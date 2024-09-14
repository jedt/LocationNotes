import React, {useEffect} from 'react';
import {
  Alert,
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Button,
} from 'react-native';
import {useDispatch, useSelector, connect} from 'react-redux';
import {fetchNotes} from '../features/notes/notesSlice';
import {NavigationContainer, useFocusEffect} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {logout} from '../features/apps/appSlice';
import NotesMap from './NotesMap';
import NotesDetail from './NotesDetail';
import NotesDetailChangeDate from './NotesDetailChangeDate';
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function NotesListComponent({navigation}) {
  const dispatch = useDispatch();
  const {notes, loading, error} = useSelector(state => state.notes);

  useFocusEffect(
    React.useCallback(() => {
      dispatch(fetchNotes());
    }, [dispatch]),
  );

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button onPress={() => navigation.push('NotesDetail')} title="Add" />
      ),
    });
  }, [navigation]);

  const renderItem = ({item}) => (
    <TouchableOpacity
      onPress={() => navigation.push('NotesDetail', {noteId: item.id})}>
      <Text style={styles.noteTitle}>{item.title}</Text>
      <Text style={styles.noteDate}>{item.date}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>Error fetching notes: {error}</Text>
      </View>
    );
  }

  if (notes.length === 0) {
    return (
      <View style={styles.container}>
        <Text>No notes found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={notes}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
}

function Notes() {
  const currentScreen = useSelector(state => state.notes.currentScreen);
  return (
    <Stack.Navigator initialRouteName={currentScreen}>
      <Stack.Screen
        name="NotesList"
        component={NotesListComponent}
        options={{title: 'Notes List'}}
      />

      <Stack.Screen name="NotesDetail" component={NotesDetail} />
      <Stack.Screen
        name="NotesDetailChangeDate"
        component={NotesDetailChangeDate}
      />
    </Stack.Navigator>
  );
}

function Map() {
  const currentScreen = useSelector(state => state.notes.currentScreen);
  return (
    <Stack.Navigator initialRouteName={currentScreen}>
      <Stack.Screen
        name="NotesMap"
        component={NotesMap}
        options={{title: 'Notes Map'}}
      />

      <Stack.Screen name="NotesDetail" component={NotesDetail} />
      <Stack.Screen
        name="NotesDetailChangeDate"
        component={NotesDetailChangeDate}
      />
    </Stack.Navigator>
  );
}

// add right button to the Tab.Navigator header

function NotesTabs({navigation}) {
  const dispatch = useDispatch();
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen
          name="Mobile Dev Task"
          component={Notes}
          options={{
            headerRight: () => (
              <Button
                onPress={() => {
                  Alert.alert('Logout', 'Are you sure you want to logout?', [
                    {
                      text: 'Cancel',
                      style: 'cancel',
                    },
                    {
                      text: 'OK',
                      onPress: () => {
                        dispatch(logout());
                      },
                    },
                  ]);
                }}
                title="Logout"
              />
            ),
          }}
        />
        <Tab.Screen name="Map" component={Map} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  noteItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  noteTitle: {
    fontSize: 18,
  },
  noteDate: {
    fontSize: 14,
    color: '#999',
  },
});

export default NotesTabs;
