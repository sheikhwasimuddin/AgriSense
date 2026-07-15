import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface GaugeProps {
  value: number;
  min?: number;
  max?: number;
  label?: string;
  unit?: string;
  size?: number;
  strokeWidth?: number;
  colorClass?: string;
  className?: string;
}

export function Gauge({
  value,
  min = 0,
  max = 100,
  label,
  unit = "",
  size = 120,
  strokeWidth = 12,
  colorClass = "text-emerald-500",
  className,
}: GaugeProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const safeValue = Math.min(Math.max(value, min), max);
  const percent = (safeValue - min) / (max - min);
  const offset = circumference - percent * circumference;

  return (
    <div className={cn("relative flex flex-col items-center justify-center", className)} style={{ width: size, height: size }}>
      {/* Outer Neumorphic ring */}
      <div className="absolute inset-0 rounded-full neo-box-sm" />
      
      {/* Inner Neumorphic well */}
      <div 
        className="absolute rounded-full neo-inset"
        style={{
          inset: strokeWidth * 1.5,
        }}
      />

      <svg
        width={size}
        height={size}
        className="transform -rotate-90 absolute inset-0 z-10"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="transparent"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          strokeLinecap="round"
          className={colorClass}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </svg>
      
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
        <span className="text-xl font-bold tracking-tight text-foreground">
          {Number.isInteger(value) ? value : value.toFixed(1)}
          <span className="text-sm font-medium text-muted-foreground ml-0.5">{unit}</span>
        </span>
        {label && (
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
