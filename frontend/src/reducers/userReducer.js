export const initialState = null;

export const ACTION = {
  USER: "USER",
  CLEAR: "CLEAR",
};

// POINT : Reducer Function
export const reducer = (state, action) => {
  switch (action.type) {
    case ACTION.USER:
      return action.payload;
    case ACTION.CLEAR:
      return null;

    default:
      return state;
  }
};
