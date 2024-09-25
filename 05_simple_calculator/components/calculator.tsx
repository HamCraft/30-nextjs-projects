"use client"; // Enables client-side rendering for this component

import { useState, ChangeEvent } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Default export of the Calculator component
export default function Calculator() {
  const [num1, setNum1] = useState<string>("");
  const [num2, setNum2] = useState<string>("");
  const [result, setResult] = useState<string>("");

  const handleNum1Change = (e: ChangeEvent<HTMLInputElement>): void => {
    setNum1(e.target.value);
  };

  const handleNum2Change = (e: ChangeEvent<HTMLInputElement>): void => {
    setNum2(e.target.value);
  };

  const add = (): void => {
    setResult((parseFloat(num1) + parseFloat(num2)).toString());
  };

  const subtract = (): void => {
    setResult((parseFloat(num1) - parseFloat(num2)).toString());
  };

  const multiply = (): void => {
    setResult((parseFloat(num1) * parseFloat(num2)).toString());
  };

  const divide = (): void => {
    if (parseFloat(num2) !== 0) {
      setResult((parseFloat(num1) / parseFloat(num2)).toString());
    } else {
      setResult("Error: Division by zero");
    }
  };

  // New Feature: Percentage Calculation
  const percentage = (): void => {
    if (parseFloat(num2) !== 0) {
      setResult(((parseFloat(num1) / parseFloat(num2)) * 100).toString() + "%");
    } else {
      setResult("Error: Division by zero");
    }
  };

  const clear = (): void => {
    setNum1("");
    setNum2("");
    setResult("");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-slate-600 dark:bg-gray-900">
      <Card className="w-full max-w-md p-6 bg-cyan-200 dark:bg-gray-800 shadow-2xl rounded-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-extrabold text-center text-gray-800 dark:text-gray-100">
            Advanced Calculator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Input fields for numbers */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col space-y-2">
              <Label htmlFor="num1" className="text-lg font-semibold text-gray-600 dark:text-gray-300">
                Number 1
              </Label>
              <Input
                id="num1"
                type="number"
                value={num1}
                onChange={handleNum1Change}
                placeholder="Enter a number"
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="num2" className="text-lg font-semibold text-gray-600 dark:text-gray-300">
                Number 2
              </Label>
              <Input
                id="num2"
                type="number"
                value={num2}
                onChange={handleNum2Change}
                placeholder="Enter a number"
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Buttons for arithmetic operations */}
          <div className="grid grid-cols-5 gap-2">
            <Button
              variant="outline"
              className="text-2xl font-bold text-gray-700 dark:text-gray-300 bg-white hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
              onClick={add}
            >
              +
            </Button>
            <Button
              variant="outline"
              className="text-2xl font-bold text-gray-700 dark:text-gray-300 bg-white hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
              onClick={subtract}
            >
              -
            </Button>
            <Button
              variant="outline"
              className="text-2xl font-bold text-gray-700 dark:text-gray-300 bg-white hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
              onClick={multiply}
            >
              *
            </Button>
            <Button
              variant="outline"
              className="text-2xl font-bold text-gray-700 dark:text-gray-300 bg-white hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
              onClick={divide}
            >
              /
            </Button>
            {/* New Percentage Button */}
            <Button
              variant="outline"
              className="text-2xl font-bold text-gray-700 dark:text-gray-300  bg-white hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
              onClick={percentage}
            >
              %
            </Button>
          </div>

          {/* Display the result */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="result" className="text-lg font-semibold text-gray-600 dark:text-gray-300">
              Result
            </Label>
            <Input
              id="result"
              type="text"
              value={result}
              placeholder="Result"
              readOnly
              className="p-2 border border-gray-300 rounded-md bg-gray-100 dark:bg-gray-700 focus:outline-none"
            />
          </div>

          {/* Clear button */}
          <Button
            variant="outline"
            className="w-full py-2 text-lg font-bold text-white bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
            onClick={clear}
          >
            Clear
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
