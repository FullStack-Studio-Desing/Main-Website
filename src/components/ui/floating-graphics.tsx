"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Floating geometric shapes with animation
export function FloatingShapes({ className }: { className?: string }) {
  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      {/* Large rotating ring - hidden on mobile to prevent overflow */}
      <motion.div
        className="absolute right-0 lg:-right-20 top-1/4 h-80 w-80 rounded-full border border-theme/10 hidden md:block"
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute right-0 lg:-right-16 top-1/4 mt-4 ml-4 h-72 w-72 rounded-full border border-theme/5 hidden md:block"
        animate={{ rotate: -360 }}
        transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
      />

      {/* Floating cubes */}
      <motion.div
        className="absolute left-[10%] top-[20%] h-4 w-4 rotate-45 border border-theme/20 bg-theme/5"
        animate={{ y: [0, -20, 0], rotate: [45, 90, 45] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-[15%] top-[30%] h-6 w-6 rotate-12 border border-theme-accent/20 bg-theme-accent/5"
        animate={{ y: [0, 15, 0], rotate: [12, -12, 12] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute left-[20%] bottom-[25%] h-3 w-3 rotate-45 border border-theme/30"
        animate={{ y: [0, -10, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Glowing orbs */}
      <motion.div
        className="absolute right-[25%] bottom-[20%] h-2 w-2 rounded-full bg-theme/40 blur-sm"
        animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute left-[30%] top-[40%] h-3 w-3 rounded-full bg-theme-accent/30 blur-sm"
        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
    </div>
  );
}

// Code-like decorative lines
export function CodeLines({ className }: { className?: string }) {
  return (
    <div className={cn("absolute pointer-events-none", className)}>
      <div className="space-y-2 font-mono text-[10px] opacity-20">
        <motion.div
          className="text-theme"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 0.2, x: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          {"const success = await build();"}
        </motion.div>
        <motion.div
          className="text-theme-accent"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 0.15, x: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          {"if (success) deploy();"}
        </motion.div>
        <motion.div
          className="text-text-muted"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 0.1, x: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          {"// Ship it 🚀"}
        </motion.div>
      </div>
    </div>
  );
}

// Gradient mesh background
export function GradientMesh({ className }: { className?: string }) {
  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      <svg className="absolute h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <radialGradient id="mesh1" cx="20%" cy="30%" r="50%">
            <stop offset="0%" stopColor="rgba(191, 247, 71, 0.08)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <radialGradient id="mesh2" cx="80%" cy="70%" r="50%">
            <stop offset="0%" stopColor="rgba(40, 233, 140, 0.06)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
        <rect x="0" y="0" width="100" height="100" fill="url(#mesh1)" />
        <rect x="0" y="0" width="100" height="100" fill="url(#mesh2)" />
      </svg>
    </div>
  );
}

// Animated grid pattern
export function AnimatedGrid({ className }: { className?: string }) {
  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(191, 247, 71, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(191, 247, 71, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
        animate={{
          backgroundPosition: ["0px 0px", "50px 50px"],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );
}

// Floating tech icons
export function FloatingIcons({ className }: { className?: string }) {
  const icons = [
    { icon: "⚛", delay: 0, x: "10%", y: "20%" },
    { icon: "▲", delay: 0.5, x: "85%", y: "15%" },
    { icon: "◆", delay: 1, x: "75%", y: "70%" },
    { icon: "○", delay: 1.5, x: "15%", y: "75%" },
    { icon: "□", delay: 2, x: "50%", y: "85%" },
  ];

  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      {icons.map((item, i) => (
        <motion.div
          key={i}
          className="absolute text-xl text-theme/10"
          style={{ left: item.x, top: item.y }}
          animate={{
            y: [0, -15, 0],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            ease: "easeInOut",
            delay: item.delay,
          }}
        >
          {item.icon}
        </motion.div>
      ))}
    </div>
  );
}

// Decorative lines connecting elements
export function ConnectorLines({ className }: { className?: string }) {
  return (
    <svg className={cn("absolute inset-0 pointer-events-none", className)} viewBox="0 0 100 100" preserveAspectRatio="none">
      <defs>
        <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(191, 247, 71, 0)" />
          <stop offset="50%" stopColor="rgba(191, 247, 71, 0.15)" />
          <stop offset="100%" stopColor="rgba(191, 247, 71, 0)" />
        </linearGradient>
      </defs>
      <motion.line
        x1="10"
        y1="20"
        x2="90"
        y2="80"
        stroke="url(#lineGrad)"
        strokeWidth="0.1"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, ease: "easeInOut" }}
      />
      <motion.line
        x1="90"
        y1="20"
        x2="10"
        y2="80"
        stroke="url(#lineGrad)"
        strokeWidth="0.1"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, ease: "easeInOut", delay: 0.5 }}
      />
    </svg>
  );
}

// Seeded random number generator for consistent values
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Floating particles
export function Particles({ count = 20, className }: { count?: number; className?: string }) {
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  // Generate stable particle data using seeded random
  const particles = React.useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: seededRandom(i * 1.1) * 100,
      y: seededRandom(i * 2.2) * 100,
      size: seededRandom(i * 3.3) * 3 + 1,
      duration: seededRandom(i * 4.4) * 10 + 10,
      delay: seededRandom(i * 5.5) * 5,
    }));
  }, [count]);

  if (!isMounted) {
    return null;
  }

  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-theme/20"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: p.delay,
          }}
        />
      ))}
    </div>
  );
}

