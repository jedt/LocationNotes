import {combineReducers} from 'redux';

import itemsReducer from './features/items/itemsSlice';
import appReducer from './features/apps/appSlice';
import noteReducer from './features/notes/notesSlice';
const rootReducer = combineReducers({
  items: itemsReducer,
  notes: noteReducer,
  app: appReducer,
});

export default rootReducer;
