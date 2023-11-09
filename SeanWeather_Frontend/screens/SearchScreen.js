 
import React, { useState, useEffect } from "react";
import { StyleSheet, View, TextInput, FlatList, Text } from 'react-native';
import { useWeatherContext } from '../contexts/WeatherContext';
import { scaleSize } from '../constants/Layout';
import { theme } from "../colors.js"; 
import {SERVER_URL} from "../config";
 
export default function SearchScreen({ navigation }) {
 
  const { addToWatchlist } = useWeatherContext();
  const [keyWord, setKeyWord] = useState("");
  const [filteredData, setFilteredData] = useState([]);


  const API_KEY = "f8a747eb9b30581a78bb88486738c5d1";

  const icons = {
    "Clouds":"cloudy",
    "Clear":"day-sunny",
    "Rain":"rains",
    "Atmosphere":"cloudy-gusts",
    "Snow":"snow",
    "Drizzle":"rain",
    "Thunderstorm":"lightning",
  } 
  const [isLoading, setIsLoading] = useState(false);
  const [cities, setCities] = useState([]);
  const [city, setCity] = useState("Loading...");
  const [days, setDays] = useState([]);
  const [ok,setOk] = useState(true);

 
const getCities = async () => {
  setIsLoading(true);
  try {
    const response = await fetch(SERVER_URL+"/api/city");

    if (!response.ok) {
      console.error("HTTP Error", response.status);
      setIsLoading(false);
      return;
    }

    const json = await response.json();

    const cities = json.city.map((item) => ({id: item.ID, name: item.Name}));

    setCities(cities);
    setIsLoading(false);
  } catch (error) {
    console.error("Failed to fetch city names:", error);
    setIsLoading(false);
  }
};
 
 

  const handleTextChange = (text) => {
    setKeyWord(text);
    handleSearch(text);
  }
  
  const addToList = async (key) =>{
    console.log("key: " , key);
    const added = await addToWatchlist(key);
    if( added ){
        navigation.navigate('Weather')
        handleTextChange("");
    }
    
  }
  const handleSearch = (searchText) => {
    if( searchText === "" ){
        setFilteredData([]);
    }
    else{
        if(cities){
          setFilteredData(cities.filter(item => item.name.toLowerCase().includes(searchText.toLowerCase())));
        }
        else{
          setFilteredData([]);
        }
    }
  };
  useEffect(() => {
    // fetch symbol names from the server and save in local SearchScreen state 
    getCities();
  }, []);

  const renderItem = ({ item }) => {
    return (
        <Text  onPress={() => addToList(item) } style={styles.weatherText}>{item.name}</Text>
    //   <TouchableOpacity  onPress={() => addToList(item)}>
    //     <View style={styles.weather}>
    //       <Text style={styles.weatherText}>{item}</Text>
    //     </View>
    //   </TouchableOpacity>
    );
  };

  return (
     
      <View style={{ ...styles.container, flex: 1 }}>
        <TextInput
          returnKeyType="done"
          style={styles.input}
          value={keyWord}
          onChangeText={handleTextChange}
          placeholder="Search..."
        />

        <FlatList
          contentContainerStyle={{ flexGrow: 1 }}
          data={filteredData}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    padding: scaleSize(10),
    paddingHorizontal: 20,
  },
  input: {
    height: 40,
    borderColor: theme.grey,
    borderWidth: 1,
    marginBottom: scaleSize(10),
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginTop: 20,
    marginVertical: 20,
    fontSize: 18,
  },
  header: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: 100,
  },
  btnText: {
    fontWeight: "600",
    fontSize: 38,
  },
  input: {
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginTop: 20,
    marginVertical: 20,
    fontSize: 18,
  },
  weatherButton: {
  //  backgroundColor: '#ddd', // 버튼의 배경색을 변경합니다.
  //  borderRadius: 5, // 버튼의 모서리를 둥글게 만듭니다.
  //  padding: 10, // 버튼 내부의 패딩을 설정합니다.
   // marginBottom: 10, // 버튼들 사이에 간격을 줍니다.
    // ...
  },
  weather: {
    backgroundColor: theme.grey,
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 15,
    flexDirection: "row",
    alignItems:"center",
    justifyContent:"space-between",
  },
  weatherText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
    marginTop:15,
  },
  btnDelete:{
    color:"red",
    fontSize:20,
    fontWeight:"500",
  },
});
