'use client'
import {useEffect,useState,useRef} from 'react';
import { VscDebugRestart } from 'react-icons/vsc';

import { shuffleList } from '@/components/Game/functions';
import TypingInput from '@/components/TypingInput';
// import Tooltip from '@/components/Tooltip';

import { usePreferenceContext } from '@/context';

export default function TypingArea() {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const _ = require('lodash');

  const {
    preferences: { type, time, isOpen, theme}, dispatch
  } = usePreferenceContext();

  const [list, setList] = useState<string[]>(() => shuffleList(type));

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (isOpen) return;
      if (event.key === 'tab') {
        buttonRef.current.focus();
      } else if (event.key !== 'Enter') {
        inputRef.current.focus();
      }
      dispatch({type: "setTheme", payload: "dark"})
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  useEffect(() => {
    setList(shuffleList(type));
  }, [type]);

  const inputRef = useRef() as React.MutableRefObject<HTMLInputElement>;
  const buttonRef = useRef() as React.MutableRefObject<HTMLButtonElement>;

  return (
    <>
      <TypingInput ref={inputRef} text={list.join(' ')} time={time} />
      <button
        onClick={() => {
          inputRef.current.focus();
          setList(shuffleList(type));
        }}
        ref={buttonRef}
        tabIndex={2}
        className={`group relative z-40 mt-16  flex items-center rounded-lg border-0  py-2 px-5 text-fg/50 outline-none transition-colors duration-200 hover:text-fg focus:bg-hl focus:text-bg active:bg-hl active:text-bg bg-orange-300 `}
      >
        <span className='text-bg '>Reset</span>
        {/* <VscDebugRestart className='scale-x-[-1] transform text-2xl' /> */}
        {/* <Tooltip className='top-12 font-primary group-hover:translate-y-0 group-hover:opacity-100 group-focus:top-14 group-focus:translate-y-0 group-focus:opacity-100 group-active:top-14 group-active:translate-y-0 group-active:opacity-100'>
          Restart Test
        </Tooltip> */}
      </button>
    </>
  );
}
