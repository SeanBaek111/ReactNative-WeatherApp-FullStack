import React from 'react';
import { View } from "react-native";
import { Fontisto } from '@expo/vector-icons';

export const WeatherIconRow = ({ icons, weatherData }) => (
  <View style={styles.iconRow}>
    {weatherData.map((item, index) => (
      <View style={styles.iconContainer} key={index}>
        <Fontisto
          name={icons[item.description] || "exclamation"}
          size={15}
          color="green"
        />
      </View>
    ))}
  </View>
);
