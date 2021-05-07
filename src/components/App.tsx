import moment from "moment";
import { useState } from "react";
import uniqid from "uniqid";
import { addStageRace } from "../api";
import { ACTIONS, useStages } from "../contexts";

import { IStage } from "../types";
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
} from "./shared";

const App = () => {
  const initialStageState = {
    id: "",
    name: "",
    date: "",
  };
  const { state, dispatch } = useStages();
  const [isOpen, setIsOpen] = useState(false);
  const [newStage, setNewStage] = useState(initialStageState);
  const [newStageRace, setNewStageRace] = useState({
    id: "",
    name: "",
    stages: [] as IStage[],
  });

  const handleAddNewStageRace = () => {
    setNewStageRace({ ...newStageRace, name: newStageRace.name });

    dispatch({
      type: ACTIONS.ADD_STAGES,
    });
    setNewStage(initialStageState);
  };

  const handleAddStage = () => {
    const newStageData = {
      id: String(uniqid()),
      name: newStage.name,
      date: newStage.date,
    };
    setNewStageRace({
      ...newStageRace,
      stages: [...newStageRace.stages, newStageData],
    });
    dispatch({
      type: ACTIONS.ADD_STAGES,
    });
  };

  const handleRemoveStage = (id: number) => {
    [...newStageRace.stages].splice(id, 1);
    setNewStageRace({
      ...newStageRace,
      stages: [...newStageRace.stages],
    });
  };

  const handleAddStageRace = async () => {
    try {
      await addStageRace(newStageRace).then(() =>
        dispatch({
          type: ACTIONS.ADD_STAGES,
        })
      );
    } catch (error) {
      dispatch({ type: ACTIONS.ADD_STAGE_RACE_ERROR });
    }
  };

  return (
    <Container>
      <h1 className="mb-3">Stage Races</h1>
      {state.loading ? (
        <LoadingSpinner />
      ) : (
        <StageRaceListGroup>
          {state.stageRaces.length === 0
            ? "No stage races"
            : state.stageRaces.map((stageRace: any) => {
                const dates = stageRace.stages.map((stage: IStage) =>
                  moment(stage.date)
                );

                const date = moment.min(dates).format("YYYY-MM-DD");
                const numberOfDays = dates.length;
                const duration = numberOfDays === 1 ? " day" : " days";

                return (
                  <>
                    <StageRaceListGroupItem
                      name={stageRace.name}
                      date={date}
                      key={stageRace.id}
                      id={stageRace.id}
                      duration={numberOfDays + duration}
                      onDelete={() => null}
                    />

                    <Modal isOpen={isOpen}>
                      {!state.addStages ? (
                        <>
                          <h1 className="mb-3">Add Stage Race</h1>
                          <FormInputGroup
                            id="1"
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

                          <p>No stages</p>

                          <p>
                            <span className="font-weight-bold">Duration:</span>{" "}
                            0 days
                          </p>
                          <ButtonWrapper>
                            <SecondaryOutlineButton
                              disabled={!newStageRace.name}
                              onClick={handleAddNewStageRace}
                            >
                              Add Stage
                            </SecondaryOutlineButton>
                            <SuccessOutlineButton onClick={handleAddStageRace}>
                              Save
                            </SuccessOutlineButton>
                            <DangerOutlineButton
                              onClick={() => setIsOpen(false)}
                            >
                              Cancel
                            </DangerOutlineButton>
                          </ButtonWrapper>
                        </>
                      ) : (
                        <>
                          <h1 className="mb-3">Add Stage</h1>
                          <FormInputGroup
                            id="1"
                            label="Name"
                            type="text"
                            value={newStage.name}
                            onChange={(e) =>
                              setNewStage({ ...newStage, name: e.target.value })
                            }
                          />
                          <FormInputGroup
                            id="1"
                            label="Date"
                            type="date"
                            value={newStage.date}
                            onChange={(e) =>
                              setNewStage({ ...newStage, date: e.target.value })
                            }
                          />

                          <ButtonWrapper>
                            <SuccessOutlineButton onClick={handleAddStage}>
                              Save
                            </SuccessOutlineButton>
                            <DangerOutlineButton
                              onClick={() => setIsOpen(false)}
                            >
                              Cancel
                            </DangerOutlineButton>
                          </ButtonWrapper>
                        </>
                      )}
                    </Modal>
                  </>
                );
              })}
        </StageRaceListGroup>
      )}
      <ButtonWrapper>
        <PrimaryButton
          onClick={() => {
            setIsOpen(true);
          }}
        >
          Add Stage Race
        </PrimaryButton>
      </ButtonWrapper>
      {state.error ? (
        <ErrorOverlay
          error={state.errorMessage}
          clearError={() => dispatch({ type: ACTIONS.CLEAR_ERROR })}
        />
      ) : null}
    </Container>
  );
};

export default App;
