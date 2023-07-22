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
// import Kbd from "@/components/Kbd";
import AnimateFade from "@/components/Layout/AnimateFade";
// import Seo from '@/components/Seo';
import { useState, useEffect } from "react";

import { useRoomContext } from "@/room";

export default function HomePage() {
  const router = useRouter();
  type TESTUARRAY =  Array<{
      userName:string,
      userEmail:string,
      testNo:string,
      score:string
    }>
  type LEADERBOARD = {
    avgScore:number,
    noOfTests:number,
    testsWithUserName: TESTUARRAY
  }
  const [leaderBoard, setLeaderBoard] = useState<LEADERBOARD>({
    avgScore: 0,
    noOfTests: 0,
    testsWithUserName: [],
  });

  useEffect(() => {
    const apiUrl = "http://localhost:5000/api/test/all";
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        let tempArr: TESTUARRAY = data.testsWithUserName
        tempArr.sort((a,b) => parseInt(b.score)- parseInt(a.score))
        setLeaderBoard(data);
        // for (let i =0 ; i < leaderBoard.testsWithUserName.length-1 ; i++) {
        //   for (let j = i + 1 ; j < leaderBoard.testsWithUserName.length ; j++) {
        //     if (leaderBoard.testsWithUserName[j].score > leaderBoard.testsWithUserName[i].score) {
        //       let temp = leaderBoard.testsWithUserName[j]
        //       leaderBoard.testsWithUserName[j] = leaderBoard.testsWithUserName[i]
        //       leaderBoard.testsWithUserName[i] = temp
        //     } 
        //   }
        // }
        // leaderBoard.testsWithUserName = leaderBoard.testsWithUserName.
        console.log(leaderBoard);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <AnimateFade>
      {/* <Seo title='Geeky  Type' /> */}

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
            <div className="glassmorphism mt-5 w-[90%] flex flex-row justify-evenly gap-4">
              <div>
                <h4 className="text-gray-800">Games Played</h4>
                <p className="text-gray-800">{leaderBoard.noOfTests}</p>
              </div>
              <div>
                <h4 className="text-gray-800">Avg Score</h4>
                <p className="text-gray-800">
                  {" "}
                  {leaderBoard.avgScore.toFixed(2)} WPM
                </p>
              </div>
            </div>
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
          </div>
          </div>
          {leaderBoard.testsWithUserName &&
          leaderBoard.testsWithUserName.length > 0 ? (
            <div className="container p-2 mx-auto rounded-md sm:p-4 text-gray-800 bg-gray-100">
              <h2 className="mb-3 text-2xl font-semibold leadi blue_gradient text-center">
                Leaderboard
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full text-xs">
                  <thead className="rounded-t-lg bg-gray-200">
                    <tr className="text-right">
                      <th title="Ranking" className="p-3 text-left">
                        #
                      </th>
                      <th title="Team name" className="p-3 text-left">
                        UserName
                      </th>
                      <th title="Wins" className="p-3">
                        UserEmail
                      </th>
                      <th title="Losses" className="p-3">
                        Score
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderBoard.testsWithUserName.map((data,i) => {
                      if (i < 10)  return (
                      <tr className="text-right border-b border-opacity-20 bg-gray-100 text-gray-800">
                        <td className="px-3 py-2 text-left">
                          <span className="text-gray-800">{i+1}</span>
                        </td>
                        <td className="px-3 py-2 text-left">
                          <span className="text-gray-800">{data.userName}</span>
                        </td>
                        <td className="px-3 py-2">
                          <span className="text-gray-800">
                            {data.userEmail}
                          </span>
                        </td>
                        <td className="px-3 py-2">
                          <span className="text-gray-800">
                            {data.score} WPM
                          </span>
                        </td>
                      </tr>)
                      }
                    )
                    }
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <p>Loading leaderBoard data...</p>
          )}
        </section>
      </main>
    </AnimateFade>
  );
}
