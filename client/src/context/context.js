import { createContext, useContext, useReducer } from "react";
import reducer from "./reducer";
import jwtDecode from "jwt-decode";

// create context
const AppContext = createContext();
// iniital state
const initialState = {
  user: null,
  users: [],
};
// check local storage token
const token = localStorage.getItem("token");
if (token) {
  const decode = jwtDecode(token);
  if (decode.exp * 1000 > Date.now()) {
    initialState.user = decode;
  } else {
    localStorage.removeItem("token");
  }
}

// context provider
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  // context login
  const login = (userData) => {
    dispatch({ type: "LOGIN", payload: userData });
  };
  // context logout
  const logout = () => {
    dispatch({ type: "LOGOUT" });
  };
  // set select user
  const setSelectedUser = (selectedUser) => {
    dispatch({ type: "SET_SELECTED_USER", payload: selectedUser });
  };
  // set users msg
  const setUserMessages = (messages, to) => {
    dispatch({ type: "SET_USER_MESSAGES", payload: { messages, to } });
  };
  // set users
  const setUsers = (users) => {
    dispatch({ type: "SET_USERS", payload: users });
  };

  const sendMessage = (to, message) => {
    dispatch({ type: "SEND_MESSAGE", payload: { to, message } });
  };
  const addReaction = (username, messageId, reaction) => {
    dispatch({
      type: "ADD_REACTION",
      payload: { username, messageId, reaction },
    });
  };
  return (
    <AppContext.Provider
      value={{
        ...state,
        login,
        logout,
        setSelectedUser,
        setUserMessages,
        setUsers,
        sendMessage,
        addReaction,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
// globle context
export const useGlobleContext = () => useContext(AppContext);
