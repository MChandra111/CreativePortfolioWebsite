"use client"
import React from "react";
import githubIcon from "./github.png";
import linkedinIcon from "./linkedin.png";
import Image from "next/image";
import BorderGlow from '@/components/BorderGlow';

export default function About() {
  return (
    <div className="page-background min-h-screen size-full flex flex-col items-center bg-linear-to-br from-[#FFFCBB] to-[#FFFFE7]">
      <div className="text-center pt-15">
        <h1 className="text-4xl font-bold text-[#71AD9B]">
          Software Portfolio
        </h1>
      </div>
      <div className="grid grid-cols-2 gap-16 mt-10">
        <BorderGlow
          edgeSensitivity={5}
          glowColor="40 80 80"
          backgroundColor="#transparent"
          borderRadius={20}
          glowRadius={40}
          glowIntensity={1}
          coneSpread={25}
          animated={false}
          colors={['#c084fc', '#f472b6', '#38bdf8']}
        >
          <Image src={githubIcon} alt="Github Icon" height={100} width={100} /> 
        </BorderGlow>
        <Image src={linkedinIcon} alt="LinkedIn Icon" height={100} width={100} />
      </div>
    </div>
  );
}
