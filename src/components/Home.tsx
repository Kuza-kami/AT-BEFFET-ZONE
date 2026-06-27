import React, { useRef, useEffect } from "react";
import { Utensils } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Import local images and video as ES Modules to resolve correctly in production builds
import chairImg from "../assets/images/arch-dining-chair-black-d575fc5ab556b8a4161a6a716397a436.jpg";
import braaiMeatImg from "../assets/images/braai_meat_1782499481725.jpg";
import papChakalakaImg from "../assets/images/pap_chakalaka_1782499501801.jpg";
import mogoduTripeImg from "../assets/images/mogodu_tripe_1782499516640.jpg";
import oxtailStewImg from "../assets/images/oxtail_stew_1782499528034.jpg";
import traditionalSpreadImg from "../assets/images/buffet_traditional_food_spread_1782462290415.jpg";
import heroVideo from "../assets/images/8477270-hd_1920_1080_24fps.mp4";

gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);
import { StaggeredText } from "./StaggeredText";
import { FoodCard } from "./FoodCard";
import Swiper from "./Swiper";
import { MENU_ITEMS } from "../types";

interface HomeProps {
  setActiveTab: (tab: "home" | "menu" | "catering" | "reviews" | "contact" | "gallery") => void;
  setSelectedMenuCategory: (category: string) => void;
  handleMagneticMove: (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  handleMagneticLeave: (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
}

export function Home({
  setActiveTab,
  setSelectedMenuCategory,
  handleMagneticMove,
  handleMagneticLeave
}: HomeProps) {
  const videoSectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: videoSectionRef,
    offset: ["start 90%", "center center"]
  });

  const videoCardMaxWidth = useTransform(scrollYProgress, [0, 1], ["100%", "1280px"]);
  const videoCardPaddingX = useTransform(scrollYProgress, [0, 1], ["0px", "clamp(16px, 4vw, 32px)"]);

