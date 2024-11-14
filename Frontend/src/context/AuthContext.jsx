import { createContext, useEffect, useReducer } from "react";

// Utility function to safely parse JSON
const safeParseJSON = (value) => {
  try {
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return null; // Fallback to null if parsing fails
  }
};

const initialState = {
  user: safeParseJSON(localStorage.getItem("user")),
  role: localStorage.getItem("role") || null,
  token: localStorage.getItem("token") || null,
};

export const authContext = createContext(initialState);

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return {
        user: null,
        role: null,
        token: null,
      };

    case "LOGIN_SUCCESS":
      return {
        user: action.payload.user,
        role: action.payload.role,
        token: action.payload.token,
      };

    case "LOGOUT":
      return {
        user: null,
        role: null,
        token: null,
      };

    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(state.user));
    localStorage.setItem("role", state.role);
    localStorage.setItem("token", state.token);
  }, [state]);

  return (
    <authContext.Provider
      value={{
        user: state.user,
        role: state.role,
        token: state.token,
        dispatch,
      }}
    >
      {children}
    </authContext.Provider>
  );
};
