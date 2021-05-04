import { useEffect, useReducer, useState } from "react";
import { getStageRaces } from "../api";
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

function getStages(state: any, action: Record<string, unknown>) {
  switch (action.type) {
    case "deleteStageRace":
      return { ...state };
  }
}

const App = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [stageRaceData, setStageRaceData] = useState<IStageRace[]>([]);

  const [{ stages }, dispatch] = useReducer(getStages, []);
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

  useEffect(() => {
    fetchStageRaces();
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
              : stageRaceData.map((stageRace: any) => {
                  console.log(JSON.stringify(stageRace));
                  return (
                    <StageRaceListGroupItem
                      duration={(stageRace.date, "days")}
                      key={stageRace.id}
                      id={stageRace.id}
                      date={stageRace.date}
                      name={stageRace.name}
                      onDelete={() => null}
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
        <>
          <h1>Add Stage Race</h1>
          <FormInputGroup
            id={"Stage Race Name"}
            type="text"
            placeholder="Enter stage race name"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setText(e.target.value)
            }
          />
          <h3>Stages</h3>

          <StageRaceFormTotals duration="6" />

          <ButtonWrapper>
            <SecondaryOutlineButton disabled={!text}>
              Add Stage
            </SecondaryOutlineButton>
            <SuccessOutlineButton>Save</SuccessOutlineButton>
            <DangerOutlineButton onClick={() => setIsOpen(false)}>
              Cancel
            </DangerOutlineButton>
          </ButtonWrapper>
        </>
      </Modal>
    </Container>
  );
};

export default App;
