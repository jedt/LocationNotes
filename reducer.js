import {combineReducers} from 'redux';

import appReducer from './features/apps/appSlice';
import noteReducer from './features/notes/notesSlice';
const rootReducer = combineReducers({
  notes: noteReducer,
  app: appReducer,
});

export default rootReducer;
