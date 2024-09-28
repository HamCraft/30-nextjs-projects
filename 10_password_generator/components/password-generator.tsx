"use client"; // Enables client-side rendering for this component

import { useState, ChangeEvent } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckedState } from "@radix-ui/react-checkbox";
import { Button } from "@/components/ui/button";

export default function GeneratePassword() {
  const [length, setLength] = useState<number>(16);
  const [includeUppercase, setIncludeUppercase] = useState<boolean>(true);
  const [includeLowercase, setIncludeLowercase] = useState<boolean>(true);
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(true);
  const [includeSymbols, setIncludeSymbols] = useState<boolean>(true);
  const [password, setPassword] = useState<string>("");
  const [passwordStrength, setPasswordStrength] = useState<string>("Weak");

  const handleLengthChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setLength(Number(e.target.value));
  };

  const generatePassword = (): void => {
    const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
    const numberChars = "0123456789";
    const symbolChars = "!@#$%^&*()_+[]{}|;:,.<>?";

    let allChars = "";
    if (includeUppercase) allChars += uppercaseChars;
    if (includeLowercase) allChars += lowercaseChars;
    if (includeNumbers) allChars += numberChars;
    if (includeSymbols) allChars += symbolChars;

    if (allChars === "") {
      alert("Please select at least one character type.");
      return;
    }

    let generatedPassword = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * allChars.length);
      generatedPassword += allChars[randomIndex];
    }
    setPassword(generatedPassword);
    setPasswordStrength(calculatePasswordStrength(generatedPassword));
  };

  const calculatePasswordStrength = (password: string): string => {
    let strength = 0;

    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[@$!%*?&#]/.test(password)) strength++;

    if (strength <= 2) return "Weak";
    if (strength === 3) return "Moderate";
    return "Strong";
  };

  const copyToClipboard = (): void => {
    navigator.clipboard.writeText(password).then(
      () => {
        alert("Password copied to clipboard!");
      },
      () => {
        alert("Failed to copy password to clipboard.");
      }
    );
  };

  const handleCheckboxChange =
    (setter: (value: boolean) => void) =>
    (checked: CheckedState): void => {
      if (typeof checked === "boolean") {
        setter(checked);
      }
    };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-4">
      <Card className="w-full max-w-md p-6 bg-gray-900 shadow-lg rounded-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-white">Password Generator</CardTitle>
          <CardDescription className="text-gray-400">
            Generate a secure password with custom options
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="length" className="text-lg font-medium text-white">
              Password Length
            </Label>
            <Input
              id="length"
              type="number"
              min="8"
              max="128"
              value={length}
              onChange={handleLengthChange}
              className="w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-white"
            />
          </div>

          {/* Improved Checkboxes with reduced gap and visible checkmark */}
          <div className="space-y-2">
            <Label className="text-sm text-white">Include:</Label>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="uppercase"
                checked={includeUppercase}
                onCheckedChange={handleCheckboxChange(setIncludeUppercase)}
                className="bg-gray-800 border-gray-700 checked:bg-indigo-500 checked:border-indigo-500"
              />
              <Label htmlFor="uppercase" className="text-white">Uppercase Letters</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="lowercase"
                checked={includeLowercase}
                onCheckedChange={handleCheckboxChange(setIncludeLowercase)}
                className="bg-gray-800 border-gray-700 checked:bg-indigo-500 checked:border-indigo-500"
              />
              <Label htmlFor="lowercase" className="text-white">Lowercase Letters</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="numbers"
                checked={includeNumbers}
                onCheckedChange={handleCheckboxChange(setIncludeNumbers)}
                className="bg-gray-800 border-gray-700 checked:bg-indigo-500 checked:border-indigo-500"
              />
              <Label htmlFor="numbers" className="text-white">Numbers</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="symbols"
                checked={includeSymbols}
                onCheckedChange={handleCheckboxChange(setIncludeSymbols)}
                className="bg-gray-800 border-gray-700 checked:bg-indigo-500 checked:border-indigo-500"
              />
              <Label htmlFor="symbols" className="text-white">Symbols</Label>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <Button
            type="button"
            className="w-full bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 text-white py-2 rounded-md hover:opacity-90"
            onClick={generatePassword}
          >
            Generate Password
          </Button>
          
          <div className="space-y-2">
            <Label htmlFor="password" className="text-white">Generated Password</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="password"
                type="text"
                value={password}
                readOnly
                className="flex-1 bg-gray-800 text-white px-3 py-2 rounded-md border border-gray-700"
              />
              <Button
                type="button"
                onClick={copyToClipboard}
                className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-2 rounded-md"
              >
                Copy to Clipboard
              </Button>
            </div>

            {/* Updated styling for strength text */}
            <div className={`font-bold ${passwordStrength === "Weak" ? "text-red-500" : passwordStrength === "Moderate" ? "text-yellow-500" : "text-green-500"}`}>
              Strength: {passwordStrength}
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
