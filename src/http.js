export async function fetchAvailablePlaces(){
  const response = await fetch('http://localhost:3000/places')
  if(!response.ok){
    throw new Error('failed to fetch places...')
  }
  const resData = await response.json()
  return resData.places;
}

export async function fetchUserPlaces(){
  const response = await fetch('http://localhost:3000/user-places')
  if(!response.ok){
    throw new Error('failed to fetch user places...')
  }
  const resData = await response.json()
  return resData.places;
}


export async function updateUserPlace(places){
  const response=await fetch('http://localhost:3000/user-places',{
    method:'PUT',
    body:JSON.stringify({places:places}),
    headers:{
      'Content-Type':'application/json'
    }
  })
  if(!response.ok){
    throw new Error('failed to update places...')
  }
  const resData = await response.json()
  return resData.message;
}

export async function deleteUserPlace(places){
  const response=await fetch('http://localhost:3000/user-places',{
    method:'DELETE',
    body:JSON.stringify({places:places}),
    headers:{
      'Content-Type':'application/json'
    }
  })
  if(!response.ok){
    throw new Error('failed to delete places...')
  }
  const resData = await response.json()
  return resData.message;
}
