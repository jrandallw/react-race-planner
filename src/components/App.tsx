import { useEffect, useReducer, useState } from "react";
import { addStageRace, deleteStageRace, getStageRaces } from "../api";
import { IStage, IStageRace } from "../types";
import {
  ButtonWrapper,
  Container,
  Modal,
  PrimaryButton,
  FormInputGroup,
  SecondaryOutlineButton,
  DangerOutlineButton,
  SuccessOutlineButton,
  LoadingSpinner,
  StageRaceFormStageListGroup,
  StageRaceListGroupItem,
  ErrorOverlay,
  StageRaceFormTotals,
} from "./shared";

const initialState = {
  loading: true,
  error: false,
  errorMessage: "",
  stageRaces: [],
};

const ACTIONS = {
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

const App = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [addStages, setAddStages] = useState(false);
  const [state, dispatch] = useReducer(reducer, initialState);
  const [text, setText] = useState("");

  const fetchStageRaces = async () => {
    try {
      await getStageRaces().then((response: IStageRace[]) => {
        dispatch({ type: ACTIONS.FETCH_SUCCESS, payload: response });
      });
    } catch (error) {
      dispatch({ type: ACTIONS.FETCH_ERROR });
    }
  };

  const addNewStageRace = async () => {
    const provisionalStageRace = {
      name: text,
      stages: [],
    };
    try {
      await addStageRace(provisionalStageRace).then(() => {
        setAddStages(true);
        setText("");
      });
    } catch (error) {
      dispatch({ type: ACTIONS.ADD_STAGE_RACE_ERROR });
    }
  };

  const deleteRace = async (id: number) => {
    try {
      await deleteStageRace(id).then(() => fetchStageRaces());
    } catch (error) {
      dispatch({ type: ACTIONS.DELETE_STAGE_RACE_ERROR });
    }
  };

  useEffect(() => {
    fetchStageRaces();
  }, []);

  return (
    <Container>
      <h1 className="mb-3">Stage Races</h1>
      {state.error ? (
        <ErrorOverlay
          error={state.errorMessage}
          clearError={() => dispatch({ type: ACTIONS.CLEAR_ERROR })}
        />
      ) : null}
      {state.loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <StageRaceFormStageListGroup>
            {state.stageRaces.length === 0
              ? "No stage races"
              : state.stageRaces.map((stageRace: IStage) => {
                  return (
                    <StageRaceListGroupItem
                      duration={(stageRace.date, "days")}
                      key={stageRace.id}
                      id={Number(stageRace.id)}
                      date={stageRace.date}
                      name={stageRace.name}
                      onDelete={() => deleteRace(Number(stageRace.id))}
                    />
                  );
                })}
          </StageRaceFormStageListGroup>
          <ButtonWrapper>
            <PrimaryButton onClick={() => setIsOpen(true)}>
              Add Stage Race
            </PrimaryButton>
          </ButtonWrapper>
        </>
      )}

      <Modal isOpen={isOpen}>
        {!addStages ? (
          <>
            <h1>Add Stage Race</h1>
            <FormInputGroup
              id="stage-race-name"
              type="text"
              placeholder="Enter stage race name"
              value={text}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setText(e.target.value)
              }
            />
            <h3>Stages</h3>

            <StageRaceFormTotals duration="6" />

            <ButtonWrapper>
              <SecondaryOutlineButton
                disabled={!text}
                onClick={addNewStageRace}
              >
                Add Stage
              </SecondaryOutlineButton>
              <SuccessOutlineButton disabled={!addStages}>
                Save
              </SuccessOutlineButton>
              <DangerOutlineButton onClick={() => setIsOpen(false)}>
                Cancel
              </DangerOutlineButton>
            </ButtonWrapper>
          </>
        ) : (
          <>
            <h1>Add Stage Race</h1>
            <FormInputGroup id="name" type="text" label="Name" value="" />
            <FormInputGroup id="date" type="date" label="Date" />

            <ButtonWrapper>
              <SuccessOutlineButton>Save</SuccessOutlineButton>
              <DangerOutlineButton onClick={() => setIsOpen(false)}>
                Cancel
              </DangerOutlineButton>
            </ButtonWrapper>
          </>
        )}
      </Modal>
    </Container>
  );
};

export default App;
