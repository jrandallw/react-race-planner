import moment from "moment";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";
import { getStageRaces } from "../api";
import { IStageRace } from "../types";

interface IStageRaceContext {
  state: State;
  dispatch: any;
  fetchStageRaces(): void;
}

const StageRaceContext = createContext({} as IStageRaceContext);

const initialState = {
  loading: true,
  error: false,
  stageRaces: [],
  errorMessage: "",
  addStages: false,
};

export const ACTIONS = {
  FETCH_SUCCESS: "fetch-success",
  ADD_STAGE_RACE: "add-stage-race",
  ADD_STAGES: "add-stages",
  DELETE_STAGE_RACE: "delete-stage-race",
  HAS_ERROR: "has-error",
  CLEAR_ERROR: "clear-error",
};

type State = {
  loading: boolean;
  error: boolean;
  addStages: boolean;
  errorMessage: string;
  stageRaces: any;
};

const sortStageRacesByDate = (items: any) => {
  return items.sort((first: any, second: any) => {
    if (moment(first.stages.date).isSame(second.stages.date)) {
      return -1;
    } else if (moment(first.stages.date).isBefore(second.stages.date)) {
      return -1;
    } else {
      return 1;
    }
  });
};

const stageRaceReducer = (state: State, action: Record<string, unknown>) => {
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
      };
    case ACTIONS.DELETE_STAGE_RACE:
      return {
        ...state,
        stageRaces: action.payload,
      };
    case ACTIONS.HAS_ERROR:
      return {
        ...state,
        error: true,
        errorMessage: String(action.message),
      };
    case ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: false,
      };
    case ACTIONS.ADD_STAGES:
      return {
        ...state,
        addStages: !state.addStages,
      };
    default:
      return state;
  }
};

export const StageRaceProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(stageRaceReducer, initialState);

  const fetchStageRaces = useCallback(async () => {
    try {
      await getStageRaces().then((response: IStageRace[]) => {
        dispatch({
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
  }, []);

  useEffect(() => {
    fetchStageRaces();
  }, [fetchStageRaces]);

  return (
    <StageRaceContext.Provider value={{ state, dispatch, fetchStageRaces }}>
      {children}
    </StageRaceContext.Provider>
  );
};

export const useStages = () => useContext(StageRaceContext);
