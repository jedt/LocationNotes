import React, {useState, useEffect} from 'react';
import {
  ActivityIndicator,
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {addNote, updateNote, deleteNote} from '../features/notes/notesSlice';
import firestore from '@react-native-firebase/firestore';
import Geolocation from '@react-native-community/geolocation';

export default function NotesDetail({route, navigation}) {
  const {noteId} = route.params || {};
  const [note, setNote] = useState({
    title: '',
    body: '',
    date: '',
    location: null,
  });

  const dispatch = useDispatch();

  useEffect(() => {
    if (noteId) {
      const unsubscribe = firestore()
        .collection('notes')
        .doc(noteId)
        .onSnapshot(documentSnapshot => {
          const data = documentSnapshot.data();
          if (data) {
            setNote({
              title: data.title,
              body: data.body,
              date: data.date,
            });
          }
        });
      return () => unsubscribe();
    } else {
      setNote(prevNote => ({
        ...prevNote,
        date: new Date().toLocaleDateString(),
      }));
    }
  }, [noteId]);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      getLocation();
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Notes App Location Permission',
            message:
              'Notes App needs access to your location to save it with your notes.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getLocation();
        } else {
          console.log('Location permission denied');
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  const getLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        setNote(prevNote => ({
          ...prevNote,
          location: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
        }));
      },
      error => {
        console.log(error);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  const handleSave = async () => {
    try {
      if (noteId) {
        dispatch(updateNote({id: noteId, noteData: note}));
      } else {
        dispatch(addNote({noteData: note}));
      }
      navigation.goBack();
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  const handleDelete = async () => {
    try {
      const returnObj = dispatch(deleteNote({id: noteId}));
      console.log('returnObj', returnObj);
      navigation.goBack();
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Date: {note.date}</Text>
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={note.title}
        onChangeText={text => setNote(prevNote => ({...prevNote, title: text}))}
      />
      <TextInput
        style={[styles.input, {height: 100}]}
        placeholder="Body"
        value={note.body}
        onChangeText={text => setNote(prevNote => ({...prevNote, body: text}))}
        multiline
      />
      <Button title="Save" onPress={handleSave} />
      {noteId && <Button title="Delete" onPress={handleDelete} color="red" />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: 'white',
  },
  input: {
    marginVertical: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
});
