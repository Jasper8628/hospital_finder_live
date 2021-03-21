import React, { createContext, useReducer, useContext } from "react";
const AppContext = createContext();
const { Provider } = AppContext;
const reducer = (state, action) => {
  switch (action.type) {
    case 'pain':
      return {
        ...state,
        painLevel: action.pain
      }
    case 'switchTab':
      return {
        ...state,
        openTab: action.tabName,
      }
    case 'closeMap':
      return {
        ...state,
        mobileMap: false
      }
    case 'direction':
      return {
        ...state,
        destination: action.destination,
        mobileMap: action.mobileMap,
      }
    case 'location':
      return {
        ...state,
        location: action.location
      }
    default:
      throw new Error(`Invalid action type: ${action.type}`)
  }
};

const ContextProvider = ({ value = 0, ...props }) => {
  const [globalState, dispatch] = useReducer(
    reducer, {
    painLevel: 0,
    openTab: 'hospital',
    mobileMap: false,
    destination: {},
    location: {},
  });
  return <Provider value={[globalState, dispatch]} {...props} />;
};
const useAppContext = () => {
  return useContext(AppContext);
};
export { ContextProvider, useAppContext };
