import { useRef, useState, useCallback, useEffect } from 'react';

import Places from './components/Places.jsx';
import Modal from './components/Modal.jsx';
import DeleteConfirmation from './components/DeleteConfirmation.jsx';
import logoImg from './assets/logo.png';
import AvailablePlaces from './components/AvailablePlaces.jsx';
import {updateUserPlace,fetchUserPlaces,deleteUserPlace} from "./http.js";
import Error from './components/Error.jsx';

function App() {
  const selectedPlace = useRef();

  const [userPlaces, setUserPlaces] = useState([]);
  const [userUpdatePlaceError,setUserUpdatePlaceError]=useState('')
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const [isFetching,setIsFetching]=useState(false)
  const [error,setError]=useState('')

  function handleStartRemovePlace(place) {
    setModalIsOpen(true);
    selectedPlace.current = place;
  }

  function handleStopRemovePlace() {
    setModalIsOpen(false);
  }

  useEffect(() => {
    async function fetchPlaces(){

      try{
        setIsFetching(true)
      const places=  await fetchUserPlaces()
      setUserPlaces(places)
      setIsFetching(false)

      }catch(error){
        setIsFetching(false)
        setError({
          message:error.message || 'failed to fetch user places'
        })
      }
    }
      fetchPlaces();
  },[])

  async function handleSelectPlace(selectedPlace) {
    setUserUpdatePlaceError(null)
    try{
      await updateUserPlace([selectedPlace,...userPlaces])

    }catch(error){
      setUserPlaces(userPlaces)
      setUserUpdatePlaceError({message:error.message || 'failed to update place...'})
    }
    setUserPlaces((prevPickedPlaces) => {
      if (!prevPickedPlaces) {
        prevPickedPlaces = [];
      }
      if (prevPickedPlaces.some((place) => place.id === selectedPlace.id)) {
        return prevPickedPlaces;
      }
      return [selectedPlace, ...prevPickedPlaces];
    });
    
    
  }

  const handleRemovePlace = useCallback(async function handleRemovePlace() {
    console.log('remove...')
    setUserPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current.id)
    );
    try{
      await deleteUserPlace(userPlaces.filter(place => place.id === selectedPlace.current.id))
    }catch(error){
      setUserPlaces(userPlaces)
      setUserUpdatePlaceError({
        message:error.message || 'failed to delete place'
      })
    }

    setModalIsOpen(false);
  }, [userPlaces]);

  function handleError(){
    setUserUpdatePlaceError(null)
  }

  return (
    <>
    <Modal open={userUpdatePlaceError} onClose={handleError}>
      {userUpdatePlaceError && <Error title='an error occoured' message={userUpdatePlaceError.message}
        onConfirm={handleError}
        />}
    </Modal>
      <Modal open={modalIsOpen} onClose={handleStopRemovePlace}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}

        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        {error && <Error title="An error occured" message={error.message} />}
        {!error && <Places
          title="I'd like to visit ..."
          fallbackText="Select the places you would like to visit below."
          places={userPlaces}
          isLoading={isFetching}
          loadingText="Fetching user place data..."
          onSelectPlace={handleStartRemovePlace}
        />}

        <AvailablePlaces onSelectPlace={handleSelectPlace} />
      </main>
    </>
  );
}

export default App;
