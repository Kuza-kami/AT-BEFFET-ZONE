import React, { useState, useEffect, useRef } from "react";
import { Camera, Upload, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { StaggeredText } from "./StaggeredText";
import { Testimonial } from "../types";

interface ReviewsProps {
  handleMagneticMove: (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  handleMagneticLeave: (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
}

export function Reviews({
  handleMagneticMove,
  handleMagneticLeave
}: ReviewsProps) {
  const [reviews, setReviews] = useState<Testimonial[]>([]);
  const [newReviewName, setNewReviewName] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewText, setNewReviewText] = useState("");
  const [newReviewImage, setNewReviewImage] = useState<string>("");
  const [cameraActive, setCameraActive] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccessMessage, setReviewSuccessMessage] = useState("");

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);

  // Load reviews on mount
  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetch("/api/reviews");
      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      }
    } catch (err) {
      console.error("Failed to load reviews:", err);
    }
  };

  const startCamera = async () => {
    setReviewError("");
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }
      });
      setCameraStream(mediaStream);
      setCameraActive(true);
      // Give React a tick to mount the video element before setting the stream
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      }, 100);
    } catch (err) {
      console.error("Camera access failed:", err);
      setReviewError("Could not access your device camera. Please upload an image file instead.");
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setCameraActive(false);
  };

  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraStream]);

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg");
        setNewReviewImage(dataUrl);
        setReviewError("");
      }
      stopCamera();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setNewReviewImage(reader.result);
          setReviewError("");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewError("");
    if (!newReviewName.trim() || !newReviewText.trim()) return;

    if (!newReviewImage) {
      setReviewError("A verified food photo is required. Please take or upload a photo of your food to verify your experience!");
      return;
    }

    setSubmittingReview(true);
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newReviewName,
          rating: newReviewRating,
          text: newReviewText,
          foodImage: newReviewImage
        })
      });

      if (response.ok) {
        setNewReviewName("");
        setNewReviewText("");
        setNewReviewRating(5);
        setNewReviewImage("");
        setReviewError("");
        setReviewSuccessMessage("Enkosi! Thank you for your verified review. It has been published successfully with your food photo!");
        fetchReviews();
        setTimeout(() => setReviewSuccessMessage(""), 5000);
      } else {
        const data = await response.json();
        setReviewError(data.error || "Failed to submit review.");
      }
    } catch (err) {
      console.error("Error submitting review:", err);
      setReviewError("An error occurred while submitting your review.");
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <motion.div
      key="tab-reviews"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.1 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8"
    >
      <div className="text-center max-w-2xl mx-auto space-y-2 gsap-reveal">
        <StaggeredText
          as="h1"
          text="CUSTOMER REVIEWS & EXPERIENCES"
          className="font-display text-3xl sm:text-4xl font-black uppercase tracking-tight"
          segmentBy="words"
          delay={80}
          direction="bottom"
        />
        <p className="text-xs sm:text-sm text-gray-700 font-sans">
          See what our wonderful guests have to say and leave your own feedback to help us grow.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 gsap-reveal">
        {/* Form left */}
        <div className="lg:col-span-5 bg-white border-2 border-[#111111] rounded-md p-6 space-y-4">
          <h3 className="font-display font-black text-lg uppercase text-[#e62419]">
            SHARE YOUR EXPERIENCE
          </h3>
          
          {reviewSuccessMessage && (
            <div className="bg-[#008f51]/10 border border-[#008f51] text-[#008f51] text-xs p-3 font-semibold">
              {reviewSuccessMessage}
            </div>
          )}

          <form onSubmit={submitReview} className="space-y-4 text-xs font-sans">
            <div className="space-y-1">
              <label className="block font-bold text-gray-700 uppercase">YOUR NAME:</label>
              <input 
                type="text" 
                required
                value={newReviewName}
                onChange={(e) => setNewReviewName(e.target.value)}
                placeholder="e.g., Lerato Mokoena"
                className="w-full border-2 border-[#111111] rounded-md bg-[#faf6ee] px-3 py-2 font-bold focus:bg-white outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block font-bold text-gray-700 uppercase">RATING (OUT OF 5 STARS):</label>
              <select 
                value={newReviewRating}
                onChange={(e) => setNewReviewRating(parseInt(e.target.value))}
                className="w-full border-2 border-[#111111] rounded-md bg-[#faf6ee] px-3 py-2 font-bold focus:bg-white outline-none cursor-pointer"
              >
                <option value="5">★★★★★ Excellent (5 Stars)</option>
                <option value="4">★★★★ Very Good (4 Stars)</option>
                <option value="3">★★★ Average (3 Stars)</option>
                <option value="2">★★ Disappointing (2 Stars)</option>
                <option value="1">★ Poor (1 Star)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block font-bold text-gray-700 uppercase">YOUR COMMENT:</label>
              <textarea 
                required
                rows={4}
                value={newReviewText}
                onChange={(e) => setNewReviewText(e.target.value)}
                placeholder="Tell us what you thought about our home-cooked traditional meals..."
                className="w-full border-2 border-[#111111] rounded-md bg-[#faf6ee] px-3 py-2 font-bold focus:bg-white outline-none resize-none"
              ></textarea>
            </div>

            {/* Verification Photo Field */}
            <div className="space-y-2">
              <label className="block font-bold text-[#111111] uppercase font-mono tracking-tight">
                VERIFY EXPERIENCE WITH A FOOD PHOTO *
              </label>
              <p className="text-[10px] text-gray-600 leading-normal">
                To maintain high-quality authentic reviews, please take or upload a photo of your food. Without a photo, your experience cannot be verified and won't be added.
              </p>

              {cameraActive ? (
                <div className="border-2 border-[#111111] rounded-md bg-black p-2 relative space-y-2">
                  <div className="absolute top-4 left-4 flex items-center space-x-1.5 bg-[#e62419] px-2 py-0.5 text-white text-[9px] font-bold uppercase animate-pulse z-10 font-mono">
                    <span className="h-2 w-2 rounded-full bg-white block"></span>
                    <span>LIVE CAMERA</span>
                  </div>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full bg-[#111111] h-48 object-cover border border-[#111111]"
                  ></video>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={capturePhoto}
                      className="flex-1 bg-white text-black border-2 border-[#111111] rounded-md hover:bg-[#111111] hover:text-white hover:border-[#111111] py-2 font-mono font-bold text-[10px] uppercase transition cursor-pointer"
                    >
                      📸 Capture Photo
                    </button>
                    <button
                      type="button"
                      onClick={stopCamera}
                      className="flex-1 bg-gray-800 text-white border-2 border-gray-800 hover:bg-transparent py-2 font-mono font-bold text-[10px] uppercase transition cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : newReviewImage ? (
                <div className="border-2 border-[#111111] rounded-md p-3 bg-green-50 space-y-2">
                  <div className="flex items-center justify-between text-[10px] text-[#008f51] font-bold font-mono uppercase">
                    <span>✓ Experience Verified with Food Photo</span>
                    <button
                      type="button"
                      onClick={() => setNewReviewImage("")}
                      className="text-red-600 hover:underline flex items-center gap-1 cursor-pointer font-bold uppercase"
                    >
                      <Trash2 className="h-3 w-3" /> Remove
                    </button>
                  </div>
                  <div className="h-40 border-2 border-[#111111] rounded-md overflow-hidden bg-gray-100 relative">
                    <img
                      src={newReviewImage}
                      alt="Captured traditional food"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    type="button"
                    onClick={startCamera}
                    className="flex-1 border-2 border-[#111111] rounded-md bg-white text-black px-3 py-2.5 font-mono font-bold text-[10px] uppercase flex items-center justify-center space-x-2 hover:bg-[#111111] hover:text-white transition cursor-pointer"
                  >
                    <Camera className="h-4 w-4" />
                    <span>Take Food Photo</span>
                  </button>
                  <label className="flex-1 border-2 border-[#111111] rounded-md bg-white text-black px-3 py-2.5 font-mono font-bold text-[10px] uppercase flex items-center justify-center space-x-2 hover:bg-[#111111] hover:text-white transition cursor-pointer text-center">
                    <Upload className="h-4 w-4" />
                    <span>Upload Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>

            {reviewError && (
              <div className="bg-[#e62419]/10 border border-[#e62419] text-[#e62419] p-3 font-semibold text-[10px] uppercase font-mono leading-relaxed">
                ⚠ {reviewError}
              </div>
            )}

            <button
              type="submit"
              disabled={submittingReview}
              onMouseMove={handleMagneticMove}
              onMouseLeave={handleMagneticLeave}
              className="w-full bg-[#e62419] text-white border-2 border-[#111111] rounded-md font-display font-black text-xs uppercase py-3 hover:bg-[#111111] transition cursor-pointer"
            >
              {submittingReview ? "SUBMITTING..." : "SUBMIT REVIEW"}
            </button>
          </form>
        </div>

        {/* Reviews List right */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="font-display font-black text-lg uppercase text-[#111111]">
            LATEST CUSTOMER REVIEWS
          </h3>
          
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            <AnimatePresence initial={false}>
              {reviews.length === 0 ? (
                <motion.div
                  key="no-reviews"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-[#faf6ee] border-2 border-dashed border-[#111111] p-10 text-center text-xs text-gray-500 font-sans"
                >
                  No reviews published yet. Be the first to share your experience!
                </motion.div>
              ) : (
                reviews.map((rev) => (
                  <motion.div
                    key={rev.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    layout
                    className="bg-[#faf6ee] border-2 border-[#111111] rounded-md p-5 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-display font-black text-sm uppercase text-[#111111]">{rev.name}</span>
                      <span className="text-[#ffbd12] text-xs font-bold">
                        {"★".repeat(rev.rating)}
                        {"☆".repeat(5 - rev.rating)}
                      </span>
                    </div>
                    
                    <p className="text-xs text-gray-700 leading-relaxed font-sans italic">
                      "{rev.text}"
                    </p>

                    {rev.foodImage && (
                      <div className="border-2 border-[#111111] rounded-md overflow-hidden bg-white max-h-56">
                        <img 
                          src={rev.foodImage} 
                          alt={`Food photo by ${rev.name}`} 
                          className="w-full object-cover max-h-56 block"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-gray-200 text-[10px] text-gray-500 font-mono">
                      <span>{rev.date}</span>
                      {rev.verified && (
                        <span className="text-[#008f51] font-bold flex items-center gap-1">
                          {rev.foodImage ? "📸 ✓ VERIFIED PHOTO" : "✓ VERIFIED GUEST"}
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
