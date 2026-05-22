"use client"
import React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { useState } from "react";
import githubIcon from "./github.png";
import linkedinIcon from "./linkedin.png";
import Image from "next/image";
import GlareHover from '@/components/GlareHover'

const projects = [
  {
    id: 1,
    name: "Portfolio Website",
    description: "A modern portfolio showcasing my work and skills.",
    technologies: ["React", "TypeScript", "Tailwind CSS", "Next.js", "Figma"],
    href: "https://github.com/MChandra111/CreativePortfolioWebsite",
  },
];

function ProjectCard({ project }: { project: typeof projects[0] }) {
  const [showTech, setShowTech] = useState(false);

  return (
    <Link key={project.id} href={project.href} className="block">
    <motion.div
      className="relative w-110 max-w-full bg-[#71AD9B] rounded-2xl p-6 shadow-sm cursor-pointer"
      style={{ borderColor: "#71AD9B", borderWidth: "1px" }}
      whileHover={{ x: 8 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onHoverStart={() => setShowTech(true)}
      onHoverEnd={() => setShowTech(false)}
    >
      <h3 className="mb-2 text-xl text-[#FFFFE7]">{project.name}</h3>
      <p className="text-sm text-[#FFFFE7]">{project.description}</p>

      {showTech && (
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{
            duration: 0.3,
            ease: [0.4, 0.0, 0.2, 1]
          }}
          className="absolute left-full ml-6 top-1/2 -translate-y-1/2 bg-white rounded-xl p-4 shadow-lg z-10"
          style={{ borderColor: "#71AD9B", borderWidth: "1px", minWidth: "200px" }}
        >
          <p className="text-sm mb-3 text-[#71AD9B]">Technologies & Skills</p>
          <div className="flex flex-col gap-2">
            {project.technologies.map((tech, index) => (
              <span
                key={index}
                className="px-3 py-1.5 rounded-full text-xs text-[#FFFFE7] text-center"
                style={{ backgroundColor: "#71AD9B" }}
              >
                {tech}
              </span>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
    </Link>
  );
}

export default function About() {
  return (
    <div className="page-background min-h-screen size-full flex flex-col items-center bg-linear-to-br from-[#FFFCBB] to-[#FFFFE7]">
      <div className="text-center pt-15">
        <h1 className="text-4xl font-bold text-[#71AD9B]">
          Software Projects
        </h1>
      </div>
      <div className="grid grid-cols-2 justify-items-center gap-16 mt-10">
          <GlareHover
            glareColor="#71AD9B"
            glareOpacity={0.4}
            glareAngle={-30}
            glareSize={300}
            transitionDuration={1000}
            playOnce={true}>
            <Image src={githubIcon} alt="Github Icon" height={100} width={100} onClick={() => window.open("https://github.com/MChandra111", "_blank")} />
          </GlareHover>
          <GlareHover
            glareColor="#71AD9B"
            glareOpacity={0.4}
            glareAngle={-30}
            glareSize={300}
            transitionDuration={1000}
            playOnce={true}>
            <Image src={linkedinIcon} alt="LinkedIn Icon" height={100} width={100} onClick={() => window.open("https://www.linkedin.com/in/maheshwar-chandra/", "_blank")} />
          </GlareHover>
      </div>

      <div className="max-w-3xl mx-auto flex flex-col gap-6 pt-10">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
    </div>
  );
}
