import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Async thunk for user signup
export const signUp = createAsyncThunk(
  'app/signUp',
  async ({email, password}, {rejectWithValue}) => {
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );

      if (userCredential && userCredential.user) {
        return {user: userCredential.user};
      }

      return rejectWithValue('User not signed up');
    } catch (error) {
      throw rejectWithValue(error.message);
    }
  },
);

// Async thunk for user login
export const login = createAsyncThunk(
  'auth/login',
  async ({email, password}, {rejectWithValue}) => {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(
        email,
        password,
      );
      if (userCredential && userCredential.user) {
        console.log('[signUp] User logged in:', userCredential.user);
        return {user: userCredential.user};
      }

      return rejectWithValue('User logged in');
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

// Async thunk for logout
export const logout = createAsyncThunk('app/logout', async () => {
  try {
    await AsyncStorage.removeItem('user');
    await auth().signOut();
    return null;
  } catch (error) {
    return error.message;
  }
});

// async thunk for reading user from async storage
//const value = await AsyncStorage.getItem('my-key');
export const readUser = createAsyncThunk(
  'app/readUser',
  async (_, {rejectWithValue}) => {
    try {
      const value = await AsyncStorage.getItem('user');
      if (value) {
        const user = JSON.parse(value);
        return user;
      }
      return rejectWithValue('User not found');
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const appSlice = createSlice({
  name: 'app',
  initialState: {
    user: null,
    status: 'idle',
    error: null,
    loggedInUser: null,
    hasUserClosedWelcome: false,
  },
  reducers: {
    setLoggedInUser(state, action) {
      state.loggedInUser = action.payload;
    },
    setHasUserClosedWelcome(state, action) {
      state.hasUserClosedWelcome = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(signUp.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        if (action.payload && action.payload.user) {
          state.user = action.payload.user;
          state.status = 'succeeded';
        } else {
          state.status = 'failed';
          state.error = 'User not signed up';
        }
      })
      .addCase(signUp.rejected, (state, action) => {
        console.error('[extraReducers] User signup failed:', action);
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(login.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, state => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(readUser.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(readUser.fulfilled, (state, action) => {
        state.loggedInUser = action.payload;
        state.status = 'succeeded';
      })
      .addCase(readUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(logout.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(logout.fulfilled, state => {
        state.hasUserClosedWelcome = false;
        state.loggedInUser = null;
        state.status = 'succeeded';
      });
  },
});

export const {setScreen, setLoggedInUser, setHasUserClosedWelcome} =
  appSlice.actions;
export default appSlice.reducer;
