import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import {ChartOptions, Chart, CategoryScale,LinearScale,LineElement, PointElement, LineController, Tooltip} from "chart.js";

interface TestData {
    testNo: number,
    score: number
}

interface Scoreprops{
    testData: TestData[],
}

const Score: React.FC<Scoreprops> = ({ testData }) => {
  Chart.register(CategoryScale, LinearScale, LineElement, PointElement, LineController, Tooltip);
  const totalTests = testData.length;
  const [startIndex, setStartIndex] = useState(0);

  const endIndex = (startIndex + 5) % totalTests;

  // Handle infinite loop for Next and Prev clicks
  const handleNextClick = () => {
    setStartIndex((prevIndex) => (prevIndex + 5) % totalTests);
  };

  const handlePrevClick = () => {
    setStartIndex((prevIndex) => (prevIndex - 5 + totalTests) % totalTests);
  };

  const slicedTestData =
    startIndex + 5 <= totalTests
      ? testData.slice(startIndex, startIndex + 5)
      : [...testData.slice(startIndex), ...testData.slice(0, endIndex)];


  const chartData = {
    labels: slicedTestData.map((test) => `Test ${test.testNo}`),
    datasets: [
      {
        label: "Score",
        data: slicedTestData.map((test) => test.score),
        borderColor: "#000000",
        fill: true,
        backgroundColor: "rgba(46, 91, 255, 0.2)",
        borderWidth: 2,
        pointRadius: 4,
        pointBackgroundColor: "#2E5BFF",
      },
    ],
  };

  const chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'category',
        grid: {
          display: false,
        },
        position: "bottom",
      },
      y: {
        grid: {
          color: "#EAEAEA",
          borderColor: "#EAEAEA",
          borderWidth: 1,
        },
        min: 0,
        max: 100,
        ticks: {
          stepSize: 20, 
        },
        position: "left",
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      tooltip: {
        mode: "index",
        intersect: false,
        backgroundColor: "rgba(46, 91, 255, 0.8)",
        bodyColor: "#EAEAEA",
        titleColor: "#EAEAEA",
      },
    },
  };

  return (
    <>
      <div className="w-[300px] h-[200px] lg:w-[900px] lg:h-[400px]">
        <Line data={chartData} options={chartOptions} />
      </div>
      <button onClick={handlePrevClick}>Previous 5 Tests</button>
      <button onClick={handleNextClick}>Next 5 Tests</button>
    </>
  );
};

export default Score;