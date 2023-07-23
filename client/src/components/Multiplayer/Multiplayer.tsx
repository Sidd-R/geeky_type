import clsx from 'clsx';
import * as React from 'react';

import TypingInput from '@/components/Multiplayer/TypingInput';

import { usePreferenceContext } from '@/context';
import { useRoomContext } from '@/room';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Multiplayer() {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const _ = require('lodash');
  const {
    room: {
      isPlaying,
      winner,
      isChatOpen,
      socket,
      user: { id, roomId, isOwner },
    },
    timeBeforeRestart,
  } = useRoomContext();

  // React.useEffect(() => {
  //   isChatOpen && inputRef.current.blur();
  // }, [isChatOpen]);

  React.useEffect(() => {
    isPlaying && inputRef.current.focus();
    !isPlaying && inputRef.current.blur();
  }, [isPlaying]);

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      // if (isOpen || isChatOpen) return;
      if (event.key === 'tab') {
        buttonRef.current.focus();
      } else if (event.key !== 'Enter' && !event.ctrlKey && isPlaying) {
        inputRef.current.focus();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isChatOpen, isPlaying]);

  const inputRef = React.useRef() as React.MutableRefObject<HTMLInputElement>;
  const buttonRef = React.useRef() as React.MutableRefObject<HTMLButtonElement>;

  const router = useRouter()

  return (
    <>
      {/* Multiplayer */}
      <TypingInput ref={inputRef} />

      <div>
        <button
          ref={buttonRef}
          disabled={isPlaying || !isOwner || timeBeforeRestart > 0}
          tabIndex={2}
          onClick={() => {if (winner) {router.push('/multiplayer')}}}
          className={clsx(
            'outline-solid mb-8 transform rounded-lg px-3 py-2 font-primary bg-orange-300 text-bg shadow-b shadow-orange-400 outline-offset-[6px] transition-all duration-200  focus:outline-dashed focus:outline-[3px] active:translate-y-[4px] active:shadow-none',
            [
              isPlaying || !isOwner || timeBeforeRestart > 0
                ? 'active:bg-fg-50 bg-fg/70 hover:bg-orange-500 focus:outline-orange-300'
                : 'active:bg-fg-80 bg-fg hover:bg-orange-500 focus:outline-orange-400 ',
            ],
            [
              (!winner ) &&
                'cursor-not-allowed',
            ]
          )}
        >
          {winner ? <Link href={'/multiplayer'}>Return</Link>  : isPlaying ? 'In Game' : 'waiting'}
        </button>
      </div>
    </>
  );
}
