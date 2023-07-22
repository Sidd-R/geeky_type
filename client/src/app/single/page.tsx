"use client";
import TypingArea from '@/components/TypingArea';
import * as React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
          </div>
        </section>
        <ToastContainer />
      </main>
    {/* </AnimateFade> */}
    </>
  );
}
