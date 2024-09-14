import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text, Button} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {useDispatch, useSelector} from 'react-redux';
import {setNoteDateValue} from '../features/notes/notesSlice';

export default function NotesDetailChangeDate({navigation, route}) {
  const {noteId, note} = route.params || {};
  const dispatch = useDispatch();
  //note.date = 9/17/2024

  const [selectedDate, setSelectedDate] = useState(new Date());

  const onDateChange = date => {
    setSelectedDate(date);
  };

  return (
    <View style={styles.container}>
      <View>
        <DatePicker
          mode="date"
          date={selectedDate}
          onDateChange={onDateChange}
        />
      </View>
      <Button
        style={{height: 50}}
        title="Save"
        onPress={() => {
          dispatch(setNoteDateValue(selectedDate.toLocaleDateString()));
          navigation.goBack();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: 10,
  },
});
