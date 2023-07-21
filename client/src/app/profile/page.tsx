"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Score from "@/components/Score";

const UserProfile = () => {
  const [userData, setUserData] = useState({
    name: "user",
    email: "user@example.com",
    maxScore: 0,
    avgScore: 0,
    noOfTests: 0,
    top20RecentTestData: [],
  });
  const [testData, setTestData] = useState([]);
  useEffect(() => {
    const _id = Cookies.get("_id");
    if (!_id) {
      window.location.href = "/auth";
      return;
    }
    const fetchData = async () => {
      const response = await fetch(
        `http://localhost:5000/api/user/me?id=` + _id
      );
      const data = await response.json();

      setUserData(data);
      const transformedData = userData.top20RecentTestData.map((item) => ({
        testNo: item.testNo,
        score: item.score,
      }));
      setTestData(transformedData);
      console.log(testData);
      console.log(userData);
    };
    fetchData();
  }, []);

  return (
    <>
      {userData ? (
        <section className="flex flex-col items-center w-full mb-10">
          <h1 className="head_text text-left">
            <span className="blue_gradient">{userData.name} Profile</span>
          </h1>
          <div className="glassmorphism mt-5 flex-col flex-center w-[90%] flex sm:flex-row sm:justify-evenly gap-4">
            <div>
                <h4 className="text-gray-800">Total Tests</h4>
                <p>{userData.noOfTests}</p>
            </div>
            <div>
                <h4 className="text-gray-800">Max Score</h4>
                <p>{userData.maxScore}</p>
            </div>
            <div>
                <h4 className="text-gray-800">Avg Score</h4>
                <p>{userData.avgScore}</p>
            </div>
          </div>
          <div className="mt-5">
            <h4 className="blue_gradient">Perfomance Graph</h4>
            <Score testData={testData} />
          </div>
        </section>
      ) : (
        <></>
      )}
    </>
  );
};

export default UserProfile;
