import { CreateListingInput } from '../types';

export const PROHIBITED_KEYWORDS = [
  'weapon',
  'gun',
  'knife',
  'firearm',
  'ammo',
  'ammunition',
  'drug',
  'weed',
  'marijuana',
  'prescription',
  'adderall',
  'xanax',
  'alcohol',
  'beer',
  'liquor',
  'vodka',
  'vape',
  'nicotine',
  'tobacco',
  'cigarette',
  'counterfeit',
  'replica',
  'exam paper',
  'leak',
  'cheating',
  'id card',
  'fake id',
];

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export function validateListingInput(input: Partial<CreateListingInput>): ValidationResult {
  const errors: Record<string, string> = {};

  // Photos
  if (!input.images || input.images.length === 0) {
    errors.images = 'At least one photograph of the item is required.';
  } else if (input.images.length > 6) {
    errors.images = 'Maximum of 6 photographs allowed.';
  }

  // Title
  const trimmedTitle = input.title?.trim() || '';
  if (!trimmedTitle) {
    errors.title = 'Title is required.';
  } else if (trimmedTitle.length < 4) {
    errors.title = 'Title must be at least 4 characters long.';
  } else if (trimmedTitle.length > 80) {
    errors.title = 'Title must be 80 characters or fewer.';
  }

  // Check prohibited words in title & description
  const combinedText = `${trimmedTitle} ${input.description || ''}`.toLowerCase();
  for (const keyword of PROHIBITED_KEYWORDS) {
    const regex = new RegExp(`\\b${keyword}\\b`, 'i');
    if (regex.test(combinedText)) {
      errors.prohibited = `Item violates campus safety policy: references "${keyword}". Please review permitted campus items.`;
      break;
    }
  }

  // Category
  if (!input.category || input.category === 'all') {
    errors.category = 'Please select a product category.';
  }

  // Condition
  if (!input.condition) {
    errors.condition = 'Please specify the item condition.';
  }

  // Listing Type & Price / Exchange
  if (!input.listingType) {
    errors.listingType = 'Please select a listing type (Sell, Exchange, or Free).';
  } else {
    if (input.listingType === 'sell') {
      const price = Number(input.price);
      if (isNaN(price) || price <= 0) {
        errors.price = 'Please enter a valid price greater than $0.';
      } else if (price > 10000) {
        errors.price = 'Price exceeds maximum campus marketplace limit ($10,000).';
      }
    } else if (input.listingType === 'exchange') {
      const trimmedExchange = input.exchangeFor?.trim() || '';
      if (!trimmedExchange) {
        errors.exchangeFor = 'Please specify what item you want in exchange.';
      } else if (trimmedExchange.length < 3) {
        errors.exchangeFor = 'Exchange description must be at least 3 characters.';
      }
    }
  }

  // Description
  const trimmedDesc = input.description?.trim() || '';
  if (!trimmedDesc) {
    errors.description = 'A brief description is required.';
  } else if (trimmedDesc.length < 10) {
    errors.description = 'Description must be at least 10 characters long.';
  } else if (trimmedDesc.length > 1000) {
    errors.description = 'Description must be 1,000 characters or fewer.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

