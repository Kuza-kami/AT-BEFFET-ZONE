import React, { useState } from "react";
import { X, Calendar, Clock, Users, PartyPopper } from "lucide-react";
import { motion } from "motion/react";
import { Reservation } from "../types";
import { triggerToast } from "./ToastNotification";

interface LookupModalProps {
  onClose: () => void;
  handleMagneticMove: (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  handleMagneticLeave: (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
}

export function LookupModal({
  onClose,
  handleMagneticMove,
  handleMagneticLeave
}: LookupModalProps) {
  const [lookupQuery, setLookupQuery] = useState("");
  const [lookupResults, setLookupResults] = useState<Reservation[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const getWhatsAppBookingText = (res: Reservation) => {
    const text = `Hello At Buffet Zone! I would like to confirm my table reservation:\n\n` +
      `• *Reservation ID:* ${res.id}\n` +
      `• *Name:* ${res.name}\n` +
      `• *Date & Time:* ${res.date} at ${res.time}\n` +
      `• *Guests:* ${res.guests} Guests\n` +
      `• *Occasion:* ${res.occasion}\n\n` +
      `Please let me know if there's anything else needed to confirm. Thank you!`;
    return `https://wa.me/27828843574?text=${encodeURIComponent(text)}`;
  };

  const getGoogleCalendarUrl = (res: Reservation) => {
    try {
      const startObj = new Date(`${res.date}T${res.time}`);
      const endObj = new Date(startObj.getTime() + 2 * 60 * 60 * 1000);
      
      const formatForGoogle = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
      
      const startStr = formatForGoogle(startObj);
      const endStr = formatForGoogle(endObj);
      
      const title = encodeURIComponent(`Table Reservation at Buffet Zone`);
      const details = encodeURIComponent(`Reservation for ${res.guests} guest(s).\nOccasion: ${res.occasion || 'None'}\nName: ${res.name}\n\nThank you for booking with At Buffet Zone!`);
      const location = encodeURIComponent(`Shop 1, 28 WF Nkomo St, Pretoria Central, Pretoria, 0002`);
      
      return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startStr}/${endStr}&details=${details}&location=${location}`;
    } catch (e) {
      return "#";
    }
  };

  const getOutlookCalendarUrl = (res: Reservation) => {
    try {
      const startObj = new Date(`${res.date}T${res.time}`);
      const endObj = new Date(startObj.getTime() + 2 * 60 * 60 * 1000);
      
      const title = encodeURIComponent(`Table Reservation at Buffet Zone`);
      const details = encodeURIComponent(`Reservation for ${res.guests} guest(s).<br>Occasion: ${res.occasion || 'None'}<br>Name: ${res.name}<br><br>Thank you for booking with At Buffet Zone!`);
      const location = encodeURIComponent(`Shop 1, 28 WF Nkomo St, Pretoria Central, Pretoria, 0002`);
      
      return `https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent&startdt=${startObj.toISOString()}&enddt=${endObj.toISOString()}&subject=${title}&body=${details}&location=${location}`;
    } catch (e) {
      return "#";
    }
  };

  const lookupBookings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupQuery.trim()) return;

    setHasSearched(true);
    try {
      const response = await fetch("/api/reservations");
      if (response.ok) {
        const allRes: Reservation[] = await response.json();
        const query = lookupQuery.toLowerCase().trim();
        const filtered = allRes.filter(r => 
          r.phone.toLowerCase().includes(query) || 
          r.email.toLowerCase().includes(query) ||
          r.name.toLowerCase().includes(query)
        );
        setLookupResults(filtered);
        
        if (filtered.length > 0) {
          triggerToast(`Found ${filtered.length} reservation(s)! 🎟️`, "info");
        } else {
          triggerToast(`No reservations found for "${lookupQuery}".`, "warning");
        }
      }
    } catch (err) {
      console.error("Error searching bookings:", err);
    }
  };

  const handleClose = () => {
    setHasSearched(false);
    setLookupResults([]);
    setLookupQuery("");
    onClose();
  };

  return (
    <div id="lookup-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-[#faf6ee] border-2 border-[#111111] rounded-md w-full max-w-lg p-6 space-y-4 relative"
      >
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black border border-transparent hover:border-black p-1 transition cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="space-y-1">
          <h3 className="font-display font-black text-lg uppercase text-[#e62419]">
            LOOKUP MY RESERVATION
          </h3>
          <p className="text-xs text-gray-600 font-sans">
            Enter your name, email address, or phone number used when making your booking.
          </p>
        </div>

        <form onSubmit={lookupBookings} className="flex gap-2">
          <input 
            type="text" 
            required
            value={lookupQuery}
            onChange={(e) => setLookupQuery(e.target.value)}
            placeholder="Name, Email, or Phone..."
            className="flex-grow border-2 border-[#111111] rounded-md bg-white px-3 py-2 text-xs font-bold outline-none font-sans"
          />
          <button 
            type="submit"
            onMouseMove={handleMagneticMove}
            onMouseLeave={handleMagneticLeave}
            className="bg-[#e62419] text-white border-2 border-[#111111] rounded-md font-display font-bold text-xs uppercase px-4 py-2 hover:bg-[#111111] transition cursor-pointer"
          >
            SEARCH
          </button>
        </form>

        {/* Results */}
        {hasSearched && (
          <div className="space-y-3 pt-2 max-h-60 overflow-y-auto custom-scrollbar">
            <span className="block text-[10px] font-mono font-bold text-gray-500 uppercase border-b border-black pb-1">
              RESULTS ({lookupResults.length}):
            </span>

            {lookupResults.length === 0 ? (
              <div className="text-center py-6 text-xs text-gray-500 font-sans bg-white border border-[#111111] border-dashed">
                No reservation found for "{lookupQuery}".
              </div>
            ) : (
              lookupResults.map(res => (
                <div key={res.id} className="bg-white border border-[#111111] p-3 space-y-2 text-xs font-sans">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-bold text-[#e62419] uppercase block">{res.name}</span>
                      <span className="text-[10px] text-gray-500 font-mono">ID: {res.id}</span>
                    </div>
                    <span className={`font-mono font-bold text-[10px] uppercase px-2 py-0.5 border ${
                      res.status === 'confirmed' ? 'bg-green-100 border-green-400 text-green-700' : 
                      res.status === 'cancelled' ? 'bg-red-100 border-red-400 text-red-700' : 
                      'bg-amber-100 border-amber-400 text-amber-700'
                    }`}>
                      {res.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-[11px] bg-[#faf6ee] p-2 border border-gray-100">
                    <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-gray-500" /> {res.date}</div>
                    <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-gray-500" /> {res.time}</div>
                    <div className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-gray-500" /> {res.guests} Guests</div>
                    <div className="flex items-center gap-1.5"><PartyPopper className="w-3.5 h-3.5 text-gray-500" /> {res.occasion}</div>
                  </div>

                  <div className="flex flex-col gap-2 pt-1">
                    <a 
                      href={getWhatsAppBookingText(res)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => triggerToast(`Confirming ${res.name}'s reservation on WhatsApp... 📱`, "success")}
                      onMouseMove={handleMagneticMove}
                      onMouseLeave={handleMagneticLeave}
                      className="w-full text-center bg-green-600 hover:bg-green-700 text-white font-display font-bold text-[10px] uppercase py-1.5 transition cursor-pointer"
                    >
                      Confirm on WhatsApp
                    </a>
                    <div className="grid grid-cols-2 gap-2">
                      <a 
                        href={getGoogleCalendarUrl(res)}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => triggerToast("Opening Google Calendar... 📅", "success")}
                        onMouseMove={handleMagneticMove}
                        onMouseLeave={handleMagneticLeave}
                        className="w-full text-center bg-white hover:bg-gray-100 text-[#4285F4] border border-[#111111] font-display font-bold text-[10px] uppercase py-1.5 transition cursor-pointer"
                      >
                        Google Calendar
                      </a>
                      <a 
                        href={getOutlookCalendarUrl(res)}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => triggerToast("Opening Outlook Calendar... 📅", "success")}
                        onMouseMove={handleMagneticMove}
                        onMouseLeave={handleMagneticLeave}
                        className="w-full text-center bg-white hover:bg-gray-100 text-[#0078D4] border border-[#111111] font-display font-bold text-[10px] uppercase py-1.5 transition cursor-pointer"
                      >
                        Outlook Calendar
                      </a>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
