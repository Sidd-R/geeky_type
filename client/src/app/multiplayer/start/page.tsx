'use client'
import { useRouter, useParams } from 'next/navigation';
import * as React from 'react';

import AnimateFade from '@/components/Layout/AnimateFade';
import Multiplayer from '@/components/Multiplayer/Multiplayer';
import Seo from '@/components/Seo';
import { useRoomContext } from '@/room';
import { Player } from '@/types';
import { usePreferenceContext } from '@/context';

export default function page() {
  
  const {
    room: { socket, user },
    dispatch,
    resetTime,
  } = useRoomContext();

  const {preferences:{type,time}} = usePreferenceContext();

  const router = useRouter();

  React.useEffect(() => {

    if (user.id) {
      socket.emit('joinRandomRoom', user,type,(words:[string,boolean,string,string,]) => {
        dispatch({ type: 'SET_TEXT', payload: words[0] });
        dispatch({type: 'SET_ROOM_ID',payload:words[2]})
        dispatch({type:'SET_USER_ID',payload:words[3]})
        console.log(words);
        if (words[1]) {
          // dispatch({ type: 'SET_IS_PLAYING', payload: true });
        }
      }
      )
      // socket.off('room update').on('room update', (players: Player[]) => {
      //   console.log("got an update",players);
        
      //   dispatch({ type: 'SET_PLAYERS', payload: players });
      // });

      socket.off('start game').on('start game', () => {
        dispatch({ type: 'SET_STATUS', payload: { progress: 0, wpm: 0 } });
        dispatch({ type: 'SET_IS_FINISHED', payload: false });
        dispatch({ type: 'SET_WINNER', payload: null });
        resetTime(5).then(() =>
          dispatch({ type: 'SET_IS_READY', payload: true })
        );
      });

      dispatch({ type: 'SET_STATUS', payload: { progress: 0, wpm: 0 } });
      dispatch({ type: 'SET_IS_READY', payload: false });
      dispatch({ type: 'SET_IS_PLAYING', payload: false });
      dispatch({ type: 'SET_IS_FINISHED', payload: false });
      dispatch({ type: 'SET_WINNER', payload: null });
      resetTime(0);

      socket.off('end game').on('end game', (playerId: string) => {
        dispatch({ type: 'SET_IS_PLAYING', payload: false });
        dispatch({ type: 'SET_WINNER', payload: playerId });
        dispatch({ type: 'SET_IS_READY', payload: false });
      });
    }

  }, []);

  return (
    <AnimateFade>
      <Seo title='Multiplayer mode' />

      <main>
        <section>
          <div className='layout flex flex-col items-center pt-28 text-center'>
            <Multiplayer />
          </div>
        </section>
      </main>
    </AnimateFade>
  );
}
