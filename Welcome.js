import {StyleSheet, View, Text, Button} from 'react-native';
import {setHasUserClosedWelcome} from './features/apps/appSlice';
import {useDispatch} from 'react-redux';

export default function Welcome({navigation}) {
  const dispatch = useDispatch();
  const onPressContinue = () => {
    dispatch(setHasUserClosedWelcome(true));
  };
  return (
    <View style={styles.container}>
      <Text style={{fontSize: 32}}>Welcome to Mobile Dev Task</Text>
      <Button title={'Continue'} onPress={onPressContinue} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
});
