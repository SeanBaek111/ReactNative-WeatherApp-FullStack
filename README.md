# ReactNative-WeatherApp-FullStack

## Introduction
This application enables users to search for cities, save them to a watchlist, and view current weather and temperature for each city in list format. Users can also view expected weather, humidity, and UV index for the next week.

<p align="center">
  <img height="300" alt="image" src="https://github.com/SeanBaek111/ReactNative-WeatherApp-FullStack/assets/33170173/7590eb7c-33b7-4383-8a08-dbe8ba48da58">
  <img height="300" alt="image" src="https://github.com/SeanBaek111/ReactNative-WeatherApp-FullStack/assets/33170173/217c17bc-de8e-4693-be45-a1639cccdfdf">
  <img height="300" alt="image" src="https://github.com/SeanBaek111/ReactNative-WeatherApp-FullStack/assets/33170173/42cbb372-c7a7-4670-822f-def0a2846f3a">
</p>


### Purpose & Description
The goal is to offer a seamless and consistent user experience across iOS, Android, and web platforms for weather tracking and forecast information.

## Video Demo
A video demonstration of the application can be viewed on YouTube to showcase the functionality and user interface.
[Watch the Demo Video](https://youtu.be/FShH5CibNI4)

### Completeness and Limitations
- The application is complete, fully functional, and has been tested on web and iOS platforms.
- Limitations include simplified API use and less seamless experience on Android due to a conflict with the bottomsheet module.

## Use of APIs
- OpenWeather API for fetching real-time weather data.
- Endpoints used:
  - `https://api.openweathermap.org/data/2.5/weather`
  - `https://api.openweathermap.org/data/2.5/onecall`

## Modules Used
- For the app: `@expo/webpack-config`, `@gorhom/bottom-sheet`, `@react-native-async-storage/async-storage`, `@react-navigation/*`, `react-native-chart-kit`, `react-native-paper`, `react-native-swipe-list-view`.
- For the server: `bcrypt`, `cors`, `express`, `jsonwebtoken`, `knex`, `mysql2`, `nodemon`.

## Application Design
- Navigation and Layout: Implemented using `IFN666 React Native Skeleton` and `venits/react-native-login-template`.
- Backend Deployment: Utilized Nginx and MySQL on a CentOS 7 server, with Node.js server and PM2.

## Technical Description
The application's architecture is modular and component-based, following common patterns in React and React Native applications.

## Test Plan
A comprehensive test plan was executed, with results documented for various functionalities like login, sign up, search, watchlist management, and weather forecasting.

## Difficulties / Exclusions / unresolved & persistent errors
- Main difficulties included handling navigation and BottomSheet module implementation.
- Server communication does not use SSL in the current implementation.

## Extensions
Future enhancements could include more detailed weather information, push notifications, and a companion web application.

## User Guide
Steps to use the application, from login to viewing detailed weather forecasts.

## References
- OpenWeatherMap API Documentation
- React Native Documentation
- React Navigation Documentation
- Gorhom Bottom Sheet Documentation

---
## SeanWeather_Backend
Contains all backend-related code and configurations.

## SeanWeather_Frontend
Includes all frontend components, screens, and navigation logic.
