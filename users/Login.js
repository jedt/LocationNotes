import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {setScreen, login, setLoggedInUser} from '../features/apps/appSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  Alert,
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
} from 'react-native';

export default function Login({navigation}) {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('test1@example.com');
  const [password, setPassword] = useState('$jkAY1vUjjVmz9W');
  const {status, error} = useSelector(state => state.app);

  const handleSignup = () => {
    dispatch(setScreen('Signup'));
    navigation.navigate('Signup');
  };

  const handleLogin = async () => {
    try {
      const user = await dispatch(login({email, password})).unwrap();
      if (user && user.user) {
        dispatch(setLoggedInUser(user.user));
        await AsyncStorage.setItem('user', JSON.stringify(user.user));
      }
    } catch (err) {
      Alert.alert('Signup Error', err);
    }
  };

  if (status === 'loading') {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.buttonGroup}>
        <Text>Email</Text>
        <TextInput style={styles.input} value={email} onChangeText={setEmail} />
      </View>
      <View style={styles.buttonGroup}>
        <Text>Password</Text>
        <TextInput
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />
      </View>
      <Button title="Login" onPress={handleLogin} />
      <View>
        <Button title="Signup" onPress={handleSignup} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    padding: 10,
  },
  buttonGroup: {
    justifyContent: 'center',
    alignSelf: 'stretch',
    alignItems: 'stretch',
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#FAFAFA',
    borderColor: '#DADADA',
    borderWidth: 1,
    height: 50,
    paddingLeft: 8,
  },
});
