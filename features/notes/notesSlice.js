import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import firestore from '@react-native-firebase/firestore';

export const fetchNotes = createAsyncThunk(
  'notes/fetchNotes',
  async (_, thunkAPI) => {
    try {
      const notes = [];
      const querySnapshot = await firestore().collection('notes').get();
      querySnapshot.forEach(documentSnapshot => {
        notes.push({id: documentSnapshot.id, ...documentSnapshot.data()});
      });
      return notes;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const addNote = createAsyncThunk(
  'notes/addNote',
  async (noteData, thunkAPI) => {
    try {
      const docRef = await firestore().collection('notes').add(noteData);
      const doc = await docRef.get();
      return {id: doc.id, ...doc.data()};
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const updateNote = createAsyncThunk(
  'notes/updateNote',
  async ({id, noteData}, thunkAPI) => {
    try {
      await firestore().collection('notes').doc(id).update(noteData);
      return {id, ...noteData};
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const deleteNote = createAsyncThunk(
  'notes/deleteNote',
  async (id, thunkAPI) => {
    try {
      await firestore().collection('notes').doc(id).delete();
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

const notesSlice = createSlice({
  name: 'notes',
  initialState: {
    currentScreen: 'NotesView',
    notes: [],
    loading: false,
    error: null,
  },
  reducers: {
    setScreen(state, action) {
      state.currentScreen = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchNotes.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotes.fulfilled, (state, action) => {
        state.loading = false;
        state.notes = action.payload;
      })
      .addCase(fetchNotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addNote.fulfilled, (state, action) => {
        state.notes.push(action.payload);
      })
      .addCase(updateNote.fulfilled, (state, action) => {
        const index = state.notes.findIndex(
          note => note.id === action.payload.id,
        );
        if (index !== -1) {
          state.notes[index] = action.payload;
        }
      })
      .addCase(deleteNote.fulfilled, (state, action) => {
        state.notes = state.notes.filter(note => note.id !== action.payload);
      });
  },
});

export const {setScreen} = notesSlice.actions;
export default notesSlice.reducer;
