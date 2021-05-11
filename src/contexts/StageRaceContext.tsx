import moment from "moment";
import {
  createContext,
  Dispatch,
  useContext,
  useEffect,
  useReducer,
} from "react";
import { addStageRace, deleteStageRace, getStageRaces } from "../api";
import { IProvisionalStageRace, IStageRace } from "../types";

export const ACTIONS = {
  FETCH_SUCCESS: "fetch-success",
  ADD_STAGE_RACE: "add-stage-race",
  DELETE_STAGE_RACE: "delete-stage-race",
  STAGES_FORM: "add-stages",

  MODAL_OPEN: "modal-open",
  HAS_ERROR: "has-error",
  IS_LOADING: "is-loading",
  CLEAR_ERROR: "clear-error",
};

const initialState = {
  loading: true,
  error: false,
  stageRaces: [] as IStageRace[],
  errorMessage: "",
  addStages: false,
  modalOpen: false,
};

interface IReducerState {
  loading: boolean;
  error: boolean;
  stageRaces: IStageRace[];
  errorMessage: string;
  addStages: boolean;
  modalOpen: boolean;
}

interface IReducerActions {
  type: string;
  message?: string;
  payload?: IStageRace[] | any;
  id?: number;
  loading?: boolean;
}

interface IStageRaceContext {
  state: IReducerState;
  dispatch: Dispatch<IReducerActions>;
  handleAddStageRace(r: IProvisionalStageRace): void;
  handleDeleteStageRace(id: number): void;
}

export const sortStageRacesByDate = (items: IStageRace[]) => {
  return items.sort((first: IStageRace, second: IStageRace) => {
    if (moment(first.stages[0].date).isSameOrBefore(second.stages[0].date)) {
      return -1;
    } else {
      return 1;
    }
  });
};

const stageRaceReducer = (state: IReducerState, action: IReducerActions) => {
  switch (action.type) {
    case ACTIONS.FETCH_SUCCESS:
      return {
        ...state,
        loading: false,
        stageRaces: action.payload,
      };
    case ACTIONS.ADD_STAGE_RACE:
      return {
        ...state,
        modalOpen: false,
        stageRaces: [...state.stageRaces, { id: action.id, ...action.payload }],
      };
    case ACTIONS.DELETE_STAGE_RACE:
      return {
        ...state,
        stageRaces: state.stageRaces.filter(
          (stageRace) => stageRace.id !== action.payload
        ),
      };
    case ACTIONS.HAS_ERROR:
      return {
        ...state,
        error: true,
        loading: false,
        errorMessage: String(action.message),
      };
    case ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: false,
      };
    case ACTIONS.STAGES_FORM:
      return {
        ...state,
        addStages: !state.addStages,
      };
    case ACTIONS.MODAL_OPEN:
      return {
        ...state,
        modalOpen: !state.modalOpen,
      };
    default:
      return state;
  }
};

const StageRaceContext = createContext({} as IStageRaceContext);

export const StageRaceProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(stageRaceReducer, initialState);

  const fetchStageRaces = async () => {
    try {
      await getStageRaces().then((response: IStageRace[]) => {
        dispatch({
          type: ACTIONS.FETCH_SUCCESS,
          loading: true,
          payload: sortStageRacesByDate(response),
        });
      });
    } catch (error) {
      dispatch({
        type: ACTIONS.HAS_ERROR,
        message: "Error loading stage races",
      });
    }
  };

  const handleAddStageRace = async (
    provisionalStageRace: IProvisionalStageRace
  ) => {
    try {
      await addStageRace(provisionalStageRace).then(() => {
        dispatch({
          type: ACTIONS.ADD_STAGE_RACE,
          id: Number(state.stageRaces.length + 1),
          payload: provisionalStageRace,
        });
      });
    } catch (error) {
      dispatch({ type: ACTIONS.HAS_ERROR, message: "Error adding stage race" });
    }
  };

  const handleDeleteStageRace = async (id: number) => {
    try {
      await deleteStageRace(id).then(() => {
        dispatch({
          type: ACTIONS.DELETE_STAGE_RACE,
          payload: id,
        });
      });
    } catch (error) {
      dispatch({
        type: ACTIONS.HAS_ERROR,
        message: "Error deleting stage race",
      });
    }
  };

  useEffect(() => {
    fetchStageRaces();
  }, []);

  return (
    <StageRaceContext.Provider
      value={{
        state,
        dispatch,
        handleAddStageRace,
        handleDeleteStageRace,
      }}
    >
      {children}
    </StageRaceContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StageRaceContext);
  if (context === undefined) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};
