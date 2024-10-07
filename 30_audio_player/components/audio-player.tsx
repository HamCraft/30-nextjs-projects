"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  ForwardIcon,
  PlayIcon,
  RewindIcon,
  UploadIcon,
  PauseIcon,
  Volume2Icon,
} from "lucide-react";
import Image from "next/image";

// Define types for the component props and state
interface AudioPlayerProps {}

interface Track {
  title: string;
  artist: string;
  src: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newTracks: Track[] = Array.from(files).map((file) => ({
        title: file.name,
        artist: "Unknown Artist",
        src: URL.createObjectURL(file),
      }));
      setTracks((prevTracks) => [...prevTracks, ...newTracks]);
    }
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      audioRef.current?.play();
      setIsPlaying(true);
    }
  };

  const handleNextTrack = () => {
    setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % tracks.length);
  };

  const handlePrevTrack = () => {
    setCurrentTrackIndex((prevIndex) =>
      prevIndex === 0 ? tracks.length - 1 : prevIndex - 1
    );
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setProgress(
        (audioRef.current.currentTime / audioRef.current.duration) * 100
      );
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(event.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause(); // Pause the current audio
      audioRef.current.src = tracks[currentTrackIndex]?.src || ""; // Set the new source
      audioRef.current.load(); // Load the new audio
      audioRef.current.currentTime = 0; // Reset the current time
      setCurrentTime(0); // Reset the displayed current time
      setProgress(0); // Reset the progress bar
  
      // If the player was playing before switching tracks, resume playing
      if (isPlaying) {
        audioRef.current.play();
      }
    }
  }, [currentTrackIndex, tracks, isPlaying]);
  
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white px-4">
      <div className="w-full max-w-lg space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-center sm:text-left">
            Audio Player
          </h1>
          <label className="flex items-center cursor-pointer text-white">
            <UploadIcon className="w-5 h-5 mr-2" />
            <span className="text-sm">Upload</span>
            <input
              type="file"
              accept="audio/*"
              multiple
              className="hidden"
              onChange={handleUpload}
            />
          </label>
        </div>

        {/* Card with Content */}
        <Card className="shadow-lg bg-gray-800">
          <CardContent className="flex flex-col items-center justify-center gap-4 p-6 sm:p-8">
            {/* Album Art */}
            <Image
              src="/music.svg"
              alt="Album Cover"
              width={100}
              height={100}
              className="rounded-full w-24 h-24 sm:w-32 sm:h-32 object-cover"
            />
            <div className="text-center">
              <h2 className="text-xl font-bold text-white">
                {tracks[currentTrackIndex]?.title || "Audio Title"}
              </h2>
              <p className="text-gray-400">
                {tracks[currentTrackIndex]?.artist || "Unknown Artist"}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full">
              <Progress value={progress} />
              <div className="flex justify-between text-xs sm:text-sm text-gray-400 mt-2">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center justify-between gap-4 w-full mt-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePrevTrack}
                className="w-10 h-10 text-white"
              >
                <RewindIcon className="w-6 h-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePlayPause}
                className="w-10 h-10 text-white"
              >
                {isPlaying ? (
                  <PauseIcon className="w-6 h-6" />
                ) : (
                  <PlayIcon className="w-6 h-6" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNextTrack}
                className="w-10 h-10 text-white"
              >
                <ForwardIcon className="w-6 h-6" />
              </Button>
            </div>

            {/* Volume Control */}
            <div className="w-full flex items-center gap-2 mt-4">
              <Volume2Icon className="w-5 h-5 text-white" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="w-full h-2 bg-gray-400 rounded-lg appearance-none"
              />
            </div>
            <audio
              ref={audioRef}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AudioPlayer;
