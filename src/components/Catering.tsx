import React, { useState } from "react";
import { motion } from "motion/react";
import { MessageCircle } from "lucide-react";
import { StaggeredText } from "./StaggeredText";
import { CATERING_PACKAGES, CateringPackage } from "../types";
import { triggerToast } from "./ToastNotification";

interface CateringProps {
  handleMagneticMove: (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  handleMagneticLeave: (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
}

export function Catering({
  handleMagneticMove,
  handleMagneticLeave
}: CateringProps) {
  // Catering Calculator States
  const [selectedCateringPackage, setSelectedCateringPackage] = useState<CateringPackage>(CATERING_PACKAGES[1]); // Gold default
  const [cateringGuests, setCateringGuests] = useState(30);
  const [selectedStarches, setSelectedStarches] = useState<string[]>(["Samp", "Dumplings"]);
  const [selectedMeats, setSelectedMeats] = useState<string[]>(["Mogodu", "Beef Stew", "Chicken Stew"]);
  const [selectedVeggies, setSelectedVeggies] = useState<string[]>(["Chakalaka", "Creamed Spinach", "Butternut"]);
  const [selectedDesserts, setSelectedDesserts] = useState<string[]>(["Malva Pudding"]);

  const toggleStarch = (item: string) => {
    setSelectedStarches(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  };
  const toggleMeat = (item: string) => {
    setSelectedMeats(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  };
  const toggleVeggie = (item: string) => {
    setSelectedVeggies(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  };
  const toggleDessert = (item: string) => {
    setSelectedDesserts(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  };

  // Catering calculator logic
  const calculateCateringCost = () => {
    const costPerHead = selectedCateringPackage.pricePerHead;
    const rawTotal = costPerHead * cateringGuests;
    const discountRate = cateringGuests >= 50 ? 0.1 : 0; // 10% discount for 50+ guests
    const discount = rawTotal * discountRate;
    const finalTotal = rawTotal - discount;
    return {
      costPerHead,
      rawTotal,
      discount,
      finalTotal
    };
  };

  const { costPerHead, rawTotal, discount, finalTotal } = calculateCateringCost();

  const getWhatsAppCateringText = () => {
    const text = `Hello At Buffet Zone! I would like to request a catering quote for my upcoming event:\n\n` +
      `• *Selected Package:* ${selectedCateringPackage.name} (R${costPerHead}/head)\n` +
      `• *Guest Count:* ${cateringGuests} People\n` +
      `• *Calculated Estimate:* R${finalTotal.toLocaleString()}\n` +
      `• *Selected Starches:* ${selectedStarches.join(", ") || "None selected"}\n` +
      `• *Selected Meats:* ${selectedMeats.join(", ") || "None selected"}\n` +
      `• *Selected Veggies:* ${selectedVeggies.join(", ") || "None selected"}\n` +
      `• *Selected Desserts:* ${selectedDesserts.join(", ") || "None selected"}\n\n` +
      `Please get back to me with a detailed invoice and setup arrangements. Thank you!`;
    return `https://wa.me/27828843574?text=${encodeURIComponent(text)}`;
  };

  return (
    <motion.div
      key="tab-catering"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.1 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8"
    >
      <div className="text-center max-w-2xl mx-auto space-y-2 gsap-reveal">
        <StaggeredText
          as="h1"
          text="CATERING ESTIMATOR & QUOTE GENERATOR"
          className="font-display text-3xl sm:text-4xl font-black uppercase tracking-tight"
          segmentBy="words"
          delay={80}
          direction="bottom"
        />
        <p className="text-xs sm:text-sm text-gray-700 font-sans">
          Instantly estimate the cost of your event with our interactive calculator, and send your selection directly to us via WhatsApp with a single click.
        </p>
      </div>

      {/* Packages selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 gsap-reveal">
        {CATERING_PACKAGES.map((pkg, index) => (
          <motion.div 
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.1, type: "spring", stiffness: 100 }}
            whileHover={{ y: -5, scale: 1.02 }}
            key={pkg.id}
            onClick={() => setSelectedCateringPackage(pkg)}
            className={`cursor-pointer border-2 border-[#111111] rounded-md p-6 flex flex-col justify-between space-y-4 transition-all duration-150 ${
              selectedCateringPackage.id === pkg.id 
                ? "bg-[#ffbd12] text-black shadow-[6px_6px_0px_0px_rgba(17,17,17,1)]" 
                : "bg-white text-black hover:bg-gray-50"
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-black text-lg uppercase leading-none">{pkg.name}</h3>
                <span className="font-mono font-bold text-sm bg-black text-white px-2 py-0.5">R{pkg.pricePerHead}/head</span>
              </div>
              <p className="text-xs leading-relaxed font-sans text-gray-800">{pkg.description}</p>
              
              <div className="pt-4 border-t border-black/10 space-y-1.5">
                <span className="block text-[10px] font-mono font-bold uppercase text-gray-700">INCLUDED OPTIONS:</span>
                <div className="grid grid-cols-2 gap-y-1 gap-x-2 text-xs">
                  <div>• Starches: <strong className="font-bold">{pkg.starches}</strong></div>
                  <div>• Meats: <strong className="font-bold">{pkg.meats}</strong></div>
                  <div>• Veggies: <strong className="font-bold">{pkg.veggies}</strong></div>
                  <div>• Salads: <strong className="font-bold">{pkg.salads}</strong></div>
                  <div>• Desserts: <strong className="font-bold">{pkg.desserts}</strong></div>
                  <div>• Drinks: <strong className="font-bold">{pkg.beverages ? "Included" : "None"}</strong></div>
                </div>
              </div>
            </div>
            <div className="pt-4 border-t border-black/10">
              <div className="flex items-center space-x-2 text-xs font-bold uppercase">
                <div className="w-4 h-4 rounded-full border border-black flex items-center justify-center bg-white">
                  {selectedCateringPackage.id === pkg.id && <div className="w-2 h-2 rounded-full bg-[#e62419]"></div>}
                </div>
                <span>{selectedCateringPackage.id === pkg.id ? "SELECTED" : "SELECT"}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Calculator Panel */}
      <div className="border-2 border-[#111111] rounded-md bg-white p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 gsap-reveal">
        {/* Inputs Left */}
        <div className="lg:col-span-7 space-y-6">
          <h3 className="font-display font-black text-xl uppercase text-[#e62419] border-b border-gray-200 pb-2">
            1. CUSTOMIZE YOUR MENU
          </h3>

          {/* Guest Count */}
          <div className="space-y-2">
            <label className="block font-display font-bold text-xs uppercase text-gray-700">NUMBER OF GUESTS: {cateringGuests} PEOPLE</label>
            <input 
              type="range" 
              min="10" 
              max="300" 
              step="5"
              value={cateringGuests}
              onChange={(e) => setCateringGuests(parseInt(e.target.value))}
              className="w-full accent-[#e62419] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-gray-500">
              <span>MIN: 10 PERS</span>
              <span>50+ GUESTS (10% SPECIAL DISCOUNT)</span>
              <span>MAX: 300 PERS</span>
            </div>
          </div>

          {/* Selection Grids */}
          <div className="space-y-4 pt-2">
            {/* Starches */}
            <div className="space-y-2">
              <span className="block text-xs font-bold uppercase text-gray-700">
                SELECT STARCHES (Max {selectedCateringPackage.starches}):
              </span>
              <div className="flex flex-wrap gap-2">
                {["Rice", "Samp", "Dumplings", "Pap"].map(starch => (
                  <button
                    key={starch}
                    onClick={() => toggleStarch(starch)}
                    className={`px-3 py-1 text-xs border border-black uppercase font-bold transition cursor-pointer ${
                      selectedStarches.includes(starch) 
                        ? "bg-[#e62419] text-white" 
                        : "bg-[#faf6ee] text-[#111111] hover:bg-gray-100"
                    }`}
                  >
                    {starch}
                  </button>
                ))}
              </div>
            </div>

            {/* Meats */}
            <div className="space-y-2">
              <span className="block text-xs font-bold uppercase text-gray-700">
                SELECT MEATS (Max {selectedCateringPackage.meats}):
              </span>
              <div className="flex flex-wrap gap-2">
                {["Mogodu", "Beef Stew", "Chicken Stew", "Hlakwana Trotters", "Boerewors Wors"].map(meat => (
                  <button
                    key={meat}
                    onClick={() => toggleMeat(meat)}
                    className={`px-3 py-1 text-xs border border-black uppercase font-bold transition cursor-pointer ${
                      selectedMeats.includes(meat) 
                        ? "bg-[#0f4cc2] text-white" 
                        : "bg-[#faf6ee] text-[#111111] hover:bg-gray-100"
                    }`}
                  >
                    {meat}
                  </button>
                ))}
              </div>
            </div>

            {/* Veggies */}
            <div className="space-y-2">
              <span className="block text-xs font-bold uppercase text-gray-700">
                SELECT VEGGIES & SALADS (Max {selectedCateringPackage.veggies + selectedCateringPackage.salads}):
              </span>
              <div className="flex flex-wrap gap-2">
                {["Chakalaka", "Creamed Spinach", "Butternut", "Beetroot Salad", "Coleslaw Salad", "Green Salad"].map(veg => (
                  <button
                    key={veg}
                    onClick={() => toggleVeggie(veg)}
                    className={`px-3 py-1 text-xs border border-black uppercase font-bold transition cursor-pointer ${
                      selectedVeggies.includes(veg) 
                        ? "bg-[#008f51] text-white" 
                        : "bg-[#faf6ee] text-[#111111] hover:bg-gray-100"
                    }`}
                  >
                    {veg}
                  </button>
                ))}
              </div>
            </div>

            {/* Desserts */}
            {selectedCateringPackage.desserts > 0 && (
              <div className="space-y-2">
                <span className="block text-xs font-bold uppercase text-gray-700">
                  SELECT DESSERTS (Max {selectedCateringPackage.desserts}):
                </span>
                <div className="flex flex-wrap gap-2">
                  {["Malva Pudding", "Peppermint Crisp Tart"].map(dessert => (
                    <button
                      key={dessert}
                      onClick={() => toggleDessert(dessert)}
                      className={`px-3 py-1 text-xs border border-black uppercase font-bold transition cursor-pointer ${
                        selectedDesserts.includes(dessert) 
                          ? "bg-[#ffbd12] text-black" 
                          : "bg-[#faf6ee] text-[#111111] hover:bg-gray-100"
                      }`}
                    >
                      {dessert}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Estimation Summary Right */}
        <div className="lg:col-span-5 bg-[#faf6ee] border-2 border-[#111111] rounded-md p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <h3 className="font-display font-black text-xl uppercase text-[#111111] border-b border-black pb-2">
              2. QUOTE SUMMARY
            </h3>
            
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="font-bold text-gray-600">SELECTED PACKAGE:</span>
                <span className="font-bold uppercase text-[#e62419]">{selectedCateringPackage.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-gray-600">BASE PRICE PER HEAD:</span>
                <span className="font-mono font-bold">R{costPerHead} / guest</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-gray-600">NUMBER OF GUESTS:</span>
                <span className="font-mono font-bold">{cateringGuests} people</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-dashed border-gray-300">
                <span className="font-bold text-gray-600">SUBTOTAL:</span>
                <span className="font-mono font-bold">R{rawTotal.toLocaleString()}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-700 font-bold">
                  <span>GROUP DISCOUNT (10%):</span>
                  <span className="font-mono">- R{discount.toLocaleString()}</span>
                </div>
              )}
            </div>

            <div className="bg-white border border-[#111111] p-4 text-center">
              <span className="block text-[10px] font-mono font-bold text-gray-500 uppercase">ESTIMATED TOTAL</span>
              <span className="font-display text-2xl sm:text-3xl font-black text-[#e62419]">R{finalTotal.toLocaleString()}</span>
              <span className="block text-[9px] text-gray-500 font-sans mt-1">
                *Includes delivery, chaffing dish setup, and traditional serving inside Pretoria CBD.
              </span>
            </div>

            {/* Selected dishes confirmation warnings */}
            <div className="text-[10px] text-gray-700 space-y-1 pt-2 border-t border-dashed border-gray-300">
              <div><strong>Starches:</strong> {selectedStarches.join(", ") || "None"}</div>
              <div><strong>Meats:</strong> {selectedMeats.join(", ") || "None"}</div>
              <div><strong>Veggies/Sides:</strong> {selectedVeggies.join(", ") || "None"}</div>
              {selectedCateringPackage.desserts > 0 && (
                <div><strong>Dessert:</strong> {selectedDesserts.join(", ") || "None"}</div>
              )}
            </div>
          </div>

          <a 
            href={getWhatsAppCateringText()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => triggerToast("Opening WhatsApp to send your catering estimate... 📋", "success")}
            onMouseMove={handleMagneticMove}
            onMouseLeave={handleMagneticLeave}
            className="block text-center bg-[#e62419] text-white border-2 border-[#111111] rounded-md font-display font-black text-xs uppercase py-3 hover:bg-[#111111] transition flex items-center justify-center space-x-2 cursor-pointer"
          >
            <MessageCircle className="h-4 w-4" />
            <span>SEND ESTIMATE VIA WHATSAPP</span>
          </a>
        </div>
      </div>
    </motion.div>
  );
}
