import {StyleSheet, View, Text, Button} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {setScreen} from '../features/notes/notesSlice';

export default function NotesView({navigation}) {
  const dispatch = useDispatch();
  return (
    <View style={styles.container}>
      <Button
        title={'Note List'}
        onPress={() => {
          navigation.navigate('NotesList');
        }}
      />
      <Button
        title={'Note Map'}
        onPress={() => {
          navigation.navigate('NotesMap');
        }}
      />
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
