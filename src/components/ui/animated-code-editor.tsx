"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface CodeLine {
  text: string;
  indent: number;
}

interface AnimatedCodeEditorProps {
  className?: string;
}

const codeSnippets: CodeLine[][] = [
  // React Component
  [
    { text: "import { useState } from 'react';", indent: 0 },
    { text: "", indent: 0 },
    { text: "export function App() {", indent: 0 },
    { text: "const [count, setCount] = useState(0);", indent: 1 },
    { text: "", indent: 0 },
    { text: "return (", indent: 1 },
    { text: "<div className=\"app\">", indent: 2 },
    { text: "<h1>Welcome!</h1>", indent: 3 },
    { text: "<button onClick={() => setCount(c => c + 1)}>", indent: 3 },
    { text: "Clicked {count} times", indent: 4 },
    { text: "</button>", indent: 3 },
    { text: "</div>", indent: 2 },
    { text: ");", indent: 1 },
    { text: "}", indent: 0 },
  ],
  // API Route
  [
    { text: "// API endpoint", indent: 0 },
    { text: "export async function POST(req) {", indent: 0 },
    { text: "const data = await req.json();", indent: 1 },
    { text: "", indent: 0 },
    { text: "const result = await db.create({", indent: 1 },
    { text: "name: data.name,", indent: 2 },
    { text: "email: data.email,", indent: 2 },
    { text: "createdAt: new Date(),", indent: 2 },
    { text: "});", indent: 1 },
    { text: "", indent: 0 },
    { text: "return Response.json({", indent: 1 },
    { text: "success: true,", indent: 2 },
    { text: "id: result.id", indent: 2 },
    { text: "});", indent: 1 },
    { text: "}", indent: 0 },
  ],
  // Tailwind Component
  [
    { text: "function Card({ title, desc }) {", indent: 0 },
    { text: "return (", indent: 1 },
    { text: "<div className=\"", indent: 2 },
    { text: "  rounded-xl border", indent: 2 },
    { text: "  bg-gradient-to-br", indent: 2 },
    { text: "  from-white/10 to-white/5", indent: 2 },
    { text: "  p-6 hover:scale-105", indent: 2 },
    { text: "  transition-all duration-300", indent: 2 },
    { text: "\">", indent: 2 },
    { text: "<h3>{title}</h3>", indent: 3 },
    { text: "<p>{desc}</p>", indent: 3 },
    { text: "</div>", indent: 2 },
    { text: ");", indent: 1 },
    { text: "}", indent: 0 },
  ],
];

