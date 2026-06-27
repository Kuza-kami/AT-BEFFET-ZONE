import React from "react";
import { motion } from "motion/react";
import { gsap } from "gsap";
import { 
  Utensils, 
  Leaf, 
  Drumstick, 
  Flame, 
  Coffee 
} from "lucide-react";
import { Dish } from "../types";
import { triggerToast } from "./ToastNotification";

export const getCategoryStyle = (category: string) => {
  switch (category) {
    case "lunch_veggies":
      return {
        icon: Leaf,
        color: "text-[#4a5d23]",
        btnBg: "bg-[#4a5d23]",
        btnHover: "hover:bg-[#3a4a1c]",
        tags: "Fresh • Vibrant • Plant-based"
      };
    case "lunch_meats":
      return {
        icon: Drumstick,
        color: "text-[#8b4513]",
        btnBg: "bg-[#8b4513]",
        btnHover: "hover:bg-[#6b350f]",
        tags: "Smoky • Tender • Slow-Cooked"
      };
    case "traditional":
      return {
        icon: Flame,
        color: "text-[#e67e22]",
        btnBg: "bg-[#e67e22]",
        btnHover: "hover:bg-[#d35400]",
        tags: "Warm • Savory • Comforting"
      };
    case "beverage":
      return {
        icon: Coffee,
        color: "text-[#2c3e50]",
        btnBg: "bg-[#2c3e50]",
        btnHover: "hover:bg-[#1a252f]",
        tags: "Refreshing • Sweet • Traditional"
      };
    default:
      return {
        icon: Utensils,
        color: "text-[#111111]",
        btnBg: "bg-[#111111]",
        btnHover: "hover:bg-[#000000]",
        tags: "Classic • Hearty • Delicious"
      };
  }
};

export const getWhatsAppMenuItemOrderText = (dish: Dish) => {
  const text = `Hello At Buffet Zone! I'm interested in ordering or learning more about this dish from your menu:\n\n` +
    `• *Dish:* ${dish.name} ${dish.xhosaName ? `(${dish.xhosaName})` : ""}\n` +
    `• *Description:* ${dish.description}\n` +
    (dish.price ? `• *Price:* R${dish.price}\n` : `• *Included in Buffet Session*\n`) +
    `\nI'm ordering from Pretoria Central. Please let me know how I can pick up or arrange quick CBD delivery!`;
  return `https://wa.me/27828843574?text=${encodeURIComponent(text)}`;
};

interface FoodCardProps {
  dish: Dish;
  key?: string;
  index?: number;
}

export function FoodCard({ dish, index = 0 }: FoodCardProps) {
  const style = getCategoryStyle(dish.category);
  const Icon = style.icon;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1, 
        type: "spring", 
        stiffness: 100, 
        damping: 15 
      }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="bg-white border-2 border-[#111111] rounded-md shadow-sm overflow-hidden flex flex-col transition-shadow duration-300 group"
    >
      {/* Top Image */}
      <div 
        className="h-48 w-full border-b-2 border-[#111111] bg-gray-100 relative overflow-hidden"
        onMouseEnter={(e) => {
          gsap.to(e.currentTarget.querySelector('img'), { scale: 1.1, duration: 0.4, ease: "power2.out" });
        }}
        onMouseLeave={(e) => {
          gsap.to(e.currentTarget.querySelector('img'), { scale: 1, duration: 0.4, ease: "power2.out" });
        }}
      >
        <img 
          src={dish.image} 
          alt={dish.name} 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        {dish.price && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="absolute top-4 right-4 bg-white border-2 border-[#111111] rounded-md text-black font-bold font-mono text-xs px-3 py-1 shadow-[2px_2px_0px_0px_rgba(17,17,17,1)]"
          >
            R{dish.price}
          </motion.div>
        )}
      </div>
      
      {/* Content */}
      <div className="p-6 flex flex-col flex-grow items-center text-center space-y-4 relative bg-white">
        {/* Divider with Icon */}
        <div className="flex items-center justify-center space-x-3 w-full">
          <div className="h-[1px] bg-gray-200 flex-grow max-w-[40px]"></div>
          <Icon className={`w-5 h-5 ${style.color} group-hover:scale-110 transition-transform duration-300`} />
          <div className="h-[1px] bg-gray-200 flex-grow max-w-[40px]"></div>
        </div>

        {/* Title & Tags */}
        <div className="space-y-2 w-full">
          <h3 className={`font-display text-xl sm:text-2xl font-bold ${style.color}`}>
            {dish.name}
          </h3>
          <p className="text-[11px] text-gray-500 font-medium tracking-wide uppercase flex items-center justify-center space-x-2">
            {style.tags.split(' • ').map((tag, i, arr) => (
              <React.Fragment key={tag}>
                <span>{tag}</span>
                {i < arr.length - 1 && <span className="text-[10px] text-gray-300">•</span>}
              </React.Fragment>
            ))}
          </p>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 leading-relaxed font-sans pb-4">
          {dish.description}
        </p>

        <div className="flex-grow"></div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center space-x-3 w-full pt-2 mt-auto">
          <motion.a
            whileTap={{ scale: 0.95 }}
            href={getWhatsAppMenuItemOrderText(dish)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => triggerToast(`Added ${dish.name} to cart! Opening WhatsApp... 🍲`, "success")}
            className={`flex-1 py-3 px-4 border-2 border-[#111111] rounded-md ${style.color} font-bold font-mono text-xs uppercase hover:bg-gray-50 transition-colors text-center shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]`}
          >
            Add to cart
          </motion.a>
          <motion.a
            whileTap={{ scale: 0.95 }}
            href={getWhatsAppMenuItemOrderText(dish)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => triggerToast(`Ordering ${dish.name}! Opening WhatsApp... 🍖`, "success")}
            className={`flex-1 py-3 px-4 ${style.btnBg} border-2 border-[#111111] rounded-md text-white font-bold font-mono text-xs uppercase ${style.btnHover} transition-colors text-center shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]`}
          >
            Order Now
          </motion.a>
        </div>
      </div>
    </motion.div>
  );
}
