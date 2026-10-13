import { useMemo } from "react";
import { motion } from "motion/react";

// Builds a clip-path with ragged top and bottom edges, like torn paper.
// Seeded from the photo path so every photo gets its own (stable) tear.
function tornEdgeClipPath(seedText: string) {
  let seed = 0;
  for (let i = 0; i < seedText.length; i++) seed = (seed * 31 + seedText.charCodeAt(i)) >>> 0;
  const random = () => {
    seed = (seed + 0x6d2b79f5) >>> 0;
    let t = seed;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  const edge = (depth: number) => {
    const phase = random() * Math.PI * 2;
    const points: number[] = [];
    for (let x = 0; x <= 100; x += 2) {
      // slow waves give the overall rip, jitter gives the paper fibres
      const wave = Math.sin(x / 9 + phase) * 0.3 + Math.sin(x / 3.7 + phase * 2) * 0.2;
      points.push(Math.max(0, Math.min(depth, depth * (0.5 + wave) + (random() - 0.5) * depth * 0.35)));
    }
    return points;
  };

  const top = edge(7).map((y, i) => `${i * 2}% ${y.toFixed(2)}%`);
  const bottom = edge(7)
    .map((y, i) => `${i * 2}% ${(100 - y).toFixed(2)}%`)
    .reverse();
  return `polygon(${[...top, ...bottom].join(", ")})`;
}

// A single pre-wedding photo placed between page sections, framed with torn-paper edges
export default function PhotoMoment({
  src,
  alt = "Aiysha and Milan pre-wedding photo",
  position = "center",
  className = "",
}: {
  src: string;
  alt?: string;
  position?: string;
  className?: string;
}) {
  const clipPath = useMemo(() => tornEdgeClipPath(src), [src]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className={`relative w-full max-w-[460px] md:max-w-[520px] mx-auto ${className}`}
      style={{ filter: "drop-shadow(0 10px 18px rgba(61,34,21,0.22))" }}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        draggable={false}
        className="block w-full aspect-[4/5] object-cover bg-[#F5EFE0]"
        style={{ clipPath, WebkitClipPath: clipPath, objectPosition: position }}
      />
    </motion.div>
  );
}
