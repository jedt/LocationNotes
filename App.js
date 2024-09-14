/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {Provider} from 'react-redux';
import store from './store';
import Dashboard from './users/Dashboard.js';

function App() {
  //create a new state currentView
  return (
    <Provider store={store}>
      <Dashboard />
    </Provider>
  );
}

export default App;
