'use client'
import { usePathname, useRouter } from 'next/navigation';
import * as React from 'react';
import { io } from 'socket.io-client';
import { animals, uniqueNamesGenerator } from 'unique-names-generator';

// import useProfile from '@/hooks/useProfile';

//import reducer from './reducer';
// import {  } from './types';

// import {  } from './types';

import {useReducer,useContext,createContext,useEffect} from 'react';
import { RoomContextValues,Action, RoomState,ProviderState, RoomAction, PreferenceState, Player } from '@/types';
import url from './url';
// const PreferenceContext = createContext({} as ProviderState);

const reducer = (state: RoomState, action: RoomAction): RoomState => {
  switch (action.type) {
    case 'SET_ROOM_ID':
      return {
        ...state,
        user: {
          ...state.user,
          roomId: action.payload,
        },
      };
    case 'SET_MODE':
      return {
        ...state,
        mode: action.payload,
      };
    case 'SET_IS_OWNER':
      return {
        ...state,
        user: {
          ...state.user,
          isOwner: action.payload,
        },
      };
    case 'TOGGLE_CHAT':
      return {
        ...state,
        isChatOpen: !state.isChatOpen,
      };
    case 'SET_USER_ID':
      return {
        ...state,
        user: {
          ...state.user,
          id: action.payload,
        },
      };
    case 'SET_NICKNAME':
      localStorage.setItem('nickname', action.payload);
      return {
        ...state,
        user: {
          ...state.user,
          username: action.payload,
        },
      };
    case 'SET_STATUS':
      return {
        ...state,
        user: {
          ...state.user,
          status: {
            progress: action.payload.progress,
            wpm: action.payload.wpm,
          },
        },
      };
    case 'SET_IS_PLAYING':
      return {
        ...state,
        isPlaying: action.payload,
      };
    case 'SET_IS_FINISHED':
      return {
        ...state,
        isFinished: action.payload,
      };
    case 'SET_WINNER':
      return {
        ...state,
        winner: action.payload,
      };
    case 'SET_IS_READY':
      return {
        ...state,
        user: {
          ...state.user,
          isReady: action.payload,
        },
      };
    case 'SET_PLAYERS':
      return {
        ...state,
        players: action.payload,
      };
    case 'SET_TEXT':
      return {
        ...state,
        text: action.payload,
      };
    default:
      throw new Error('Unknown action type');
  }
};

// export default reducer;


const socket = io(
  url+'public',
  {
    autoConnect: false,
  }
);

const RoomContext = React.createContext({} as RoomContextValues);

export const RoomProvider = ({ children }: { children: React.ReactNode }) => {
  // const { user } = useProfile();

  const [room, dispatch] = React.useReducer(reducer, {
    text: '',
    mode: 'words',
    isPlaying: false,
    isFinished: false,
    isChatOpen: false,
    winner: null,
    user: {
      isOwner: false,
      roomId: null,
      username:
        uniqueNamesGenerator({
          dictionaries: [animals],
          style: 'lowerCase',
        }),
      id: '',
      status: {
        wpm: 0,
        progress: 0,
      },
      isReady: false,
    },
    players: [],
    socket,
  });

  const [timeBeforeRestart, setTimeBeforeRestart] = React.useState(() => 0);

  const resetTime = async (time: number) => setTimeBeforeRestart(time);

  React.useEffect(() => {
    const dispatchTimeout = setTimeout(() => {
      room.user.isReady && dispatch({ type: 'SET_IS_PLAYING', payload: true });
    }, 5000);

    const restartInterval = setInterval(() => {
      if (room.user.isReady) {
        setTimeBeforeRestart((previousTime) => {
          if (previousTime === 0) {
            clearInterval(restartInterval);
          }
          return previousTime - 1;
        });
      }
    }, 1000);

    return () => {
      clearInterval(restartInterval);
      clearTimeout(dispatchTimeout);
    };
  }, [room.user.isReady]);

  // const { pathname } = useRouter();
  const pathname = usePathname()
  const router = useRouter()

  socket.on('connect', () => {
    dispatch({ type: 'SET_USER_ID', payload: socket.id });
    // if (pathname == '/multiplayer/start') router.push('/multiplayer')
  });

  socket.on('disconnect', () => {
    dispatch({ type: 'SET_IS_READY', payload: false });
    dispatch({ type: 'SET_ROOM_ID', payload: null });
    // if (pathname != '/multiplayer/start') router.push('/multiplayer')
  });

  React.useEffect(() => {
    // console.log( "user form uod",room.user,pathname);
    
    if (room.user.id && room.user.roomId) {
      console.log("updateee");
      
      socket.emit('room update', room.user);
      socket.on('room update', (players: Player[]) => {
        // console.log("got an update",players);
        
        dispatch({ type: 'SET_PLAYERS', payload: players });
      });
    }

    const isMultiplayer = !!pathname.match(/^\/multiplayer$/);

    if (isMultiplayer && room.user.roomId && room.user.id) {
      socket.emit('leave room', room.user);
    }

    socket.connect();
  }, [pathname, room.user]);



  return (
    <RoomContext.Provider
      value={{ room, dispatch, timeBeforeRestart, resetTime }}
    >
      {children}
    </RoomContext.Provider>
  );
};

export const useRoomContext = () => React.useContext(RoomContext);
