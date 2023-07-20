'use client'
import {useReducer,useContext,createContext,useEffect} from 'react';
import { ProviderState, Action, PreferenceState } from '@/types';
const PreferenceContext = createContext({} as ProviderState);

const reducer = (state: PreferenceState, action: Action) => {
  switch (action.type) {
    case 'SET_THEME':
      if (typeof window !== undefined) {
        window.localStorage.setItem('theme', action.payload);
      }
      return {
        ...state,
        theme: action.payload,
      };
    case 'SET_FONT_FAMILY':
      if (typeof window !== undefined) {
        window.localStorage.setItem('font-family', action.payload);
      }
      return {
        ...state,
        fontFamily: action.payload,
      };
    case 'SET_TYPE':
      if (typeof window !== undefined) {
        window.localStorage.setItem('type', action.payload);
      }
      return {
        ...state,
        type: action.payload,
      };
    case 'SET_TIME':
      if (typeof window !== undefined) {
        window.localStorage.setItem('time', action.payload);
      }
      return {
        ...state,
        time: action.payload,
      };
    case 'SET_ZEN_MODE':
      if (typeof window !== undefined) {
        window.localStorage.setItem('zen-mode', JSON.stringify(action.payload));
      }
      return {
        ...state,
        zenMode: action.payload,
      };
    case 'TOGGLE_COMMAND_PALETTE':
      return {
        ...state,
        isOpen: !state.isOpen,
      };
    default:
      throw new Error('Unknown action type');
  }
};


export default function PreferenceProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [preferences, dispatch] = useReducer(reducer, {
    theme: 'default',
    fontFamily: 'poppins',
    isOpen: false,
    zenMode: false,
    type: 'words',
    time: '15',
  });

  useEffect(() => {
    if (typeof window !== undefined) {
      const theme = window.localStorage.getItem('theme');
      const fontFamily = window.localStorage.getItem('font-family');
      const type = window.localStorage.getItem('type');
      const time = window.localStorage.getItem('time');
      const zenMode = window.localStorage.getItem('zen-mode');
      if (theme) dispatch({ type: 'SET_THEME', payload: theme });
      if (fontFamily)
        dispatch({ type: 'SET_FONT_FAMILY', payload: fontFamily });
      if (type) dispatch({ type: 'SET_TYPE', payload: type });
      if (time) dispatch({ type: 'SET_TIME', payload: time });
      if (zenMode)
        dispatch({ type: 'SET_ZEN_MODE', payload: zenMode === 'true' });
    }
  }, []);

  return (
    <PreferenceContext.Provider value={{ preferences, dispatch }}>
      {children}
    </PreferenceContext.Provider>
  );
}

export const usePreferenceContext = () => useContext(PreferenceContext);
