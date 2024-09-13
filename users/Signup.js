import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  ActivityIndicator,
  Alert,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import {useDispatch, useSelector, connect} from 'react-redux';
import {signUp} from '../features/apps/appSlice';

export default function Signup({navigation, route}) {
  const [email, setEmail] = useState('test1@example.com');
  const [password, setPassword] = useState('$jkAY1vUjjVmz9W');
  const dispatch = useDispatch();

  const {status, error} = useSelector(state => state.app);

  const onSignup = async () => {
    try {
      await dispatch(signUp({email, password})).unwrap();
      navigation.navigate('Login');
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
      <Button title="Signup" onPress={onSignup} />
      <Button title="Go Back" onPress={() => navigation.popToTop()} />
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
