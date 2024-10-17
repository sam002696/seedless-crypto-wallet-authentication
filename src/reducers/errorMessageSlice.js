import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  datas:''
};

export const errorMessageSlice = createSlice({
  name: 'errorMessage',
  initialState,
  reducers: {
    setErrorMessage: (state, {payload}) => {
      return {
        datas: payload.errors
      }
    },
  },
});

export const {setErrorMessage} = errorMessageSlice.actions;
export const selectErrorMessage = state => state.errorMessage;
export default errorMessageSlice.reducer;
