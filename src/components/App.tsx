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

const App = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [stageRaceData, setStageRaceData] = useState<IStageRace[]>([]);
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

  async function handleAddStageRace(
    provisionalStageRace: IProvisionalStageRace
  ) {
    try {
      await addStageRace(provisionalStageRace).then(() => {
        fetchStageRaces();
        setIsOpen(false);
      });
    } catch (error) {
      setHasError(true);
      errorMessage = "Error adding stage race";
    }
    setIsLoading(false);
  }

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
              : stageRaceData.map((stageRace: any, index: number) => {
                  const dates = stageRace.stages.map((stage: IStage) =>
                    moment(stage.date)
                  );
                  const date = moment.min(dates).format("YYYY-MM-DD");
                  const numberOfDays = dates.length;
                  const duration = numberOfDays === 1 ? " day" : " days";

                  return (
                    <>
                      <StageRaceListGroupItem
                        duration={numberOfDays + duration}
                        key={stageRace.id}
                        id={stageRace.id}
                        date={String(date)}
                        name={stageRace.name}
                        onDelete={() => handleDeleteStageRace(stageRace.id)}
                      />

                      <Modal isOpen={isOpen}>
                        <h1>Add Stage Race</h1>
                        <FormInputGroup
                          id="stage-race-name"
                          type="text"
                          placeholder="Enter stage race name"
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setText(e.target.value)
                          }
                        />
                        <ButtonWrapper>
                          <SecondaryOutlineButton disabled={!text}>
                            Add Stage
                          </SecondaryOutlineButton>
                          <SuccessOutlineButton>Save</SuccessOutlineButton>
                          <DangerOutlineButton onClick={() => setIsOpen(false)}>
                            Cancel
                          </DangerOutlineButton>
                        </ButtonWrapper>
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
