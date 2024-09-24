"use client"; // Enables client-side rendering for this component

// Importing necessary hooks and components from React and custom components
import { useState, useEffect, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Type definition for the NumberGuessingComponent's state
interface NumberGuessingState {
  gameStarted: boolean;
  gameOver: boolean;
  paused: boolean;
  targetNumber: number;
  userGuess: number | string;
  attempts: number;
  hint: string; // New state for providing hints to the user
}

// Defining the NumberGuessingComponent function component
export default function NumberGuessing(): JSX.Element {
  // State variables to manage the game state
  const [gameStarted, setGameStarted] = useState<boolean>(false); // Indicates if the game has started
  const [gameOver, setGameOver] = useState<boolean>(false); // Indicates if the game is over
  const [paused, setPaused] = useState<boolean>(false); // Indicates if the game is paused
  const [targetNumber, setTargetNumber] = useState<number>(0); // The number to be guessed
  const [userGuess, setUserGuess] = useState<number | string>(""); // The user's guess (can be a number or an empty string)
  const [attempts, setAttempts] = useState<number>(0); // Number of attempts made by the user
  const [hint, setHint] = useState<string>(""); // Hint to be provided to the user after multiple incorrect guesses

  // useEffect to generate a new target number when the game starts or resumes
  useEffect(() => {
    if (gameStarted && !paused) {
      const randomNumber: number = Math.floor(Math.random() * 10) + 1; // Generate a random number between 1 and 10
      setTargetNumber(randomNumber); // Set the target number
      setHint(""); // Reset the hint when the game starts
    }
  }, [gameStarted, paused]); // Dependencies: gameStarted and paused

  // Function to handle the start of the game
  const handleStartGame = (): void => {
    setGameStarted(true); // Start the game
    setGameOver(false); // Reset the game over state
    setAttempts(0); // Reset the attempts counter
    setPaused(false); // Ensure the game is not paused
  };

  // Function to handle pausing the game
  const handlePauseGame = (): void => {
    setPaused(true); // Pause the game
  };

  // Function to handle resuming the game
  const handleResumeGame = (): void => {
    setPaused(false); // Resume the game
  };

  // Function to provide hints based on incorrect guesses
  const provideHint = () => {
    if (attempts >= 3) {
      if (typeof userGuess === "number") {
        if (userGuess > targetNumber) {
          setHint("Try guessing lower!");
        } else if (userGuess < targetNumber) {
          setHint("Try guessing higher!");
        }
      }
    }
  };

  // Function to handle the user's guess
  const handleGuess = (): void => {
    if (typeof userGuess === "number" && userGuess === targetNumber) {
      setGameOver(true); // If the guess is correct, end the game
    } else {
      setAttempts(attempts + 1); // Increment the attempts counter
      provideHint(); // Check if a hint should be provided
    }
  };

  // Function to handle restarting the game
  const handleTryAgain = (): void => {
    setGameStarted(false); // Reset the game state
    setGameOver(false); // Reset the game over state
    setUserGuess(""); // Clear the user's guess
    setAttempts(0); // Reset the attempts counter
    setHint(""); // Clear any existing hint
  };

  // Function to handle input change for user's guess
  const handleUserGuessChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setUserGuess(parseInt(e.target.value));
  };

  // JSX to render the game UI with improved styling and the new hint feature
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500">
      {/* Main container for the game */}
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
        {/* Title of the game */}
        <h1 className="text-4xl font-extrabold text-center mb-4 text-black">
          Number Guessing Game
        </h1>
        {/* Description of the game */}
        <p className="text-center text-gray-700 mb-6">
          Guess the number between 1 and 10!
        </p>
        {/* Conditional rendering: show start button if game hasn't started */}
        {!gameStarted && (
          <div className="flex justify-center mb-4">
            {/* Button to start the game */}
            <Button
              onClick={handleStartGame}
              className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:from-purple-600 hover:via-pink-600 hover:to-red-600 text-white font-bold py-2 px-6 rounded-lg"
            >
              Start Game
            </Button>
          </div>
        )}
        {/* Conditional rendering: show game controls if game started and not over */}
        {gameStarted && !gameOver && (
          <div>
            <div className="flex justify-center mb-4">
              {/* Button to resume the game if paused */}
              {paused ? (
                <Button
                  onClick={handleResumeGame}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg"
                >
                  Resume
                </Button>
              ) : (
                /* Button to pause the game */
                <Button
                  onClick={handlePauseGame}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg"
                >
                  Pause
                </Button>
              )}
            </div>

            <div className="flex justify-center mb-6">
              {/* Input field for user's guess */}
              <Input
                type="number"
                value={userGuess}
                onChange={handleUserGuessChange}
                className="bg-gray-200 border border-gray-300 rounded-lg py-3 px-4 w-full max-w-xs text-center"
                placeholder="Enter your guess"
              />
              {/* Button to submit the guess */}
              <Button
                onClick={handleGuess}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg ml-4"
              >
                Guess
              </Button>
            </div>
            {/* Display hint and attempts */}
            <div className="text-center text-gray-700 mb-4">
              {hint && <p className="text-red-600 font-semibold">{hint}</p>}
              <p>Attempts: {attempts}</p>
            </div>
          </div>
        )}
        {/* Conditional rendering: show game over message if game is over */}
        {gameOver && (
          <div>
            <div className="text-center mb-4 text-black">
              {/* Game over message */}
              <h2 className="text-2xl font-bold">Game Over!</h2>
              <p>You guessed the number in {attempts} attempts.</p>
            </div>
            <div className="flex justify-center">
              {/* Button to try the game again */}
              <Button
                onClick={handleTryAgain}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg"
              >
                Try Again
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}