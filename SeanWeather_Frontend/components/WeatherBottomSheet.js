import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import BottomSheet from "@gorhom/bottom-sheet/src";
import { LineChart } from "react-native-chart-kit";

import { Fontisto } from '@expo/vector-icons';
const { width } = Dimensions.get("window");
import { WeatherContext } from "../contexts/WeatherContext";
import { scaleSize } from "../constants/Layout";

const DATA_TYPES = ["Temperature", "Humidity", "UVI"];
const DATA_COLORS = {
  Temperature: { bgFrom: "#03a9f4", bgTo: "#0288d1" },
  Humidity: { bgFrom: "#4caf50", bgTo: "#388e3c" },
  UVI: { bgFrom: "#3f51b5", bgTo: "#303f9f" },
};
const DATA_UNITS = {
  Temperature: "°C",
  Humidity: "%",
  UVI: "",
};


const icons = {
  Clouds: "cloudy",
  Clear: "day-sunny",
  Rain: "rains",
  Atmosphere: "cloudy-gusts",
  Snow: "snow",
  Drizzle: "rain",
  Thunderstorm: "lightning",
};

const WeatherBottomSheet = React.forwardRef((props, ref) => {
  const { weatherData, currentCity } = useContext(WeatherContext);
  const [processedWeatherData, setProcessedWeatherData] = useState(null);
  const [selectedDataType, setSelectedDataType] = useState(DATA_TYPES[0]);

  useEffect(() => {
   
    if (weatherData) {
      const newProcessedWeatherData = processWeatherData(weatherData);
      //console.log(newProcessedWeatherData);
      setProcessedWeatherData(newProcessedWeatherData);
    }
  }, [weatherData]);

  const processWeatherData = (data) => {
 
    return data.map((day) => {
     // console.log(day);
      const date = new Date(day.dt * 1000);
      return {
        date: `${date.getMonth() + 1}/${date.getDate()}`,
        temperature: day.temp.day,
        humidity: day.humidity,
        uvi: day.uvi,
        description: day.weather[0].main,
      };
    });
  };

  const lineChartData = {
    labels: processedWeatherData
      ? processedWeatherData.map((item) => item.date)
      : [],
    datasets: [
      {
        data: processedWeatherData
          ? processedWeatherData.map(
              (item) => item[selectedDataType.toLowerCase()]
            )
          : [],
      },
    ],
  };

  const handleDataTypeChange = () => {
    const currentIndex = DATA_TYPES.indexOf(selectedDataType);
    const nextIndex = (currentIndex + 1) % DATA_TYPES.length;
    setSelectedDataType(DATA_TYPES[nextIndex]);
  };

  return (
    <BottomSheet
      ref={ref}
      index={props.index}
      snapPoints={props.snapPoints}
      onChange={props.onSheetChanges}
      backgroundComponent={() => <View style={styles.bottomSheet} />}
    >
      <View style={styles.contentContainer}>
        <TouchableOpacity onPress={handleDataTypeChange}>
          <Text style={styles.chartTitle}>
            {currentCity} {selectedDataType}{" "}
            {DATA_UNITS[selectedDataType].length > 0
              ? "(" + DATA_UNITS[selectedDataType] + ")"
              : ""}
          </Text>
        </TouchableOpacity>
        {processedWeatherData && processedWeatherData.length > 0? (
          <View
            style={{             
              height: scaleSize(200),
            }}
            onStartShouldSetResponder={() => true}
            onResponderRelease={handleDataTypeChange}
          >
            <LineChart
              data={lineChartData}
              width={width - 10}
              height={ scaleSize(210)}
              chartConfig={{
                backgroundColor: DATA_COLORS[selectedDataType].bgFrom,
                backgroundGradientFrom: DATA_COLORS[selectedDataType].bgFrom,
                backgroundGradientTo: DATA_COLORS[selectedDataType].bgTo,
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
              }}
              style={{
                marginVertical: 8,
              }}
            />
            <View style={styles.iconRow}>
              {processedWeatherData.map((item, index) => (
                <View style={styles.iconContainer} key={index}>
                  <Fontisto
                    name={icons[item.description] || "exclamation"}
                    size={15}
                    color="green"
                  />
                </View>
              ))}
            </View>
          </View>
        ) : (
          <Text>Loading...</Text>
        )}
      </View>
    </BottomSheet>
  );
});

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#F5F5DC",
    borderTopRightRadius: 16,
    borderTopLeftRadius: 16,
  },
  bottomSheet: {
    flex: 1,    
    backgroundColor: "#ADD8E6",
  },
  chartTitle:{
    marginTop: scaleSize(15),
  },
  chartContainer: {
    position: 'relative',
    width: '100%',
  },
  iconRow: {    
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: scaleSize(10),
    width: scaleSize(331),
  },
  iconContainer: {
    marginLeft: scaleSize(60),    
    width: scaleSize(20),
    alignItems: 'flex-start',
  },
});

export default WeatherBottomSheet;
