"use client";

import { useEffect, useRef, useState } from "react";
import createGlobe from "cobe";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/lib/hooks";

interface GlobeProps {
  className?: string;
  config?: Partial<GlobeConfig>;
}

interface GlobeConfig {
  width: number;
  height: number;
  onRender: (state: { phi: number }) => void;
  devicePixelRatio: number;
  phi: number;
  theta: number;
  dark: number;
  diffuse: number;
  mapSamples: number;
  mapBrightness: number;
  baseColor: [number, number, number];
  markerColor: [number, number, number];
  glowColor: [number, number, number];
  markers: { location: [number, number]; size: number }[];
}

const defaultConfig: Omit<GlobeConfig, "width" | "height" | "onRender"> = {
  devicePixelRatio: 2,
  phi: 0,
  theta: 0.3,
  dark: 1,
  diffuse: 0.4,
  mapSamples: 16000,
  mapBrightness: 1.2,
  baseColor: [0.3, 0.3, 0.3],
  markerColor: [0.75, 0.97, 0.28], // theme color (BFF747)
  glowColor: [0.3, 0.4, 0.1],
  markers: [
    { location: [14.5995, 120.9842], size: 0.03 }, // Manila
    { location: [19.076, 72.8777], size: 0.05 }, // Mumbai
    { location: [23.8103, 90.4125], size: 0.04 }, // Dhaka
    { location: [40.7128, -74.006], size: 0.07 }, // New York
    { location: [34.0522, -118.2437], size: 0.06 }, // Los Angeles
    { location: [51.5074, -0.1278], size: 0.06 }, // London
    { location: [48.8566, 2.3522], size: 0.05 }, // Paris
    { location: [35.6762, 139.6503], size: 0.06 }, // Tokyo
    { location: [22.3193, 114.1694], size: 0.05 }, // Hong Kong
    { location: [1.3521, 103.8198], size: 0.04 }, // Singapore
    { location: [-33.8688, 151.2093], size: 0.05 }, // Sydney
    { location: [55.7558, 37.6173], size: 0.05 }, // Moscow
    { location: [52.52, 13.405], size: 0.05 }, // Berlin
    { location: [-23.5505, -46.6333], size: 0.06 }, // Sao Paulo
    { location: [25.2048, 55.2708], size: 0.05 }, // Dubai
  ],
};

export function Globe({ className, config = {} }: GlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);
  const [r, setR] = useState(0);
  const isMobile = useIsMobile();

  const updatePointerInteraction = (value: number | null) => {
    pointerInteracting.current = value;
    if (canvasRef.current) {
      canvasRef.current.style.cursor = value ? "grabbing" : "grab";
    }
  };

  const updateMovement = (clientX: number) => {
    if (pointerInteracting.current !== null) {
      const delta = clientX - pointerInteracting.current;
      pointerInteractionMovement.current = delta;
      setR(delta / 200);
    }
  };

  useEffect(() => {
    let phi = 0;
    let width = 0;

    const onResize = () => {
      if (canvasRef.current) {
        width = canvasRef.current.offsetWidth;
      }
    };

    window.addEventListener("resize", onResize);
    onResize();

    const dpr = isMobile ? 1 : 2;
    const globe = createGlobe(canvasRef.current!, {
      ...defaultConfig,
      ...config,
      devicePixelRatio: dpr,
      mapSamples: isMobile ? 8000 : defaultConfig.mapSamples,
      width: width * dpr,
      height: width * dpr,
      onRender: (state) => {
        if (!pointerInteracting.current) {
          phi += 0.005;
        }
        state.phi = phi + r;
      },
    });

    setTimeout(() => {
      if (canvasRef.current) {
        canvasRef.current.style.opacity = "1";
      }
    }, 0);

    return () => {
      globe.destroy();
      window.removeEventListener("resize", onResize);
    };
  }, [r, config, isMobile]);

  return (
    <div
      className={cn(
        "absolute inset-0 flex items-center justify-center",
        className
      )}
    >
      <canvas
        ref={canvasRef}
        onPointerDown={(e) =>
          updatePointerInteraction(e.clientX - pointerInteractionMovement.current)
        }
        onPointerUp={() => updatePointerInteraction(null)}
        onPointerOut={() => updatePointerInteraction(null)}
        onMouseMove={(e) => updateMovement(e.clientX)}
        onTouchMove={(e) =>
          e.touches[0] && updateMovement(e.touches[0].clientX)
        }
        className="h-full w-full opacity-0 transition-opacity duration-500 [contain:layout_paint_size]"
        style={{ cursor: "grab" }}
      />
    </div>
  );
}

export function GlobeDemo() {
  return (
    <div className="relative flex size-full max-w-lg items-center justify-center overflow-hidden rounded-lg px-40 pb-40 pt-8 md:pb-60">
      <span className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-text-header to-text-muted bg-clip-text text-center text-8xl font-semibold leading-none text-transparent">
        Global
      </span>
      <Globe className="top-28" />
      <div className="pointer-events-none absolute inset-0 h-full bg-[radial-gradient(circle_at_50%_200%,rgba(0,0,0,0.2),rgba(255,255,255,0))]" />
    </div>
  );
}
