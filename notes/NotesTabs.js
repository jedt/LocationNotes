import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector, connect} from 'react-redux';
import {fetchNotes} from '../features/notes/notesSlice';
import {NavigationContainer, useFocusEffect} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {logout} from '../features/apps/appSlice';
import NotesMap from './NotesMap';
import NotesDetail from './NotesDetail';
import NotesDetailChangeDate from './NotesDetailChangeDate';
import {FloatingAction} from 'react-native-floating-action';

import {
  Alert,
  StyleSheet,
  View,
  Text,
  Dimensions,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Button,
  Image,
  RefreshControl,
} from 'react-native';

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;
const cardHeight = deviceWidth / 1.6 - 28;

const actions = [
  {
    text: 'New Note',
    icon: require('../images/add.png'),
    name: 'NewNote',
    position: 0,
  },
];

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function NotesListComponent({navigation}) {
  const dispatch = useDispatch();
  const {notes, loading, error} = useSelector(state => state.notes);

  useEffect(() => {
    dispatch(fetchNotes());
  }, [dispatch]);

  const onRefresh = () => {
    dispatch(fetchNotes());
  };

  const renderItem = ({item}) => (
    <TouchableOpacity
      onPress={() =>
        navigation.push('NotesDetail', {noteId: item.id, item: item})
      }>
      <View style={styles.noteItem}>
        <Text style={styles.noteTitle}>{item.title}</Text>
        <Text style={styles.noteDate}>{item.date}</Text>
        <View style={styles.body}>
          <Text>{item.body}</Text>
        </View>
      </View>
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
        keyExtractor={item => {
          if (item.id) {
            return item.id;
          }
          return Math.random().toString();
        }}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={onRefresh} />
        }
      />
    </View>
  );
}

function Notes({navigation}) {
  const currentScreen = useSelector(state => state.notes.currentScreen);
  const dispatch = useDispatch();
  return (
    <>
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
      <FloatingAction
        distanceToEdge={{vertical: 20, horizontal: 10}}
        actions={actions}
        onPressItem={() => {
          navigation.navigate('NotesDetail', {
            item: {
              title: '',
              body: '',
              date: new Date().toLocaleDateString(),
              location: null,
            },
          });
        }}
      />
    </>
  );
}

function Map({navigation}) {
  const currentScreen = useSelector(state => state.notes.currentScreen);
  return (
    <>
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
      <FloatingAction
        distanceToEdge={{vertical: 50, horizontal: 10}}
        actions={actions}
        onPressItem={() => {
          navigation.navigate('NotesDetail', {
            item: {
              title: '',
              body: '',
              date: new Date().toLocaleDateString(),
              location: null,
            },
          });
        }}
      />
    </>
  );
}

// add right button to the Tab.Navigator header

function NotesTabs({navigation}) {
  const dispatch = useDispatch();
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen
          name="MobileDevTask"
          component={Notes}
          options={{
            tabBarIcon: ({color, focused, size}) => (
              <Image
                source={require('../images/list.png')}
                style={{tintColor: color}}
              />
            ),
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
        <Tab.Screen
          name="Map"
          component={Map}
          options={{
            tabBarIcon: ({color, focused, size}) => (
              <Image
                source={require('../images/map.png')}
                style={{tintColor: color}}
              />
            ),
          }}
        />
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
  body: {
    marginTop: 10,
  },
  listStyle: {},
  noteItem: {
    marginBottom: 4,
    backgroundColor: '#FFFFFF',
    width: deviceWidth,
    height: cardHeight,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    alignSelf: 'stretch',
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
