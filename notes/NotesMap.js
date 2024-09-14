import React, {useEffect} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import {useSelector, useDispatch, connect} from 'react-redux';

function NotesMap({navigation}) {
  const dispatch = useDispatch();
  const notes = useSelector(state => state.notes.notes);
  const loading = useSelector(state => state.notes.loading);

  // Set the initial region to the first note's location or a default location
  const initialRegion =
    notes.length > 0
      ? {
          latitude: notes[0].location.latitude,
          longitude: notes[0].location.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }
      : {
          latitude: 37.78825, // Default latitude
          longitude: -122.4324, // Default longitude
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!loading && (
        <MapView style={styles.map} initialRegion={initialRegion}>
          {notes.map(note => (
            <Marker
              key={note.id}
              coordinate={{
                latitude: note.location.latitude,
                longitude: note.location.longitude,
              }}
              title={note.title}
              description={note.body}
              onPress={() => navigation.push('NotesDetail', {noteId: note.id})}
            />
          ))}
        </MapView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});

export default connect(state => ({notes: state.notes}))(NotesMap);
