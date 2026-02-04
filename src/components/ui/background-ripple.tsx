"use client";
import React, { useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export const BackgroundRippleEffect = ({
  rows = 8,
  cols = 27,
  cellSize = 56,
  className,
}: {
  rows?: number;
  cols?: number;
  cellSize?: number;
  className?: string;
}) => {
  const [clickedCell, setClickedCell] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [rippleKey, setRippleKey] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      className={cn(
        "absolute inset-0 h-full w-full overflow-hidden",
        className
      )}
    >
      <div className="relative h-full w-full overflow-hidden">
        <div className="pointer-events-none absolute inset-0 z-[2] h-full w-full overflow-hidden" />
        {/* Edge fade masks */}
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-[3] w-80"
          style={{ background: 'linear-gradient(to right, #050505 0%, #050505 20%, transparent 100%)' }}
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-[3] w-80"
          style={{ background: 'linear-gradient(to left, #050505 0%, #050505 20%, transparent 100%)' }}
        />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-[3] h-40"
          style={{ background: 'linear-gradient(to bottom, #050505 0%, transparent 100%)' }}
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] h-40"
          style={{ background: 'linear-gradient(to top, #050505 0%, transparent 100%)' }}
        />
        <DivGrid
          key={`base-${rippleKey}`}
          className="opacity-100"
          rows={rows}
          cols={cols}
          cellSize={cellSize}
          borderColor="rgba(191, 247, 71, 0.18)"
          fillColor="rgba(191, 247, 71, 0.025)"
          clickedCell={clickedCell}
          onCellClick={(row, col) => {
            setClickedCell({ row, col });
            setRippleKey((k) => k + 1);
          }}
          interactive
        />
      </div>
    </div>
  );
};

type DivGridProps = {
  className?: string;
  rows: number;
  cols: number;
  cellSize: number;
  borderColor: string;
  fillColor: string;
  clickedCell: { row: number; col: number } | null;
  onCellClick?: (row: number, col: number) => void;
  interactive?: boolean;
};

const DivGrid = ({
  className,
  rows = 7,
  cols = 30,
  cellSize = 56,
  borderColor = "rgba(191, 247, 71, 0.15)",
  fillColor = "rgba(191, 247, 71, 0.02)",
  clickedCell = null,
  onCellClick = () => {},
  interactive = true,
}: DivGridProps) => {
  const cells = useMemo(
    () => Array.from({ length: rows * cols }, (_, idx) => idx),
    [rows, cols]
  );

  const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
    gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
    width: cols * cellSize,
    height: rows * cellSize,
    marginInline: "auto",
  };

  return (
    <div className={cn("relative z-[1]", className)} style={gridStyle}>
      {cells.map((idx) => {
        const rowIdx = Math.floor(idx / cols);
        const colIdx = idx % cols;
        const distance = clickedCell
          ? Math.hypot(clickedCell.row - rowIdx, clickedCell.col - colIdx)
          : 0;
        const delay = clickedCell ? Math.max(0, distance * 55) : 0;
        const duration = 200 + distance * 80;

        const style: React.CSSProperties = clickedCell
          ? {
              animationDelay: `${delay}ms`,
              animationDuration: `${duration}ms`,
              backgroundColor: fillColor,
              borderColor: borderColor,
            }
          : {
              backgroundColor: fillColor,
              borderColor: borderColor,
            };

        return (
          <div
            key={idx}
            className={cn(
              "cell relative border-[0.5px] opacity-50 transition-opacity duration-150 will-change-transform hover:opacity-80",
              "shadow-[0px_0px_40px_1px_rgba(191,247,71,0.06)_inset]",
              clickedCell && "animate-cell-ripple",
              !interactive && "pointer-events-none"
            )}
            style={style}
            onClick={
              interactive ? () => onCellClick?.(rowIdx, colIdx) : undefined
            }
          />
        );
      })}
    </div>
  );
};

// Non-interactive version for pure background decoration
export const BackgroundRippleStatic = ({
  rows = 6,
  cols = 20,
  cellSize = 64,
  className,
}: {
  rows?: number;
  cols?: number;
  cellSize?: number;
  className?: string;
}) => {
  const cells = useMemo(
    () => Array.from({ length: rows * cols }, (_, idx) => idx),
    [rows, cols]
  );

  const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
    gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
    width: cols * cellSize,
    height: rows * cellSize,
    marginInline: "auto",
  };

  return (
    <div
      className={cn(
        "absolute inset-0 h-full w-full overflow-hidden pointer-events-none",
        className
      )}
    >
      <div
        className="relative z-[1] opacity-40"
        style={gridStyle}
      >
        {cells.map((idx) => (
          <div
            key={idx}
            className="border-[0.5px] transition-opacity duration-300 hover:opacity-80 shadow-[0px_0px_30px_1px_rgba(191,247,71,0.03)_inset]"
            style={{
              backgroundColor: "rgba(191, 247, 71, 0.01)",
              borderColor: "rgba(191, 247, 71, 0.08)",
            }}
          />
        ))}
      </div>
    </div>
  );
};
