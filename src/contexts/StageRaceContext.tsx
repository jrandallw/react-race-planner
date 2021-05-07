import { createContext, useContext, useEffect, useReducer } from "react";
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
  FETCH_ERROR: "fetch-error",
  ADD_STAGE_RACE: "add-stage-race",
  ADD_STAGE_RACE_ERROR: "add-stage-race-error",
  ADD_STAGES: "add-stages",
  DELETE_STAGE_RACE: "delete-stage-race",
  DELETE_STAGE_RACE_ERROR: "delete-stage-race-error",
  CLEAR_ERROR: "clear-error",
};

type State = {
  loading: boolean;
  error: boolean;
  addStages: boolean;
  errorMessage: string;
  stageRaces: any;
};

const stageRaceReducer = (state: State, action: Record<string, unknown>) => {
  switch (action.type) {
    case ACTIONS.FETCH_SUCCESS:
      return {
        ...state,
        loading: false,
        stageRaces: action.payload,
      };
    case ACTIONS.FETCH_ERROR:
      return {
        ...state,
        error: true,
        errorMessage: "Error loading stage races",
      };
    case ACTIONS.ADD_STAGE_RACE:
      return {
        ...state,
      };
    case ACTIONS.ADD_STAGE_RACE_ERROR:
      return {
        ...state,
        errorMessage: "Error adding stage race",
      };
    case ACTIONS.DELETE_STAGE_RACE:
      return {
        ...state,
        stageRaces: action.payload,
      };
    case ACTIONS.DELETE_STAGE_RACE_ERROR:
      return {
        ...state,
        errorMessage: "Error deleting stage race",
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

  const fetchStageRaces = async () => {
    try {
      await getStageRaces().then((response: IStageRace[]) => {
        dispatch({ type: ACTIONS.FETCH_SUCCESS, payload: response });
      });
    } catch (error) {
      dispatch({ type: ACTIONS.FETCH_ERROR });
    }
  };

  useEffect(() => {
    fetchStageRaces();
  }, []);

  return (
    <StageRaceContext.Provider value={{ state, dispatch, fetchStageRaces }}>
      {children}
    </StageRaceContext.Provider>
  );
};

export const useStages = () => useContext(StageRaceContext);
