import moment from "moment";
import { useState } from "react";
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
  const { state, dispatch } = useStages();
  const [isOpen, setIsOpen] = useState(false);
  const [stageRaceName, setStageRaceName] = useState("");
  const [stageName, setStageName] = useState("");
  const [date, setDate] = useState("");

  const addNewStageRace = async () => {
    const provisionalStageRace = {
      name: stageRaceName,
      stages: [],
    };
    console.log(provisionalStageRace);
    try {
      await addStageRace(provisionalStageRace).then(() =>
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
                console.log(stageRace);
                const dates = stageRace.stages.map((stage: IStage) =>
                  moment(stage.date)
                );

                const date = moment.min(dates).format("YYYY-MM-DD");
                const numberOfDays = dates.length;
                const duration = numberOfDays === 1 ? " day" : " days";

                return (
                  <StageRaceListGroupItem
                    name={stageRace.name}
                    date={date}
                    key={stageRace.id}
                    id={stageRace.id}
                    duration={numberOfDays + duration}
                    onDelete={() => null}
                  />
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
      <Modal isOpen={isOpen}>
        {!state.addStages ? (
          <>
            <h1 className="mb-3">Add Stage Race</h1>
            <FormInputGroup
              id="1"
              placeholder="Enter stage race name"
              value={stageRaceName}
              onChange={(e) => setStageRaceName(e.target.value)}
            />
            <h3 className="mb-1">Stages</h3>
            <p>No stages</p>
            <p>
              <span className="font-weight-bold">Duration:</span> 0 days
            </p>
            <ButtonWrapper>
              <SecondaryOutlineButton
                disabled={!stageRaceName}
                onClick={addNewStageRace}
              >
                Add Stage
              </SecondaryOutlineButton>
              <SuccessOutlineButton onClick={() => null}>
                Save
              </SuccessOutlineButton>
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
              value={stageName}
              onChange={(e) => setStageName(e.target.value)}
            />
            <FormInputGroup
              id="1"
              label="Date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />

            <ButtonWrapper>
              <SuccessOutlineButton
                onClick={() =>
                  dispatch({
                    type: ACTIONS.ADD_STAGE_RACE,
                    name: stageName,
                    date: date,
                  })
                }
              >
                Save
              </SuccessOutlineButton>
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
