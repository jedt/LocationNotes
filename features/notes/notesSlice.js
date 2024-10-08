import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
const notesCollection = firestore().collection('notes');
export const fetchNotes = createAsyncThunk(
  'notes/fetchNotes',
  async (_, thunkAPI) => {
    try {
      console.log(`[${Date()} notesSlice] fetchNotes`);
      const notes = [];
      const startTime = Date.now();
      const querySnapshot = await notesCollection.get();
      console.log(
        `[${Date()} notesSlice] fetchNotes took`,
        Date.now() - startTime,
        'ms',
      );
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
  async ({noteData}, thunkAPI) => {
    try {
      const documentReference = await notesCollection.add(noteData);
      return {id: documentReference.id, ...noteData};
    } catch (error) {
      console.log('addNote error', error);
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const updateNote = createAsyncThunk(
  'notes/updateNote',
  async ({id, noteData}, thunkAPI) => {
    try {
      await notesCollection.doc(id).update(noteData);
      return {id, ...noteData};
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const deleteNote = createAsyncThunk(
  'notes/deleteNote',
  async ({id}, thunkAPI) => {
    try {
      await notesCollection.doc(id).delete();
      return id;
    } catch (error) {
      console.log('deleteNote error', error);
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
    noteDateValue: new Date().toLocaleDateString(),
  },
  reducers: {
    setScreen(state, action) {
      state.currentScreen = action.payload;
    },
    setNoteDateValue(state, action) {
      console.log('[notesSlice] setNoteDateValue', action.payload);
      state.noteDateValue = action.payload;
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
      .addCase(addNote.pending, state => {
        state.loading = true;
      })
      .addCase(addNote.fulfilled, (state, action) => {
        state.loading = false;
        state.notes.push(action.payload);
      })
      .addCase(updateNote.pending, state => {
        state.loading = true;
      })
      .addCase(updateNote.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.notes.findIndex(
          note => note.id === action.payload.id,
        );
        if (index !== -1) {
          state.notes[index] = action.payload;
        }
      })
      .addCase(deleteNote.pending, state => {
        state.loading = true;
      })
      .addCase(deleteNote.fulfilled, (state, action) => {
        console.log('deleteNote.fulfilled', action.payload);
        state.loading = false;
        state.notes = state.notes.filter(note => note.id !== action.payload);
      });
  },
});

export const {setScreen, setNote, setNoteDateValue} = notesSlice.actions;
export default notesSlice.reducer;
