import React, { useRef } from 'react';
import { motion, useInView, Variants, TargetAndTransition, Transition } from 'motion/react';

export type Easing = [number, number, number, number] | "linear" | "easeIn" | "easeOut" | "easeInOut" | "circIn" | "circOut" | "circInOut" | "backIn" | "backOut" | "backInOut" | "anticipate";

export interface StaggeredTextProps {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";
  segmentBy?: "chars" | "words" | "lines";
  separator?: string;
  delay?: number;
  duration?: number;
  easing?: Easing | Easing[];
  threshold?: number;
  rootMargin?: string;
  direction?: "top" | "bottom" | "left" | "right";
  blur?: boolean;
  staggerDirection?: "forward" | "reverse" | "center";
  respectReducedMotion?: boolean;
  exitOnScrollOut?: boolean;
  from?: TargetAndTransition;
  to?: TargetAndTransition | TargetAndTransition[];
  onAnimationComplete?: () => void;
  onExitComplete?: () => void;
}

export const StaggeredText: React.FC<StaggeredTextProps> = ({
  text,
  className = "",
  as: Component = "p",
  segmentBy = "words",
  separator,
  delay = 80,
  duration = 0.6,
  easing = [0.25, 0.1, 0.25, 1], // ease out quad-ish
  threshold = 0.1,
  rootMargin = "0px",
  direction = "bottom",
  blur = true,
  staggerDirection = "forward",
  respectReducedMotion = true,
  exitOnScrollOut = false,
  from,
  to,
  onAnimationComplete,
  onExitComplete,
}) => {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: !exitOnScrollOut, amount: threshold, margin: rootMargin as any });
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const shouldReduceMotion = respectReducedMotion && prefersReducedMotion;

  let segments: string[] = [];
  
  if (separator !== undefined) {
    segments = text.split(separator);
  } else if (segmentBy === "chars") {
    segments = text.split("");
  } else if (segmentBy === "words") {
    segments = text.split(" ");
  } else if (segmentBy === "lines") {
    segments = text.split("\n");
  }

  // Create segments with space preservation for words
  const renderSegments = segmentBy === "words" ? segments.map((s, i) => s + (i === segments.length - 1 ? "" : " ")) : segments;

  const getDirectionOffset = () => {
    switch (direction) {
      case "top": return { y: -20, x: 0 };
      case "bottom": return { y: 20, x: 0 };
      case "left": return { x: -20, y: 0 };
      case "right": return { x: 20, y: 0 };
      default: return { y: 20, x: 0 };
    }
  };

  const offset = getDirectionOffset();

  const defaultFrom: TargetAndTransition = {
    opacity: 0,
    y: offset.y,
    x: offset.x,
    filter: blur ? "blur(8px)" : "blur(0px)",
  };

  const defaultTo: TargetAndTransition = {
    opacity: 1,
    y: 0,
    x: 0,
    filter: "blur(0px)",
  };

  const initial = from || defaultFrom;
  const animate = to || defaultTo;

  if (shouldReduceMotion) {
    return (
      <Component className={className} ref={ref as any}>
        {text}
      </Component>
    );
  }

  return (
    <Component className={className} ref={ref as any}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" style={{ display: "inline-block" }}>
        {renderSegments.map((segment, index) => {
          
          let segmentDelay = index * (delay / 1000);
          
          if (staggerDirection === "reverse") {
             segmentDelay = (segments.length - 1 - index) * (delay / 1000);
          } else if (staggerDirection === "center") {
             const center = Math.floor(segments.length / 2);
             segmentDelay = Math.abs(center - index) * (delay / 1000);
          }

          return (
            <motion.span
              key={index}
              initial={initial as any}
              animate={isInView ? (animate as any) : (initial as any)}
              transition={{
                duration,
                delay: segmentDelay,
                ease: easing as any,
              }}
              style={{ display: segmentBy === "lines" ? "block" : "inline-block", whiteSpace: "pre" }}
              onAnimationComplete={index === segments.length - 1 ? onAnimationComplete : undefined}
            >
              {segment === " " ? "\u00A0" : segment}
            </motion.span>
          );
        })}
      </span>
    </Component>
  );
};
