import React, { useState } from "react";
import confetti from "canvas-confetti";
import { 
  MapPin, 
  Clock, 
  Phone, 
  MessageCircle, 
  X, 
  Calendar, 
  Users, 
  PartyPopper 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { StaggeredText } from "./StaggeredText";
import { Reservation } from "../types";
import { triggerToast } from "./ToastNotification";

interface ContactProps {
  setShowLookupModal: (val: boolean) => void;
  handleMagneticMove: (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  handleMagneticLeave: (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
}

export function Contact({
  setShowLookupModal,
  handleMagneticMove,
  handleMagneticLeave
}: ContactProps) {
  // Booking Form States
  const [bookingName, setBookingName] = useState("");
  const [bookingEmail, setBookingEmail] = useState("");
  const [bookingPhone, setBookingPhone] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [bookingGuests, setBookingGuests] = useState(2);
  const [bookingOccasion, setBookingOccasion] = useState("None");
  const [bookingNotes, setBookingNotes] = useState("");
  const [submittingBooking, setSubmittingBooking] = useState(false);
  const [activeTicket, setActiveTicket] = useState<Reservation | null>(null);

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

  const submitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingName.trim() || !bookingEmail.trim() || !bookingPhone.trim() || !bookingDate || !bookingTime) {
      return;
    }

    setSubmittingBooking(true);
    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: bookingName,
          email: bookingEmail,
          phone: bookingPhone,
          date: bookingDate,
          time: bookingTime,
          guests: bookingGuests,
          occasion: bookingOccasion,
          notes: bookingNotes
        })
      });

      if (response.ok) {
        const ticketData = await response.json();
        setActiveTicket(ticketData);
        
        // Trigger subtle branded confetti animation
        confetti({
          particleCount: 85,
          spread: 65,
          origin: { y: 0.6 },
          colors: ["#e62419", "#ffbd12", "#0f4cc2", "#111111"]
        });

        // Trigger success toast notification
        triggerToast("Table Reservation created successfully! Please confirm on WhatsApp 🎟️", "success");

        // Reset form
        setBookingName("");
        setBookingEmail("");
        setBookingPhone("");
        setBookingDate("");
        setBookingTime("");
        setBookingGuests(2);
        setBookingOccasion("None");
        setBookingNotes("");
      }
    } catch (err) {
      console.error("Error submitting booking:", err);
    } finally {
      setSubmittingBooking(false);
    }
  };

  return (
    <motion.div
      key="tab-contact"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.1 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12"
    >
      <div className="text-center max-w-2xl mx-auto space-y-2 gsap-reveal">
        <StaggeredText
          as="h1"
          text="BOOK A TABLE & CONTACT"
          className="font-display text-3xl sm:text-4xl font-black uppercase tracking-tight"
          segmentBy="words"
          delay={80}
          direction="bottom"
        />
        <p className="text-xs sm:text-sm text-gray-700 font-sans">
          Plan your visit to At Buffet Zone by booking a table for free in a few quick clicks.
        </p>
      </div>

      {/* Combined Practical Info & Map Card */}
      <div className="bg-white border-2 border-[#111111] rounded-md grid grid-cols-1 md:grid-cols-2 gsap-reveal shadow-[6px_6px_0px_0px_rgba(17,17,17,1)]">
        {/* Left column: Practical Info */}
        <div className="p-6 sm:p-8 space-y-4 flex flex-col justify-center">
          <h3 className="font-display font-black text-lg sm:text-xl uppercase text-[#e62419]">
            PRACTICAL INFO
          </h3>
          <div className="space-y-4 text-xs sm:text-sm font-sans text-gray-700">
            <div className="flex items-start space-x-3">
              <MapPin className="h-5 w-5 text-[#e62419] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-black">RESTAURANT ADDRESS:</strong>
                Shop 1, 28 WF Nkomo Street,<br />Pretoria Central, Pretoria CBD, 0002
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Clock className="h-5 w-5 text-[#e62419] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-black">OPENING HOURS:</strong>
                Monday - Sunday: 11:30 - 22:30<br />(Breakfast buffet served from 07:00)
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Phone className="h-5 w-5 text-[#e62419] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-black">DIRECT PHONE:</strong>
                +27 82 884 3574
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Map Preview */}
        <div className="border-t-2 md:border-t-0 md:border-l-2 border-[#111111] p-2 flex">
          <iframe 
            src="https://maps.google.com/maps?q=Shop%201,%2028%20WF%20Nkomo%20Street,%20Pretoria%20Central,%20Pretoria&t=&z=15&ie=UTF8&iwloc=&output=embed" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            className="border-2 border-[#111111] rounded-md w-full min-h-[260px] md:min-h-0 md:h-full block"
          ></iframe>
        </div>
      </div>

      {/* Booking and Contact details split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start gsap-reveal">
        
        {/* Information block left */}
        <div className="lg:col-span-4 space-y-6">
          {/* Booking lookup reminder */}
          <div className="bg-[#faf6ee] border-2 border-[#111111] rounded-md p-6 space-y-3 shadow-[4px_4px_0px_0px_rgba(17,17,17,1)]">
            <h4 className="font-display font-black text-sm uppercase text-[#111111]">
              LOOKUP A RESERVATION?
            </h4>
            <p className="text-xs text-gray-600 font-sans leading-relaxed">
              Already have a booking? Retrieve your reservation ticket to check its status or confirm it on WhatsApp.
            </p>
            <button
              onClick={() => setShowLookupModal(true)}
              onMouseMove={handleMagneticMove}
              onMouseLeave={handleMagneticLeave}
              className="w-full text-center border-2 border-[#111111] rounded-md bg-[#ffbd12] text-black font-display font-bold text-xs uppercase py-2 hover:bg-black hover:text-white transition cursor-pointer"
            >
              FIND MY TICKET
            </button>
          </div>
        </div>

        {/* Reservation Form right */}
        <div id="booking-card-form" className="lg:col-span-8 bg-white border-2 border-[#111111] rounded-md p-6 sm:p-8 space-y-6 shadow-[6px_6px_0px_0px_rgba(17,17,17,1)]">
          
          {activeTicket ? (
            /* Ticket style card when reservation created */
            <div className="border-4 border-dashed border-[#e62419] bg-[#faf6ee] p-6 space-y-6 relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-24 h-24 bg-[#ffbd12] rotate-45 border-b-2 border-[#111111] hidden sm:block"></div>
              
              <div className="text-center space-y-1">
                <span className="text-xs font-mono font-bold text-[#e62419]">RESERVATION TICKET CONFIRMED</span>
                <h3 className="font-display font-black text-2xl uppercase tracking-tighter text-[#111111]">
                  AT BUFFET ZONE PRETORIA
                </h3>
                <span className="inline-block px-3 py-1 bg-white border border-[#111111] font-mono font-bold text-xs mt-1 text-gray-700">
                  ID: {activeTicket.id}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-y border-dashed border-[#111111] py-4 text-xs font-sans">
                <div>
                  <strong className="text-gray-500 block uppercase">Full Name:</strong>
                  <span className="font-bold text-sm">{activeTicket.name}</span>
                </div>
                <div>
                  <strong className="text-gray-500 block uppercase">Date & Time:</strong>
                  <span className="font-bold text-sm text-[#e62419]">{activeTicket.date} at {activeTicket.time}</span>
                </div>
                <div>
                  <strong className="text-gray-500 block uppercase">Number of Guests:</strong>
                  <span className="font-bold text-sm">{activeTicket.guests} People</span>
                </div>
                <div>
                  <strong className="text-gray-500 block uppercase">Special Occasion:</strong>
                  <span className="font-bold text-sm">{activeTicket.occasion}</span>
                </div>
                <div>
                  <strong className="text-gray-500 block uppercase">Phone:</strong>
                  <span className="font-bold text-sm">{activeTicket.phone}</span>
                </div>
                <div>
                  <strong className="text-gray-500 block uppercase">Email:</strong>
                  <span className="font-bold text-sm">{activeTicket.email}</span>
                </div>
              </div>

              {activeTicket.notes && (
                <div className="text-xs bg-white p-3 border border-gray-200">
                  <strong className="block text-gray-500 uppercase">Special Notes:</strong>
                  <p className="font-sans text-gray-700 italic mt-0.5">"{activeTicket.notes}"</p>
                </div>
              )}

              <div className="bg-[#ffbd12] border border-[#111111] p-3 text-center text-[11px] font-sans font-semibold text-gray-800">
                🔔 Export this reservation to your calendar or confirm it instantly via WhatsApp.
              </div>

              <div className="flex flex-col gap-3">
                <a 
                  href={getWhatsAppBookingText(activeTicket)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => triggerToast("Opening WhatsApp to confirm your table reservation... 📱", "success")}
                  onMouseMove={handleMagneticMove}
                  onMouseLeave={handleMagneticLeave}
                  className="w-full text-center bg-green-600 hover:bg-green-700 text-white border-2 border-[#111111] rounded-md font-display font-black text-xs uppercase py-3 transition flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>CONFIRM VIA WHATSAPP</span>
                </a>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <a 
                    href={getGoogleCalendarUrl(activeTicket)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => triggerToast("Opening Google Calendar... 📅", "success")}
                    onMouseMove={handleMagneticMove}
                    onMouseLeave={handleMagneticLeave}
                    className="w-full text-center bg-white hover:bg-gray-100 text-[#4285F4] border-2 border-[#111111] rounded-md font-display font-bold text-xs uppercase py-2.5 transition flex items-center justify-center space-x-2 cursor-pointer shadow-[2px_2px_0px_0px_rgba(17,17,17,1)]"
                  >
                    <Calendar className="h-4 w-4" />
                    <span>GOOGLE CALENDAR</span>
                  </a>

                  <a 
                    href={getOutlookCalendarUrl(activeTicket)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => triggerToast("Opening Outlook Calendar... 📅", "success")}
                    onMouseMove={handleMagneticMove}
                    onMouseLeave={handleMagneticLeave}
                    className="w-full text-center bg-white hover:bg-gray-100 text-[#0078D4] border-2 border-[#111111] rounded-md font-display font-bold text-xs uppercase py-2.5 transition flex items-center justify-center space-x-2 cursor-pointer shadow-[2px_2px_0px_0px_rgba(17,17,17,1)]"
                  >
                    <Calendar className="h-4 w-4" />
                    <span>OUTLOOK CALENDAR</span>
                  </a>
                </div>

                <button
                  onClick={() => setActiveTicket(null)}
                  onMouseMove={handleMagneticMove}
                  onMouseLeave={handleMagneticLeave}
                  className="w-full py-3 border-2 border-[#111111] rounded-md bg-black text-white hover:bg-gray-800 font-display font-bold text-xs uppercase transition cursor-pointer mt-2"
                >
                  BOOK ANOTHER TABLE
                </button>
              </div>
            </div>
          ) : (
            /* The main booking form */
            <div className="space-y-4">
              <h3 className="font-display font-black text-xl uppercase text-[#e62419] border-b border-gray-200 pb-2">
                ONLINE RESERVATION FORM (FREE)
              </h3>

              <form onSubmit={submitBooking} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                <div className="space-y-1">
                  <label className="block font-bold text-gray-700 uppercase">YOUR FULL NAME *</label>
                  <input 
                    type="text" 
                    required
                    value={bookingName}
                    onChange={(e) => setBookingName(e.target.value)}
                    placeholder="e.g., Karabo Molefe"
                    className="w-full border-2 border-[#111111] rounded-md bg-[#faf6ee] px-3 py-2.5 font-bold focus:bg-white outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-gray-700 uppercase">EMAIL ADDRESS *</label>
                  <input 
                    type="email" 
                    required
                    value={bookingEmail}
                    onChange={(e) => setBookingEmail(e.target.value)}
                    placeholder="e.g., karabo@gmail.com"
                    className="w-full border-2 border-[#111111] rounded-md bg-[#faf6ee] px-3 py-2.5 font-bold focus:bg-white outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-gray-700 uppercase">PHONE NUMBER *</label>
                  <input 
                    type="tel" 
                    required
                    value={bookingPhone}
                    onChange={(e) => setBookingPhone(e.target.value)}
                    placeholder="e.g., +27 82 123 4567"
                    className="w-full border-2 border-[#111111] rounded-md bg-[#faf6ee] px-3 py-2.5 font-bold focus:bg-white outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-gray-700 uppercase">NUMBER OF GUESTS *</label>
                  <select 
                    value={bookingGuests}
                    onChange={(e) => setBookingGuests(parseInt(e.target.value))}
                    className="w-full border-2 border-[#111111] rounded-md bg-[#faf6ee] px-3 py-2.5 font-bold focus:bg-white outline-none cursor-pointer"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20].map(n => (
                      <option key={n} value={n}>{n} {n > 1 ? "Guests" : "Guest"}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-gray-700 uppercase">DATE OF VISIT *</label>
                  <input 
                    type="date" 
                    required
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full border-2 border-[#111111] rounded-md bg-[#faf6ee] px-3 py-2.5 font-bold focus:bg-white outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-gray-700 uppercase">TIME OF SERVICE *</label>
                  <select
                    value={bookingTime}
                    required
                    onChange={(e) => setBookingTime(e.target.value)}
                    className="w-full border-2 border-[#111111] rounded-md bg-[#faf6ee] px-3 py-2.5 font-bold focus:bg-white outline-none cursor-pointer"
                  >
                    <option value="">-- Select Time --</option>
                    <option value="07:30">07:30 (Breakfast Buffet)</option>
                    <option value="08:30">08:30 (Breakfast Buffet)</option>
                    <option value="11:30">11:30 (Lunch Opening)</option>
                    <option value="12:30">12:30 (Lunch Buffet)</option>
                    <option value="13:30">13:30 (Lunch Buffet)</option>
                    <option value="15:30">15:30 (Afternoon Buffet)</option>
                    <option value="17:30">17:30 (Evening Buffet)</option>
                    <option value="18:30">18:30 (Evening Buffet)</option>
                    <option value="19:30">19:30 (Late Dinner)</option>
                  </select>
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="block font-bold text-gray-700 uppercase">SPECIAL OCCASION (OPTIONAL)</label>
                  <select 
                    value={bookingOccasion}
                    onChange={(e) => setBookingOccasion(e.target.value)}
                    className="w-full border-2 border-[#111111] rounded-md bg-[#faf6ee] px-3 py-2.5 font-bold focus:bg-white outline-none cursor-pointer"
                  >
                    <option value="None">None</option>
                    <option value="Birthday">Birthday</option>
                    <option value="Anniversary">Wedding Anniversary</option>
                    <option value="Business Lunch">Business Lunch</option>
                    <option value="Family Gathering">Family Gathering</option>
                    <option value="Traditional Celebration">Traditional Celebration</option>
                  </select>
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="block font-bold text-gray-700 uppercase">SPECIAL NOTES OR REQUESTS</label>
                  <textarea 
                    rows={3}
                    value={bookingNotes}
                    onChange={(e) => setBookingNotes(e.target.value)}
                    placeholder="e.g., food allergies, request for a quiet table..."
                    className="w-full border-2 border-[#111111] rounded-md bg-[#faf6ee] px-3 py-2 font-bold focus:bg-white outline-none resize-none"
                  ></textarea>
                </div>

                <div className="sm:col-span-2 pt-2">
                  <button
                    type="submit"
                    disabled={submittingBooking}
                    onMouseMove={handleMagneticMove}
                    onMouseLeave={handleMagneticLeave}
                    className="w-full bg-[#e62419] text-white border-2 border-[#111111] rounded-md font-display font-black text-xs uppercase py-3 hover:bg-[#111111] transition cursor-pointer"
                  >
                    {submittingBooking ? "SAVING..." : "BOOK MY TABLE FOR FREE"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

    </motion.div>
  );
}
