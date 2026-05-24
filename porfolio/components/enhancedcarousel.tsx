"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import BorderGlow from "@/components/BorderGlow";
import { ArrowLeft, ArrowRight, Mouse } from "lucide-react";

export interface Story {
  id: number;
  imageUrl: string;
  title: string;
  album?: string;
  year?: string;
  tags?: string[];
  href?: string;
}

interface CardProps {
  storiesData?: Story[];
  onAlbumClick?: (story: Story) => void;
}

const defaultStoriesData: Story[] = [
  {
    id: 1,
    imageUrl:
      "https://i.pinimg.com/736x/d6/8a/12/d68a121e960094f99ad8acd37505fb7d.jpg",
    title: "Crimson Forest",
  },
  {
    id: 2,
    imageUrl:
      "https://i.pinimg.com/736x/21/16/f7/2116f71f9d51d875e44d809f074ff079.jpg",
    title: "Misty Mountains",
  },
  {
    id: 3,
    imageUrl:
      "https://i.pinimg.com/1200x/fe/c2/0d/fec20d2958059b8463bffb138d4eaac6.jpg",
    title: "Floating Islands",
  },
  {
    id: 4,
    imageUrl:
      "https://i.pinimg.com/736x/84/dc/62/84dc62de850a34a9d420c97f3a2d58f4.jpg",
    title: "Crystal Cave",
  },
  {
    id: 5,
    imageUrl:
      "https://i.pinimg.com/1200x/be/c3/7e/bec37e2c43e703f922f887db2578ce2e.jpg",
    title: "Sunset Peaks",
  },
  {
    id: 6,
    imageUrl:
      "https://i.pinimg.com/736x/47/dd/47/47dd47b0d66c2fa641e03e370bcb5433.jpg",
    title: "Night Sky",
  },
  {
    id: 7,
    imageUrl:
      "https://i.pinimg.com/736x/05/01/bc/0501bcd327d9df915e83154bbf9456e3.jpg",
    title: "Ancient Ruins",
  },
  {
    id: 8,
    imageUrl:
      "https://i.pinimg.com/736x/c1/46/be/c146bebffca026d2c4fa76cc85aac917.jpg",
    title: "Magical Tree",
  },
  {
    id: 9,
    imageUrl:
      "https://i.pinimg.com/736x/91/7a/51/917a51df0d444def3cade8d626305a67.jpg",
    title: "Celestial Waters",
  },
];

const StoryCard = ({
  story,
  index,
  onAlbumClick,
}: {
  story: Story;
  index: number;
  onAlbumClick?: (story: Story) => void;
}) => {
  return (
    <motion.button
      type="button"
      className="relative h-96 w-72 shrink-0 overflow-hidden rounded-lg shadow-xl group text-left"
      initial={{ opacity: 0, y: 36 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.55,
        delay: index * 0.12,
        ease: "easeOut",
      }}
      whileHover={{ y: -8, transition: { type: "spring", stiffness: 300, damping: 24 } }}
      onPointerDown={(e) => e.stopPropagation()}
      onClick={() => {
        if (story.album && onAlbumClick) onAlbumClick(story);
      }}
      disabled={!story.album || !onAlbumClick}
    >
      <Image
        src={story.imageUrl}
        alt={story.title}
        fill
        sizes={"full"}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 pointer-events-none"
        loading="eager"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent"></div>
      <div className="relative z-10 flex flex-col justify-end h-full p-6 text-white">
        <h3 className="font-bold text-2xl tracking-wide">{story.title}</h3>
      </div>
    </motion.button>
  );
};

export default function EnhancedCarousel({
  storiesData = defaultStoriesData,
  onAlbumClick,
}: CardProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragConstraint, setDragConstraint] = useState(0);

  useEffect(() => {
    const calculateConstraints = () => {
      if (containerRef.current && trackRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const trackWidth = trackRef.current.scrollWidth;
        setDragConstraint(containerWidth - trackWidth);
      }
    };

    calculateConstraints();
    window.addEventListener("resize", calculateConstraints);

    return () => window.removeEventListener("resize", calculateConstraints);
  }, []);

  return (
    <div className="font-sans w-full py-12 md:py-20 flex flex-col items-center justify-center">
        <header className="w-120 text-center mb-12 cursor-default">
          <BorderGlow
          edgeSensitivity={5}
          glowColor="40 80 80"
          backgroundColor="#334155"
          borderRadius={20}
          glowRadius={40}
          glowIntensity={1}
          coneSpread={25}
          animated={false}
          colors={['#c084fc', '#f472b6', '#38bdf8']}
        >
          <div style={{ padding: '2em' }}>
            <p className="text-4xl font-bold text-[#F9FAFB]">Digital Albums</p>
          </div>
        </BorderGlow>
        </header>
      <div className="w-full max-w-7xl mx-auto px-4">

        <motion.div
          ref={containerRef}
          className="cursor-grab overflow-x-hidden overflow-y-visible px-4 pt-8 pb-2"
          whileTap={{ cursor: "grabbing" }}
        >
          <motion.div
            ref={trackRef}
            className="flex w-max space-x-6 px-4 pb-6"
            drag="x"
            dragConstraints={{
              right: 0,
              left: dragConstraint - 32,
            }}
            dragElastic={0.15}
          >
            {storiesData.toReversed().map((story, index) => (
              <StoryCard
                key={story.id}
                story={story}
                index={index}
                onAlbumClick={onAlbumClick}
              />
            ))}
          </motion.div>
        </motion.div>
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.55,
            delay: storiesData.length * 0.12,
            ease: "easeOut",
          }}
        >
          <ArrowLeft size={30} color="#334155" className="" />
          <Mouse size={30} color="#334155" className="mx-4" />
          <ArrowRight size={30} color="#334155" className="" />
        </motion.div>
      </div>
    </div>
  );
}
