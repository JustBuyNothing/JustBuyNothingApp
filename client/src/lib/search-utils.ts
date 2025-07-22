// Search utilities for enhanced product search

export interface SearchableProduct {
  id: number;
  title: string;
  description?: string;
  features?: string[];
  category: string;
  subcategory?: string;
  price: string;
  rating: string;
}

export interface SearchResult {
  product: SearchableProduct;
  relevanceScore: number;
  matchType: 'title' | 'description' | 'features' | 'category' | 'subcategory';
}

export function searchProducts(
  products: SearchableProduct[],
  searchTerm: string,
  categoryFilter: string = 'all'
): SearchableProduct[] {
  if (!searchTerm) {
    return products.filter(product => 
      categoryFilter === 'all' || product.category === categoryFilter
    );
  }

  const searchLower = searchTerm.toLowerCase();
  const results: SearchResult[] = [];

  for (const product of products) {
    // Skip if doesn't match category filter
    if (categoryFilter !== 'all' && product.category !== categoryFilter) {
      continue;
    }

    let relevanceScore = 0;
    let matchType: SearchResult['matchType'] = 'title';

    // Check title match (highest priority)
    if (product.title.toLowerCase().includes(searchLower)) {
      relevanceScore += 100;
      matchType = 'title';
    }

    // Check description match
    if (product.description?.toLowerCase().includes(searchLower)) {
      relevanceScore += 50;
      if (relevanceScore < 50) matchType = 'description';
    }

    // Check features match
    if (product.features?.some(feature => 
      feature.toLowerCase().includes(searchLower)
    )) {
      relevanceScore += 30;
      if (relevanceScore < 30) matchType = 'features';
    }

    // Check category match
    if (product.category.toLowerCase().includes(searchLower)) {
      relevanceScore += 20;
      if (relevanceScore < 20) matchType = 'category';
    }

    // Check subcategory match
    if (product.subcategory?.toLowerCase().includes(searchLower)) {
      relevanceScore += 15;
      if (relevanceScore < 15) matchType = 'subcategory';
    }

    // Add to results if any match found
    if (relevanceScore > 0) {
      results.push({
        product,
        relevanceScore,
        matchType
      });
    }
  }

  // Sort by relevance score (highest first)
  results.sort((a, b) => b.relevanceScore - a.relevanceScore);

  return results.map(result => result.product);
}

export function highlightSearchTerm(text: string, searchTerm: string): string {
  if (!searchTerm) return text;
  
  const regex = new RegExp(`(${searchTerm})`, 'gi');
  return text.replace(regex, '<mark class="bg-yellow-200 text-yellow-900 px-1 rounded">$1</mark>');
}

export function getSearchSuggestions(
  products: SearchableProduct[],
  searchTerm: string
): string[] {
  if (!searchTerm || searchTerm.length < 2) return [];

  const searchLower = searchTerm.toLowerCase();
  const suggestions = new Set<string>();

  for (const product of products) {
    // Add title words that start with search term
    const titleWords = product.title.toLowerCase().split(' ');
    for (const word of titleWords) {
      if (word.startsWith(searchLower) && word !== searchLower) {
        suggestions.add(word);
      }
    }

    // Add category suggestions
    if (product.category.toLowerCase().includes(searchLower)) {
      suggestions.add(product.category);
    }

    // Add subcategory suggestions
    if (product.subcategory?.toLowerCase().includes(searchLower)) {
      suggestions.add(product.subcategory);
    }

    // Add feature suggestions
    if (product.features) {
      for (const feature of product.features) {
        const featureWords = feature.toLowerCase().split(' ');
        for (const word of featureWords) {
          if (word.startsWith(searchLower) && word !== searchLower) {
            suggestions.add(word);
          }
        }
      }
    }
  }

  return Array.from(suggestions).slice(0, 5); // Return top 5 suggestions
}