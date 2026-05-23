"use client"
import React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { useState } from "react";
import { GithubIcon } from "@/components/ui/github";
import BorderGlow from "@/components/BorderGlow";
import { LinkedinIcon } from "@/components/ui/linkedin";
import { FileTextIcon } from "@/components/ui/file-text";

const projects = [
  {
    id: 1,
    name: "Portfolio Website",
    description: "A modern portfolio showcasing my work and skills.",
    technologies: ["React", "TypeScript", "Tailwind CSS", "Next.js", "Figma", "MongoDB", "Github Copilot"],
    href: "https://github.com/MChandra111/CreativePortfolioWebsite",
  },
  {
    id: 2,
    name: "Fake News Detection",
    description: "A machine learning model to identify and flag fake news articles.",
    technologies: ["Python"],
    href: "#",
  }
];

function ProjectCard({ project }: { project: typeof projects[0] }) {
  const [showTech, setShowTech] = useState(false);

  return (
    <Link key={project.id} href={project.href} className="block">
    <motion.div
      className="relative w-130 max-w-full bg-[#fcfcfe] rounded-2xl p-6 shadow-sm cursor-pointer"
      style={{ borderColor: "#475569", borderWidth: "2px" }}
      whileHover={{ x: 8 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onHoverStart={() => setShowTech(true)}
      onHoverEnd={() => setShowTech(false)}
    >
      <h3 className="mb-2 text-xl text-[#334155] font-bold grid grid-cols-2">{project.name} ⧉</h3>
      <p className="text-md text-[#475569]">{project.description}</p>

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
          style={{ borderColor: "#334155", borderWidth: "1px", minWidth: "200px" }}
        >
          <p className="text-sm mb-3 text-[#475569]">Technologies & Skills</p>
          <div className="flex flex-col gap-2">
            {project.technologies.map((tech, index) => (
              <span
                key={index}
                className="px-3 py-1.5 rounded-full text-xs text-[#F9FAFB] text-center"
                style={{ backgroundColor: "#475569" }}
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
    <div className="page-background min-h-screen size-full flex flex-col items-center">
      <div className="text-center pt-15 pb-5 padding">
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
        <div style={{ padding: '1.5em' }}>
        <h1 className="text-4xl font-bold text-[#F9FAFB]">
          Software Projects
        </h1>
        </div>
        </BorderGlow>
      </div>
          <div className="grid grid-cols-3 gap-5 flex-col justify-center pt-5">
            <motion.a
                href="https://github.com/MChandra111"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 rounded-full"
                style={{ backgroundColor: "#334155", color: "#F9FAFB" }}
            >
              <GithubIcon size={35} color="white" />
            </motion.a>

            <motion.a
              href="https://pdflink.to/1ddacf4f/"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 rounded-full"
              style={{ backgroundColor: "#334155", color: "#F9FAFB" }}
            >
              <FileTextIcon size={35} color="white" />
            </motion.a>

            <motion.a
              href="https://www.linkedin.com/in/maheshwar-chandra/"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 rounded-full"
              style={{ backgroundColor: "#334155", color: "#F9FAFB" }}
            >
              <LinkedinIcon size={35} color="white" />
            </motion.a>
          </div>

      <div className="max-w-3xl mx-auto flex flex-col gap-6 pt-10">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
    </div>
  );
}
