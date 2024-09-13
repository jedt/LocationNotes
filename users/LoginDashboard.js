import {Provider, useDispatch, useSelector, connect} from 'react-redux';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();
import Login from './Login';
import Signup from './Signup';

export default function LoginDashboard() {
  const currentScreen = useSelector(state => state.app.currentScreen);
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={currentScreen}>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{title: 'Login'}}
        />
        <Stack.Screen name="Signup" component={Signup} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
