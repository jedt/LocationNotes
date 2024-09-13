/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useState, useEffect} from 'react';
import auth from '@react-native-firebase/auth';
import {Provider, useDispatch, useSelector, connect} from 'react-redux';
import store from './store';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {StyleSheet, Text, View, Button} from 'react-native';
import Dashboard from './users/Dashboard.js';
const Stack = createNativeStackNavigator();

function App() {
  //create a new state currentView
  return (
    <Provider store={store}>
      <Dashboard />
    </Provider>
  );
}

export default App;
