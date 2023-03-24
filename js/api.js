const apiKey = "d01467e5642040a9a7fff538ed76dda7";
const baseUrl = "https://api.rawg.io/api/games";

export const buildSearchUrl = (searchTerm, pageSize, pageNumber) => {
  return `${baseUrl}?key=${apiKey}&search=${searchTerm}&page_size=${pageSize}&page=${pageNumber}`;
};

console.log("api.js loaded")