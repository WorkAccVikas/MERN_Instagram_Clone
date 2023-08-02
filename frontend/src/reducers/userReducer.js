export const initialState = null;

export const ACTION = {
  USER: "USER",
};

// POINT : Reducer Function
export const reducer = (state, action) => {
  switch (action.type) {
    case ACTION.USER:
      return action.payload;

    default:
      return state;
  }
};
