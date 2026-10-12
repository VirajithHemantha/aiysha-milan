import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart, Maximize2, X, ChevronLeft, ChevronRight, Camera } from "lucide-react";

export interface GalleryPhoto {
  id: number;
  src: string;
  alt: string;
}

const GALLERY_PHOTOS: GalleryPhoto[] = [
  { id: 1, src: "/pre/IMG_0957.JPG.jpeg", alt: "Aiysha and Milan pre-wedding photo 1" },
  { id: 2, src: "/pre/IMG_0958.JPG.jpeg", alt: "Aiysha and Milan pre-wedding photo 2" },
  { id: 3, src: "/pre/IMG_0959.JPG.jpeg", alt: "Aiysha and Milan pre-wedding photo 3" },
  { id: 4, src: "/pre/IMG_0961.JPG.jpeg", alt: "Aiysha and Milan pre-wedding photo 4" },
  { id: 5, src: "/pre/IMG_0962.JPG.jpeg", alt: "Aiysha and Milan pre-wedding photo 5" },
];

export default function GallerySection() {
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);
  const [likedPhotos, setLikedPhotos] = useState<Record<number, boolean>>({});

  const toggleLike = (id: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setLikedPhotos((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const goPrev = useCallback(() => {
    setActivePhotoIndex((prev) =>
      prev === null ? null : (prev - 1 + GALLERY_PHOTOS.length) % GALLERY_PHOTOS.length
    );
  }, []);

  const goNext = useCallback(() => {
    setActivePhotoIndex((prev) =>
      prev === null ? null : (prev + 1) % GALLERY_PHOTOS.length
    );
  }, []);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (activePhotoIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActivePhotoIndex(null);
      else if (e.key === "ArrowLeft") goPrev();
      else if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activePhotoIndex, goPrev, goNext]);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    document.body.style.overflow = activePhotoIndex !== null ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [activePhotoIndex]);

  return (
    <section className="w-full relative py-8 md:py-16" id="gallery">
      {/* Soft backdrop aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-5xl h-[500px] bg-sage/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* Section Header */}
      <div className="text-center space-y-3 md:space-y-4 mb-10 md:mb-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex items-center justify-center gap-3 text-sage/70"
        >
          <div className="h-px w-8 md:w-16 bg-gradient-to-r from-transparent to-sage/40" />
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-sage/10 border border-sage/20 text-[10px] md:text-xs uppercase tracking-[0.3em] font-medium text-umber">
            <Camera size={13} className="text-sage animate-pulse" />
            <span>Memories &amp; Moments</span>
          </div>
          <div className="h-px w-8 md:w-16 bg-gradient-to-l from-transparent to-sage/40" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="serif italic text-3xl sm:text-5xl md:text-6xl text-sage font-light tracking-wide drop-shadow-sm"
        >
          Pre-Wedding Gallery
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="serif italic text-zinc-600 text-sm sm:text-base md:text-lg max-w-xl mx-auto leading-relaxed"
        >
          A tender glimpse into the quiet smiles, whispered promises, and cherished chapters of our story.
        </motion.p>
      </div>

      {/* ============================================================== */}
      {/* AUTO-MOVING ROW: photos glide left to right, no scrolling       */}
      {/* ============================================================== */}
      <style>{`
        @keyframes gallery-marquee-ltr {
          from { transform: translateX(-50%); }
          to   { transform: translateX(0); }
        }
        .gallery-marquee-track {
          animation: gallery-marquee-ltr 20s linear infinite;
          will-change: transform;
        }
        .gallery-marquee:hover .gallery-marquee-track {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .gallery-marquee-track { animation: none; transform: none; }
        }
      `}</style>

      <div
        className="gallery-marquee w-full overflow-hidden py-6"
        style={{
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
          maskImage:
            "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
        }}
      >
        <div className="gallery-marquee-track flex flex-row flex-nowrap w-max">
          {[0, 1].map((copy) => (
            <div
              key={copy}
              className="flex flex-row flex-nowrap items-center gap-4 md:gap-7 pr-4 md:pr-7"
              aria-hidden={copy === 1}
            >
              {GALLERY_PHOTOS.map((photo, index) => (
                <button
                  key={`${copy}-${photo.id}`}
                  type="button"
                  tabIndex={copy === 1 ? -1 : 0}
                  onClick={() => setActivePhotoIndex(index)}
                  aria-label={`Open ${photo.alt}`}
                  className="group relative shrink-0 h-[300px] sm:h-[380px] md:h-[460px]"
                >
                  {/* Print-style white mat; image keeps its natural proportions */}
                  <div className="h-full p-1.5 md:p-2.5 bg-white rounded-[1.3rem] md:rounded-[1.6rem] shadow-xl ring-1 ring-black/5 transition-shadow duration-700 group-hover:shadow-[0_25px_50px_-12px_rgba(212,175,55,0.4)]">
                    <div className="relative h-full overflow-hidden rounded-[0.9rem] md:rounded-[1.2rem] bg-[#F5EFE0]">
                      <img
                        src={photo.src}
                        alt={photo.alt}
                        draggable={false}
                        className="block h-full w-auto max-w-none"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                      {/* Like button */}
                      <span
                        role="button"
                        tabIndex={copy === 1 ? -1 : 0}
                        onClick={(e) => toggleLike(photo.id, e)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            e.stopPropagation();
                            setLikedPhotos((prev) => ({ ...prev, [photo.id]: !prev[photo.id] }));
                          }
                        }}
                        aria-label="Like photo"
                        className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-black/35 backdrop-blur-md border border-white/30 flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
                      >
                        <Heart
                          size={15}
                          className={likedPhotos[photo.id] ? "text-rose-400 fill-rose-400" : "text-white"}
                        />
                      </span>

                      {/* Zoom hint */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-11 h-11 rounded-full bg-black/35 backdrop-blur-md border border-white/40 flex items-center justify-center text-white shadow-xl scale-90 group-hover:scale-100 transition-transform">
                          <Maximize2 size={16} />
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ============================================================== */}
      {/* LIGHTBOX                                                        */}
      {/* ============================================================== */}
      <AnimatePresence>
        {activePhotoIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-2xl flex flex-col justify-between p-4 sm:p-6 md:p-8 select-none"
            onClick={() => setActivePhotoIndex(null)}
          >
            {/* Top Bar */}
            <div
              className="flex items-center justify-between w-full max-w-6xl mx-auto z-20 text-white"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3">
                <span className="serif italic text-sage text-xl md:text-2xl font-light">
                  Aiysha &amp; Milan
                </span>
                <span className="text-white/30 text-sm">|</span>
                <span className="text-xs uppercase tracking-[0.25em] font-sans text-sand font-bold">
                  {String(activePhotoIndex + 1).padStart(2, "0")} / {String(GALLERY_PHOTOS.length).padStart(2, "0")}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleLike(GALLERY_PHOTOS[activePhotoIndex].id)}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 flex items-center justify-center transition-all hover:scale-110"
                  title="Like photo"
                  aria-label="Like photo"
                >
                  <Heart
                    size={18}
                    className={likedPhotos[GALLERY_PHOTOS[activePhotoIndex].id] ? "text-rose-400 fill-rose-400" : "text-white"}
                  />
                </button>
                <button
                  onClick={() => setActivePhotoIndex(null)}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 flex items-center justify-center transition-all hover:scale-110"
                  title="Close (Esc)"
                  aria-label="Close"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Central Photo */}
            <div
              className="relative flex-1 flex items-center justify-center max-w-6xl mx-auto w-full my-3 sm:my-5"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={goPrev}
                className="absolute left-0 sm:left-2 z-30 w-11 h-11 md:w-14 md:h-14 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all hover:scale-110"
                aria-label="Previous photo"
              >
                <ChevronLeft size={28} />
              </button>

              <motion.div
                key={activePhotoIndex}
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/20 ring-1 ring-sage/30"
              >
                <img
                  src={GALLERY_PHOTOS[activePhotoIndex].src}
                  alt={GALLERY_PHOTOS[activePhotoIndex].alt}
                  className="max-h-[68vh] sm:max-h-[72vh] md:max-h-[75vh] w-auto object-contain bg-black/40"
                />
              </motion.div>

              <button
                onClick={goNext}
                className="absolute right-0 sm:right-2 z-30 w-11 h-11 md:w-14 md:h-14 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all hover:scale-110"
                aria-label="Next photo"
              >
                <ChevronRight size={28} />
              </button>
            </div>

            {/* Bottom Filmstrip */}
            <div
              className="w-full max-w-xl mx-auto flex items-center justify-center gap-2 sm:gap-3 overflow-x-auto py-1 z-20"
              onClick={(e) => e.stopPropagation()}
            >
              {GALLERY_PHOTOS.map((thumb, idx) => (
                <button
                  key={thumb.id}
                  onClick={() => setActivePhotoIndex(idx)}
                  aria-label={`Go to photo ${idx + 1}`}
                  className={`relative shrink-0 h-14 sm:h-16 rounded-lg overflow-hidden border-2 transition-all duration-300 ${idx === activePhotoIndex
                      ? "border-sage scale-105 ring-2 ring-sage shadow-lg shadow-sage/40"
                      : "border-white/30 opacity-50 hover:opacity-90"
                    }`}
                >
                  <img src={thumb.src} alt={thumb.alt} className="h-full w-auto block" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
