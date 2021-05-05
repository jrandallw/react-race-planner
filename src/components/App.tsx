import { useStore } from "../contexts";
import {
  Container,
  LoadingSpinner,
  StageRaceListGroup,
  StageRaceListGroupItem,
} from "./shared";

const App = () => {
  const { state, dispatch } = useStore();

  return (
    <Container>
      <h1 className="mb-3">Stage Races</h1>
      {state.loading ? (
        <LoadingSpinner />
      ) : (
        <StageRaceListGroup>
          {state.stageRaces.map((stageRace: any, index: number) => {
            return (
              <StageRaceListGroupItem
                name={stageRace.name}
                date="2021-05-05"
                id={stageRace.id}
                duration="days"
                onDelete={() => null}
              />
            );
          })}
        </StageRaceListGroup>
      )}
    </Container>
  );
};

export default App;
