document.getElementById("submitBtn").addEventListener("click", async function () {
    const countryName = document.getElementById("countryName").value.trim();

    if (!countryName) {
        alert("Please enter a country!");
        return;
    }

    await getCountryDetails(countryName);
});

async function getCountryDetails(countryName) {
    try {
        const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`);
        
        if (!response.ok) {
            throw new Error("Country not found!");
        }

        const data = await response.json();
        const country = data[0];

        const capital = country.capital ? country.capital[0] : "N/A";
        const population = country.population ? country.population.toLocaleString() : "N/A";
        const region = country.region || "N/A";
        const flag = country.flags.svg || "";
        const borders = country.borders || [];

        document.getElementById("countryInfo").innerHTML = `
            <h2>${countryName}</h2>
            <ul>
                <li>Capital: ${capital}</li>
                <li>Population: ${population}</li>
                <li>Region: ${region}</li>
                <li>Flag: <img src="${flag}" alt="${countryName} Flag" style="width: 100px;"></li>
            </ul>
        `;

        if (borders.length > 0) {
            await getBorders(borders);
        } else {
            document.getElementById("borderingCountries").innerHTML = "<h3>No neighboring countries.</h3>";
        }

    } catch (error) {
        document.getElementById("countryInfo").innerHTML = `<p>${error.message}</p>`;
        document.getElementById("borderingCountries").innerHTML = '';
    }
}

async function getBorders(borderCountries) {
    try {
        const response = await fetch(`https://restcountries.com/v3.1/alpha?codes=${borderCountries.join(",")}`);
        
        if (!response.ok) {
            throw new Error("Couldn't fetch bordering countries!");
        }

        const neighbors = await response.json();

        let neighborHTML = neighbors.map(neighbor => `
            <li>
                ${neighbor.name.common}
                <img src="${neighbor.flags.png}" alt="${neighbor.name.common} Flag" style="width: 50px;" />
            </li>
        `).join("");

        document.getElementById("borderingCountries").innerHTML = `
            <h3>Neighboring Countries</h3>
            <ul>${neighborHTML}</ul>
        `;
        
    } catch (error) {
        document.getElementById("borderingCountries").innerHTML = `<p>${error.message}</p>`;
    }
}
