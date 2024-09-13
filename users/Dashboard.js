import LoginDashboard from './LoginDashboard';
import {useSelector, useDispatch} from 'react-redux';
import {readUser} from '../features/apps/appSlice';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  ActivityIndicator,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useEffect} from 'react';

export default function Dashboard() {
  const loggedInUser = useSelector(state => state.app.loggedInUser);
  const {status, error} = useSelector(state => state.app);
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
    return (
      <View style={styles.container}>
        <Text>Welcome {loggedInUser.email}</Text>
      </View>
    );
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
