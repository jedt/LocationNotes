import LoginDashboard from './LoginDashboard';
import {useSelector, useDispatch} from 'react-redux';
import {readUser} from '../features/apps/appSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useEffect} from 'react';
import Welcome from '../Welcome';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

const Stack = createNativeStackNavigator();
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  ActivityIndicator,
  Alert,
} from 'react-native';

import NotesTabs from '../notes/NotesTabs';
// import NotesView from '../notes/NotesView';
// import NotesDetail from '../notes/NotesDetail';
// import NotesMap from '../notes/NotesMap';

export default function Dashboard() {
  const loggedInUser = useSelector(state => state.app.loggedInUser);
  const currentScreen = useSelector(state => state.notes.currentScreen);
  const {status, error} = useSelector(state => state.app);
  const hasUserClosedWelcome = useSelector(
    state => state.app.hasUserClosedWelcome,
  );
  const dispatch = useDispatch();

  //readUser
  useEffect(() => {
    try {
      console.log('[Dashboard] readUser');
      dispatch(readUser());
    } catch (err) {
      Alert.alert('Error', err);
    }
  }, [dispatch]);

  if (status === 'loading') {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    );
  }

  if (loggedInUser) {
    if (hasUserClosedWelcome) {
      console.log('[Dashboard] currentScreen', currentScreen);
      return <NotesTabs />;
    }
    return <Welcome />;
  }

  return <LoginDashboard />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
});
