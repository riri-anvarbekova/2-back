# 2-back
Introduction

This project is a web application. It shows information about a random person. The app gets data from four APIs: Random User API, REST Countries API, Exchange Rate API, and NewsData.io API. The backend uses Node.js, and all logic is in core.js. The frontend shows data in a clean and simple way with cards.
1️Main Function: getRandomUserData()
export async function getRandomUserData() {
  const userResponse = await fetch('https://randomuser.me/api/');
  const userData = await userResponse.json();
  const user = userData.results[0];

  const userInfo = {
    firstName: user.name.first,
    lastName: user.name.last,
    gender: user.gender,
    profilePicture: user.picture.large,
    age: user.dob.age,
    dob: user.dob.date,
    city: user.location.city,
    country: user.location.country,
    fullAddress: `${user.location.street.number} ${user.location.street.name}`
  };


What it does:

Gets a random user from Random User API.

Extracts important information: first name, last name, gender, profile picture, age, date of birth, city, country, and full address.

Then it calls other functions to get more information:

  const countryInfo = await getCountryInfo(userInfo.country);
  const exchangeRates = await getExchangeRates(countryInfo.currency);
  const news = await getNews(userInfo.country);


What it does:

getCountryInfo() gets data about the country.

getExchangeRates() gets currency rates.

getNews() gets five news articles.

Finally, it returns all information:

  return { userInfo, countryInfo, exchangeRates, news };
}

2️ Get Country Information: getCountryInfo(countryName)
async function getCountryInfo(countryName) {
  const res = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
  const data = await res.json();
  const country = data[0];

  return {
    name: country.name.common,
    capital: country.capital ? country.capital[0] : 'N/A',
    languages: country.languages ? Object.values(country.languages).join(', ') : 'N/A',
    currency: country.currencies ? Object.keys(country.currencies)[0] : 'N/A',
    flag: country.flags?.png || ''
  };
}


What it does:

Uses REST Countries API to get country details.

Extracts: country name, capital, languages, currency, and flag image.

If data is missing, it returns 'N/A' or empty values.

3️Get Exchange Rates: getExchangeRates(currencyCode)
async function getExchangeRates(currencyCode) {
  const res = await fetch(`https://open.er-api.com/v6/latest/${currencyCode}`);
  const data = await res.json();
  return { USD: data.rates.USD, KZT: data.rates.KZT };
}


What it does:

Gets exchange rates for the user’s currency.

Returns USD and KZT rates.

Makes it easy to show currency values on the frontend.

4️ Get News: getNews(countryName)
async function getNews(countryName) {
  const apiKey = process.env.NEWSDATA_API_KEY;
  const res = await fetch(`https://newsdata.io/api/1/news?apikey=${apiKey}&q=${countryName}&language=en`);
  const data = await res.json();
  return data.results.slice(0, 5).map(article => ({
    title: article.title,
    image: article.image_url,
    description: article.description,
    url: article.link
  }));
}


What it does:

Uses NewsData.io API to get five news articles about the user’s country.

Each article includes: title, image, description, and link to the full article.

Returns an empty array if no news is found.

/project-root
│
├─ server.js         # Main backend server
├─ core.js           # API logic and data processing
├─ package.json      # Project metadata and dependencies
├─ .env              # API keys (not shared)
└─ /public           # Frontend files
    ├─ index.html
    └─ style.css
This project shows how to use several APIs together to get interesting information about a random user. The app combines user data, country information, exchange rates, and news into one page
