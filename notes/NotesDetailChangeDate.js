import React, {useState} from 'react';
import {StyleSheet, View, Text, Button} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {useDispatch, useSelector} from 'react-redux';
import {setNote} from '../features/notes/notesSlice';

export default function NotesDetailChangeDate({navigation, route}) {
  const dispatch = useDispatch();
  const {note} = useSelector(state => state.notes);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const onDateChange = date => {
    setSelectedDate(date);
    dispatch(
      setNote({
        ...note,
        date: date.toLocaleDateString(),
      }),
    );
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
        onPress={() => navigation.goBack()}
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
