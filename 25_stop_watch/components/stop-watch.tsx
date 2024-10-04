"use client"; // Enables client-side rendering for this component

import { useState, useEffect } from "react"; // Import useState and useEffect hooks from React
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"; // Import custom Card components
import { Button } from "@/components/ui/button"; // Import custom Button component
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table"; // Import custom Table components

// Define the LapTime type
type LapTime = number;

export default function StopWatch() {
  // State to manage whether the stopwatch is running
  const [isRunning, setIsRunning] = useState<boolean>(false);
  // State to manage the elapsed time in milliseconds
  const [time, setTime] = useState<number>(0);
  // State to manage the list of lap times
  const [lapTimes, setLapTimes] = useState<LapTime[]>([]);

  // useEffect to handle the stopwatch timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 10);
      }, 10);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  // Function to handle starting the stopwatch
  const handleStart = () => {
    setIsRunning(true);
  };

  // Function to handle stopping the stopwatch
  const handleStop = () => {
    setIsRunning(false);
  };

  // Function to handle resetting the stopwatch
  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setLapTimes([]);
  };

  // Function to handle recording a lap time
  const handleLap = () => {
    setLapTimes((prevLapTimes) => [...prevLapTimes, time]);
  };

  // Calculate minutes, seconds, and milliseconds from the elapsed time
  const minutes = Math.floor(time / 60000);
  const seconds = Math.floor((time % 60000) / 1000);
  const milliseconds = Math.floor((time % 1000) / 10);

  // JSX return statement rendering the Stopwatch UI
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-200 to-purple-300 p-6">
      <Card className="w-full max-w-lg shadow-lg rounded-xl">
        <CardHeader className="flex flex-col items-center justify-center p-6 bg-gradient-to-r from-purple-400 to-indigo-600 rounded-t-xl text-white">
          <CardTitle className="text-6xl font-extrabold tracking-tight">Stopwatch</CardTitle>
          <CardDescription className="text-lg mt-2 text-gray-100">
            Track your time efficiently
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center gap-8 p-8 bg-white rounded-b-xl">
          {/* Display the elapsed time */}
          <div className="text-8xl font-extrabold tracking-tight">
            {minutes.toString().padStart(2, "0")}:
            {seconds.toString().padStart(2, "0")}.
            {milliseconds.toString().padStart(2, "0")}
          </div>
          {/* Buttons to control the stopwatch */}
          <div className="flex gap-6">
            <Button
              onClick={isRunning ? handleStop : handleStart}
              className={`px-8 py-3 text-lg font-bold rounded-full shadow transition-all ${
                isRunning ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
              } text-white`}
            >
              {isRunning ? "Stop" : "Start"}
            </Button>
            <Button
              onClick={handleReset}
              className="px-8 py-3 text-lg font-bold rounded-full shadow bg-gray-500 hover:bg-gray-600 text-white transition-all"
            >
              Reset
            </Button>
            <Button
              onClick={handleLap}
              className="px-8 py-3 text-lg font-bold rounded-full shadow bg-blue-500 hover:bg-blue-600 text-white transition-all"
            >
              Lap
            </Button>
          </div>
          {/* Display the list of lap times */}
          <div className="w-full max-w-md">
            <Card className="overflow-hidden border border-gray-300 rounded-lg">
              <CardHeader className="bg-gray-200 p-4">
                <CardTitle className="text-xl font-semibold text-gray-700">
                  Lap Times
                </CardTitle>
              </CardHeader>
              <CardContent className="max-h-[300px] overflow-auto p-0">
                <Table className="min-w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-left text-sm font-medium text-gray-600">Lap</TableHead>
                      <TableHead className="text-right text-sm font-medium text-gray-600">Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lapTimes.map((lapTime, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium text-gray-800">{index + 1}</TableCell>
                        <TableCell className="text-right font-medium text-gray-800">
                          {Math.floor(lapTime / 60000)
                            .toString()
                            .padStart(2, "0")}
                          :
                          {Math.floor((lapTime % 60000) / 1000)
                            .toString()
                            .padStart(2, "0")}
                          .
                          {Math.floor((lapTime % 1000) / 10)
                            .toString()
                            .padStart(2, "0")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
