// Category organization and display utilities

export const CATEGORY_ORDER = [
  'electronics',
  'home and kitchen',
  "men's clothing",
  "women's clothing",
  'beauty and personal care',
  'jewelry'
];

export const CATEGORY_DISPLAY_NAMES: Record<string, string> = {
  'electronics': 'Electronics',
  'home and kitchen': 'Home and Kitchen',
  "men's clothing": "Men's Clothing",
  "women's clothing": "Women's Clothing",
  'beauty and personal care': 'Beauty & Personal Care',
  'jewelry': 'Jewelry'
};

// Electronics subcategories - organized by popularity and product count
export const ELECTRONICS_SUBCATEGORIES = [
  'Laptops',
  'PCs', 
  'Headphones',
  'TV Streaming',
  'Fitness Wearables',
  'Cameras',
  'Printers',
  'eReaders',
  'Smart Bulbs',
  'Sound Bars',
  'Smartphones',
  'Bluetooth Speakers'
];

// Home and Kitchen subcategories
export const HOME_KITCHEN_SUBCATEGORIES = [
  'Kitchen Appliances',
  'Home Decor',
  'Storage & Organization',
  'Cleaning Supplies',
  'Garden & Outdoor'
];

// Beauty and Personal Care subcategories
export const BEAUTY_PERSONAL_CARE_SUBCATEGORIES = [
  'Skincare',
  'Makeup',
  'Hair Care',
  'Personal Care',
  'Fragrance'
];

// Jewelry subcategories
export const JEWELRY_SUBCATEGORIES = [
  'Necklaces',
  'Earrings',
  'Bracelets',
  'Rings',
  'Watches'
];

export const ELECTRONICS_SUBCATEGORY_DISPLAY_NAMES: Record<string, string> = {
  'Laptops': 'Laptops',
  'PCs': 'Desktop PCs',
  'Headphones': 'Headphones & Earbuds',
  'TV Streaming': 'TV & Streaming',
  'Fitness Wearables': 'Fitness & Wearables',
  'Cameras': 'Cameras',
  'Printers': 'Printers',
  'eReaders': 'eReaders',
  'Smart Bulbs': 'Smart Lighting',
  'Sound Bars': 'Sound Bars',
  'Smartphones': 'Smartphones',
  'Bluetooth Speakers': 'Bluetooth Speakers'
};

export const HOME_KITCHEN_SUBCATEGORY_DISPLAY_NAMES: Record<string, string> = {
  'Kitchen Appliances': 'Kitchen Appliances',
  'Home Decor': 'Home Decor',
  'Storage & Organization': 'Storage & Organization',
  'Cleaning Supplies': 'Cleaning Supplies',
  'Garden & Outdoor': 'Garden & Outdoor'
};

export const BEAUTY_PERSONAL_CARE_SUBCATEGORY_DISPLAY_NAMES: Record<string, string> = {
  'Skincare': 'Skincare',
  'Makeup': 'Makeup',
  'Hair Care': 'Hair Care',
  'Personal Care': 'Personal Care',
  'Fragrance': 'Fragrance'
};

export const JEWELRY_SUBCATEGORY_DISPLAY_NAMES: Record<string, string> = {
  'Necklaces': 'Necklaces',
  'Earrings': 'Earrings',
  'Bracelets': 'Bracelets',
  'Rings': 'Rings',
  'Watches': 'Watches'
};

export function getCategoryDisplayName(category: string): string {
  return CATEGORY_DISPLAY_NAMES[category] || category.charAt(0).toUpperCase() + category.slice(1);
}

export function getElectronicsSubcategoryDisplayName(subcategory: string): string {
  return ELECTRONICS_SUBCATEGORY_DISPLAY_NAMES[subcategory] || subcategory;
}

export function getHomeKitchenSubcategoryDisplayName(subcategory: string): string {
  return HOME_KITCHEN_SUBCATEGORY_DISPLAY_NAMES[subcategory] || subcategory;
}

export function getBeautyPersonalCareSubcategoryDisplayName(subcategory: string): string {
  return BEAUTY_PERSONAL_CARE_SUBCATEGORY_DISPLAY_NAMES[subcategory] || subcategory;
}

export function getJewelrySubcategoryDisplayName(subcategory: string): string {
  return JEWELRY_SUBCATEGORY_DISPLAY_NAMES[subcategory] || subcategory;
}

export function sortCategoriesByOrder(categories: string[]): string[] {
  return categories.sort((a, b) => {
    const aIndex = CATEGORY_ORDER.indexOf(a);
    const bIndex = CATEGORY_ORDER.indexOf(b);
    
    // If both categories are in the order array, sort by their position
    if (aIndex !== -1 && bIndex !== -1) {
      return aIndex - bIndex;
    }
    
    // If only one is in the order array, prioritize it
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    
    // If neither is in the order array, sort alphabetically
    return a.localeCompare(b);
  });
}

export function sortElectronicsSubcategoriesByOrder(subcategories: string[]): string[] {
  return subcategories.sort((a, b) => {
    const aIndex = ELECTRONICS_SUBCATEGORIES.indexOf(a);
    const bIndex = ELECTRONICS_SUBCATEGORIES.indexOf(b);
    
    // If both subcategories are in the order array, sort by their position
    if (aIndex !== -1 && bIndex !== -1) {
      return aIndex - bIndex;
    }
    
    // If only one is in the order array, prioritize it
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    
    // If neither is in the order array, sort alphabetically
    return a.localeCompare(b);
  });
}