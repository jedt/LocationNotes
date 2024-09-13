import React, {useState, useEffect} from 'react';
import {View, Text, TextInput, Button, StyleSheet} from 'react-native';
import {useDispatch} from 'react-redux';
import {addNote, updateNote, deleteNote} from '../features/notes/notesSlice';
import firestore from '@react-native-firebase/firestore';

export default function NotesDetail({route, navigation}) {
  const {noteId} = route.params || {};
  const [note, setNote] = useState({title: '', body: '', date: ''});
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (noteId) {
      const unsubscribe = firestore()
        .collection('notes')
        .doc(noteId)
        .onSnapshot(documentSnapshot => {
          const data = documentSnapshot.data();
          setNote({
            title: data.title,
            body: data.body,
            date: data.date,
          });
        });
      return () => unsubscribe();
    } else {
      setNote(prevNote => ({
        ...prevNote,
        date: new Date().toLocaleDateString(),
      }));
    }
  }, [noteId]);

  const handleSave = async () => {
    setLoading(true);
    try {
      if (noteId) {
        await dispatch(updateNote({id: noteId, noteData: note}));
      } else {
        await dispatch(addNote(note));
      }
      navigation.goBack();
    } catch (error) {
      console.error('Error saving note:', error);
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await dispatch(deleteNote(noteId));
      navigation.goBack();
    } catch (error) {
      console.error('Error deleting note:', error);
    }
    setLoading(false);
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
      <Button title="Save" onPress={handleSave} disabled={loading} />
      {noteId && (
        <Button
          title="Delete"
          onPress={handleDelete}
          color="red"
          disabled={loading}
        />
      )}
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
