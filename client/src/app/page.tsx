"use client";
import { useRouter } from "next/navigation";
import * as React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { IoMdPerson } from "react-icons/io";
import { RiTeamFill } from "react-icons/ri";
import Image from "next/image";
import Button from "@/components/Button/Button";
// import ChatBox from '@/components/Chat/ChatBox';
import Input from "@/components/Input";
import Kbd from "@/components/Kbd";
import AnimateFade from "@/components/Layout/AnimateFade";
// import Seo from '@/components/Seo';

import { useRoomContext } from "@/room";

export default function HomePage() {
  const router = useRouter();

  const methods = useForm<{ code: string }>({
    mode: "onTouched",
  });

  const { dispatch } = useRoomContext();

<<<<<<< HEAD
/**
 * !STARTERCONF info
 * ? `Layout` component is called in every page using `np` snippets. If you have consistent layout across all page, you can add it here too
 */

function MyApp({
  Component,
  pageProps: { ...pageProps },
  router,
}: AppProps) {
  return (
    <div>
      <CommandPalette data={commands} />
      {/* <SessionProvider session={session}> */}
        <Layout>
          <ToastContainer
            toastClassName={() =>
              "relative flex p-1 mt-4 min-h-10 rounded-md justify-between overflow-hidden cursor-pointer bg-hl text-bg border-2 border-hl mx-4"
            }
            bodyClassName={() =>
              "flex px-2 py-2 text-sm font-primary block accent-hl"
            }
            closeButton={() => (
              <MdClose className="text-bg/80 transition-colors duration-200 hover:text-bg" />
            )}
          />
          <Header />
          <AnimatePresence exitBeforeEnter>
            <Component {...pageProps} key={router.route} />
          </AnimatePresence>
          {/* <RoomProvider>
            <ChatProvider>
              
            </ChatProvider>
          </RoomProvider> */}
        </Layout>
      {/* </SessionProvider> */}
    </div>
=======
  return (
    <AnimateFade>
      {/* <Seo title='Monkeytype Clone' /> */}

      <main>
        <section className="w-full flex-center flex-col mt-10">
          <h1 className="head_text text-center">
            Pratice & Play
            <br className="min-md:hidden" />
            <span className="orange_gradient text-center">
              With Your Friends
            </span>
          </h1>
          <p className="desc text-center">
            Geekytype is a fun typing game that allows you to increase your
            typing speed and compete with you friends.
          </p>
        </section>
        <section className="mb-10">
          <div className="flex flex-col items-center gap-8 pt-4 lg:pt-8 text-center">
            {/* <ChatBox
                className='right-3 w-[calc(100%+2rem)] sm:right-2'
                label='public chat'
              /> */}

            {/* <div className='aspect-video w-full max-w-[450px] overflow-hidden rounded-lg ring-4 ring-fg ring-offset-4 ring-offset-bg'>
              <iframe
                src='https://www.youtube.com/embed/nnM9h7twXg8?autoplay=1&mute=1&loop=1&color=white&controls=0&modestbranding=1&playsinline=1&rel=0&enablejsapi=1&playlist=nnM9h7twXg8'
                title='Monkeytype Clone'
                frameBorder='0'
                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                allowFullScreen
                style={{
                  width: '300%',
                  height: '100%',
                  marginLeft: '-100%',
                  zIndex: 50,
                }}
              ></iframe>
            </div> */}
            <FormProvider {...methods}>
              <Input
                placeholder="enter your nickname"
                autoComplete="off"
                name="nickname"
                id="nickname"
                maxLength={20}
                defaultValue={localStorage?.getItem("nickname") || ""}
                onBlur={(e) => {
                  if (!e.target.value) return;
                  dispatch({ type: "SET_NICKNAME", payload: e.target.value });
                }}
                className="text-center py-2 px-2 bg-slate-200"
              />
            </FormProvider>
            <div className="flex flex-col items-center px-2 w-full lg:flex-row md:justify-around">
              <div className="max-w-sm my-5 p-5 rounded-md flex flex-row items-center prompt_card">
                <Image
                  src="/assets/images/practice.jpg"
                  alt=""
                  width={500}
                  height={500}
                  className="object-cover object-center md:w-48 w-40 h-40 rounded-md dark:bg-gray-500"
                />
                <div className="ml-6 flex flex-col items-center">
                  <div className="mt-6 mb-2">
                    <h2 className="text-xl font-semibold tracki orange_gradient">
                      Practice Your Skills
                    </h2>
                  </div>
                  <Button
                    onClick={() => router.push("/multiplayer")}
                    className="flex items-center"
                  >
                    <RiTeamFill className="mr-1" />
                    Practice
                  </Button>
                </div>
              </div>
              <div className="max-w-sm my-5 p-5 rounded-md flex flex-row items-center prompt_card">
                <Image
                  src="/assets/images/1v1.png"
                  alt=""
                  width={500}
                  height={500}
                  className="object-cover object-center md:w-48 w-40 h-40 rounded-md"
                />
                <div className="ml-6 flex flex-col items-center">
                  <div className="mt-6 mb-2">
                    <h2 className="text-xl font-semibold tracki orange_gradient">
                      1v1 Against Randoms
                    </h2>
                  </div>
                  <Button
                    onClick={() => router.push("/compete")}
                    className="flex items-center"
                  >
                    <RiTeamFill className="mr-1" />
                    Challenge
                  </Button>
                </div>
              </div>
              <div className="max-w-sm my-5 p-5 rounded-md flex flex-row items-center prompt_card">
                <Image
                  src="/assets/images/challenge.jpg"
                  alt=""
                  width={500}
                  height={500}
                  className="object-cover object-center md:w-48 w-40 h-40 rounded-md dark:bg-gray-500"
                />
                <div className="ml-6 flex flex-col items-center">
                  <div className="mt-6 mb-2">
                    <h2 className="text-xl font-semibold tracki orange_gradient">
                      Play Against friends
                    </h2>
                  </div>
                  <Button
                    onClick={() => router.push("/multiplayer")}
                    className="flex items-center"
                  >
                    <RiTeamFill className="mr-1" />
                    Multiplayer
                  </Button>
                </div>
              </div>
              {/* <Button
                onClick={() => router.push('/single')}
                className='flex items-center'
              >
                <IoMdPerson className='mr-1' />
                Play Solo
              </Button>
              <div>
                <Button
                  onClick={() => router.push('/multiplayer')}
                  className='flex items-center'
                >
                  <RiTeamFill className='mr-1' />
                  Multiplayer
                </Button> */}
            </div>

            {/* <div className='flex flex-col items-center justify-center gap-2 font-primary'>
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
    </AnimateFade>
>>>>>>> 3fd72b3046263bcc4d35ed38e51107861f8a07a4
  );
}
