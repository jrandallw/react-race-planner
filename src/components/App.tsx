import { useState } from "react";
import { ACTIONS, useStages } from "../contexts";
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
  const { state, dispatch } = useStages();
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState("");
  const [addStages, setAddStages] = useState(false);

  return (
    <Container>
      <h1 className="mb-3">Stage Races</h1>
      {state.loading ? (
        <LoadingSpinner />
      ) : (
        <StageRaceListGroup>
          {state.stageRaces.length === 0
            ? "No stage races"
            : state.stageRaces.map((stageRace: any, index: number) => {
                return (
                  <StageRaceListGroupItem
                    name={stageRace.name}
                    date="2021-05-05"
                    key={stageRace.id}
                    id={stageRace.id}
                    duration="days"
                    onDelete={() => null}
                  />
                );
              })}
        </StageRaceListGroup>
      )}
      <ButtonWrapper>
        <PrimaryButton onClick={() => setIsOpen(true)}>
          Add Stage Race
        </PrimaryButton>
      </ButtonWrapper>
      <Modal isOpen={isOpen}>
        {!addStages ? (
          <>
            <h1 className="mb-3">Add Stage Race</h1>
            <FormInputGroup
              id="1"
              placeholder="Enter stage race name"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <p>No stages</p>
            <p>0 days</p>
            <ButtonWrapper>
              <SecondaryOutlineButton
                disabled={!text}
                onClick={() => setAddStages(true)}
              >
                Add Stage
              </SecondaryOutlineButton>
              <SuccessOutlineButton disabled>Save</SuccessOutlineButton>
              <DangerOutlineButton onClick={() => setIsOpen(false)}>
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
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <FormInputGroup
              id="1"
              label="Date"
              type="date"
              onChange={(e) => setText(e.target.value)}
            />

            <ButtonWrapper>
              <SuccessOutlineButton disabled>Save</SuccessOutlineButton>
              <DangerOutlineButton onClick={() => setIsOpen(false)}>
                Cancel
              </DangerOutlineButton>
            </ButtonWrapper>
          </>
        )}
      </Modal>
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
