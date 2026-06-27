import React, { useState, useEffect } from "react";
import { 
  Menu as MenuIcon, 
  X, 
  Ticket 
} from "lucide-react";
import { motion, AnimatePresence, useScroll, useSpring } from "motion/react";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollToPlugin);

// Import Modular Components
import { Home } from "./components/Home";
import { Menu } from "./components/Menu";
import { Catering } from "./components/Catering";
import { Reviews } from "./components/Reviews";
import { Gallery } from "./components/Gallery";
import { Contact } from "./components/Contact";
import { LookupModal } from "./components/LookupModal";
import { ToastNotification, triggerToast } from "./components/ToastNotification";

export default function App() {
  // Scroll Progress Indicator
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Navigation & Tabs State
  const [activeTab, setActiveTab] = useState<"home" | "menu" | "catering" | "reviews" | "contact" | "gallery">("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Menu Category Filter State
  const [selectedMenuCategory, setSelectedMenuCategory] = useState<string>("all");

  // Reservation Lookup Modal State
  const [showLookupModal, setShowLookupModal] = useState(false);

  // GSAP Ticker & Interaction Refs

  // Requirement: "when it switch to the other section i want to be always at the top of the page"
  useEffect(() => {
    gsap.to(window, { duration: 0.6, scrollTo: 0, ease: "power3.inOut" });
  }, [activeTab]);

  // Requirement: "when i open the navigation menu stop the scrolling around the page"
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Trigger GSAP stagger-reveals and text fades on activeTab change
  useEffect(() => {
    // Reset and reveal tab components with className 'gsap-reveal'
    gsap.killTweensOf(".gsap-reveal");
    gsap.killTweensOf(".gsap-fade-in");

    gsap.set(".gsap-reveal", { opacity: 0, y: 35, scale: 0.97 });
    gsap.set(".gsap-fade-in", { opacity: 0 });

    gsap.to(".gsap-reveal", {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.65,
      stagger: 0.06,
      ease: "power2.out",
      clearProps: "transform" // clear transforms after completion so hover translations continue to work cleanly!
    });

    gsap.to(".gsap-fade-in", {
      opacity: 1,
      duration: 0.75,
      ease: "power1.out"
    });
  }, [activeTab]);

  // GSAP Magnetic Micro-interaction on main buttons
  const handleMagneticMove = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(el, {
      x: x * 0.4,
      y: y * 0.4,
      scale: 1.05,
      duration: 0.3,
      ease: "power2.out"
    });
  };

  const handleMagneticLeave = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    const el = e.currentTarget;
    gsap.to(el, {
      x: 0,
      y: 0,
      scale: 1,
      duration: 0.6,
      ease: "elastic.out(1.1, 0.4)"
    });
  };

  // GSAP 3D Hover Tilt Micro-interaction on Bento-Grid cards
  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    
    const angleX = (yc - y) / 12; 
    const angleY = (x - xc) / 12;
    
    gsap.to(el, {
      rotateX: angleX,
      rotateY: angleY,
      scale: 1.03,
      transformPerspective: 800,
      ease: "power2.out",
      duration: 0.35
    });
  };

  const handleCardMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    gsap.to(el, {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      ease: "power3.out",
      duration: 0.6
    });
  };

  return (
    <div id="app-root" className="min-h-screen flex flex-col font-sans bg-white text-[#111111] selection:bg-[#e62419] selection:text-white">
      {/* Scroll Progress Indicator Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] z-50 bg-[#e62419] origin-left"
        style={{ scaleX }}
      />
      
      {/* ==========================================
          HEADER (GOUROU MINI STYLE)
          ========================================== */}
      <header id="main-header" className="sticky top-4 z-40 bg-white border-2 border-[#111111] rounded-md w-[calc(100%-2rem)] sm:w-[calc(100%-3rem)] max-w-7xl mx-auto shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] mt-4 mb-4">
        <div className="flex items-center justify-between h-14 md:h-16">
          {/* Logo */}
          <div id="nav-logo" className="flex items-center space-x-2 cursor-pointer pl-4 sm:pl-6 lg:pl-8" onClick={() => setActiveTab("home")}>
            <span className="font-display text-2xl md:text-3xl font-black tracking-tighter text-[#111111] uppercase">
              AT BUFFET <span className="text-[#111111]">ZONE</span>
            </span>
          </div>

          {/* Hamburger menu toggle (Always visible) */}
          <div className="h-full border-l-2 border-[#111111] flex items-center px-4 sm:px-6 lg:px-8">
            <motion.button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              whileTap={{ scale: 0.9 }}
              className="flex items-center space-x-2 hover:text-[#e62419] transition cursor-pointer"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 md:h-7 md:w-7" />
              ) : (
                <MenuIcon className="h-6 w-6 md:h-7 md:w-7" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation Panel */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              id="mobile-navbar-panel"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1, transition: { duration: 0.3, ease: [0.76, 0, 0.24, 1], staggerChildren: 0.1, delayChildren: 0.1 } }}
              exit={{ height: 0, opacity: 0, transition: { duration: 0.3, ease: [0.76, 0, 0.24, 1] } }}
              className="bg-[#faf6ee] border-t-2 border-[#111111] overflow-hidden"
            >
              <div className="px-4 py-8 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4 md:space-y-6 flex flex-col items-start">
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    id="mobile-nav-home"
                    onClick={() => { setActiveTab("home"); setMobileMenuOpen(false); }}
                    whileTap={{ scale: 0.96 }}
                    className="block w-full text-left font-display font-black tracking-tighter text-3xl sm:text-4xl md:text-5xl uppercase hover:text-[#e62419] transition-colors cursor-pointer"
                  >
                    HOME
                  </motion.button>
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    id="mobile-nav-menu"
                    onClick={() => { setActiveTab("menu"); setMobileMenuOpen(false); }}
                    whileTap={{ scale: 0.96 }}
                    className="block w-full text-left font-display font-black tracking-tighter text-3xl sm:text-4xl md:text-5xl uppercase hover:text-[#e62419] transition-colors cursor-pointer"
                  >
                    THE MENU
                  </motion.button>
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    id="mobile-nav-catering"
                    onClick={() => { setActiveTab("catering"); setMobileMenuOpen(false); }}
                    whileTap={{ scale: 0.96 }}
                    className="block w-full text-left font-display font-black tracking-tighter text-3xl sm:text-4xl md:text-5xl uppercase hover:text-[#0f4cc2] transition-colors cursor-pointer"
                  >
                    CATERING QUOTE
                  </motion.button>
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    id="mobile-nav-reviews"
                    onClick={() => { setActiveTab("reviews"); setMobileMenuOpen(false); }}
                    whileTap={{ scale: 0.96 }}
                    className="block w-full text-left font-display font-black tracking-tighter text-3xl sm:text-4xl md:text-5xl uppercase hover:text-[#e62419] transition-colors cursor-pointer"
                  >
                    REVIEWS
                  </motion.button>
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    id="mobile-nav-gallery"
                    onClick={() => { setActiveTab("gallery"); setMobileMenuOpen(false); }}
                    whileTap={{ scale: 0.96 }}
                    className="block w-full text-left font-display font-black tracking-tighter text-3xl sm:text-4xl md:text-5xl uppercase hover:text-[#e62419] transition-colors cursor-pointer"
                  >
                    GALLERY
                  </motion.button>
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    id="mobile-nav-contact"
                    onClick={() => { setActiveTab("contact"); setMobileMenuOpen(false); }}
                    whileTap={{ scale: 0.96 }}
                    className="block w-full text-left font-display font-black tracking-tighter text-3xl sm:text-4xl md:text-5xl uppercase hover:text-[#e62419] transition-colors cursor-pointer"
                  >
                    BOOK A TABLE
                  </motion.button>
                </div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="pt-8 border-t-2 border-[#111111] md:border-t-0 md:border-l-2 md:pl-8 flex flex-col space-y-4 justify-end"
                >
                  <motion.button
                    id="mobile-btn-lookup"
                    onClick={() => { setShowLookupModal(true); setMobileMenuOpen(false); }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center justify-center space-x-2 border-2 border-[#111111] rounded-md py-4 text-sm font-bold uppercase hover:bg-[#ffbd12] transition-colors cursor-pointer"
                  >
                    <Ticket className="h-5 w-5" />
                    <span>MY TABLE BOOKING</span>
                  </motion.button>

                  <motion.button
                    id="mobile-btn-book"
                    onClick={() => {
                      setActiveTab("contact");
                      setMobileMenuOpen(false);
                      setTimeout(() => {
                        gsap.to(window, { duration: 0.8, scrollTo: "#booking-card-form", ease: "power3.inOut" });
                      }, 200);
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full bg-[#e62419] text-white border-2 border-[#111111] rounded-md font-display font-black py-4 text-sm uppercase text-center hover:bg-[#111111] transition-colors cursor-pointer"
                  >
                    BOOK A TABLE NOW
                  </motion.button>

                  <motion.a
                    id="mobile-btn-recrutement"
                    href="#recrutement-section"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab("home");
                      setMobileMenuOpen(false);
                      setTimeout(() => {
                        gsap.to(window, { duration: 0.8, scrollTo: "#recrutement-section", ease: "power3.inOut" });
                      }, 200);
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full bg-[#111111] text-white border-2 border-[#111111] rounded-md font-display font-black py-4 text-sm uppercase text-center hover:bg-white hover:text-[#111111] transition-colors cursor-pointer"
                  >
                    RECRUITMENT
                  </motion.a>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ==========================================
          MAIN CONTENT
          ========================================== */}
      <motion.main 
        className="flex-grow transition-transform transition-opacity transition-[border-radius] duration-500 origin-top overflow-hidden"
        animate={{ 
          scale: mobileMenuOpen ? 0.95 : 1,
          y: mobileMenuOpen ? 16 : 0,
          opacity: mobileMenuOpen ? 0.6 : 1,
          borderRadius: mobileMenuOpen ? "2rem" : "0rem"
        }}
        transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
      >
        <AnimatePresence mode="wait">
          {activeTab === "home" && (
            <Home 
              setActiveTab={setActiveTab}
              setSelectedMenuCategory={setSelectedMenuCategory}
              handleMagneticMove={handleMagneticMove}
              handleMagneticLeave={handleMagneticLeave}
            />
          )}

          {activeTab === "menu" && (
            <Menu 
              selectedMenuCategory={selectedMenuCategory}
              setSelectedMenuCategory={setSelectedMenuCategory}
            />
          )}

          {activeTab === "catering" && (
            <Catering 
              handleMagneticMove={handleMagneticMove}
              handleMagneticLeave={handleMagneticLeave}
            />
          )}

          {activeTab === "reviews" && (
            <Reviews 
              handleMagneticMove={handleMagneticMove}
              handleMagneticLeave={handleMagneticLeave}
            />
          )}

          {activeTab === "gallery" && (
            <Gallery />
          )}

          {activeTab === "contact" && (
            <Contact 
              setShowLookupModal={setShowLookupModal}
              handleMagneticMove={handleMagneticMove}
              handleMagneticLeave={handleMagneticLeave}
            />
          )}
        </AnimatePresence>
      </motion.main>

      {/* ==========================================
          GIANT FOOTER
          ========================================== */}
      <footer className="bg-white border-t-2 border-[#111111] pt-6 sm:pt-10 pb-8 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Main Logo & Social row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border-b border-gray-200 pb-10">
            {/* Giant rotated branding text block left */}
            <div className="lg:col-span-5 flex items-center justify-start">
              <span className="font-display text-5xl sm:text-7xl font-black text-[#e62419] tracking-tighter uppercase select-none leading-none rotate-[-2deg] inline-block border-2 border-[#111111] rounded-md p-4 bg-[#ffbd12]">
                BUFFETZONE
              </span>
            </div>
            
            {/* Middle decorative Native slogan */}
            <div className="lg:col-span-4 text-left">
              <p className="font-display font-black text-lg uppercase tracking-tight text-[#111111]">
                - Wamkelekile ngazo zonke izikhathi.
              </p>
              <p className="text-xs text-gray-500 font-sans mt-1">
                Authentic home-style African cuisine slow-simmered daily for Pretoria CBD workers and families.
              </p>
            </div>

            {/* Social Links right */}
            <div className="lg:col-span-3 flex justify-start lg:justify-end space-x-4">
              <a 
                href="https://instagram.com/atbuffetzone" 
                target="_blank" 
                rel="noopener noreferrer"
                onMouseMove={handleMagneticMove}
                onMouseLeave={handleMagneticLeave}
                className="px-4 py-2 border border-[#111111] font-display font-bold text-xs uppercase hover:bg-[#e62419] hover:text-white transition cursor-pointer"
              >
                INSTAGRAM ↗
              </a>
              <a 
                href="https://tiktok.com/@atbuffetzone" 
                target="_blank" 
                rel="noopener noreferrer"
                onMouseMove={handleMagneticMove}
                onMouseLeave={handleMagneticLeave}
                className="px-4 py-2 border border-[#111111] font-display font-bold text-xs uppercase hover:bg-[#0f4cc2] hover:text-white transition cursor-pointer"
              >
                TIKTOK ↗
              </a>
            </div>
          </div>

          {/* Sub-Footer Address & Legal Info */}
          <div className="text-center space-y-6">
            <h3 className="font-display text-2xl sm:text-3xl font-black uppercase text-[#111111] tracking-tight">
              AT BUFFET ZONE COMPANY
            </h3>
            
            <div className="flex flex-wrap justify-center gap-2">
              <button 
                onClick={() => {
                  setActiveTab("contact");
                  setTimeout(() => {
                    gsap.to(window, { duration: 0.8, scrollTo: "#booking-card-form", ease: "power3.inOut" });
                  }, 100);
                }}
                onMouseMove={handleMagneticMove}
                onMouseLeave={handleMagneticLeave}
                className="px-4 py-1.5 border border-[#111111] font-display font-bold text-[10px] uppercase tracking-wider hover:bg-[#ffbd12] transition cursor-pointer"
              >
                BOOK A TABLE
              </button>
              <button 
                onClick={() => {
                  const whatsappUrl = "https://wa.me/27828843574?text=Hello%20At%20Buffet%20Zone!%20I%20would%20like%20to%20order%20a%20savory%20takeaway%20lunchbox%20today.";
                  triggerToast("Opening WhatsApp to order your takeaway lunchbox! 🍲", "success");
                  window.open(whatsappUrl, "_blank");
                }}
                onMouseMove={handleMagneticMove}
                onMouseLeave={handleMagneticLeave}
                className="px-4 py-1.5 border border-[#111111] font-display font-bold text-[10px] uppercase tracking-wider hover:bg-[#ffbd12] transition cursor-pointer"
              >
                ORDER TAKEAWAY
              </button>
            </div>

            {/* Practical list */}
            <div className="text-xs font-sans text-gray-600 max-w-2xl mx-auto space-y-2 leading-relaxed">
              <p>
                <strong>Address:</strong> Shop 1, 28 WF Nkomo Street, Pretoria Central, Pretoria, 0002 | Central Metro Line
              </p>
              <p>
                <strong>Hours:</strong> Open Monday to Friday from 07:00 to 22:30, Weekends from 11:30 to 23:30
              </p>
              <p>
                <strong>Reservations Recommended:</strong> via our website or by direct phone at <strong className="text-[#e62419] font-bold">+27 82 884 3574</strong>
              </p>
            </div>

            {/* Copyright */}
            <div className="pt-8 border-t border-gray-100 text-[10px] text-gray-400 font-mono flex flex-wrap justify-between gap-4">
              <span>© {new Date().getFullYear()} AT BUFFET ZONE. ALL RIGHTS RESERVED.</span>
              <div className="flex space-x-4">
                <button onClick={() => setActiveTab("home")} className="hover:underline cursor-pointer">HOME</button>
                <button onClick={() => setActiveTab("menu")} className="hover:underline cursor-pointer">MENU</button>
                <button onClick={() => setActiveTab("catering")} className="hover:underline cursor-pointer">CATERING</button>
                <button onClick={() => setActiveTab("gallery")} className="hover:underline cursor-pointer">GALLERY</button>
                <button onClick={() => setActiveTab("reviews")} className="hover:underline cursor-pointer">REVIEWS</button>
              </div>
            </div>
          </div>

        </div>
      </footer>

      {/* ==========================================
          RESERVATION LOOKUP MODAL
          ========================================== */}
      <AnimatePresence>
        {showLookupModal && (
          <LookupModal 
            onClose={() => setShowLookupModal(false)}
            handleMagneticMove={handleMagneticMove}
            handleMagneticLeave={handleMagneticLeave}
          />
        )}
      </AnimatePresence>

      {/* Global Toast Notification */}
      <ToastNotification />
    </div>
  );
}
