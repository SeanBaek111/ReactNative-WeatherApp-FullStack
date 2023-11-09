import React, { useState, useContext, useEffect } from "react";
import { Alert, Platform } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
 

export const WeatherContext = React.createContext();

import { SERVER_URL } from "../config"
const STORAGE_KEY = "@watchlist";

export const WeatherProvider = ({ children }) => {
  const [state, setState] = useState([]);
  const [weatherData, setWeatherData] = useState([]);
  const [currentCity, setCurrentCity] = useState();
  return (
    <WeatherContext.Provider value={{state, setState, weatherData, setWeatherData, currentCity, setCurrentCity}}>
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeatherContext = () => {
  const { state, setState, weatherData, setWeatherData,currentCity, setCurrentCity } = useContext(WeatherContext);
  
  const addToWatchlist = async (newSymbol) => {
    if (state.find((item) => item.id === newSymbol.id)) {
      // If the item is already in the list, show an alert and return early.
      if (Platform.OS === 'web') {
        alert(newSymbol.name + " is already in the list.");
      } else {
        Alert.alert("Error", newSymbol.name + " is already in the list.");
      }
      return false;
    }  

     // Add to server
     const token =  await AsyncStorage.getItem('userToken');
    // console.log("token : ", token);
     const response = await fetch(SERVER_URL+'/watchlist/add', {
      method: 'POST',
      headers: {
        accept: "application/json",
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(newSymbol),
    });

   // console.log(response);
   

    if (response.ok) {      
      // Otherwise, add the item to the list.
      const newState = [...state,newSymbol];

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      setState(newState);    
      return true;
    }
    else{
      //throw new Error('Failed to add item to server');
      return false;
    }

  };

  const retrieveWatchlistFromServer = async () => {
      
     // retrieve to server
     const token =  await AsyncStorage.getItem('userToken');
    // console.log("token : ", token);
     const response = await fetch(SERVER_URL+'/watchlist/list', {
      method: 'GET',
      headers: {
        accept: "application/json",
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }, 
    });
 

    if (response.ok) {      
      const data = await response.json();
      console.log("response data: ", data.data);
      
      
      // Otherwise, add the item to the list.
      const newState = [...data.data];
       await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
       setState(newState);    
      return true;
    }
    else{
      throw new Error('Failed to add item to server');
      //return false;
    }

  };

  const deleteFromWatchlist = async (weatherId) => {
    const confirmed = Platform.OS === 'web'
    ? window.confirm("Are you sure you want to remove this city from the list?")
    : await new Promise((resolve) =>
        Alert.alert(
          "Delete Item",
          "Are you sure you want to remove this city from the list?",
          [
            {
              text: "Cancel",
              onPress: () => resolve(false),
              style: "cancel"
            },
            {
              text: "Yes",
              onPress: () => resolve(true)
            }
          ],
          { cancelable: false }
        )
      );

    if (confirmed) {

     const token =  await AsyncStorage.getItem('userToken');
     //console.log("token : ", token);
      const response = await fetch(SERVER_URL+'/watchlist/remove', {
       method: 'DELETE',
       headers: {
         accept: "application/json",
         'Content-Type': 'application/json',
         Authorization: `Bearer ${token}`
       },
       body: JSON.stringify({ id: weatherId})
     });
 
     //console.log(response);
     if (response.ok) {               
        const newState = state.filter((weather) => weather.id !== weatherId);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
        setState(newState);
        return true;      
     }
     else{
   //   console.log(response);
      return false;
     } 
    }
    else{
      return false;
    }
  };

  const retrieveWatchlist = async () => {    
    const storedWatchlist = await AsyncStorage.getItem(STORAGE_KEY);    
    if (storedWatchlist) setState(JSON.parse(storedWatchlist));
  };

  useEffect(() => {
    retrieveWatchlist();
  }, []);

  return { 
    watchList: state,
    addToWatchlist,
    deleteFromWatchlist,
    retrieveWatchlistFromServer,
    weatherData,
    setWeatherData,
    currentCity,
    setCurrentCity,
  };
};
