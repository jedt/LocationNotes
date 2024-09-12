import {combineReducers} from 'redux';

import itemsReducer from './features/items/itemsSlice';

const rootReducer = combineReducers({
  items: itemsReducer,
});

export default rootReducer;
