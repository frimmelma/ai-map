// We'll use this for real API calls in the future
// import axios from 'axios';

// This is a mock service that simulates natural language processing
// In a real application, you would use a proper NLP service or API
export const processNaturalLanguage = async (query) => {
  // Simple keyword extraction
  const keywords = extractKeywords(query);

  // Return the most relevant keyword as the search term
  return keywords[0] || query;
};

// Simple keyword extraction function
const extractKeywords = (query) => {
  // List of common keywords in Czech
  const knownItems = [
    { keywords: ['zmrzlina', 'zmrzlinu', 'zmrzlinárna', 'zmrzlinárně'], searchTerm: 'zmrzlina' },
    { keywords: ['pivo', 'piva', 'pivnice', 'hospoda', 'hospodě', 'bar', 'baru'], searchTerm: 'hospoda' },
    { keywords: ['vajnos', 'víno', 'vína', 'vinárna', 'vinárně', 'alkohol'], searchTerm: 'vinárna' },
    { keywords: ['jídlo', 'restaurace', 'restauraci', 'oběd', 'večeře'], searchTerm: 'restaurace' },
    { keywords: ['káva', 'kávu', 'kavárna', 'kavárně', 'café'], searchTerm: 'kavárna' },
    { keywords: ['obchod', 'obchodě', 'nakupování', 'nákup', 'supermarket'], searchTerm: 'obchod' },
    { keywords: ['park', 'parku', 'zahrada', 'zahradě'], searchTerm: 'park' },
    { keywords: ['kino', 'kině', 'film', 'filmy'], searchTerm: 'kino' },
    { keywords: ['divadlo', 'divadle'], searchTerm: 'divadlo' },
    { keywords: ['muzeum', 'muzeu', 'galerie', 'galerii'], searchTerm: 'muzeum' },
    { keywords: ['hotel', 'hotelu', 'ubytování'], searchTerm: 'hotel' },
    { keywords: ['nemocnice', 'nemocnici', 'doktor', 'lékař', 'lékaře'], searchTerm: 'nemocnice' },
    { keywords: ['lékárna', 'lékárně'], searchTerm: 'lékárna' },
    { keywords: ['benzínka', 'benzínce', 'benzín', 'čerpací stanice'], searchTerm: 'čerpací stanice' },
    { keywords: ['bankomat', 'bankomatu', 'banka', 'banky'], searchTerm: 'bankomat' },
    { keywords: ['pošta', 'poště'], searchTerm: 'pošta' },
    { keywords: ['škola', 'škole', 'školy'], searchTerm: 'škola' },
    { keywords: ['knihovna', 'knihovně'], searchTerm: 'knihovna' },
    { keywords: ['kostel', 'kostele', 'chrám', 'chrámu'], searchTerm: 'kostel' },
    { keywords: ['policie', 'policii', 'policejní stanice'], searchTerm: 'policie' },
    { keywords: ['holky', 'holka', 'dívky', 'dívka', 'ženy', 'žena'], searchTerm: 'bar' },
  ];

  const lowerQuery = query.toLowerCase();
  const foundItems = [];

  knownItems.forEach(item => {
    item.keywords.forEach(keyword => {
      if (lowerQuery.includes(keyword)) {
        foundItems.push(item.searchTerm);
      }
    });
  });

  return foundItems.length > 0 ? foundItems : [query];
};

// Function to get nearby places
export const getNearbyPlaces = async (location, type, radius = 1000) => {
  // In a real application, you would use the Google Places API
  // This is a mock implementation
  const mockPlaces = [
    { name: 'Kavárna U Růže', distance: '120 m' },
    { name: 'Restaurace Na Rohu', distance: '250 m' },
    { name: 'Obchod Potraviny', distance: '300 m' },
    { name: 'Bar U Zelené žáby', distance: '450 m' },
    { name: 'Kino Světozor', distance: '600 m' }
  ];

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  return mockPlaces;
};
