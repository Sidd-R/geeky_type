import TypingArea from '@/components/TypingArea';
import * as React from 'react';

// import Box from '@/components/Game/Box';
// import Kbd from '@/components/Kbd';
// import AnimateFade from '@/components/Layout/AnimateFade';
// import Seo from '@/components/Seo';


export default function SoloPage() {
  return (
    <>
    {/* <AnimateFade> */}
      {/* <Seo title='Monkeytype Clone' /> */}

      <main>
        <section>
          <div className='layout flex flex-col items-center pt-36 text-center'>
            {/* <Box /> */}
            <TypingArea/>
            {/* <div className='mt-8 flex flex-col items-center justify-center gap-2 font-primary'>
              <div className='flex items-center space-x-2 text-sm'>
                <Kbd>tab</Kbd>
                <span className='text-hl'> + </span>
                <Kbd>enter</Kbd>
                <span className='text-hl'> - restart test </span>
              </div>
              <div className='flex items-center space-x-2 text-sm'>
                <Kbd>ctrl/cmd</Kbd>
                <span className='text-hl'> + </span>
                <Kbd>k</Kbd>
                <span className='text-hl'> or </span>
                <Kbd>p</Kbd>
                <span className='text-hl'> - command palette </span>
              </div>
            </div> */}
          </div>
        </section>
      </main>
    {/* </AnimateFade> */}
    </>
  );
}
