// WeathersScreen.js

import React, { useMemo, useRef,useState } from "react"; 

import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from "react-native";

const isWeb = Platform.OS === "web";
 
import WeatherBottomSheet from '../components/WeatherBottomSheet';  

import { SwipeListView } from "react-native-swipe-list-view";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";

import { Fontisto } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { useWeatherContext } from "../contexts/WeatherContext";
import { theme } from "../colors.js";
function WeathersScreen() {
  const API_KEY = "f8a747eb9b30581a78bb88486738c5d1";
  const icons = {
    Clouds: "cloudy",
    Clear: "day-sunny",
    Rain: "rains",
    Atmosphere: "cloudy-gusts",
    Snow: "snow",
    Drizzle: "rain",
    Thunderstorm: "lightning",
  };

  const [sheetIndex, setSheetIndex] = useState(0);  
   // ref
   const bottomSheetRef = useRef(null);
 
   // variables
   const snapPoints = useMemo(() => ['1%', '50%'], []); 
  
   const handleSheetChanges = (index) => {
    //console.log('handleSheetChanges from WeathersScreen', index); 
    setSheetIndex(index);
  }; 

  const [isLoading, setLoading] = React.useState(true);

  const [weather, setWeather] = React.useState([]);

  const { watchList, deleteFromWatchlist, setWeatherData , setCurrentCity} = useWeatherContext();

  const getWeather = async (latitude, longitude) => {
    
    try { 
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude={alert}&appid=${API_KEY}&units=metric`
      );
      const json = await response.json();
     // console.log(json.daily);
     
      setWeatherData(json.daily);
      setLoading(false);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch weather data.");
      console.error(error);
      setLoading(false);
    }
};

React.useEffect(() => {
  // Fetch weather information for each city
  const fetchWeatherData = async () => {
    setLoading(true); // Start loading
    const promises = watchList.map(async (item) => {
      try {
        // Fetch weather information
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${item.name}&units=metric&appid=${API_KEY}`
        );
        const json = await response.json();

        // Check if the API response is valid
        if (json && json.main && json.weather && json.weather[0]) {
          return {
            id: item.id,
            valid: true,
            name: item.name,
            temperature: json.main.temp,
            icon: json.weather[0].main,
            description: json.weather[0].description,
            lat: json.coord.lat,
            lon: json.coord.lon,
          };
        } else {
          console.log('Invalid API response for city:', item.name);
          console.log(json);
          return null;
        }
      } catch (error) {
        console.error('Failed to fetch weather data for city:', item.name);
        return null;
      }
    });

    const weatherData = await Promise.all(promises);
    setWeather(weatherData.filter(item => item !== null));
    setLoading(false);
  };

  fetchWeatherData();
}, [watchList]);


 
  const renderItem = ({ item }) => (
    !item.valid?
    <View style={styles.weatherText}>Loding...</View>
    : 
    <TouchableOpacity onPress={() => {
        //console.log("current city is " + item.name);
        setCurrentCity(item.name);
        getWeather(item.lat, item.lon);   
        setSheetIndex(1);  // Set the sheet index to 1 when an item is pressed 
        if(bottomSheetRef){
          bottomSheetRef.current?.snapToIndex(1);  
        }
        
      }}>
    <View style={styles.weather} key={item.id}>
      <Text style={styles.weatherText}>{item.name}</Text>
      <View style={styles.weatherInfoContainer}>
        <View style={styles.weatherInfo}>
          <Text style={styles.weatherTemp}>{Math.round(item.temperature)}°C</Text>
          <Fontisto name={icons[item.icon]} size={38} color="#dfe24a" />
        </View>
        <Text style={styles.weatherDescription}>{item.description}</Text>
      </View> 
    </View>
  </TouchableOpacity>
  );
  

  //   if (isLoading) {
  //     return <Text>Loading...</Text>;
  //   }

  return (
    <View style={styles.container}>
      {isLoading ? (
         <ActivityIndicator size="large" color="#40E0D0" />
      ) : (
        <SwipeListView
          data={weather}
          renderItem={renderItem}
          renderHiddenItem={({ item }) => (
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deleteFromWatchlist(item.id)}
            >
              <MaterialIcons name="delete" size={36} color="red" />
            </TouchableOpacity>
          )}
          rightOpenValue={-75}
          showsVerticalScrollIndicator={false}
        />
      )}
       <WeatherBottomSheet
        ref={bottomSheetRef} 
        index={sheetIndex} // Use the sheetIndex state here
        snapPoints={snapPoints}
        onSheetChanges={handleSheetChanges}
      />
    </View>
  );
  
}

export default WeathersScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: theme.bg,
    color: "white",
    fontSize: moderateScale(110),
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
  deleteButton: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    marginTop: verticalScale(5),
    borderRadius: scale(15),
    top: 0,
    bottom: 0,
    width: 75,
    backgroundColor: "black",
    right: 0,
  },
  weather: {
    backgroundColor: theme.grey,
    marginTop: verticalScale(5),
    marginBottom: verticalScale(5),
    paddingVertical: verticalScale(25),
    paddingHorizontal: scale(20),
    borderRadius: scale(15),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  weatherText: {
    color: "white",
    fontSize: moderateScale(18),
    fontWeight: "600",    
    width: scale(150),
  },
  weatherInfoContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    marginRight:scale(10),
  },
  weatherInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'start',
    
  },
  weatherTemp: {
    color: "white",
    fontSize: moderateScale(18),
    fontWeight: "500",
    marginTop: verticalScale(0),
  },
  weatherDescription: {
    color: "lightgreen",  
    fontSize: moderateScale(14),
    fontWeight: "400",
    marginTop: verticalScale(5),
    width: scale(111),
    textAlign:"left",
  },
});
