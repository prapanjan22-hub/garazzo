import { combineReducers } from '@reduxjs/toolkit';

// Placeholder reducer
function dummyReducer(state = {}, action) {
  return state;
}

const rootReducer = combineReducers({
  dummy: dummyReducer,
});

export default rootReducer;
