export interface Song {
  id: string;
  title: string;
  artist: string;
  /** URL or path under /public, e.g. "/music/my-track.mp3" */
  src: string;
  duration?: string;
}

/**
 * Demo tracks from samplelib.com (supports CORS for Web Audio / visualizer).
 * Replace with your own files in /public/music, e.g. src: "/music/my-track.mp3"
 */
export const songs: Song[] = [
  {
    id: "1",
    title: "Rain",
    artist: "Lo-Fi",
    src: "/music/Rain.mp3",
    duration: "3:00",
  },
  {
    id: "2",
    title: "Memento Mori",
    artist: "Pop, Vocal",
    src: "/music/MementoMori.mp3",
    duration: "3:30",
  },
  {
    id: "3",
    title: "Melodies",
    artist: "Pop, Vocal",
    src: "/music/Melodies.mp3",
    duration: "3:47",
  },
  {
    id: "4",
    title: "Whiplash",
    artist: "Pop, Instrumental",
    src: "/music/Whiplash.mp3",
    duration: "2:17",
  },
  {
    id: "5",
    title: "Corner Coffee Shop",
    artist: "Latin, Instrumental",
    src: "/music/CornerCoffeeShop.mp3",
    duration: "1:53",
  },
  {
    id: "6",
    title: "Fallacies",
    artist: "Rap, Instrumental",
    src: "/music/Fallacies.mp3",
    duration: "3:06",
  },
  {
    id: "7",
    title: "Blood Moon",
    artist: "Orchestral, Instrumental",
    src: "/music/BloodMoon.mp3",
    duration: "1:20",
  },
  {
    id: "8",
    title: "Monster In The Snow",
    artist: "Instrumental",
    src: "/music/MonsterInTheSnow.mp3",
    duration: "3:05",
  },
  {
    id: "9",
    title: "Gestalt",
    artist: "Vocal Chop, Pop",
    src: "/music/Gestalt.mp3",
    duration: "3:16",
  },
  {
    id: "10",
    title: "Look What You've Done",
    artist: "Vocal Chop, Pop",
    src: "/music/WhatYouveDone.mp3",
    duration: "3:13",
  }
];
