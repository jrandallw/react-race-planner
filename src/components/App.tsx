import { useEffect, useState } from "react";
import { deleteStageRace, getStageRaces } from "../api";
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

interface IStageRaceListGroupItemProps {
  id: number;
  name: string;
  date: string; // earliest stage date
  duration: string;
  onDelete: () => void;
}

const App = () => {
  // const [hasStageRaces] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isDeleteError, setIsDeleteError] = useState(false);
  const [data, setData] = useState([]);
  const [newStageData, setNewStageData] = useState({
    name: "",
    date: "",
    id: "",
  });

  async function fetchStageRaces() {
    setIsError(false);
    setIsLoading(true);
    try {
      await getStageRaces().then(function (response: any) {
        setData(response);
      });
    } catch (error) {
      setIsError(true);
    }
    setIsLoading(false);
  }

  async function deleteStageRaces(id: number) {
    try {
      await deleteStageRace(id).then(function () {
        getStageRaces().then(function (response: any) {
          setData(response);
        });
      });
    } catch (error) {
      setIsDeleteError(true);
    }
  }

  useEffect(() => {
    fetchStageRaces();
  }, []);

  const changeModal = () => {
    setModalOpen(!modalOpen);
  };

  return (
    <Container>
      <h1 className="mb-3">Stage Races</h1>
      {isError && (
        <ErrorOverlay
          error={"Error loading stage races"}
          clearError={() => setIsError(false)}
        />
      )}
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <StageRaceFormStageListGroup>
            {data.length === 0
              ? "No stage races"
              : data.map((stage: IStageRaceListGroupItemProps) => {
                  return (
                    <StageRaceListGroupItem
                      duration={(stage.date, "days")}
                      key={stage.id}
                      id={stage.id}
                      date={stage.date}
                      name={stage.name}
                      onDelete={() => deleteStageRaces(stage.id)}
                    />
                  );
                })}
          </StageRaceFormStageListGroup>
          <ButtonWrapper>
            <PrimaryButton onClick={changeModal}>Add Stage Race</PrimaryButton>
          </ButtonWrapper>
        </>
      )}

      <Modal isOpen={modalOpen}>
        <h1>Add Stage Race</h1>
        <FormInputGroup
          id={"s"}
          placeholder="Enter stage race name"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setNewStageData({ ...newStageData, name: e.target.value })
          }
        />
        <h3>Stages</h3>
        <p>No stages</p>
        <p>Duration: 0 days</p>
        <ButtonWrapper>
          <SecondaryOutlineButton disabled={!newStageData.name}>
            Add Stage
          </SecondaryOutlineButton>
          <SuccessOutlineButton>Save</SuccessOutlineButton>
          <DangerOutlineButton onClick={changeModal}>
            Cancel
          </DangerOutlineButton>
        </ButtonWrapper>
      </Modal>
    </Container>
  );
};

export default App;
