import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Search, X, FileDown } from "lucide-react";
import { StaggeredText } from "./StaggeredText";
import { FoodCard } from "./FoodCard";
import { MENU_ITEMS } from "../types";
import { generateMenuPDF } from "../utils/pdfGenerator";
import { triggerToast } from "./ToastNotification";

interface MenuProps {
  selectedMenuCategory: string;
  setSelectedMenuCategory: (category: string) => void;
}

export function MenuSkeleton() {
  return (
    <div className="bg-white border-2 border-[#111111] rounded-md shadow-sm overflow-hidden flex flex-col animate-pulse">
      {/* Top Image placeholder with a simulated price tag */}
      <div className="h-48 w-full border-b-2 border-[#111111] bg-gray-100 relative">
        <div className="absolute top-4 right-4 bg-gray-200 border-2 border-[#111111] rounded-md w-14 h-6 shadow-[2px_2px_0px_0px_rgba(17,17,17,1)]"></div>
      </div>
      
      {/* Content */}
      <div className="p-6 flex flex-col flex-grow items-center text-center space-y-4">
        {/* Divider with Icon placeholder */}
        <div className="flex items-center justify-center space-x-3 w-full">
          <div className="h-[1px] bg-gray-200 flex-grow max-w-[40px]"></div>
          <div className="w-5 h-5 bg-gray-200 rounded-full shrink-0"></div>
          <div className="h-[1px] bg-gray-200 flex-grow max-w-[40px]"></div>
        </div>

        {/* Title & Tags */}
        <div className="space-y-2.5 w-full flex flex-col items-center">
          {/* Main Title bar */}
          <div className="h-6 bg-gray-200 w-3/4 rounded-sm"></div>
          
          {/* Tags (three small pills) */}
          <div className="flex items-center justify-center space-x-2">
            <div className="h-3 bg-gray-100 w-12 rounded-full"></div>
            <span className="text-[10px] text-gray-200">•</span>
            <div className="h-3 bg-gray-100 w-12 rounded-full"></div>
            <span className="text-[10px] text-gray-200">•</span>
            <div className="h-3 bg-gray-100 w-12 rounded-full"></div>
          </div>
        </div>

        {/* Description lines */}
        <div className="space-y-2 w-full flex flex-col items-center">
          <div className="h-3.5 bg-gray-100 w-full rounded-sm"></div>
          <div className="h-3.5 bg-gray-100 w-11/12 rounded-sm"></div>
          <div className="h-3.5 bg-gray-100 w-4/5 rounded-sm"></div>
        </div>

        <div className="flex-grow"></div>

        {/* Action Buttons styled like actual FoodCard buttons */}
        <div className="flex items-center justify-center space-x-3 w-full pt-2 mt-auto">
          <div className="flex-1 h-11 bg-gray-100 border-2 border-[#111111] rounded-md shadow-[2px_2px_0px_0px_rgba(17,17,17,1)]"></div>
          <div className="flex-1 h-11 bg-gray-200 border-2 border-[#111111] rounded-md shadow-[2px_2px_0px_0px_rgba(17,17,17,1)]"></div>
        </div>
      </div>
    </div>
  );
}

export function Menu({
  selectedMenuCategory,
  setSelectedMenuCategory
}: MenuProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Trigger a brief simulated API fetch when the category is selected or component mounts
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [selectedMenuCategory]);

  const filteredDishes = MENU_ITEMS.filter(item => {
    const matchesCategory = selectedMenuCategory === "all" || item.category === selectedMenuCategory;
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.xhosaName && item.xhosaName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <motion.div
      key="tab-menu"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.1 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8"
    >
      <div className="text-center max-w-2xl mx-auto space-y-4 gsap-reveal">
        <div className="space-y-2">
          <StaggeredText
            as="h1"
            text="OUR FULL MENU"
            className="font-display text-3xl sm:text-4xl font-black uppercase tracking-tight"
            segmentBy="words"
            delay={80}
            direction="bottom"
          />
          <p className="text-xs sm:text-sm text-gray-700 font-sans">
            Our all-you-can-eat lunch buffet is R135 per person, and the breakfast buffet is R75. You can also order individual custom takeaway plates below.
          </p>
        </div>

        <div className="pt-1">
          <button
            onClick={() => {
              triggerToast("Generating your PDF menu... Please wait.", "info");
              try {
                generateMenuPDF(MENU_ITEMS);
                triggerToast("Traditional Menu PDF downloaded successfully! 📄", "success");
              } catch (err) {
                console.error(err);
                triggerToast("Failed to generate PDF. Please try again.", "warning");
              }
            }}
            className="inline-flex items-center space-x-2 px-5 py-2.5 border-2 border-[#111111] rounded-md bg-[#ffbd12] text-black font-display font-black text-xs uppercase tracking-wider hover:bg-black hover:text-white transition-all duration-200 cursor-pointer shadow-[3px_3px_0px_0px_rgba(17,17,17,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_rgba(17,17,17,1)]"
          >
            <FileDown className="h-4 w-4 shrink-0" />
            <span>DOWNLOAD PDF MENU</span>
          </button>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="max-w-md mx-auto gsap-reveal">
        <div className="relative border-2 border-[#111111] rounded-md bg-white shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] focus-within:shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] transition-all">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-[#111111]" />
          </div>
          <input
            type="text"
            placeholder="Search our delicious dishes (e.g. Mogodu)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-10 py-3 text-sm font-sans text-black placeholder-gray-500 bg-transparent border-none focus:outline-none focus:ring-0"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-[#e62419] cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap justify-center gap-2 border-b-2 border-[#111111] pb-4 gsap-reveal">
        {[
          { key: "all", label: "ALL CATEGORIES" },
          { key: "traditional", label: "SIGNATURE SPECIALTIES" },
          { key: "breakfast", label: "BREAKFAST BUFFET" },
          { key: "lunch_meats", label: "BUFFET MEATS" },
          { key: "lunch_veggies", label: "VEGGIES & SIDES" },
          { key: "dessert", label: "DESSERTS" },
          { key: "beverage", label: "TRADITIONAL DRINKS" }
        ].map(cat => (
          <button
            key={cat.key}
            onClick={() => setSelectedMenuCategory(cat.key)}
            className={`px-4 py-2 border-2 border-[#111111] rounded-md font-display font-bold text-xs uppercase transition cursor-pointer ${
              selectedMenuCategory === cat.key 
                ? "bg-[#e62419] text-white" 
                : "bg-white text-black hover:bg-gray-100"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Menu Items Grid */}
      {filteredDishes.length === 0 && !isLoading ? (
        <div className="text-center py-12 border-2 border-dashed border-[#111111] bg-[#faf6ee] rounded-md gsap-reveal">
          <p className="font-display font-black text-lg uppercase text-gray-700">No dishes match your search</p>
          <p className="text-xs text-gray-500 font-sans mt-2">Try clearing your filters or search query to explore more!</p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedMenuCategory("all");
            }}
            className="mt-4 px-4 py-2 border-2 border-[#111111] rounded-md font-display font-bold text-xs uppercase bg-[#e62419] text-white hover:bg-black transition cursor-pointer"
          >
            Clear Search & Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
          {isLoading ? (
            // Render matching number of skeleton cards to prevent layout shift
            Array.from({ length: Math.max(3, filteredDishes.length) }).map((_, i) => (
              <MenuSkeleton key={`menu-skeleton-${i}`} />
            ))
          ) : (
            filteredDishes.map((dish, index) => (
              <FoodCard key={dish.id} dish={dish} index={index} />
            ))
          )}
        </div>
      )}
    </motion.div>
  );
}
