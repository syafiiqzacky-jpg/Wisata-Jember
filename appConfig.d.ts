export interface DestinationItem {
  id: string;
  name: string;
  category: string;
  district: string;
  openHours: string;
  bestTime: string;
  travelTimeFromCity: string;
  shortDescription: string;
  description: string;
  highlights: string[];
  image: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  location: string;
  caption: string;
  image: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  destination: string;
  quote: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface AppConfig {
  brandName: string;
  businessType: string;
  tagline: string;
  themeColor: {
    primary: string;
    accent: string;
    bgLight: string;
  };
  contact: {
    whatsapp: string;
    email: string;
    address: string;
  };
  heroImage: string;
  fallbackImage: string;
  products: DestinationItem[];
  gallery: GalleryItem[];
  testimonials: TestimonialItem[];
  faq: FaqItem[];
}

export declare const APP_CONFIG: AppConfig;
