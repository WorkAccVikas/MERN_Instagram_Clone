export const initialState = null;

export const ACTION = {
  USER: "USER",
  CLEAR: "CLEAR",
  UPDATE: "UPDATE",
};

// POINT : Reducer Function
export const reducer = (state, action) => {
  switch (action.type) {
    case ACTION.USER:
      return action.payload;
    case ACTION.CLEAR:
      return null;
    case ACTION.UPDATE:
      return {
        ...state,
        followers: action.payload.followers,
        following: action.payload.following,
      };

    default:
      return state;
  }
};
