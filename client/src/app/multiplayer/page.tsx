'use client'
import { yupResolver } from '@hookform/resolvers/yup';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import {useEffect,useState} from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { CgSpinner } from 'react-icons/cg';
import { FaArrowRight } from 'react-icons/fa';
import { RiTeamFill } from 'react-icons/ri';
import Button from '@/components/Button/Button';
import AnimateFade from '@/components/Layout/AnimateFade';
import Seo from '@/components/Seo';
import { useRoomContext } from '@/room';

export default function MultiplayerPage() {
  const {
    room: { socket, mode },
    dispatch,
    resetTime,
  } = useRoomContext();

  const router = useRouter();

  // const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [isJoiningRoom, setIsJoiningRoom] = useState(false);

  const joinRandomRoom = () => {
    setIsJoiningRoom(true)    
    dispatch({type: 'SET_USER_ID',payload:socket.id})
    router.push('/multiplayer/start')

  }

  const createNewRoom = () => {
    // setIsJoiningRoom(true)
  }

  const joinUsingCode = () => {
    // setIsJoiningRoom(true)
  }

  return (
    <AnimateFade>
      <Seo title='Enter Room Code' />

      <main>
        <section>
          <div className='layout flex min-h-[65vh] w-full flex-col items-center pt-10 text-center font-primary'>
            <div className='flex w-full flex-col gap-4'>
              <RiTeamFill className='self-center text-[5rem] text-orange-400' />
              <h1 className='mb-4  text-bg'>multiplayer mode</h1>
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

              <span className='mb-7  text-3xl font-bold'>or</span>

              <div className='flex items-center justify-center space-x-4 '>
                <Button
                  onClick={() => {
                    setIsJoiningRoom(true);
                  }}
                  disabled={isJoiningRoom}
                  className={`${isJoiningRoom && 'cursor-not-allowed'} mb-0 bg-orange-300`}
                >
                  {false ? (
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
                  {false ? (
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
