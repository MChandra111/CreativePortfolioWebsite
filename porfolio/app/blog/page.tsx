"use client"
import React from "react";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const blogPosts = [
  {
    id: 1,
    title: "Getting Started with React and TypeScript",
    date: "2026-05-15",
    excerpt: "Learn how to set up a modern React application with TypeScript, exploring best practices and common patterns for type-safe development.",
    readTime: "5 min read",
  },
  {
    id: 2,
    title: "Building Scalable Web Applications",
    date: "2026-05-08",
    excerpt: "Explore architectural patterns and design principles that help create maintainable and scalable web applications for growing teams.",
    readTime: "8 min read",
  },
];

function BlogPostCard({ post, index }: { post: typeof blogPosts[0]; index: number }) {
  return (
    <motion.article
      className="bg-white rounded-lg p-8 shadow-sm border cursor-pointer group"
      style={{ borderColor: "#E2E8F0" }}
      initial={{ opacity: 0, y: 36 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.55,
        delay: index * 0.12,
        ease: "easeOut",
      }}
      whileHover={{
        y: -2,
        x: 4,
        transition: { type: "spring", stiffness: 300, damping: 20 },
      }}
      whileTap={{ scale: 0.995 }}
      onClick={() => window.open(`/blog/${post.id}`, "_blank")}
    >
      <div className="flex items-start justify-between mb-3">
        <time className="text-sm" style={{ color: "#475569" }}>
          {new Date(post.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </time>
        <span className="text-xs" style={{ color: "#94A3B8" }}>{post.readTime}</span>
      </div>

      <h2 className="mb-3 font-bold" style={{ color: "#334155" }}>{post.title}</h2>

      <p className="leading-relaxed mb-4" style={{ color: "#64748B" }}>
        {post.excerpt}
      </p>

      <div className="flex items-center gap-2 text-sm group-hover:gap-3 transition-all" style={{ color: "#475569" }}>
        <span>Read more</span>
        <ArrowRight size={16} className="translate-y-0.5 -translate-x-1" />
      </div>
    </motion.article>
  );
}

export default function BlogPage() {
  return (
    <div className="size-full overflow-auto" style={{ background: "linear-gradient(to bottom, #F9FAFB, #F3F4F6)" }}>
      <div className="max-w-3xl mx-auto px-8 py-12">
        <div className="flex items-center justify-between mb-12 pt-6">
          <div>
            <h1 className="mb-2 text-3xl font-bold" style={{ color: "#334155" }}>Blog</h1>
            <p style={{ color: "#64748B" }}>Thoughts on software development and design</p>
          </div>
        </div>

        <motion.div
          className="flex flex-col gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {blogPosts.toReversed().map((post, index) => (
            <BlogPostCard key={post.id} post={post} index={index} />
          ))}
        </motion.div>
      </div>
    </div>
  );
}
