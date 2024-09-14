import React, {useState, useEffect} from 'react';
import {
  ActivityIndicator,
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Platform,
  Image,
  PermissionsAndroid,
  TouchableOpacity,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  addNote,
  updateNote,
  deleteNote,
  setNoteDateValue,
} from '../features/notes/notesSlice';
import firestore from '@react-native-firebase/firestore';
import Geolocation from '@react-native-community/geolocation';

export default function NotesDetail({route, navigation}) {
  const {noteId, item} = route.params || {};
  const {noteDateValue} = useSelector(state => state.notes);
  const [note, setNote] = useState(item || {});
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setNoteDateValue(item.date));
  }, [noteId, item]);

  useEffect(() => {
    if (noteId) {
      const unsubscribe = firestore()
        .collection('notes')
        .doc(noteId)
        .onSnapshot(documentSnapshot => {
          const data = documentSnapshot.data();
          if (data) {
            setNote({
              ...data,
              ...note,
              date: noteDateValue,
              location: data.location || null,
            });
          }
        });
      return () => unsubscribe();
    } else {
      setNote({
        title: '',
        body: '',
        date: noteDateValue || new Date().toLocaleDateString(),
        location: null,
      });
    }
  }, [noteId]);

  useEffect(() => {
    requestLocationPermission();
  }, [noteId, noteDateValue]);

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
        setNote({...note, date: noteDateValue, location: position.coords});
      },
      error => {
        console.log(error);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  const handleSave = () => {
    if (noteId) {
      dispatch(updateNote({id: noteId, noteData: note}));
    } else {
      dispatch(addNote({noteData: note}));
    }
    navigation.goBack();
  };

  const handleDelete = () => {
    dispatch(deleteNote({id: noteId}));
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() =>
          navigation.push('NotesDetailChangeDate', {noteId, note})
        }>
        <View style={styles.buttonWrapper}>
          <View style={styles.textWrapper}>
            <Text>Date: {note.date}</Text>
          </View>
          <Image
            resizeMode="contain"
            source={require('../images/right_arrow.png')}
          />
        </View>
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={note.title}
        onChangeText={text => setNote({...note, title: text})}
      />
      <TextInput
        style={[styles.input, {height: 100}]}
        placeholder="Body"
        value={note.body}
        onChangeText={text => setNote({...note, body: text})}
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
    height: 44,
    paddingHorizontal: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },

  buttonWrapper: {
    paddingHorizontal: 10,
    height: 44,
    borderWidth: 1,
    flexDirection: 'row',
    borderColor: '#EAEAEA',
    alignItems: 'center',
    alignSelf: 'stretch',
    justifyContent: 'center',
  },

  textWrapper: {
    flex: 1,
  },
});
