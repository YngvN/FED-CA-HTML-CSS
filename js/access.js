const clientId = 'sissdenr6blv6shlyjwtxycs8axvuh';
const accessToken = '9xy8y0n44f2izzlck6r4jlmfv6bwiy';

// const url = 'https://api.igdb.com/v4/games';

// const options = {
//   method: 'GET',
//   headers: {
//     'Client-ID': clientId,
//     'Authorization': `Bearer ${accessToken}`
//   },
//   body: 'fields name, cover.url; where id = 7346;'
// };

// fetch(url, options)
//   .then(response => response.json())
//   .then(data => {
//     console.log(data); // Log the data to the console to see if it's being fetched correctly
//     const game = data[0];
//     const title = game.name;
//     const coverUrl = game.cover.url;

//     // Update the HTML with the game title and cover image
//     const titleElem = document.getElementById('game-title');
//     titleElem.innerText = title;

//     const coverElem = document.getElementById('game-cover');
//     coverElem.src = `https:${coverUrl}`;
//   })
//   .catch(error => console.log(error));

//   const gameId = 7346;

fetch(`https://api.igdb.com/v4/games`, {
  method: 'POST',
  headers: {
    'Client-ID': clientId,
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'text/plain'
  },
  body: `fields name, cover.url; where id = ${gameId};`
})
.then(response => response.json())
.then(data => {
  const game = data[0];
  const title = game.name;
  const coverUrl = game.cover.url;

  // Update the HTML with the game title and cover image
  const titleElem = document.getElementById('game-title');
  titleElem.innerText = title;

  const coverElem = document.getElementById('game-cover');
  coverElem.src = `https:${coverUrl}`;
})
.catch(error => console.log(error));