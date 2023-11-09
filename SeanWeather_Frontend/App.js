import { Provider } from 'react-native-paper'
import { WeatherProvider } from './contexts/WeatherContext';  
import { StyleSheet } from 'react-native';
import React, {  } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack'
import { theme } from './core/theme'

//import LoginScreen
import LoginScreen from './screens/LoginScreen';  
import RegisterScreen from './screens/RegisterScreen';
import ResetPasswordScreen from './screens/ResetPasswordScreen';
import BottomTabNavigator from "./navigation/BottomTabNavigator"; 

const Stack = createStackNavigator()


export default function App() {


  return (
    <WeatherProvider>
      <Provider theme={theme}> 
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName="LoginScreen"
              screenOptions={{
                headerShown: false,
                headerStyle: { backgroundColor: "#408FAA" },
                headerTintColor: "white",
              }}
            >
              <Stack.Screen name="LoginScreen" component={LoginScreen} />
              <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
              <Stack.Screen
                name="Home"
                component={BottomTabNavigator}
                options={{
                  headerShown: true,  
                }}
              />
              <Stack.Screen
                name="ResetPasswordScreen"
                component={ResetPasswordScreen}
              />
            </Stack.Navigator>
          </NavigationContainer> 
      </Provider>
    </WeatherProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
