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

function HomeScreen({navigation}) {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Home Screen</Text>
      <Button
        title="Go to Details"
        onPress={() =>
          navigation.push('Details', {
            itemID: 86,
            description: 'sample text',
          })
        }
      />
    </View>
  );
}

function DetailsScreen({route, navigation}) {
  const {itemID, description} = route.params;
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Details Screen</Text>
      <Text>itemID: {itemID}</Text>
      <Text>description: {description}</Text>
      <Button title="Go back" onPress={() => navigation.popToTop()} />
    </View>
  );
}

const Stack = createNativeStackNavigator();

// function App() {
//   return (
//     <Provider store={store}>
//       <NavigationContainer>
//         <Stack.Navigator initialRouteName="Home">
//           <Stack.Screen
//             name="Home"
//             component={HomeScreen}
//             options={{title: 'Overview'}}
//           />
//           <Stack.Screen
//             name="Details"
//             component={DetailsScreen}
//             options={({route}) => {
//               console.log(route);
//               return {
//                 title: 'Title: ' + route.name,
//               };
//             }}
//           />
//         </Stack.Navigator>
//       </NavigationContainer>
//     </Provider>
//   );
// }

function App() {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    console.log('subscriber:', subscriber);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Login</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text>Welcome {user.email}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
