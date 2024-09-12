import {createSlice} from '@reduxjs/toolkit';

const itemsSlice = createSlice({
  name: 'items',
  initialState: [],
  reducers: {
    setItems(state, action) {
      return action.payload;
    },
    addItem(state, action) {
      state.push(action.payload);
    },
  },
});

export const {setItems, addItem} = itemsSlice.actions;
export default itemsSlice.reducer;
