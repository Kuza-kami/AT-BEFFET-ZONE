export interface Dish {
  id: string;
  name: string;
  xhosaName?: string;
  description: string;
  price?: number;
  category: "traditional" | "breakfast" | "lunch_meats" | "lunch_veggies" | "dessert" | "beverage";
  image: string;
  popular?: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  rating: number;
  text: string;
  date: string;
  verified: boolean;
  isUserCreated: boolean;
  foodImage?: string;
}

export interface Reservation {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  occasion: string;
  notes?: string;
  status: "confirmed" | "pending" | "cancelled";
  createdAt: string;
}

export interface CateringPackage {
  id: string;
  name: string;
  pricePerHead: number;
  starches: number;
  meats: number;
  veggies: number;
  salads: number;
  desserts: number;
  beverages: boolean;
  description: string;
  features: string[];
}

export const MENU_ITEMS: Dish[] = [
  // Traditional African Meals
  {
    id: "dish-1",
    name: "Mogodu",
    xhosaName: "Beef Tripe",
    description: "Slow-simmered, tenderly spiced traditional beef tripe prepared in its own savory natural broth. A legendary South African delicacy.",
    price: 85,
    category: "traditional",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600", // Grilled/stewed vibe
    popular: true
  },
  {
    id: "dish-2",
    name: "Samp & Beef Stew",
    xhosaName: "Isigwampa",
    description: "Creamy, slow-cooked cracked white maize and sugar beans served with premium chuck roast slow-braised with carrots and rich beef gravy.",
    price: 80,
    category: "traditional",
    image: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?auto=format&fit=crop&q=80&w=600", // Stew vibe
    popular: true
  },
  {
    id: "dish-3",
    name: "Hlakwana",
    xhosaName: "Beef Trotters",
    description: "Gelatinous, thick herb gravy-infused slow-braised beef trotters, stewed patiently until succulent and falling off the bone.",
    price: 90,
    category: "traditional",
    image: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&q=80&w=600", // Braised meat vibe
    popular: false
  },
  {
    id: "dish-4",
    name: "Steamed Dumplings",
    xhosaName: "Ujeqe",
    description: "Traditional soft, fluffy steam-baked bread dumplings, perfect for wiping up rich gravies and slow-cooked traditional broths.",
    price: 15,
    category: "traditional",
    image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&q=80&w=600", // Steamed buns/bread vibe
    popular: true
  },
  {
    id: "dish-5",
    name: "Hardbody Chicken Stew",
    xhosaName: "Umleqwa",
    description: "Robust, slow-cooked free-range village chicken, braised in a traditional onion and mild curry-herb broth for a firm, intensely flavorful meat.",
    price: 95,
    category: "traditional",
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&q=80&w=600", // Chicken stew vibe
    popular: false
  },
  {
    id: "dish-6",
    name: "Pap & Grilled Chuck",
    xhosaName: "Ipapa ne Chuck",
    description: "Traditional stiff white maize meal porridge served with a savory tomato and onion Chakalaka relish and charcoal-grilled tender chuck steak.",
    price: 85,
    category: "traditional",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600", // Grilled meat vibe
    popular: true
  },

  // Breakfast Buffet
  {
    id: "b-1",
    name: "Mabele & Soft Pap",
    description: "Warm, creamy, buttery ground sorghum or maize meal porridge served with honey, butter, and brown sugar.",
    category: "breakfast",
    image: "https://images.unsplash.com/photo-1578849278619-e73505e9610f?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "b-2",
    name: "Soweto Scramble & Wors",
    description: "Buffet style pan-scrambled eggs with chopped chives, pan-fried local beef boerewors, and slow-baked sweet white beans.",
    category: "breakfast",
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "b-3",
    name: "Steam-bread & Jam Set",
    description: "Daily fresh steam-bread served warm with apricot jam, butter, and cheddar cheese slices.",
    category: "breakfast",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=600"
  },

  // Lunch Buffet - Meats
  {
    id: "lm-1",
    name: "Slow-Braised Beef Stew",
    description: "Premium beef chunks braised in red wine, root vegetables, thyme, and rich brown gravy.",
    category: "lunch_meats",
    image: "https://images.unsplash.com/photo-1534939561126-855b8675edd7?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "lm-2",
    name: "Traditional Mogodu (Tripe)",
    description: "Slow-stewed, aromatic tripe seasoned with coarse salt and secret traditional broth spices.",
    category: "lunch_meats",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "lm-3",
    name: "Crispy Fish & Golden Chips",
    description: "Freshly battered deep-fried hake fillets seasoned with lemon pepper, served with home-cut crispy chips.",
    category: "lunch_meats",
    image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&q=80&w=600"
  },

  // Lunch Buffet - Veggies & Sides
  {
    id: "lv-1",
    name: "Creamed Spinach",
    description: "Fresh spinach leaves braised with chopped onions, sweet garlic, fresh cream, and nutmeg.",
    category: "lunch_veggies",
    image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "lv-2",
    name: "Sweet Cinnamon Butternut",
    description: "Roasted fresh butternut squash chunks glazed with cinnamon, honey, and a touch of butter.",
    category: "lunch_veggies",
    image: "https://images.unsplash.com/photo-1506806732259-39c2d0268443?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "lv-3",
    name: "Spicy Chakalaka Relish",
    description: "Gritted carrots, green peppers, baked beans, onions, and red chilies sauteed in a hot South African curry powder.",
    category: "lunch_veggies",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600",
    popular: true
  },

  // Desserts
  {
    id: "d-1",
    name: "Malva Pudding with Custard",
    description: "Warm, spongy sweet apricot-infused cake drenched in butter cream syrup, served with creamy vanilla custard.",
    category: "dessert",
    image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=600",
    popular: true
  },
  {
    id: "d-2",
    name: "Peppermint Crisp Tart",
    description: "Layers of crisp coconut biscuits, caramel treat pudding, fresh cream, and crushed peppermint chocolate bar.",
    category: "dessert",
    image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&q=80&w=600"
  },

  // Beverages
  {
    id: "bev-1",
    name: "Gemere (Traditional Ginger Beer)",
    description: "Authentic home-brewed sweet fermented ginger beer, served ice-cold with fresh pineapple accents.",
    price: 25,
    category: "beverage",
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=600",
    popular: true
  },
  {
    id: "bev-2",
    name: "Rooibos Ice Tea",
    description: "Freshly brewed herbal Rooibos tea with lemon, sweet honey, and mint leaves over ice.",
    price: 22,
    category: "beverage",
    image: "https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&q=80&w=600"
  }
];

