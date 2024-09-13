import {combineReducers} from 'redux';

import itemsReducer from './features/items/itemsSlice';
import appReducer from './features/apps/appSlice';

const rootReducer = combineReducers({
  items: itemsReducer,
  app: appReducer,
});

export default rootReducer;
