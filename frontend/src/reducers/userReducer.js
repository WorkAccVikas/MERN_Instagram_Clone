export const initialState = null;

export const ACTION = {
  USER: "USER",
  CLEAR: "CLEAR",
  UPDATE: "UPDATE",
  UPDATE_PIC: "UPDATE_PIC",
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
    case ACTION.UPDATE_PIC:
      return {
        ...state,
        profile_pic: action.payload,
      };

    default:
      return state;
  }
};
