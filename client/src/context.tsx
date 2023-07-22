'use client'
import {useReducer,useContext,createContext,useEffect} from 'react';
import { ProviderState, Action, PreferenceState } from '@/types';
const PreferenceContext = createContext({} as ProviderState);

const reducer = (state: PreferenceState, action: Action) => {
  switch (action.type) {
    case 'setTheme':
      if (typeof window !== undefined) {
        window.localStorage.setItem('theme', action.payload);
      }
      // case 
      return {
        ...state,
        theme: action.payload,
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
    theme: "light",
    isOpen: false,
    type: 'words',
    time: '30',
  });

  useEffect(() => {
    if (typeof window !== undefined) {
      const theme = window.localStorage.getItem('theme');
      const type = window.localStorage.getItem('type');
      const time = window.localStorage.getItem('time');
      if (theme) dispatch({ type: 'setTheme', payload: theme });
    }
  }, []);

  return (
    <PreferenceContext.Provider value={{ preferences, dispatch }}>
      {children}
    </PreferenceContext.Provider>
  );
}

export const usePreferenceContext = () => useContext(PreferenceContext);