export const CATERING_PACKAGES: CateringPackage[] = [
  {
    id: "cat-silver",
    name: "Silver Corporate Set",
    pricePerHead: 110,
    starches: 1,
    meats: 2,
    veggies: 2,
    salads: 1,
    desserts: 0,
    beverages: false,
    description: "Excellent for quick, professional government or office lunch breaks in Pretoria Central. Simple and satisfying.",
    features: [
      "1 starch of choice (e.g. Rice or Pap)",
      "2 meats (e.g. Beef Stew & Grilled Chicken)",
      "2 cooked vegetables (e.g. Spinach & Squash)",
      "1 fresh salad (e.g. Green Salad)",
      "Includes premium delivery & set up in Pretoria Central",
      "Traditional gravy & hot Chakalaka relish included"
    ]
  },
  {
    id: "cat-gold",
    name: "Gold Traditional Feast",
    pricePerHead: 140,
    starches: 2,
    meats: 3,
    veggies: 3,
    salads: 2,
    desserts: 1,
    beverages: false,
    description: "Our signature package. Perfect for client meetings, major group booking events, and traditional wedding parties.",
    features: [
      "2 starches of choice (including creamy Samp & soft Dumplings)",
      "3 meats (includes award-winning slow-cooked Mogodu)",
      "3 cooked vegetables of choice",
      "2 premium salads (e.g. Beetroot & Coleslaw)",
      "1 dessert choice (warm Malva pudding & custard)",
      "Chaffing dishes, server staff, and full setup included",
      "10% discount for orders over 50 people"
    ]
  },
  {
    id: "cat-platinum",
    name: "Platinum Royal Celebration",
    pricePerHead: 180,
    starches: 3,
    meats: 4,
    veggies: 4,
    salads: 3,
    desserts: 2,
    beverages: true,
    description: "A grand culinary experience with premium South African dishes, traditional drinks, and complete event hospitality.",
    features: [
      "3 starches of choice (Samp, Dumplings, and Basmati Rice)",
      "4 meats (Mogodu, Hlakwana trotters, Beef Stew, and Grilled Chicken)",
      "4 cooked vegetables of choice",
      "3 premium salads & relishes",
      "2 desserts (Malva Pudding and Peppermint Crisp Tart)",
      "Bottomless traditional Gemere (ginger beer) or soft drinks",
      "VIP server staff, customized buffet layout, tablecloths, and setup"
    ]
  }
];
