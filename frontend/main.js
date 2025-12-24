document.getElementById('getUserBtn').addEventListener('click', async () => {
  const userCard = document.getElementById('userCard');
  userCard.innerHTML = `<p>Loading...</p>`;

  try {
    // -------- GET RANDOM USER --------
    const userResponse = await fetch('/randomuser');
    if (!userResponse.ok) throw new Error('Failed to fetch user');
    const userData = await userResponse.json();
    const user = {
      firstName: userData.name.first,
      lastName: userData.name.last,
      gender: userData.gender,
      age: userData.dob.age,
      dob: userData.dob.date,
      city: userData.location.city,
      country: userData.location.country,
      address: `${userData.location.street.number} ${userData.location.street.name}`,
      profilePicture: userData.picture.large
    };

    // -------- GET COUNTRY INFO --------
    const countryResponse = await fetch(`/country?country=${encodeURIComponent(user.country)}`);
    if (!countryResponse.ok) throw new Error('Failed to fetch country');
    const countryData = await countryResponse.json();
    const country = {
      capital: countryData.capital ? countryData.capital[0] : 'N/A',
      languages: countryData.languages ? Object.values(countryData.languages).join(', ') : 'N/A',
      currency: countryData.currencies ? Object.keys(countryData.currencies)[0] : 'N/A',
      flag: countryData.flags ? countryData.flags.png : ''
    };

    // -------- GET EXCHANGE RATE --------
    const exchangeResponse = await fetch(`/currency?currency=${encodeURIComponent(country.currency)}`);
    if (!exchangeResponse.ok) throw new Error('Failed to fetch exchange rates');
    const exchangeData = await exchangeResponse.json();

    // -------- GET NEWS --------
    const newsResponse = await fetch('/news');
    if (!newsResponse.ok) throw new Error('Failed to fetch news');
    const newsData = await newsResponse.json();

    // -------- RENDER USER CARD --------
    userCard.innerHTML = `
      <div>
        <img src="${user.profilePicture}" alt="Profile Picture">
        <h2>${user.firstName} ${user.lastName}</h2>
        <p>Gender: ${user.gender}</p>
        <p>Age: ${user.age}</p>
        <p>DOB: ${new Date(user.dob).toLocaleDateString()}</p>
        <p>City: ${user.city}</p>
        <p>Country: ${user.country}</p>
        <p>Address: ${user.address}</p>
      </div>
      <div>
        <h3>Country Info</h3>
        <p>Capital: ${country.capital}</p>
        <p>Languages: ${country.languages}</p>
        <p>Currency: ${country.currency}</p>
        <img src="${country.flag}" alt="Flag" style="width:100px;">
      </div>
      <div>
        <h3>Exchange Rates</h3>
        <p>1 ${country.currency} = ${exchangeData.conversion_rates?.USD || 'N/A'} USD</p>
        <p>1 ${country.currency} = ${exchangeData.conversion_rates?.KZT || 'N/A'} KZT</p>
      </div>
      <div id="newsSection">
        <h3>News</h3>
      </div>
    `;

    // -------- RENDER NEWS --------
    const newsHTML = newsData.articles.map(article => `
      <div class="news-card">
        ${article.image ? `<img src="${article.image}" alt="News Image">` : ''}
        <div>
          <h4>${article.title}</h4>
          <p>${article.description || ''}</p>
          <a href="${article.url}" target="_blank">Read more</a>
        </div>
      </div>
    `).join('');

    document.getElementById('newsSection').innerHTML = newsHTML;

  } catch (err) {
    console.error(err);
    userCard.innerHTML = `<p>Error loading data: ${err.message}</p>`;
  }
});