// Circuit board pattern
export function CircuitPattern({ className }: { className?: string }) {
  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none opacity-[0.03]", className)}>
      <svg className="h-full w-full" viewBox="0 0 200 200">
        <pattern id="circuit" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
          {/* Horizontal lines */}
          <line x1="0" y1="25" x2="20" y2="25" stroke="currentColor" strokeWidth="1" className="text-theme" />
          <line x1="30" y1="25" x2="50" y2="25" stroke="currentColor" strokeWidth="1" className="text-theme" />
          {/* Vertical lines */}
          <line x1="25" y1="0" x2="25" y2="20" stroke="currentColor" strokeWidth="1" className="text-theme" />
          <line x1="25" y1="30" x2="25" y2="50" stroke="currentColor" strokeWidth="1" className="text-theme" />
          {/* Nodes */}
          <circle cx="25" cy="25" r="3" fill="currentColor" className="text-theme" />
          <circle cx="10" cy="25" r="2" fill="currentColor" className="text-theme-accent" />
          <circle cx="40" cy="25" r="2" fill="currentColor" className="text-theme-accent" />
        </pattern>
        <rect x="0" y="0" width="100%" height="100%" fill="url(#circuit)" />
      </svg>
    </div>
  );
}

// Hexagon grid
export function HexagonGrid({ className }: { className?: string }) {
  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      <svg className="h-full w-full opacity-[0.03]" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id="hexagons" width="28" height="49" patternUnits="userSpaceOnUse" patternTransform="scale(0.5)">
            <path
              d="M14 0 L28 8 L28 24 L14 32 L0 24 L0 8 Z M14 49 L28 41 L28 57 L14 65 L0 57 L0 41 Z M0 16 L0 32 L-14 40 L-14 24 Z M28 16 L28 32 L42 40 L42 24 Z M0 49 L0 65 L-14 73 L-14 57 Z M28 49 L28 65 L42 73 L42 57 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              className="text-theme"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hexagons)" />
      </svg>
    </div>
  );
}

// 3D perspective grid
export function PerspectiveGrid({ className }: { className?: string }) {
  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      <div
        className="absolute bottom-0 left-0 right-0 h-[50%] opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(191, 247, 71, 0.1) 1px, transparent 1px),
            linear-gradient(to top, rgba(191, 247, 71, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          transform: "perspective(500px) rotateX(60deg)",
          transformOrigin: "bottom",
        }}
      />
    </div>
  );
}

// Glowing border effect
export function GlowingBorder({ className, children }: { className?: string; children?: React.ReactNode }) {
  return (
    <div className={cn("relative", className)}>
      <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-theme/50 via-theme-accent/50 to-theme/50 opacity-20 blur-sm" />
      <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-theme/20 via-theme-accent/20 to-theme/20" />
      <div className="relative rounded-2xl bg-bg-body">{children}</div>
    </div>
  );
}

// Animated corner accents
export function CornerAccents({ className }: { className?: string }) {
  return (
    <div className={cn("absolute inset-0 pointer-events-none", className)}>
      {/* Top left */}
      <motion.div
        className="absolute top-4 left-4 h-16 w-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute top-0 left-0 h-px w-8 bg-gradient-to-r from-theme to-transparent" />
        <div className="absolute top-0 left-0 h-8 w-px bg-gradient-to-b from-theme to-transparent" />
      </motion.div>

      {/* Top right */}
      <motion.div
        className="absolute top-4 right-4 h-16 w-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
      >
        <div className="absolute top-0 right-0 h-px w-8 bg-gradient-to-l from-theme to-transparent" />
        <div className="absolute top-0 right-0 h-8 w-px bg-gradient-to-b from-theme to-transparent" />
      </motion.div>

      {/* Bottom left */}
      <motion.div
        className="absolute bottom-4 left-4 h-16 w-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.4 }}
      >
        <div className="absolute bottom-0 left-0 h-px w-8 bg-gradient-to-r from-theme to-transparent" />
        <div className="absolute bottom-0 left-0 h-8 w-px bg-gradient-to-t from-theme to-transparent" />
      </motion.div>

      {/* Bottom right */}
      <motion.div
        className="absolute bottom-4 right-4 h-16 w-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.6 }}
      >
        <div className="absolute bottom-0 right-0 h-px w-8 bg-gradient-to-l from-theme to-transparent" />
        <div className="absolute bottom-0 right-0 h-8 w-px bg-gradient-to-t from-theme to-transparent" />
      </motion.div>
    </div>
  );
}

// Data visualization decorative element
export function DataViz({ className }: { className?: string }) {
  const bars = [40, 65, 45, 80, 55, 70, 90, 60, 75, 50];

  return (
    <div className={cn("flex items-end gap-1 h-20", className)}>
      {bars.map((height, i) => (
        <motion.div
          key={i}
          className="w-2 rounded-t bg-gradient-to-t from-theme/20 to-theme/60"
          initial={{ height: 0 }}
          animate={{ height: `${height}%` }}
          transition={{
            duration: 0.5,
            delay: i * 0.05,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

// Orbiting dots
export function OrbitingDots({ className }: { className?: string }) {
  return (
    <div className={cn("relative h-40 w-40", className)}>
      {/* Center dot */}
      <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-theme/50" />

      {/* Orbit 1 */}
      <motion.div
        className="absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2"
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rounded-full bg-theme/40" />
      </motion.div>

      {/* Orbit 2 */}
      <motion.div
        className="absolute left-1/2 top-1/2 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2"
        animate={{ rotate: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-theme-accent/40" />
      </motion.div>

      {/* Orbit rings */}
      <div className="absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 rounded-full border border-theme/10" />
      <div className="absolute left-1/2 top-1/2 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-theme/5" />
    </div>
  );
}
