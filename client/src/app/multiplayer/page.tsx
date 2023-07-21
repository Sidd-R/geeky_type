'use client'
import { yupResolver } from '@hookform/resolvers/yup';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import {useEffect,useState} from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { CgSpinner } from 'react-icons/cg';
import { FaArrowRight } from 'react-icons/fa';
import { RiTeamFill } from 'react-icons/ri';
// import { toast } from 'react-toastify';
// import * as yup from 'yup';

// import { createRoom } from '@/lib/socket/roomHandler';

import Button from '@/components/Button/Button';
// import ChatBox from '@/components/Chat/ChatBox';
// import Input from '@/components/Input';
import AnimateFade from '@/components/Layout/AnimateFade';
// import Seo from '@/components/Seo';

import { useRoomContext } from '@/room';
// import { Socket } from 'socket.io-client';
// import { v4 } from 'uuid';

// export const createRoom = (
//   socket: Socket,
//   mode: 'words' | 'sentences' | 'numbers'
// ) => {
//   const id = v4().slice(0, 6);
//   // check whether id exists yet or not
//   socket.emit('create room', id, mode);
// };


// const schema = yup.object().shape({
//   code: yup
//     .string()
//     .required('code is required')
//     .length(6, 'code must be 6 characters long'),
// });

export default function MultiplayerPage() {
  // const methods = useForm<{ code: string }>({
  //   mode: 'onTouched',
  //   resolver: yupResolver(schema),
  // });
  // const { handleSubmit } = methods;

  const {
    room: { socket, mode },
    dispatch,
    resetTime,
  } = useRoomContext();

  const router = useRouter();

  // const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [isJoiningRoom, setIsJoiningRoom] = useState(false);

  const joinRandomRoom = () => {
    // setIsJoiningRoom(true)
    // socket.connect()
    
    // console.log("hi");
    
    dispatch({type: 'SET_USER_ID',payload:socket.id})
    router.push('/multiplayer/start')

  }

  const createNewRoom = () => {
    setIsJoiningRoom(true)
  }

  const joinUsingCode = () => {
    setIsJoiningRoom(true)
  }


  // useEffect(() => {
    // socket.emit('hi', 'hello');

    // create another room id if already exist
    // socket.off('room already exist').on('room already exist', () => {
    //   createRoom(socket, mode);
    // });
// 
    // socket.off('end game').on('end game', () => {
    //   dispatch({ type: 'SET_STATUS', payload: { progress: 0, wpm: 0 } });
    //   dispatch({ type: 'SET_IS_READY', payload: false });
    //   dispatch({ type: 'SET_IS_PLAYING', payload: false });
    //   dispatch({ type: 'SET_IS_FINISHED', payload: false });
    //   dispatch({ type: 'SET_WINNER', payload: null });
    //   resetTime(0);
    // });

    // on create room success, redirect to that room
    // socket
    //   .off('create room success')
    //   .on('create room success', (roomId: string) => {
    //     setIsCreatingRoom(false);
    //     dispatch({ type: 'SET_IS_OWNER', payload: true });
    //     router.push(`/multiplayer/${roomId}`);
    //   });

  // }, []);

  const onSubmit = ({ code }: { code: string }) => {
    setIsJoiningRoom(true);
    router.push(`/multiplayer/${code}`);
  };

  return (
    <AnimateFade>
      {/* <Seo title='Enter Room Code' /> */}

      <main>
        <section>
          <div className='layout flex min-h-[65vh] w-full flex-col items-center pt-10 text-center font-primary'>
          {/*<div className='relative mb-8 flex h-8 w-full max-w-[800px] items-center justify-between'>
                 <ChatBox
                className='right-3 w-[calc(100%+0.5rem)] sm:right-2'
                label='public chat'
              /> 
            </div> */}
            <div className='flex w-full flex-col gap-4'>
              <RiTeamFill className='self-center text-[5rem] text-orange-400' />
              <h1 className='mb-4  text-bg'>multiplayer mode</h1>
              {/* <FormProvider {...methods}> */}
                {/* <form onSubmit={onSubmit}> */}
                <div className='flex items-center justify-center space-x-4 '>
                <Button
                  onClick={joinRandomRoom}
                  disabled={isJoiningRoom}
                  className={`${isJoiningRoom && 'cursor-not-allowed'} mb-0 bg-orange-300`}
                >
                  {isJoiningRoom ? (
                    <span className='flex items-center text-bg bg-orange-300'>
                      Joining
                      <CgSpinner className='ml-2 animate-spin' />
                    </span>
                  ) : <span className='text-bg mx-3'> Join Random Room</span>}
                </Button>
              </div>
                {/* </form> */}
              {/* </FormProvider> */}

              <span className='mb-7  text-3xl font-bold'>or</span>
              {/* <div className='mx-auto mb-4 flex space-x-2 font-primary'>
                <button
                  onClick={() =>
                    dispatch({ type: 'SET_MODE', payload: 'words' })
                  }
                  className={clsx(
                    'rounded-lg px-2 py-1 transition-colors duration-200',
                    [mode === 'words' ? 'text-hl ring-2 ring-fg' : 'text-hl']
                  )}
                >
                  words
                </button>
                <button
                  onClick={() =>
                    dispatch({ type: 'SET_MODE', payload: 'sentences' })
                  }
                  className={clsx(
                    'rounded-lg px-2 py-1 transition-colors duration-200',
                    [
                      mode === 'sentences'
                        ? 'text-hl ring-2 ring-fg'
                        : 'text-hl',
                    ]
                  )}
                >
                  sentences
                </button>
                <button
                  onClick={() =>
                    dispatch({ type: 'SET_MODE', payload: 'numbers' })
                  }
                  className={clsx(
                    'rounded-lg px-2 py-1 transition-colors duration-200',
                    [mode === 'numbers' ? 'text-hl ring-2 ring-fg' : 'text-hl']
                  )}
                >
                  numbers
                </button>
              </div> */}
              <div className='flex items-center justify-center space-x-4 '>
                <Button
                  onClick={() => {
                    setIsJoiningRoom(true);
                    // createRoom(socket);
                  }}
                  disabled={isJoiningRoom}
                  className={`${isJoiningRoom && 'cursor-not-allowed'} mb-0 bg-orange-300`}
                >
                  {isJoiningRoom ? (
                    <span className='flex items-center text-bg bg-orange-300'>
                      Creating
                      <CgSpinner className='ml-2 animate-spin' />
                    </span>
                  ) : <span className='text-bg mx-3'> Create New Room</span>}
                </Button>
              </div>
              <span className='mb-8 text-3xl font-bold'>or</span>
              
              <div className='mx-auto -mb-2 flex max-w-[330px] justify-center  p-0 items-center'>
                    <input
                      name='code'
                      id='code'
                      autoComplete='off'
                      placeholder='enter room code'
                      className='flex-1 rounded-r-none h-12 px-4 shadow-none bg-gray-200 rounded-lg'
                    />
                  <div className='bg-orange-300 h-12 px-3 flex justify-center items-center rounded-lg rounded-l-none '
                    onClick={joinUsingCode}
                  >
                  {isJoiningRoom ? (
                    <span className='flex items-center text-bg bg-orange-300'>
                      Joining
                      <CgSpinner className='ml-2 animate-spin' />
                    </span>
                  ) : <span className='text-bg '>Join</span>}
                  </div>
                  </div>
            </div>
          </div>
        </section>
      </main>
    </AnimateFade>
  );
}
