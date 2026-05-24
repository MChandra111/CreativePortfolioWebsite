"use client"
import React, { useMemo, useState } from "react";
import { ArrowRight, Search } from "lucide-react";
import { motion } from "framer-motion";

const blogPosts = [
  {
    id: 1,
    title: "WIP",
    date: "2026-05-15",
    excerpt: "WIP",
    readTime: "0 min read",
    tags: ["Artificial Intelligence"],
    href: "#"
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
      onClick={() => window.open(post.href, "_blank")}
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
  const [query, setQuery] = useState("");

  const filteredPosts = useMemo(() => {
    const posts = blogPosts.toReversed();
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return posts;

    return posts.filter(
      (post) =>
        post.title.toLowerCase().includes(normalizedQuery) ||
        post.excerpt.toLowerCase().includes(normalizedQuery) ||
        post.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery))
    );
  }, [query]);

  return (
    <div className="size-full overflow-auto" style={{ background: "linear-gradient(to bottom, #F9FAFB, #F3F4F6)" }}>
      <div className="max-w-3xl mx-auto px-8 py-12">
        <div className="flex items-center justify-between mb-12 pt-6">
          <div>
            <h1 className="mb-2 text-3xl font-bold" style={{ color: "#334155" }}>Blog</h1>
            <p style={{ color: "#64748B" }}>Thoughts on software development and design</p>
          </div>
        </div>

        <div className="relative mb-8">
          <Search
            size={18}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: "#94A3B8" }}
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search posts..."
            aria-label="Search blog posts"
            className="w-full rounded-lg border bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition-shadow focus:ring-2 focus:ring-[#334155]/20"
            style={{ borderColor: "#E2E8F0", color: "#334155" }}
          />
        </div>

        <motion.div
          className="flex flex-col gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {filteredPosts.length === 0 ? (
            <p className="py-12 text-center" style={{ color: "#64748B" }}>
              No posts found for &ldquo;{query.trim()}&rdquo;.
            </p>
          ) : (
            filteredPosts.map((post, index) => (
              <BlogPostCard key={post.id} post={post} index={index} />
            ))
          )}
        </motion.div>
      </div>
    </div>
  );
}
