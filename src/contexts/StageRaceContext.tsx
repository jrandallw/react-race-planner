import { createContext, useContext, useEffect, useReducer } from "react";
import { getStageRaces } from "../api";
import { IStageRace } from "../types";

interface IStageRaceContext {
  state: State;
  dispatch: any;
}

const StageRaceContext = createContext({} as IStageRaceContext);

const initialState = {
  loading: true,
  error: false,
  stageRaces: [],
  errorMessage: "",
};

export const ACTIONS = {
  FETCH_SUCCESS: "fetch-success",
  FETCH_ERROR: "fetch-error",
  ADD_STAGE_RACE: "add-stage-race",
  ADD_STAGE_RACE_ERROR: "add-stage-race-error",
  DELETE_STAGE_RACE: "delete-stage-race",
  DELETE_STAGE_RACE_ERROR: "delete-stage-race-error",
  CLEAR_ERROR: "clear-error",
};

type State = {
  loading: boolean;
  error: boolean;
  errorMessage: string;
  stageRaces: any;
};

const reducer = (state: State, action: Record<string, unknown>) => {
  switch (action.type) {
    case ACTIONS.FETCH_SUCCESS:
      return {
        loading: false,
        error: false,
        stageRaces: action.payload,
        errorMessage: "",
      };
    case ACTIONS.FETCH_ERROR:
      return {
        loading: false,
        error: true,
        stageRaces: [],
        errorMessage: "Error loading stage races",
      };
    case ACTIONS.ADD_STAGE_RACE:
      return {
        ...state,
        stages: [...state.stageRaces, { name: action.name, date: action.date }],
      };
    case ACTIONS.ADD_STAGE_RACE_ERROR:
      return {
        ...state,
        errorMessage: "Error adding stage race",
      };
    case ACTIONS.DELETE_STAGE_RACE:
      return {
        ...state,
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
    default:
      return state;
  }
};

export const StageRaceProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

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
    <StageRaceContext.Provider value={{ state, dispatch }}>
      {children}
    </StageRaceContext.Provider>
  );
};

export const useStages = () => useContext(StageRaceContext);
