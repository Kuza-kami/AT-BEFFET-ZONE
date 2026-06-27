import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Image } from "lucide-react";
import { StaggeredText } from "./StaggeredText";

export function GallerySkeleton() {
  return (
    <div className="border-2 border-[#111111] rounded-md bg-white p-2 shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] animate-pulse flex flex-col">
      <div className="border-2 border-[#111111] rounded-md aspect-[4/3] bg-gray-100 flex items-center justify-center text-gray-300">
        <Image className="h-10 w-10 shrink-0" />
      </div>
      <div className="pt-3 pb-1 px-2 flex justify-center">
        <div className="h-4 bg-gray-200 w-2/3 rounded-sm"></div>
      </div>
    </div>
  );
}

export function Gallery() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      key="tab-gallery"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.1 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8"
    >
      <div className="text-center max-w-2xl mx-auto space-y-2 gsap-reveal">
        <StaggeredText
          as="h1"
          text="RESTAURANT GALLERY"
          className="font-display text-3xl sm:text-4xl font-black uppercase tracking-tight"
          segmentBy="words"
          delay={80}
          direction="bottom"
        />
        <p className="text-xs sm:text-sm text-gray-700 font-sans">
          Take a look at our vibrant restaurant atmosphere, beautifully set dining tables, and mouth-watering traditional food stations.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 gsap-reveal">
        {isLoading ? (
          // Render matching number of skeleton cards to prevent layout shift
          Array.from({ length: 3 }).map((_, i) => (
            <GallerySkeleton key={`gallery-skeleton-${i}`} />
          ))
        ) : (
          <>
            <motion.div 
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.1, type: "spring", stiffness: 100 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="border-2 border-[#111111] rounded-md bg-white p-2 shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] transition-transform"
            >
              <div className="border-2 border-[#111111] rounded-md overflow-hidden aspect-[4/3] bg-gray-100">
                <motion.img
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.4 }}
                  src="/src/assets/images/buffet_restaurant_interior_1782462273318.jpg"
                  alt="Bustling restaurant interior"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="pt-3 pb-1 px-2 font-mono font-bold text-xs uppercase text-center text-[#111111]">
                Vibrant Dining Atmosphere
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.2, type: "spring", stiffness: 100 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="border-2 border-[#111111] rounded-md bg-white p-2 shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] transition-transform"
            >
              <div className="border-2 border-[#111111] rounded-md overflow-hidden aspect-[4/3] bg-gray-100">
                <motion.img
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.4 }}
                  src="/src/assets/images/buffet_traditional_food_spread_1782462290415.jpg"
                  alt="Traditional food spread"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="pt-3 pb-1 px-2 font-mono font-bold text-xs uppercase text-center text-[#111111]">
                Delicious Food Stations
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.3, type: "spring", stiffness: 100 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="border-2 border-[#111111] rounded-md bg-white p-2 shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] transition-transform"
            >
              <div className="border-2 border-[#111111] rounded-md overflow-hidden aspect-[4/3] bg-gray-100">
                <motion.img
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.4 }}
                  src="/src/assets/images/buffet_dining_table_1782462305976.jpg"
                  alt="Beautiful dining table setup"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="pt-3 pb-1 px-2 font-mono font-bold text-xs uppercase text-center text-[#111111]">
                Elegant Table Settings
              </div>
            </motion.div>
          </>
        )}
      </div>
    </motion.div>
  );
}
