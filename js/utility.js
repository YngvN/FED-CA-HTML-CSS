export const fetchData = async (url) => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    const games = data.results.map((game) => {
      const price = generateRandomPrice(game.id);
      return { ...game, price };
    });
    return games;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }

};

const generateRandomPrice = (id) => {
  const randomPrice = (Math.floor(Math.random() * 56) + 5) + 0.95;
  localStorage.setItem(`price_${id}`, randomPrice.toFixed(2));
  return randomPrice.toFixed(2);
};

console.log("utility.js loaded")