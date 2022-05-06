const reducer = (state, action) => {
  let msgUsers;
  switch (action.type) {
    // log in user
    case "LOGIN":
      localStorage.setItem("token", action.payload.token);
      return { ...state, user: action.payload };
    // log out user
    case "LOGOUT":
      localStorage.removeItem("token");
      window.location.reload();
      return { ...state, user: null };
    // set selected user
    case "SET_SELECTED_USER":
      msgUsers = state.users.map((user) => {
        return { ...user, selected: user.name === action.payload };
      });
      // console.log(msgUsers);
      return { ...state, users: msgUsers };
    // set messages
    case "SET_USER_MESSAGES":
      msgUsers = state.users.map((user) => {
        if (user.name === action.payload.to) {
          return { ...user, messages: action.payload.messages };
        }
        return user;
      });
      // console.log(msgUsers);
      return { ...state, users: msgUsers };
    // set users
    case "SET_USERS":
      return { ...state, users: action.payload };
    case "SEND_MESSAGE":
      action.payload.message.reactions = [];
      msgUsers = state.users.map((user) => {
        if (user.name === action.payload.to) {
          return {
            ...user,
            messages: [action.payload.message, ...user.messages],
            lastMessage: action.payload.message,
          };
        }
        return user;
      });
      return { ...state, users: msgUsers };
    case "ADD_REACTION":
      const { username, messageId, reaction } = action.payload;
      const userIndex = state.users.findIndex((user) => user.name === username);
      const userMessageIndex = state.users[userIndex].messages.findIndex(
        (message) => message.uuid === messageId
      );
      const reactionIndex = state.users[userIndex].messages[
        userMessageIndex
      ].reactions.findIndex((r) => r.uuid === reaction.uuid);

      if (reactionIndex < 0) {
        const userMessageReactions = [
          ...state.users[userIndex].messages[userMessageIndex].reactions,
          reaction,
        ];
        state.users[userIndex].messages[userMessageIndex].reactions =
          userMessageReactions;
        return { ...state };
      } else {
        state.users[userIndex].messages[userMessageIndex].reactions[
          reactionIndex
        ] = reaction;
        return { ...state };
      }

    default:
      throw new Error(`Error, unkown type`);
  }
};

export default reducer;
