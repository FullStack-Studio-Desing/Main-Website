"use client";
import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState } from "react";

export const BackgroundBeams = ({ className }: { className?: string }) => {
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        });
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className
      )}
    >
      <svg
        className="absolute inset-0 h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="beam-gradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(191, 247, 71, 0.15)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <filter id="beam-blur">
            <feGaussianBlur in="SourceGraphic" stdDeviation="20" />
          </filter>
        </defs>

        {/* Animated beam lines */}
        <g className="opacity-40">
          {[...Array(6)].map((_, i) => (
            <line
              key={i}
              x1={`${10 + i * 18}%`}
              y1="0%"
              x2={`${mousePosition.x * 0.02 + 30 + i * 10}%`}
              y2="100%"
              stroke="url(#beam-gradient)"
              strokeWidth="2"
              className="animate-pulse"
              style={{
                animationDelay: `${i * 0.2}s`,
                animationDuration: `${2 + i * 0.3}s`,
              }}
            />
          ))}
        </g>

        {/* Glow orbs */}
        <circle
          cx={mousePosition.x || "50%"}
          cy={mousePosition.y || "50%"}
          r="300"
          fill="url(#beam-gradient)"
          filter="url(#beam-blur)"
          className="transition-all duration-500 ease-out"
        />
      </svg>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-bg-body via-transparent to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-bg-body/50 via-transparent to-transparent" />
    </div>
  );
};

export const BackgroundBeamsWithCollision = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const parentRef = useRef<HTMLDivElement>(null);

  const beams = [
    { initialX: 10, translateX: 10, duration: 7, repeatDelay: 3, delay: 2 },
    { initialX: 600, translateX: 600, duration: 3, repeatDelay: 3, delay: 4 },
    { initialX: 100, translateX: 100, duration: 7, repeatDelay: 7, className: "h-6" },
    { initialX: 400, translateX: 400, duration: 5, repeatDelay: 14, delay: 4 },
    { initialX: 800, translateX: 800, duration: 11, repeatDelay: 2, className: "h-20" },
    { initialX: 1000, translateX: 1000, duration: 4, repeatDelay: 2, className: "h-12" },
    { initialX: 1200, translateX: 1200, duration: 6, repeatDelay: 4, delay: 2, className: "h-6" },
  ];

  return (
    <div
      ref={parentRef}
      className={cn(
        "relative flex min-h-screen w-full items-center justify-center overflow-hidden",
        className
      )}
    >
      {beams.map((beam, idx) => (
        <CollisionBeam
          key={`beam-${idx}`}
          containerRef={containerRef}
          parentRef={parentRef}
          {...beam}
        />
      ))}

      {children}
      <div
        ref={containerRef}
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 w-full bg-gradient-to-t from-bg-body to-transparent"
      />
    </div>
  );
};

const CollisionBeam = ({
  containerRef,
  parentRef,
  initialX,
  translateX,
  duration,
  repeatDelay,
  delay = 0,
  className,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>;
  parentRef: React.RefObject<HTMLDivElement | null>;
  initialX: number;
  translateX: number;
  duration: number;
  repeatDelay: number;
  delay?: number;
  className?: string;
}) => {
  const beamRef = useRef<HTMLDivElement>(null);
  const [collision, setCollision] = useState<{
    detected: boolean;
    coordinates: { x: number; y: number } | null;
  }>({
    detected: false,
    coordinates: null,
  });
  const [beamKey, setBeamKey] = useState(0);
  const [cycleCollisionDetected, setCycleCollisionDetected] = useState(false);

  useEffect(() => {
    const checkCollision = () => {
      if (
        beamRef.current &&
        containerRef.current &&
        parentRef.current &&
        !cycleCollisionDetected
      ) {
        const beamRect = beamRef.current.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();
        const parentRect = parentRef.current.getBoundingClientRect();

        if (beamRect.bottom >= containerRect.top) {
          const relativeX = beamRect.left - parentRect.left + beamRect.width / 2;
          const relativeY = beamRect.bottom - parentRect.top;

          setCollision({
            detected: true,
            coordinates: { x: relativeX, y: relativeY },
          });
          setCycleCollisionDetected(true);
        }
      }
    };

    const animationInterval = setInterval(checkCollision, 50);

    return () => clearInterval(animationInterval);
  }, [cycleCollisionDetected, containerRef, parentRef]);

  useEffect(() => {
    if (collision.detected && collision.coordinates) {
      setTimeout(() => {
        setCollision({ detected: false, coordinates: null });
        setCycleCollisionDetected(false);
      }, 2000);

      setTimeout(() => {
        setBeamKey((prev) => prev + 1);
      }, 2000);
    }
  }, [collision]);

  return (
    <>
      <div
        key={beamKey}
        ref={beamRef}
        className={cn(
          "absolute left-0 top-0 h-14 w-px rounded-full bg-gradient-to-t from-theme via-theme/50 to-transparent",
          className
        )}
        style={
          {
            left: `${initialX}px`,
            animation: `beam-animation ${duration}s linear ${delay}s infinite`,
            "--translate-x": `${translateX}px`,
          } as React.CSSProperties
        }
      />
      {collision.detected && collision.coordinates && (
        <Explosion
          key={`explosion-${beamKey}`}
          style={{
            left: `${collision.coordinates.x}px`,
            top: `${collision.coordinates.y}px`,
            transform: "translate(-50%, -50%)",
          }}
        />
      )}
    </>
  );
};

const Explosion = ({ style }: { style: React.CSSProperties }) => {
  const spans = Array.from({ length: 20 }, (_, index) => ({
    id: index,
    direction: Math.random() * 360,
    distance: Math.random() * 80 + 20,
    duration: Math.random() * 0.5 + 0.5,
  }));

  return (
    <div className="absolute z-50 h-2 w-2" style={style}>
      <div className="absolute -translate-x-1/2 -translate-y-1/2">
        {spans.map((span) => (
          <span
            key={span.id}
            className="absolute h-1 w-1 rounded-full bg-theme"
            style={{
              animation: `explosion ${span.duration}s ease-out forwards`,
              transform: `rotate(${span.direction}deg) translateY(0)`,
              "--explosion-distance": `${span.distance}px`,
            } as React.CSSProperties}
          />
        ))}
      </div>
    </div>
  );
};