const syntaxHighlight = (text: string): React.ReactNode[] => {
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;

  const patterns: [RegExp, string][] = [
    [/^(\/\/.*$)/, "text-gray-500"], // Comments
    [/^(import|export|from|async|await|return|const|let|function|if|else)(?=\s|$)/, "text-purple-400"], // Keywords
    [/^(useState|useEffect|Response|db)(?=\s|\(|\.|\,|$)/, "text-yellow-400"], // Functions/hooks
    [/^('[^']*'|"[^"]*")/, "text-green-400"], // Strings
    [/^(\{|\}|\(|\)|\[|\]|;|,|=>|:)/, "text-gray-400"], // Punctuation
    [/^(<\/?[a-zA-Z][a-zA-Z0-9]*|>|\/>)/, "text-blue-400"], // JSX tags
    [/^(className|onClick|href|key)(?==)/, "text-cyan-400"], // Attributes
    [/^(\d+)/, "text-orange-400"], // Numbers
    [/^(true|false|null|undefined)/, "text-orange-400"], // Booleans
  ];

  while (remaining.length > 0) {
    let matched = false;

    for (const [pattern, className] of patterns) {
      const match = remaining.match(pattern);
      if (match) {
        parts.push(
          <span key={key++} className={className}>
            {match[0]}
          </span>
        );
        remaining = remaining.slice(match[0].length);
        matched = true;
        break;
      }
    }

    if (!matched) {
      // Find the next special character or end of string
      const nextSpecial = remaining.slice(1).search(/['"<>{}()\[\];,=]|import|export|from|async|await|return|const|let|function|\/\//);
      const endIdx = nextSpecial === -1 ? remaining.length : nextSpecial + 1;
      parts.push(
        <span key={key++} className="text-text-body">
          {remaining.slice(0, endIdx)}
        </span>
      );
      remaining = remaining.slice(endIdx);
    }
  }

  return parts;
};

export function AnimatedCodeEditor({ className }: AnimatedCodeEditorProps) {
  const [currentSnippetIndex, setCurrentSnippetIndex] = useState(0);
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [cursorPosition, setCursorPosition] = useState({ line: 0, char: 0 });
  const [isTyping, setIsTyping] = useState(true);

  const currentSnippet = useMemo(() => codeSnippets[currentSnippetIndex], [currentSnippetIndex]);

  const typeCode = useCallback(() => {
    const currentLine = currentSnippet[visibleLines];

    if (!currentLine) {
      // Finished typing all lines
      setIsTyping(false);
      setTimeout(() => {
        // Reset and move to next snippet
        setVisibleLines(0);
        setCursorPosition({ line: 0, char: 0 });
        setCurrentSnippetIndex((prev) => (prev + 1) % codeSnippets.length);
        setIsTyping(true);
      }, 3000);
      return;
    }

    const fullLineLength = currentLine.text.length + currentLine.indent * 2;

    if (cursorPosition.char < fullLineLength) {
      // Still typing current line
      setCursorPosition((prev) => ({
        ...prev,
        char: prev.char + 1,
      }));
    } else {
      // Move to next line
      setVisibleLines((prev) => prev + 1);
      setCursorPosition((prev) => ({
        line: prev.line + 1,
        char: 0,
      }));
    }
  }, [currentSnippet, visibleLines, cursorPosition.char]);

  useEffect(() => {
    if (!isTyping) return;

    const speed = Math.random() * 30 + 20; // Random typing speed for realism
    const timer = setTimeout(typeCode, speed);
    return () => clearTimeout(timer);
  }, [typeCode, isTyping]);

  const fileNames = ["App.tsx", "api/route.ts", "Card.tsx"];

  return (
    <div className={cn("relative w-full h-full", className)}>
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-theme/20 via-transparent to-blue-500/20 rounded-3xl blur-xl" />

      {/* Editor container */}
      <div className="absolute inset-4 rounded-2xl overflow-hidden border border-white/10 bg-[#0d1117] shadow-2xl">
        {/* Title bar */}
        <div className="h-10 bg-[#161b22] border-b border-white/10 flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
          </div>
          <div className="flex items-center gap-4">
            {fileNames.map((name, i) => (
              <motion.div
                key={name}
                className={cn(
                  "text-xs px-3 py-1 rounded-md transition-colors",
                  i === currentSnippetIndex
                    ? "bg-theme/20 text-theme"
                    : "text-gray-500 hover:text-gray-400"
                )}
                animate={i === currentSnippetIndex ? { scale: [1, 1.05, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                {name}
              </motion.div>
            ))}
          </div>
          <div className="w-20" />
        </div>

        {/* Line numbers + code */}
        <div className="flex h-[calc(100%-40px)] overflow-hidden">
          {/* Line numbers */}
          <div className="w-12 bg-[#0d1117] border-r border-white/5 pt-4 text-right pr-3 font-mono text-xs text-gray-600 select-none">
            {currentSnippet.map((_, i) => (
              <div key={i} className="h-6 leading-6">
                {i + 1}
              </div>
            ))}
          </div>

          {/* Code area */}
          <div className="flex-1 p-4 font-mono text-sm overflow-hidden relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSnippetIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {currentSnippet.map((line, lineIndex) => {
                  const indent = "  ".repeat(line.indent);
                  const fullText = indent + line.text;
                  const isCurrentLine = lineIndex === visibleLines;
                  const isPastLine = lineIndex < visibleLines;

                  let displayText = "";
                  if (isPastLine) {
                    displayText = fullText;
                  } else if (isCurrentLine) {
                    displayText = fullText.slice(0, cursorPosition.char);
                  }

                  return (
                    <div
                      key={lineIndex}
                      className={cn(
                        "h-6 leading-6 whitespace-pre relative",
                        lineIndex > visibleLines && "opacity-0"
                      )}
                    >
                      {syntaxHighlight(displayText)}
                      {isCurrentLine && isTyping && (
                        <motion.span
                          className="inline-block w-[2px] h-4 bg-theme ml-[1px] align-middle"
                          animate={{ opacity: [1, 0] }}
                          transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                        />
                      )}
                    </div>
                  );
                })}
              </motion.div>
            </AnimatePresence>

            {/* Terminal output simulation */}
            {!isTyping && (
              <motion.div
                className="absolute bottom-4 left-4 right-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="bg-[#161b22] rounded-lg p-3 border border-white/10">
                  <div className="flex items-center gap-2 text-xs">
                    <motion.div
                      className="w-2 h-2 rounded-full bg-green-500"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                    <span className="text-green-400">Build successful</span>
                    <span className="text-gray-500">• 0.42s</span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Status bar */}
        <div className="absolute bottom-0 left-0 right-0 h-6 bg-[#161b22] border-t border-white/5 flex items-center justify-between px-4 text-[10px] text-gray-500">
          <div className="flex items-center gap-4">
            <span>TypeScript React</span>
            <span>UTF-8</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Ln {visibleLines + 1}, Col {cursorPosition.char + 1}</span>
            <motion.div
              className="flex items-center gap-1"
              animate={{ opacity: isTyping ? [0.5, 1, 0.5] : 1 }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <div className={cn(
                "w-2 h-2 rounded-full",
                isTyping ? "bg-yellow-500" : "bg-green-500"
              )} />
              <span>{isTyping ? "Typing..." : "Ready"}</span>
            </motion.div>
          </div>
        </div>
      </div>

    </div>
  );
}
