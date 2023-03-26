const apiKey = "d01467e5642040a9a7fff538ed76dda7";
const baseUrl = "https://api.rawg.io/api";




export const fetchData = async (url) => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    const games = data.results.map(async (game) => {
      let price = generateRandomPrice(game.id);
      let description = game.description;
      if (!description) {
        description = await fetchGameDetails(game.id);
      }
      return { ...game, price, description };
    });
    return Promise.all(games);
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

export const fetchGameDetails = async (id) => {
  try {
    const url = `${baseUrl}/games/${id}?key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.description_raw;
  } catch (error) {
    console.error(`Error fetching game details for ID ${id}:`, error);
    return "";
  }
};

