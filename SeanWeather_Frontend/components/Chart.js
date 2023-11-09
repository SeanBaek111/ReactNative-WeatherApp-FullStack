import React from 'react';
import { LineChart } from "react-native-chart-kit";
import { scaleSize } from "../constants/Layout";

export const Chart = ({ lineChartData, selectedDataType, DATA_COLORS, handleDataTypeChange }) => {
  return (
    <View
      style={{ height: scaleSize(200) }}
      onStartShouldSetResponder={() => true}
      onResponderRelease={handleDataTypeChange}
    >
      <LineChart
        data={lineChartData}
        width={width - 10}
        height={scaleSize(210)}
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
    </View>
  );
};