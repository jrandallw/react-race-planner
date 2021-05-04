import { useContext, useEffect, useState } from "react";
import { deleteStageRace, getStageRaces } from "../api";
import { StageRaceContext } from "../contexts";
import { IStageRace } from "../types";
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

const App = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [stageRaceData, setStageRaceData] = useState<IStageRace[]>([]);

  const { activeForm, setActiveForm } = useContext(StageRaceContext);

  // asynchronous function to fetch stage races
  async function fetchStageRaces() {
    setHasError(false);
    setIsLoading(true);
    try {
      await getStageRaces().then(function (response: IStageRace[]) {
        setStageRaceData(response);
      });
    } catch (error) {
      setHasError(true);
    }
    setIsLoading(false);
  }

  // asynchronous function to delete stage races
  async function deleteStageRaces(id: number) {
    try {
      await deleteStageRace(id).then(function () {
        getStageRaces().then(function (response: IStageRace[]) {
          setStageRaceData(response);
        });
      });
    } catch (error) {
      setHasError(true);
    }
  }

  // fetch all stage races from the
  // API on component mount
  useEffect(() => {
    fetchStageRaces();
  }, []);

  return (
    <Container>
      <h1 className="mb-3">Stage Races</h1>
      {hasError ? (
        <ErrorOverlay
          error={"No error"}
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
              : stageRaceData.map((stageRace: any) => {
                  console.log(JSON.stringify(stageRace));
                  return (
                    <StageRaceListGroupItem
                      duration={(stageRace.date, "days")}
                      key={stageRace.id}
                      id={stageRace.id}
                      date={stageRace.date}
                      name={stageRace.name}
                      onDelete={() => deleteStageRaces(stageRace.id)}
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
        {activeForm === "add-stage-race" ? (
          <>
            <h1>Add Stage Race</h1>
            <FormInputGroup
              id={"Stage Race Name"}
              type="text"
              placeholder="Enter stage race name"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setInputValue(e.target.value)
              }
            />
            <h3>Stages</h3>

            <StageRaceFormTotals duration="6" />

            <ButtonWrapper>
              <SecondaryOutlineButton
                disabled={!inputValue}
                onClick={() => setActiveForm("add-stage-form")}
              >
                Add Stage
              </SecondaryOutlineButton>
              <SuccessOutlineButton>Save</SuccessOutlineButton>
              <DangerOutlineButton onClick={() => setIsOpen(false)}>
                Cancel
              </DangerOutlineButton>
            </ButtonWrapper>
          </>
        ) : activeForm === "add-stage-form" ? (
          <>
            <h1>Add Stage</h1>
            <FormInputGroup
              id={"Stage Name"}
              label="Name"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setInputValue(e.target.value)
              }
            />
            <FormInputGroup
              id={"Stage Date"}
              label="Date"
              type="date"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setInputValue(e.target.value)
              }
            />
            <ButtonWrapper>
              <SecondaryOutlineButton disabled={!inputValue}>
                Add Stage
              </SecondaryOutlineButton>
              <SuccessOutlineButton>Save</SuccessOutlineButton>
              <DangerOutlineButton onClick={() => setIsOpen(false)}>
                Cancel
              </DangerOutlineButton>
            </ButtonWrapper>
          </>
        ) : (
          <></>
        )}
      </Modal>
    </Container>
  );
};

export default App;
