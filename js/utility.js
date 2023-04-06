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

export async function fetchGameById(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log("Game data fetched:", data);
    return data;
  } catch (error) {
    console.error("Error fetching game data:", error);
    return null;
  }
}



// export const fetchGameById = async (gameId) => {
//   try {
//     const response = await fetch(`https://api.rawg.io/api/games/${gameId}`);
//     const game = await response.json();
//     const price = generateRandomPrice(game.id);
//     const description = game.description || await fetchGameDetails(game.id);
//     const genres = game.genres.slice(0, 2);
//     const platforms = game.platforms.slice(0, 2);
//     const developer = game.developers.map(developer => developer.name).join(', ');
//     const releaseDate = new Date(game.released).toLocaleDateString();
//     return { ...game, price, description, genres, platforms, developer, releaseDate };
//   } catch (error) {
//     console.error("Error fetching data:", error);
//     return null;
//   }
// };


// const form = document.getElementById("nav-login");

// form.addEventListener("submit", (event) => {
//   event.preventDefault();

//   const successMessage = document.createElement("p");
//   successMessage.textContent = "Success! You have logged in.";

//   form.appendChild(successMessage);
// });
