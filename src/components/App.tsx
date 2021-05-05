import moment from "moment";
import { useEffect, useState } from "react";

import { addStageRace, deleteStageRace, getStageRaces } from "../api";
import { IProvisionalStageRace, IStage, IStageRace } from "../types";
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
} from "./shared";

const initialStageRaceState = {
  name: "",
  id: "",
  stages: [] as any,
};

const App = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [addStages, setAddStages] = useState(false);
  const [stageRaceData, setStageRaceData] = useState<IStageRace[]>([]);
  const [newStageRace, setNewStageRace] = useState(initialStageRaceState);
  const [newStage, setNewStage] = useState({ name: "", date: "", id: "" });
  const [text, setText] = useState("");

  let errorMessage = "";

  async function fetchStageRaces() {
    setHasError(false);
    setIsLoading(true);
    try {
      await getStageRaces().then(function (response: IStageRace[]) {
        setStageRaceData(response);
      });
    } catch (error) {
      setHasError(true);
      errorMessage = "Error loading stage races";
    }
    setIsLoading(false);
  }

  const handleAddStageRace = async (
    provisionalStageRace: IProvisionalStageRace
  ) => {
    try {
      await addStageRace(provisionalStageRace).then(() => {
        setNewStageRace({ ...newStageRace, name: text });
        setAddStages(true);
      });
    } catch (error) {
      setHasError(true);
      errorMessage = "Error adding stage race";
    }
    setIsLoading(false);
  };

  const handleDeleteStageRace = async (id: number) => {
    try {
      await deleteStageRace(id).then(() => fetchStageRaces());
    } catch (error) {
      setHasError(true);
      errorMessage = "Error deleting stage race";
    }
  };

  useEffect(() => {
    fetchStageRaces();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log(newStageRace.stages);

  const handleAdd = (newStage: any) => {
    setNewStageRace({ ...newStageRace, stages: newStage });
    handleAddStageRace(newStageRace);
  };

  return (
    <Container>
      <h1 className="mb-3">Stage Races</h1>
      {hasError ? (
        <ErrorOverlay
          error={errorMessage}
          clearError={() => setHasError(false)}
        />
      ) : null}
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <StageRaceFormStageListGroup>
            {stageRaceData.length === 0
              ? "No stage races"
              : stageRaceData.map((stageRace: IStageRace) => {
                  const dates = stageRace.stages.map((stage: IStage) =>
                    moment(stage.date)
                  );

                  return (
                    <>
                      <StageRaceListGroupItem
                        duration={String(dates.length)}
                        key={stageRace.id}
                        id={stageRace.id}
                        date={String(moment.min(dates).format("YYYY-MM-DD"))}
                        name={stageRace.name}
                        onDelete={() => handleDeleteStageRace(stageRace.id)}
                      />

                      <Modal isOpen={isOpen}>
                        {!addStages ? (
                          <>
                            <h1>Add Stage Race</h1>
                            <FormInputGroup
                              id="stage-race-name"
                              type="text"
                              placeholder="Enter stage race name"
                              onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                              ) => setText(e.target.value)}
                            />

                            <ButtonWrapper>
                              <SecondaryOutlineButton
                                disabled={!text}
                                onClick={() => setAddStages(true)}
                              >
                                Add Stage
                              </SecondaryOutlineButton>
                              <SuccessOutlineButton onClick={() => null}>
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
                            <h1>Add Stage</h1>
                            <FormInputGroup
                              id="stage-name"
                              type="text"
                              label="Name"
                              onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                              ) =>
                                setNewStage({
                                  ...newStage,
                                  name: e.target.value,
                                })
                              }
                            />
                            <FormInputGroup
                              id="stage-date"
                              type="date"
                              label="Date"
                              onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                              ) =>
                                setNewStage({
                                  ...newStage,
                                  date: e.target.value,
                                })
                              }
                            />

                            <ButtonWrapper>
                              <SuccessOutlineButton
                                onClick={() => handleAdd(newStage)}
                              >
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
          </StageRaceFormStageListGroup>
          <ButtonWrapper>
            <PrimaryButton onClick={() => setIsOpen(true)}>
              Add Stage Race
            </PrimaryButton>
          </ButtonWrapper>
        </>
      )}
    </Container>
  );
};

export default App;
