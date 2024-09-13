import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Async thunk for user signup
export const signUp = createAsyncThunk(
  'app/signup',
  async ({email, password}, {rejectWithValue}) => {
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );

      console.log('[signUp] userCredential:', userCredential);

      if (userCredential && userCredential.user) {
        console.log('[signUp] User signed up:', userCredential.user);
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
    currentScreen: 'Login',
    user: null,
    status: 'idle',
    error: null,
    loggedInUser: null,
    hasUserClosedWelcome: false,
  },
  reducers: {
    setScreen(state, action) {
      state.currentScreen = action.payload;
    },
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
        console.log('[extraReducers] User signed up:', action);
        //action =  {"meta": {"arg": {"email": "test1@example.com", "password": "1234"}, "requestId": "3RahPSBHkLtszW2hhr978", "requestStatus": "fulfilled"}, "payload": undefined, "type": "app/signup/fulfilled"}
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
      });
  },
});

export const {setScreen, setLoggedInUser, setHasUserClosedWelcome} =
  appSlice.actions;
export default appSlice.reducer;
