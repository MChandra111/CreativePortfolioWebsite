"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, PanInfo } from "framer-motion";
import Image from "next/image";

interface CardData {
  id: number;
  imageUrl: string;
  title: string;
  location?: string;
  tags?: string[];
  date?: Date | string;
}

interface CarouselProps {
  cards?: CardData[];
}

interface IconProps {
  className?: string;
}

interface CardProps {
  card: CardData;
  index: number;
  activeIndex: number;
  totalCards: number;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
}


const ChevronLeftIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m15 18-6-6 6-6" />
  </svg>
);

const ChevronRightIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
);

// Badge component removed (unused)

const cardData: CardData[] = [
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

export default function Carousel({ cards = cardData }: CarouselProps) {
  const items = cards.length > 0 ? cards : cardData;
  const [activeIndex, setActiveIndex] = useState(
    Math.floor(items.length / 2)
  );
  const [isPaused, setIsPaused] = useState(false);
  const [fullscreenCard, setFullscreenCard] = useState<CardData | null>(null);
  const [fullscreenRect, setFullscreenRect] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [fullscreenDimensions, setFullscreenDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const autoplayIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const autoplayDelay = 3000;

  const goToNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  useEffect(() => {
    if (!isPaused) {
      autoplayIntervalRef.current = setInterval(goToNext, autoplayDelay);
    }
    return () => {
      if (autoplayIntervalRef.current) {
        clearInterval(autoplayIntervalRef.current);
      }
    };
  }, [isPaused, goToNext]);

  const changeSlide = (newIndex: number) => {
    const newSafeIndex = (newIndex + items.length) % items.length;
    setActiveIndex(newSafeIndex);
    if (autoplayIntervalRef.current) {
      clearInterval(autoplayIntervalRef.current);
    }
    if (!isPaused) {
      autoplayIntervalRef.current = setInterval(goToNext, autoplayDelay);
    }
  };

  const onDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const dragThreshold = 75;
    const dragOffset = info.offset.x;
    if (dragOffset > dragThreshold) {
      changeSlide(activeIndex - 1);
    } else if (dragOffset < -dragThreshold) {
      changeSlide(activeIndex + 1);
    }
  };

  const openFullscreen = (card: CardData, rect: DOMRect | null) => {
    setFullscreenCard(card);
    if (rect) {
      setFullscreenRect({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      });
    } else {
      setFullscreenRect(null);
    }
    setIsPaused(true);
    setIsClosing(false);
  };

  const closeFullscreen = () => {
    // trigger closing animation back to original rect
    setIsClosing(true);
    setIsPaused(true);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeFullscreen();
      }
    };

    if (fullscreenCard) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [fullscreenCard]);

  return (
    <section className="w-full flex-col items-center justify-center font-sans overflow-hidden">
      <div
        className="w-full max-w-5xl mx-auto p-4"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="relative flex w-full flex-col rounded-3xl border border-white/10 dark:border-white/10 bg-white dark:bg-neutral-900 p-4 pt-6 md:p-6">
          <div className="relative w-full h-70 md:h-100 flex items-center justify-center overflow-hidden pt-12">
            <motion.div
              className="w-full h-full flex items-center justify-center"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={onDragEnd}
            >
              {items.map((card, index) => (
                <Card
                  key={card.id}
                  card={card}
                  index={index}
                  activeIndex={activeIndex}
                  totalCards={items.length}
                  onClick={(e) => {
                    if (index === activeIndex) {
                      const el = e.currentTarget as HTMLElement;
                      const rect = el.getBoundingClientRect();
                      openFullscreen(card, rect);
                    }
                  }}
                />
              ))}
            </motion.div>
          </div>

          <div className="flex items-center justify-center gap-6 mt-6">
            <button
              onClick={() => changeSlide(activeIndex - 1)}
              className="p-2 rounded-full bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 border border-gray-300 dark:border-white/10 text-gray-700 dark:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <ChevronLeftIcon className="w-6 h-6" />
            </button>

            <div className="flex items-center justify-center gap-2">
              {items.map((_, index) => (
                <button
                  key={index}
                  onClick={() => changeSlide(index)}
                  className={`h-2 rounded-full transition-all duration-300 focus:outline-none ${
                    activeIndex === index
                      ? "w-6 bg-pink-400"
                      : "w-2 bg-gray-300 dark:bg-neutral-600 hover:bg-gray-400 dark:hover:bg-neutral-500"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={() => changeSlide(activeIndex + 1)}
              className="p-2 rounded-full bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 border border-gray-300 dark:border-white/10 text-gray-700 dark:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <ChevronRightIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
      {fullscreenCard && fullscreenRect ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/85"
            onClick={closeFullscreen}
          />

          <motion.div
            initial={{
              top: fullscreenRect.top,
              left: fullscreenRect.left,
              width: fullscreenRect.width,
              height: fullscreenRect.height,
              position: "fixed",
            }}
            animate={
              isClosing && fullscreenRect
                ? {
                    top: fullscreenRect.top,
                    left: fullscreenRect.left,
                    x: 0,
                    y: 0,
                    width: fullscreenRect.width,
                    height: fullscreenRect.height,
                    position: "fixed",
                  }
                : {
                    top: "50%",
                    left: "50%",
                    x: "-50%",
                    y: "-50%",
                    width: fullscreenDimensions?.width || "90vw",
                    height: fullscreenDimensions?.height || "90vh",
                    position: "fixed",
                  }
            }
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="z-50 rounded-3xl overflow-hidden bg-black"
            onClick={(e) => e.stopPropagation()}
            onAnimationComplete={() => {
              if (isClosing) {
                setFullscreenCard(null);
                setFullscreenRect(null);
                setIsClosing(false);
                setIsPaused(false);
                setFullscreenDimensions(null);
              }
            }}
          >
            <button
              onClick={closeFullscreen}
              className="absolute top-4 right-4 z-10 rounded-full bg-white/10 px-3 py-2 text-white hover:bg-white/20"
            >
              Close
            </button>

            <div className="relative w-full h-full">
              <Image
                fill
                src={fullscreenCard.imageUrl}
                alt={fullscreenCard.title}
                className="object-contain"
                onLoad={(result) => {
                  const img = result.target as HTMLImageElement;
                  const imgWidth = img.naturalWidth;
                  const imgHeight = img.naturalHeight;
                  const aspectRatio = imgWidth / imgHeight;
                  const maxWidth = window.innerWidth * 0.9;
                  const maxHeight = window.innerHeight * 0.9;
                  let width = maxWidth;
                  let height = width / aspectRatio;
                  if (height > maxHeight) {
                    height = maxHeight;
                    width = height * aspectRatio;
                  }
                  setFullscreenDimensions({ width, height });
                }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src =
                    "https://placehold.co/800x600/1e1e1e/ffffff?text=Image+Missing";
                }}
              />

              <div className="absolute bottom-4 right-4 flex items-center">
                <div className="group relative">
                  <button
                    aria-label="Show info"
                    className="w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="16" x2="12" y2="12"></line>
                      <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                  </button>

                  <div className="absolute bottom-full right-0 mb-2 hidden opacity-80 w-56 rounded-md bg-black/85 p-3 text-white text-sm group-hover:block">
                    <h4 className="font-semibold">Location: {fullscreenCard.location || 'Location unknown'}</h4>
                    <p className="mt-1 text-xs opacity-80">Date: {typeof fullscreenCard.date === 'string' ? fullscreenCard.date : fullscreenCard.date?.toLocaleDateString() || 'Date unknown'}</p>
                    <p className="mt-1 text-xs opacity-80">Tags: {fullscreenCard.tags?.join(", ") || 'No tags'}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      ) : null}
    </section>
  );
}

function Card({ card, index, activeIndex, totalCards, onClick }: CardProps) {
  let offset = index - activeIndex;
  if (offset > totalCards / 2) {
    offset -= totalCards;
  } else if (offset < -totalCards / 2) {
    offset += totalCards;
  }

  const isVisible = Math.abs(offset) <= 1;

  const animate = {
    x: `${offset * 50}%`,
    scale: offset === 0 ? 1 : 0.8,
    zIndex: totalCards - Math.abs(offset),
    opacity: isVisible ? 1 : 0,
    transition: { type: "spring" as const, stiffness: 260, damping: 30 },
  };

  const isActive = index === activeIndex;

  return (
    <motion.div
      className="absolute w-1/2 md:w-1/3 h-[95%]"
      style={{
        transformStyle: "preserve-3d",
      }}
      animate={animate}
      initial={false}
    >
      <div
        className={`relative w-full h-full rounded-3xl shadow-2xl overflow-hidden bg-gray-200 dark:bg-neutral-800 ${
          isActive ? "cursor-pointer" : "cursor-default"
        }`}
        onClick={isActive ? onClick : undefined}
      >
        <Image
          fill
          src={card.imageUrl}
          alt={card.title}
          className="w-full h-full object-cover pointer-events-none"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src =
              "https://placehold.co/400x600/1e1e1e/ffffff?text=Image+Missing";
          }}
        />
      </div>
    </motion.div>
  );
}
