import moment from "moment";
import { useState } from "react";
import { addStageRace, deleteStageRace } from "../api";
import { ACTIONS, useStages } from "../contexts";
import uniqid from "uniqid";

import { IStage, IStageRace } from "../types";
import {
  ButtonWrapper,
  Container,
  DangerOutlineButton,
  LoadingSpinner,
  Modal,
  FormInputGroup,
  PrimaryButton,
  SecondaryOutlineButton,
  StageRaceListGroup,
  StageRaceListGroupItem,
  SuccessOutlineButton,
  ErrorOverlay,
  StageRaceFormStageListGroup,
  StageRaceFormStageListGroupItem,
  StageRaceFormTotals,
} from "./shared";

const App = () => {
  const { state, dispatch, fetchStageRaces } = useStages();

  // initial state for stages within stage race
  const initialStageState = {
    id: "",
    name: "",
    date: "",
  };
  const [newStage, setNewStage] = useState(initialStageState);

  // initial state for a new stage race
  const initialStageRaceState = {
    name: "",
    stages: [] as IStage[],
  };
  const [newStageRace, setNewStageRace] = useState(initialStageRaceState);

  const handleCreateNewStageRace = () => {
    setNewStageRace({ ...newStageRace, name: newStageRace.name });
    dispatch({
      type: ACTIONS.STAGES_FORM,
    });
    setNewStage(initialStageState);
  };

  const handleAddStageRace = async () => {
    try {
      await addStageRace(newStageRace).then(() => {
        dispatch({
          type: ACTIONS.MODAL_OPEN,
        });
        dispatch({
          type: ACTIONS.STAGES_FORM,
        });
        fetchStageRaces();
      });
    } catch (error) {
      dispatch({ type: ACTIONS.HAS_ERROR, message: "Error adding stage race" });
    }
  };

  const handleDeleteStageRace = async (id: number) => {
    try {
      await deleteStageRace(id).then(() => {
        fetchStageRaces();
      });
    } catch (error) {
      dispatch({
        type: ACTIONS.HAS_ERROR,
        message: "Error deleting stage race",
      });
    }
  };

  const handleAddStage = () => {
    const newStageData = {
      id: uniqid(),
      name: newStage.name,
      date: newStage.date,
    };
    setNewStageRace({
      ...newStageRace,
      stages: [...newStageRace.stages, newStageData],
    });
    dispatch({
      type: ACTIONS.STAGES_FORM,
    });
  };

  const handleDeleteStage = (id: number) => {
    const newStagesList = newStageRace.stages.filter((_, i) => i !== id);
    setNewStageRace({
      ...newStageRace,
      stages: newStagesList,
    });
  };

  const getDuration = (items: IStage[]) => {
    const length = items.length;
    const duration = items.length === 1 ? "day" : "days";

    return `${length} ${duration}`;
  };

  const getEarliestDate = (stages: IStage[]) => {
    const dates = stages.map((stage: IStage) => moment(stage.date));
    const earliestDate = moment.min(dates).format("YYYY-MM-DD");
    return earliestDate;
  };

  const getSortedDates = (items: IStage[]) => {
    const sortMoments = (a: IStage, b: IStage) =>
      Number(moment(a.date)) - Number(moment(b.date));
    const sortedDates = items.sort(sortMoments);

    return sortedDates;
  };

  return (
    <Container>
      <h1 className="mb-3">Stage Races</h1>
      {state.loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <StageRaceListGroup>
            {state.stageRaces.length === 0
              ? "No stage races"
              : state.stageRaces.map((stageRace: IStageRace, index: number) => {
                  return (
                    <StageRaceListGroupItem
                      name={stageRace.name}
                      date={getEarliestDate(stageRace.stages)}
                      key={stageRace.id}
                      id={stageRace.id}
                      duration={getDuration(stageRace.stages)}
                      onDelete={() => handleDeleteStageRace(stageRace.id)}
                    />
                  );
                })}
          </StageRaceListGroup>

          <ButtonWrapper>
            <PrimaryButton
              onClick={() => {
                dispatch({
                  type: ACTIONS.MODAL_OPEN,
                });
              }}
            >
              Add Stage Race
            </PrimaryButton>
          </ButtonWrapper>
        </>
      )}
      {state.error ? (
        <ErrorOverlay
          error={state.errorMessage}
          clearError={() => dispatch({ type: ACTIONS.CLEAR_ERROR })}
        />
      ) : null}

      {!state.addStages ? (
        <Modal isOpen={state.modalOpen}>
          <h2 className="mb-3">Add Stage Race</h2>
          <FormInputGroup
            id="text-input-stage-name"
            placeholder="Enter stage race name"
            value={newStageRace.name}
            onChange={(e) =>
              setNewStageRace({
                ...newStageRace,
                name: e.target.value,
              })
            }
          />
          <h3 className="mb-1">Stages</h3>

          {newStageRace.stages.length === 0 ? (
            <>
              <p>No stages</p>
              <StageRaceFormTotals duration={"0 days"} />
            </>
          ) : (
            <>
              <StageRaceFormStageListGroup>
                {getSortedDates(newStageRace.stages).map(
                  (stage: IStage, index: number) => {
                    return (
                      <StageRaceFormStageListGroupItem
                        key={stage.id}
                        id={stage.id}
                        date={stage.date}
                        name={stage.name}
                        onDelete={() => handleDeleteStage(index)}
                      />
                    );
                  }
                )}
              </StageRaceFormStageListGroup>
              <StageRaceFormTotals
                duration={getDuration(newStageRace.stages)}
              />
            </>
          )}
          <ButtonWrapper>
            <SecondaryOutlineButton
              disabled={!newStageRace.name}
              onClick={handleCreateNewStageRace}
            >
              Add Stage
            </SecondaryOutlineButton>
            <SuccessOutlineButton
              disabled={!newStageRace.stages.length}
              onClick={handleAddStageRace}
            >
              Save
            </SuccessOutlineButton>
            <DangerOutlineButton
              onClick={() => {
                setNewStageRace({
                  ...newStageRace,
                  name: "",
                });
                dispatch({
                  type: ACTIONS.MODAL_OPEN,
                });
              }}
            >
              Cancel
            </DangerOutlineButton>
          </ButtonWrapper>
        </Modal>
      ) : (
        <Modal isOpen={state.modalOpen}>
          <h2 className="mb-3">Add Stage</h2>
          <FormInputGroup
            id="text-input-name"
            label="Name"
            type="text"
            value={newStage.name}
            onChange={(e) => setNewStage({ ...newStage, name: e.target.value })}
          />
          <FormInputGroup
            id="text-input-date"
            label="Date"
            type="date"
            value={newStage.date}
            onChange={(e) => setNewStage({ ...newStage, date: e.target.value })}
          />

          <ButtonWrapper>
            <SuccessOutlineButton
              disabled={!newStage.name || !newStage.date}
              onClick={handleAddStage}
            >
              Save
            </SuccessOutlineButton>
            <DangerOutlineButton
              onClick={() => {
                dispatch({ type: ACTIONS.STAGES_FORM });
              }}
            >
              Cancel
            </DangerOutlineButton>
          </ButtonWrapper>
        </Modal>
      )}
    </Container>
  );
};

export default App;
