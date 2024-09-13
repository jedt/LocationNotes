import React, {useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Button,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {fetchNotes} from '../features/notes/notesSlice';
import {NavigationContainer, useFocusEffect} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import NotesMap from './NotesMap';
import NotesDetail from './NotesDetail';

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
        <Button
          onPress={() => navigation.navigate('NotesDetail')}
          title="Add"
        />
      ),
    });
  }, [navigation]);

  const renderItem = ({item}) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('NotesDetail', {noteId: item.id})}>
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
    </Stack.Navigator>
  );
}

function NotesTabs() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="List" component={Notes} />
        <Tab.Screen name="Map" component={NotesMap} />
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

// <NavigationContainer>
//   <Stack.Navigator initialRouteName={currentScreen}>
//     <Stack.Screen
//       name="NotesList"
//       component={NotesTabs}
//       options={{title: 'Notes List'}}
//     />
//     <Stack.Screen
//       name="NotesMap"
//       component={NotesMap}
//       options={{title: 'Notes Map'}}
//     />
//     <Stack.Screen name="NotesDetail" component={NotesDetail} />
//     <Stack.Screen
//       name="NotesView"
//       component={NotesView}
//       options={{title: 'Notes View'}}
//     />
//   </Stack.Navigator>
// </NavigationContainer>
