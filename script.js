document.addEventListener('DOMContentLoaded', function () {
    // DOM Elements
    const globalStatsEl = document.getElementById('globalStats');
    const countryDataEl = document.getElementById('countryData');
    const loadingEl = document.getElementById('loading');
    const errorEl = document.getElementById('error');
    const searchBtn = document.getElementById('searchBtn');
    const countryInput = document.getElementById('countryInput');
    const lastUpdatedEl = document.getElementById('lastUpdated');

    // API URLs
    const ALL_COUNTRIES_URL = 'https://disease.sh/v3/covid-19/countries';
    const GLOBAL_URL = 'https://disease.sh/v3/covid-19/all';
    const COUNTRY_URL = 'https://disease.sh/v3/covid-19/countries/';

    // Fetch data functions
    async function fetchGlobalData() {
        try {
            showLoading();
            const response = await fetch(GLOBAL_URL);
            const data = await response.json();
            displayGlobalData(data);
            hideLoading();
        } catch (err) {
            showError('Failed to fetch global data. Please try again later.');
            hideLoading();
        }
    }

    async function fetchAllCountries() {
        try {
            showLoading();
            const response = await fetch(ALL_COUNTRIES_URL);
            const data = await response.json();
            displayCountryData(data);
            hideLoading();
        } catch (err) {
            showError('Failed to fetch country data. Please try again later.');
            hideLoading();
        }
    }

    async function fetchCountryData(country) {
        try {
            showLoading();
            const response = await fetch(`${COUNTRY_URL}${country}`);
            const data = await response.json();

            // Clear previous data
            countryDataEl.innerHTML = '';

            // Display single country data
            displayCountryData([data]);
            hideLoading();
        } catch (err) {
            showError('Country not found or there was an error fetching data.');
            hideLoading();
        }
    }

    // Display functions
    function displayGlobalData(data) {
        const date = new Date(data.updated);
        lastUpdatedEl.textContent = date.toLocaleString();

        globalStatsEl.innerHTML = `
            <div class="bg-white p-6 rounded-lg shadow-md">
                <h3 class="text-lg font-semibold text-gray-700 mb-2">Total Cases</h3>
                <p class="text-3xl font-bold text-blue-600">${formatNumber(data.cases)}</p>
                <p class="text-sm text-gray-500 mt-1">+${formatNumber(data.todayCases)} today</p>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-md">
                <h3 class="text-lg font-semibold text-gray-700 mb-2">Total Deaths</h3>
                <p class="text-3xl font-bold text-red-600">${formatNumber(data.deaths)}</p>
                <p class="text-sm text-gray-500 mt-1">+${formatNumber(data.todayDeaths)} today</p>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-md">
                <h3 class="text-lg font-semibold text-gray-700 mb-2">Total Recovered</h3>
                <p class="text-3xl font-bold text-green-600">${formatNumber(data.recovered)}</p>
                <p class="text-sm text-gray-500 mt-1">${Math.round((data.recovered / data.cases) * 100)}% recovery rate</p>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-md">
                <h3 class="text-lg font-semibold text-gray-700 mb-2">Active Cases</h3>
                <p class="text-3xl font-bold text-yellow-600">${formatNumber(data.active)}</p>
                <p class="text-sm text-gray-500 mt-1">${Math.round((data.active / data.cases) * 100)}% of total cases</p>
            </div>
        `;
    }

    function displayCountryData(countries) {
        countryDataEl.innerHTML = countries.map(country => `
            <tr>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                        <div class="flex-shrink-0 h-10 w-10">
                            <img class="h-10 w-10 rounded-full" src="${country.countryInfo?.flag || ''}" alt="${country.country} flag">
                        </div>
                        <div class="ml-4">
                            <div class="text-sm font-medium text-gray-900">${country.country}</div>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">${formatNumber(country.cases)}</div>
                    <div class="text-sm text-gray-500">+${formatNumber(country.todayCases)}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">${formatNumber(country.deaths)}</div>
                    <div class="text-sm text-gray-500">+${formatNumber(country.todayDeaths)}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">${formatNumber(country.recovered)}</div>
                    <div class="text-sm text-gray-500">${Math.round((country.recovered / country.cases) * 100)}%</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">${formatNumber(country.active)}</div>
                    <div class="text-sm text-gray-500">${Math.round((country.active / country.cases) * 100)}%</div>
                </td>
            </tr>
        `).join('');
    }

    // Helper functions
    function formatNumber(num) {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    }

    function showLoading() {
        loadingEl.classList.remove('hidden');
    }

    function hideLoading() {
        loadingEl.classList.add('hidden');
    }

    function showError(message) {
        errorEl.textContent = message;
        errorEl.classList.remove('hidden');
        setTimeout(() => {
            errorEl.classList.add('hidden');
        }, 5000);
    }

    // Event listeners
    searchBtn.addEventListener('click', () => {
        const country = countryInput.value.trim();
        if (country) {
            fetchCountryData(country);
        } else {
            showError('Please enter a country name');
        }
    });

    countryInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const country = countryInput.value.trim();
            if (country) {
                fetchCountryData(country);
            } else {
                showError('Please enter a country name');
            }
        }
    });

    // Initial load
    fetchGlobalData();
    fetchAllCountries();
});