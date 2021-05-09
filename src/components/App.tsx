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
  const initialStageState = {
    id: "",
    name: "",
    date: "",
  };
  const { state, dispatch, fetchStageRaces } = useStages();
  const [isOpen, setIsOpen] = useState(false);
  const [newStage, setNewStage] = useState(initialStageState);
  const [newStageRace, setNewStageRace] = useState({
    name: "",
    stages: [] as IStage[],
  });

  const handleAddNewStageRace = () => {
    setNewStageRace({ ...newStageRace, name: newStageRace.name });
    dispatch({
      type: ACTIONS.ADD_STAGES,
      stages: true,
    });
    setNewStage(initialStageState);
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
      type: ACTIONS.ADD_STAGES,
      stages: false,
    });
  };

  const handleDeleteStage = (id: number) => {
    newStageRace.stages.splice(id, 1);
    setNewStageRace({
      ...newStageRace,
      stages: [...newStageRace.stages],
    });
  };

  const handleAddStageRace = async () => {
    try {
      await addStageRace(newStageRace).then(() => {
        setIsOpen(false);
        fetchStageRaces();
        dispatch({
          type: ACTIONS.ADD_STAGES,
        });
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
  const getDuration = (items: IStage[]) => {
    const length = items.length;
    const duration = items.length === 1 ? " day" : " days";

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
                setIsOpen(true);
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
        <Modal isOpen={isOpen}>
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
                        key={uniqid()}
                        id={uniqid()}
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
              onClick={handleAddNewStageRace}
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
                setIsOpen(false);
              }}
            >
              Cancel
            </DangerOutlineButton>
          </ButtonWrapper>
        </Modal>
      ) : (
        <Modal isOpen={isOpen}>
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
                dispatch({ type: ACTIONS.ADD_STAGES });
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
