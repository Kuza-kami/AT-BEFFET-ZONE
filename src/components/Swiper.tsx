import React, { useRef, useEffect } from 'react'
import Core from 'smooothy'
import { ArrowRight } from 'lucide-react';
import { Dish } from '../types';
import { getCategoryStyle, getWhatsAppMenuItemOrderText } from './FoodCard';
import { triggerToast } from './ToastNotification';

interface SwiperProps {
  dishes: Dish[];
}

const getCategoryColor = (category: string) => {
  switch (category) {
    case "lunch_veggies": return "#4a5d23"; // Greenish
    case "lunch_meats": return "#8b4513"; // Brownish
    case "traditional": return "#e67e22"; // Orangey
    case "beverage": return "#2c3e50"; // Dark blue
    default: return "#f1ede1"; // Light beige
  }
}

const Swiper = ({ dishes }: SwiperProps) => {

  const wrapperRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<any>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const slides = [...wrapper.children] as HTMLElement[];

    const preventSelect = (e: Event) => e.preventDefault();
    wrapper.addEventListener('selectstart', preventSelect);
    wrapper.style.userSelect = 'none';
    wrapper.style.webkitUserSelect = 'none';
    wrapper.style.touchAction = 'pan-y';

    const slider = new Core(wrapper, {
      infinite: false,
      snap: false,
      variableWidth: true,
      lerpFactor: 0.02,
      speedDecay: 0.97,
      bounceLimit: 0,
      setOffset: ({ itemWidth, totalWidth }) => {
        const gap = window.innerWidth * 0.02;
        const lastSlideOffset = (dishes.length - 1) * (itemWidth + gap);
        return totalWidth - lastSlideOffset;
      },
      onUpdate: (instance) => {
        const vwOffset = window.innerWidth * .1

        slides.forEach((slide, i) => {
          const slideWidth = slide.offsetWidth;
          const slideLeft = slide.offsetLeft + instance.current;
          
          const isLast = i === dishes.length - 1;

          if (slideLeft < 0 && !isLast) {
            const ratio = Math.min(1, Math.abs(slideLeft) / slideWidth);
            slide.style.cssText = `
              background-color: #ffffff;
              border: 2px solid #111111;
              border-radius: 6px;
              box-shadow: none;
              color: #111111;
              transform-origin: left 80%;
              transform: translateX(${instance.current + Math.abs(slideLeft) + ratio * vwOffset}px) rotate(${-15 * ratio}deg) scale(${1 - ratio * 0.4});
              position: relative;
              z-index: ${i + 1};
            `
          } else {
            slide.style.cssText = `
              background-color: #ffffff;
              border: 2px solid #111111;
              border-radius: 6px;
              box-shadow: none;
              color: #111111;
              transform: translateX(${instance.current}px);
              z-index: ${i + 1};
            `
          }
        })
      }
    })

    let animId: number;
    let wasDragging = false;
    let momentum = 0;
    const MOMENTUM_MULTIPLIER = 10;
    const MOMENTUM_DECAY = 0.96;

    function animate() {
      slider.update();

      if (slider.isDragging) {
        wasDragging = true;
        momentum = 0;
      } else if (wasDragging) {
        momentum = slider.speed * MOMENTUM_MULTIPLIER;
        wasDragging = false;
      }
      if (Math.abs(momentum) > .5) {
        slider.target += momentum;
        momentum *= MOMENTUM_DECAY;
      }

      // Always clamp target within [maxScroll, 0] to guarantee stability
      slider.target = Math.max(slider.maxScroll, Math.min(0, slider.target));

      animId = requestAnimationFrame(animate);
    }

    animate();

    sliderRef.current = slider;

    return () => {
      cancelAnimationFrame(animId);
      wrapper.removeEventListener('selectstart', preventSelect);
      slider.destroy();
    }
  }, [dishes])

  const handleNext = () => {
    if (sliderRef.current) {
      const slider = sliderRef.current;
      const wrapper = wrapperRef.current;
      let jump = window.innerWidth * 0.35 + window.innerWidth * 0.04;
      if (wrapper && wrapper.children.length > 0) {
        const firstChild = wrapper.children[0] as HTMLElement;
        if (firstChild) {
          const gap = window.innerWidth > 640 ? window.innerWidth * 0.02 : window.innerWidth * 0.04;
          jump = firstChild.offsetWidth + gap;
        }
      }
      
      // If already at or near the end (maxScroll), wrap back to the beginning
      if (slider.target <= slider.maxScroll + 20) {
        slider.target = 0;
      } else {
        slider.target = Math.max(slider.maxScroll, slider.target - jump);
      }
    }
  };

  const handleMagneticMove = (e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
  };

  const handleMagneticLeave = (e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.transform = "translate(0px, 0px)";
  };


  return (
    <div className='w-full sm:h-[650px] md:h-[720px] flex flex-col sm:flex-row items-center gap-[4vw] overflow-hidden sm:overflow-visible py-10 px-4'>
      <div className='w-full sm:w-1/3 h-full flex flex-col items-start justify-center mb-8 sm:mb-0 relative z-20'>
        <h2 className='text-5xl sm:text-[6vw] lg:text-[7vw] font-display uppercase leading-[.8] font-black tracking-tighter text-[#111111]'>Our <br /> Signature <br /> Dishes</h2>
        <p className='text-sm sm:text-lg font-sans font-medium text-gray-700 mt-[4vw] sm:mt-[2vw] w-full sm:w-[90%] mb-8'>
          Discover our homecooked specialty dishes, slow-simmered and served steaming hot to fuel your daily motivation.
        </p>
        
        <button 
          onClick={handleNext}
          className="border-2 border-[#111111] rounded-md bg-[#111111] text-white px-6 py-3 font-display font-bold uppercase text-sm hover:bg-transparent hover:text-[#111111] transition-colors cursor-pointer flex items-center gap-2"
        >
          Next Dish <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      <div className='w-full sm:w-2/3 h-[550px] sm:h-[580px] md:h-[640px] overflow-clip sm:overflow-visible relative flex items-center'>
        <div ref={wrapperRef} className='flex h-full items-center will-change-transform'>
          {dishes.map((slide, index) => {
            const { icon: CategoryIcon } = getCategoryStyle(slide.category);
            
            return (
              <div
                key={slide.id}
                className={`shrink-0 pointer-events-auto w-[85vw] sm:w-[45vw] md:w-[35vw] lg:w-[30vw] h-auto rounded-md flex flex-col justify-between p-5 bg-white border-2 border-[#111111] ${index < dishes.length - 1 ? 'mr-[4vw] sm:mr-[2vw]' : ''}`}
              >
                <div className="w-full h-[200px] sm:h-[220px] overflow-hidden rounded-none bg-[#fdfbf7] relative mb-4 border-b-2 border-[#111111]">
                  <img src={slide.image} alt={slide.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  
                  <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                    <div className="bg-black/60 p-2 rounded-none inline-block backdrop-blur-md border border-white text-white">
                      <CategoryIcon className="h-4 w-4" />
                    </div>
                    {slide.popular && (
                      <span className="text-[10px] text-white font-bold uppercase tracking-widest border border-white px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-none">
                        Popular
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className='text-lg sm:text-xl md:text-2xl font-display font-black uppercase tracking-tight text-neutral-900 leading-none'>{slide.name}</h3>
                      <span className="bg-[#111111] text-white text-xs sm:text-sm font-black font-display px-3 py-1.5 rounded-none leading-none shrink-0 ml-2 border border-white">
                        R{slide.price}
                      </span>
                    </div>
                    {slide.xhosaName && (
                      <p className='text-xs sm:text-sm font-sans font-medium text-neutral-400 mb-2 italic'>{slide.xhosaName}</p>
                    )}
                    <p className='text-[11px] sm:text-[13px] font-sans font-medium text-neutral-500 leading-relaxed line-clamp-3 mb-4'>{slide.description}</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-[#f7d6c5] text-[#111111] text-[10px] px-2.5 py-1 rounded-none font-bold uppercase tracking-wider border border-[#111111]">
                      {slide.category.replace('_', ' ')}
                    </span>
                    {slide.popular && (
                      <span className="bg-[#e9f5db] text-[#111111] text-[10px] px-2.5 py-1 rounded-none font-bold uppercase tracking-wider border border-[#111111]">
                        Signature
                      </span>
                    )}
                  </div>

                  <a 
                    href={getWhatsAppMenuItemOrderText(slide)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      triggerToast(`Opening WhatsApp to order ${slide.name}... 📱`, "success");
                    }}
                    className="w-full bg-[#111111] text-white py-3 px-4 rounded-md font-display font-black text-center uppercase tracking-wider text-xs sm:text-sm hover:bg-transparent hover:text-[#111111] border-2 border-[#111111] transition-colors flex items-center justify-center gap-2 cursor-pointer mt-auto"
                  >
                    Order on WhatsApp
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  )
}

export default Swiper;
