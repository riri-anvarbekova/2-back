import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

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

  const countryInfo = await getCountryInfo(userInfo.country);

  const exchangeRates = await getExchangeRates(countryInfo.currency);

  const news = await getNews(userInfo.country);

  return { userInfo, countryInfo, exchangeRates, news };
}

async function getCountryInfo(countryName) {
  try {
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
  } catch (err) {
    return { name: countryName, capital: 'N/A', languages: 'N/A', currency: 'N/A', flag: '' };
  }
}

async function getExchangeRates(currencyCode) {
  try {
    const res = await fetch(`https://open.er-api.com/v6/latest/${currencyCode}`);
    const data = await res.json();
    return { USD: data.rates.USD, KZT: data.rates.KZT };
  } catch (err) {
    return { USD: 'N/A', KZT: 'N/A' };
  }
}

async function getNews(countryName) {
  try {
    const apiKey = process.env.NEWSDATA_API_KEY;
    const res = await fetch(`https://newsdata.io/api/1/news?apikey=${apiKey}&q=${countryName}&language=en`);
    const data = await res.json();
    return data.results.slice(0, 5).map(article => ({
      title: article.title,
      image: article.image_url,
      description: article.description,
      url: article.link
    }));
  } catch (err) {
    return [];
  }
}