  const textPathRef = useRef<SVGTextPathElement>(null);
  const cateringGridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cateringGridRef.current) {
      const children = cateringGridRef.current.children;
      gsap.fromTo(children, 
        { opacity: 0, y: 50 },
        {
          opacity: 1, 
          y: 0, 
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cateringGridRef.current,
            start: "top 85%",
            once: true
          }
        }
      );
    }
  }, []);

  useEffect(() => {
    if (textPathRef.current) {
      gsap.to(textPathRef.current, {
        attr: { startOffset: "-2000" },
        ease: "none",
        duration: 80, // slow down to make it smooth
        repeat: -1
      });
    }
  }, []);

  return (
    <motion.div
      key="tab-home"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.1 }}
      className="pb-20"
    >
      {/* Minimalist Hero Section */}
      <section className="bg-white min-h-[80vh] flex items-center relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col md:flex-row items-center justify-between h-full relative z-10">
          <div className="flex flex-col items-center md:items-start w-full pt-32 pb-20 md:py-0 gsap-reveal">
            {/* Desktop Layout */}
            <div className="hidden md:flex font-display font-black md:text-[8rem] tracking-tighter uppercase leading-none text-[#111111] mt-[-1rem] flex-wrap items-baseline z-20">
              <StaggeredText
                as="span"
                text="BUFFE"
                className="font-display font-black md:text-[8rem] tracking-tighter uppercase leading-none text-[#111111]"
                segmentBy="chars"
                delay={80}
                direction="bottom"
              />
              <span className="relative inline-block">
                {/* AT is positioned above T */}
                <StaggeredText
                  as="span"
                  text="AT"
                  className="absolute bottom-full left-0 mb-3 font-display font-semibold md:text-6xl tracking-tight leading-none text-[#111111] whitespace-nowrap"
                  segmentBy="chars"
                  delay={60}
                  direction="bottom"
                />
                {/* T itself */}
                <StaggeredText
                  as="span"
                  text="T"
                  className="font-display font-black md:text-[8rem] tracking-tighter uppercase leading-none text-[#111111]"
                  segmentBy="chars"
                  delay={150}
                  direction="bottom"
                />
                {/* ZONE is positioned starting at T */}
                <StaggeredText
                  as="span"
                  text="ZONE"
                  className="absolute top-full left-0 mt-[-1.5rem] font-display font-medium md:text-[8rem] tracking-tighter uppercase leading-none text-[#111111] whitespace-nowrap"
                  segmentBy="chars"
                  delay={100}
                  direction="bottom"
                />
              </span>
            </div>
            {/* Spacer to reserve height for absolutely positioned ZONE on desktop */}
            <div className="hidden md:block h-[6.5rem] pointer-events-none" />

            {/* Mobile Layout */}
            <div className="flex md:hidden flex-col items-center justify-center w-full font-display uppercase leading-none text-[#111111] text-center z-20 mt-10">
              <StaggeredText
                as="span"
                text="AT"
                className="font-semibold text-3xl sm:text-5xl tracking-tight mb-3"
                segmentBy="chars"
                delay={60}
                direction="bottom"
              />
              <StaggeredText
                as="span"
                text="BUFFET"
                className="font-black text-[3.5rem] sm:text-7xl tracking-tighter"
                segmentBy="chars"
                delay={80}
                direction="bottom"
              />
              <StaggeredText
                as="span"
                text="ZONE"
                className="font-medium text-[3.5rem] sm:text-7xl tracking-tighter mt-1"
                segmentBy="chars"
                delay={100}
                direction="bottom"
              />
            </div>
          </div>
        </div>
        
        <div className="absolute inset-0 md:left-auto md:right-0 bottom-0 top-0 w-full md:w-1/2 flex justify-center md:justify-end items-center opacity-100 pointer-events-none z-0">
          {/* Using the uploaded chair photo */}
          <img 
            src={chairImg} 
            alt="Minimalist Modern Chair" 
            className="h-[50%] sm:h-[60%] md:h-[90%] object-contain md:object-right"
            referrerPolicy="no-referrer"
          />
        </div>
      </section>

      {/* Scrolling Food Marquee */}
      <div className="bg-white overflow-hidden flex whitespace-nowrap py-1 sm:py-2 relative select-none pause-marquee mb-4 sm:mb-8 mt-4 sm:mt-6">
        <div className="animate-marquee flex items-center space-x-3 sm:space-x-4 px-2 w-max">
          {[...Array(6)].map((_, arrayIndex) => (
            <React.Fragment key={arrayIndex}>
              <img src={braaiMeatImg} alt="Braai Meat" className="h-16 w-24 sm:h-20 sm:w-32 md:h-24 md:w-40 object-cover border-2 border-[#111111] rounded-md shadow-[2px_2px_0px_0px_rgba(17,17,17,1)]" referrerPolicy="no-referrer" />
              <img src={papChakalakaImg} alt="Pap and Chakalaka" className="h-16 w-24 sm:h-20 sm:w-32 md:h-24 md:w-40 object-cover border-2 border-[#111111] rounded-md shadow-[2px_2px_0px_0px_rgba(17,17,17,1)]" referrerPolicy="no-referrer" />
              <img src={mogoduTripeImg} alt="Mogodu Tripe" className="h-16 w-24 sm:h-20 sm:w-32 md:h-24 md:w-40 object-cover border-2 border-[#111111] rounded-md shadow-[2px_2px_0px_0px_rgba(17,17,17,1)]" referrerPolicy="no-referrer" />
              <img src={oxtailStewImg} alt="Oxtail Stew" className="h-16 w-24 sm:h-20 sm:w-32 md:h-24 md:w-40 object-cover border-2 border-[#111111] rounded-md shadow-[2px_2px_0px_0px_rgba(17,17,17,1)]" referrerPolicy="no-referrer" />
              <img src={traditionalSpreadImg} alt="Traditional Spread" className="h-16 w-24 sm:h-20 sm:w-32 md:h-24 md:w-40 object-cover border-2 border-[#111111] rounded-md shadow-[2px_2px_0px_0px_rgba(17,17,17,1)]" referrerPolicy="no-referrer" />
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Color Palette Block */}
      <section className="flex w-full h-8 md:h-12 border-y-2 border-[#111111]">
        <div className="flex-1 bg-[#f1ede1] border-r-2 border-[#111111]"></div>
        <div className="flex-1 bg-[#a9b89d] border-r-2 border-[#111111]"></div>
        <div className="flex-1 bg-[#ffbd12] border-r-2 border-[#111111]"></div>
        <div className="flex-1 bg-[#985a32] border-r-2 border-[#111111]"></div>
        <div className="flex-1 bg-[#e62419] border-r-2 border-[#111111]"></div>
        <div className="flex-1 bg-[#4a1f11]"></div>
      </section>

      {/* Hero Photo & Traditional Greeting Banner (GOUROU AUTO-RICKSHAW STYLE) */}
      <motion.section 
        ref={videoSectionRef}
        className="mx-auto w-full py-8 gsap-reveal flex justify-center"
        style={{
          maxWidth: videoCardMaxWidth,
          paddingLeft: videoCardPaddingX,
          paddingRight: videoCardPaddingX,
        }}
      >
        <div className="border-y-2 sm:border-2 border-[#111111] rounded-none sm:rounded-md overflow-hidden bg-white w-full">
          {/* Photo */}
          <div className="h-[300px] sm:h-[480px] relative bg-gray-100">
            <video 
              autoPlay 
              loop 
              muted 
              playsInline
              className="w-full h-full object-cover filter contrast-105"
            >
              <source src={heroVideo} type="video/mp4" />
            </video>
          </div>
          {/* Red Banner Below Photo */}
          <div className="bg-[#e62419] border-t-2 border-[#111111] text-white p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-8">
              <p className="font-display text-lg sm:text-2xl font-black uppercase tracking-tight leading-snug">
                BUFFET ZONE invites you on an authentic culinary journey across South African traditions with hearty family recipes.
              </p>
            </div>
            <div className="md:col-span-4 text-left md:text-right">
              <p className="font-display font-black text-xs uppercase tracking-wider text-[#ffbd12]">
                Re a go amogela ka lethabo!
              </p>
              <p className="font-display text-sm font-bold text-white mt-1">
                Siyakwamukela ku-At Buffet Zone.
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Generous Cuisine Intro & Sidebar (GOUROU RECRUTEMENT BLUE BLOCK STYLE) */}
      <motion.section 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: [0.215, 0.61, 0.355, 1] }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 gsap-reveal"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Intro */}
          <div className="lg:col-span-8 bg-[#faf6ee] border-2 border-[#111111] rounded-md p-8 space-y-6">
            <StaggeredText
              as="h2"
              text="Traditional homecooked, fresh & hearty cuisine"
              className="font-display text-2xl sm:text-4xl font-black uppercase tracking-tighter text-[#e62419]"
              segmentBy="words"
              delay={50}
              direction="bottom"
            />
            <p className="text-sm sm:text-base leading-relaxed font-sans text-gray-800">
              At AT BUFFET ZONE, everything is prepared daily on site in keeping with our rich traditions. Our chefs carefully select top quality ingredients to recreate the authentic flavors of South African soil. From beautifully marinated meats to spicy seasonal vegetables like our legendary Chakalaka.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <button 
                onClick={() => setActiveTab("menu")}
                onMouseMove={handleMagneticMove}
                onMouseLeave={handleMagneticLeave}
                className="bg-[#e62419] text-white border border-[#111111] font-display font-bold text-xs uppercase px-6 py-3 hover:bg-[#111111] transition cursor-pointer"
              >
                DISCOVER THE MENU
              </button>
              <button 
                onClick={() => {
                  setActiveTab("contact");
                  setTimeout(() => {
                    gsap.to(window, { duration: 0.8, scrollTo: "#booking-card-form", ease: "power3.inOut" });
                  }, 100);
                }}
                onMouseMove={handleMagneticMove}
                onMouseLeave={handleMagneticLeave}
                className="border border-[#111111] font-display font-bold text-xs uppercase px-6 py-3 hover:bg-[#ffbd12] transition cursor-pointer"
              >
                CONTACT US
              </button>
            </div>
          </div>

          {/* Right Column: Recruitment Blue block (GOUROU BLUE RECRUITMENT STYLE) */}
          <div id="recrutement-section" className="lg:col-span-4 bg-[#0f4cc2] border-2 border-[#111111] rounded-md p-8 text-white flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <StaggeredText
                as="h3"
                text="We are recruiting kitchen & front-of-house staff!"
                className="font-display text-xl sm:text-2xl font-black uppercase tracking-tight leading-none text-[#ffbd12]"
                segmentBy="words"
                delay={50}
                direction="bottom"
              />
              <p className="text-xs leading-relaxed font-sans text-blue-100">
                Do you love traditional food, teamwork, and high-quality service? Join our dynamic team in Pretoria Central. Send your CV on WhatsApp or visit us in person.
              </p>
            </div>
            <div>
              <a 
                href="https://wa.me/27828843574?text=Hello%20At%20Buffet%20Zone!%20I%20am%20interested%20in%20applying%20for%20a%20job%20opportunity." 
                target="_blank" 
                rel="noopener noreferrer"
                onMouseMove={handleMagneticMove}
                onMouseLeave={handleMagneticLeave}
                className="inline-block w-full text-center bg-[#ffbd12] text-black border border-[#111111] font-display font-black text-xs uppercase py-3 hover:bg-white transition cursor-pointer"
              >
                SUBMIT APPLICATION
              </a>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Traditional Dishes Swiper */}
      <motion.section 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: [0.215, 0.61, 0.355, 1] }}
        className="w-full bg-[#f1ede1] border-y-2 border-[#111111] overflow-hidden gsap-reveal"
      >
        <Swiper dishes={MENU_ITEMS.filter(item => item.popular).slice(0, 10)} />
      </motion.section>

      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: [0.215, 0.61, 0.355, 1], delay: 0.1 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 gsap-reveal"
      >
        <div className="text-center">
          <button
            id="btn-voir-menu-complet"
            onClick={() => {
              setSelectedMenuCategory("all");
              setActiveTab("menu");
            }}
            onMouseMove={handleMagneticMove}
            onMouseLeave={handleMagneticLeave}
            className="bg-[#e62419] text-white border-2 border-[#111111] rounded-md font-display font-black text-xs uppercase tracking-wider px-8 py-3.5 hover:bg-[#111111] transition cursor-pointer"
          >
            VIEW OUR FULL MENU
          </button>
        </div>
      </motion.section>

      {/* Giant Red Banner "CATERING" (GOUROU RED SHOP BANNER STYLE) */}
      <motion.section 
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.215, 0.61, 0.355, 1] }}
        className="bg-[#e62419] border-y-2 border-[#111111] py-10 relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-2">
          <StaggeredText
            as="h2"
            text="CATERING"
            className="font-display text-5xl sm:text-7xl font-black tracking-tighter text-white uppercase leading-none"
            segmentBy="chars"
            delay={80}
            direction="bottom"
          />
          <p className="font-display text-xs sm:text-sm font-bold text-[#ffbd12] tracking-widest uppercase">
            • LUNCH BOXES • WORKPLACE LUNCHES • CUSTOM BUFFET CATERING •
          </p>
        </div>
      </motion.section>

      {/* Catering Sub-items Grid (GOUROU SHOP THREE ITEMS STYLE) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 gsap-reveal">
        <div ref={cateringGridRef} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Item 1: Boite d'allumette styled takeaway Box */}
          <div 
            className="bg-white border-2 border-[#111111] rounded-md p-6 flex flex-col justify-between space-y-4 opacity-0"
          >
            <div className="relative h-44 border border-[#111111] bg-gray-100 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=400" 
                alt="Lunch Box" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h4 className="font-display font-black text-sm uppercase text-[#111111]">TRADITIONAL LUNCH BOX</h4>
              <p className="text-xs text-gray-600 font-sans mt-1">
                Includes 1 slow-cooked meat, rice or pap, veggie side dishes, and spicy Chakalaka. Ideal for quick office lunches.
              </p>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-gray-200">
              <span className="font-mono text-sm font-bold text-[#e62419]">FROM R65</span>
              <a 
                href="https://wa.me/27828843574?text=Hello%20At%20Buffet%20Zone!%20I%20would%20like%20to%20order%20traditional%20lunch%20boxes." 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-3 py-1 bg-[#ffbd12] border border-[#111111] font-display font-bold text-[10px] uppercase tracking-wider"
              >
                ORDER
              </a>
            </div>
          </div>

          {/* Item 2: Apron / T-shirt styled banner */}
          <div 
            className="bg-white border-2 border-[#111111] rounded-md p-6 flex flex-col justify-between space-y-4 opacity-0"
          >
            <div className="relative h-44 border border-[#111111] bg-[#008f51] flex items-center justify-center p-4">
              <div className="text-center text-white space-y-2">
                <Utensils className="h-10 w-10 mx-auto text-[#ffbd12]" />
                <span className="block font-display font-black text-xs uppercase tracking-wider">OFFICIAL APRON</span>
                <span className="block text-[10px] font-mono bg-black/20 px-2 py-0.5">LIMITED EDITION</span>
              </div>
            </div>
            <div>
              <h4 className="font-display font-black text-sm uppercase text-[#111111]">AT BUFFET ZONE KITCHEN APRON</h4>
              <p className="text-xs text-gray-600 font-sans mt-1">
                Heavyweight, highly durable forest green cotton apron featuring a custom embroidered logo. Perfect for barbecues and grilling.
              </p>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-gray-200">
              <span className="font-mono text-sm font-bold text-[#e62419]">SINGLE PRICE R150</span>
              <a 
                href="https://wa.me/27828843574?text=Hello%20At%20Buffet%20Zone!%20I%20am%20interested%20in%20buying%20the%20Official%20Apron." 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-3 py-1 bg-[#ffbd12] border border-[#111111] font-display font-bold text-[10px] uppercase tracking-wider"
              >
                ORDER
              </a>
            </div>
          </div>

          {/* Item 3: Service Traiteur Coming soon banner */}
          <motion.div 
            whileHover={{ scale: 1.03, y: -5 }}
            className="bg-white border-2 border-[#111111] rounded-md p-6 flex flex-col justify-between space-y-4 opacity-0"
          >
            <div className="relative h-44 border border-[#111111] bg-gray-100 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=400" 
                alt="Event Catering" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h4 className="font-display font-black text-sm uppercase text-[#111111]">EVENT CATERING</h4>
              <p className="text-xs text-gray-600 font-sans mt-1">
                Professional catering for office meetings, weddings, and traditional gatherings. Custom menu options available.
              </p>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-gray-200">
              <span className="font-mono text-sm font-bold text-[#e62419]">CUSTOM ESTIMATES</span>
              <button 
                onClick={() => setActiveTab("catering")}
                className="px-3 py-1 bg-[#ffbd12] border border-[#111111] font-display font-bold text-[10px] uppercase tracking-wider"
              >
                QUOTE
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Animated SVG Text Path banner */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="bg-white overflow-hidden pt-8 sm:pt-12 pb-0"
      >
        <div className="w-full relative h-[100px] sm:h-[150px] flex items-center justify-center">
          <svg viewBox="0 0 1000 200" className="w-[200%] h-full overflow-visible" preserveAspectRatio="xMidYMid slice">
            <path 
              id="textPathCurve" 
              d="M -1000 100 C -750 0, -750 200, -500 100 C -250 0, -250 200, 0 100 C 250 0, 250 200, 500 100 C 750 0, 750 200, 1000 100 C 1250 0, 1250 200, 1500 100 C 1750 0, 1750 200, 2000 100 C 2250 0, 2250 200, 2500 100" 
              fill="transparent" 
              stroke="transparent" 
            />
            <text className="font-display font-black text-3xl sm:text-4xl uppercase tracking-widest fill-[#111111]">
              <textPath href="#textPathCurve" startOffset="0" ref={textPathRef}>
                {"★ AT BUFFET ZONE PRETORIA CENTRAL ★ FOLLOW US @ATBUFFETZONE ★ AUTHENTIC SOUTH AFRICAN RECIPES ".repeat(20)}
              </textPath>
            </text>
          </svg>
        </div>
      </motion.section>
    </motion.div>
  );
}
