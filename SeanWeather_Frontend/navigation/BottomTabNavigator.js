import React, { useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Button } from 'react-native'; // Import Button
import TabBarIcon from "../components/TabBarIcon";
import WeathersScreen from "../screens/WeathersScreen";
import SearchScreen from "../screens/SearchScreen";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { Text } from 'react-native-paper'

const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = "Weather";

export default function BottomTabNavigator({ navigation, route }) {
  useEffect(() => {
    navigation.setOptions({ 
      headerTitle: getHeaderTitle(route),
      headerRight: () => ( // Add headerRight
        <Button
          onPress={() => {
            navigation.reset({
              index: 0,
              routes: [{ name: 'LoginScreen' }],
            })
          }}
          title="Logout"
          color="#000"
        />
      )
    });
  }, [navigation, route]);

  return (
    <BottomTab.Navigator initialRouteName={INITIAL_ROUTE_NAME} 
    screenOptions={{
      tabBarStyle: { backgroundColor: '#444444' },
    }}> 
      <BottomTab.Screen
        name="Weather"
        component={WeathersScreen}
        options={{
          title: "Weather",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name="partly-sunny-outline" />
          ),
          headerShown: false,
          
        }}
      />
      <BottomTab.Screen
        name="Search" 
        component={SearchScreen}
        options={{
          title: "Search",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name="md-search" />
          ),
          headerShown: false,
        }}
      />
    </BottomTab.Navigator>
  );
}

function getHeaderTitle(route) {
  return getFocusedRouteNameFromRoute(route) ?? INITIAL_ROUTE_NAME;
}
