import moment from "moment";
import { createContext, useContext, useEffect, useReducer } from "react";
import { deleteStageRace, getStageRaces } from "../api";
import { IStageRace } from "../types";

type State = {
  loading: boolean;
  error: boolean;
  addStages: boolean;
  errorMessage: string;
  modalOpen: boolean;
  stageRaces: IStageRace[];
};

interface IStageRaceContext {
  state: State;
  dispatch: any;
}

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
  stageRaces: [],
  errorMessage: "",
  addStages: false,
  modalOpen: false,
};

const sortStageRacesByDate = (items: any[]) => {
  return items.sort(
    (first: Record<string, any>, second: Record<string, any>) => {
      if (moment(first.stages.date).isSame(second.stages.date)) {
        return -1;
      } else if (moment(first.stages.date).isBefore(second.stages.date)) {
        return -1;
      } else {
        return 1;
      }
    }
  );
};

const stageRaceReducer = (state: State, action: any) => {
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
        stageRaces: [...state.stageRaces, action.payload],
      };
    case ACTIONS.DELETE_STAGE_RACE:
      return {
        ...state,
        stageRaces: state.stageRaces.map(
          (index: any) => (index = action.id ? deleteStageRace(index) : null)
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
          loading: true,
          type: ACTIONS.FETCH_SUCCESS,
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

  useEffect(() => {
    fetchStageRaces();
  }, []);

  return (
    <StageRaceContext.Provider value={{ state, dispatch }}>
      {children}
    </StageRaceContext.Provider>
  );
};

export const useStore = () => useContext(StageRaceContext);
