// Parameters
const currencies = ['usdt', 'btc', 'eth', 'trx', 'doge'];
const pairs = ['usdt', 'rls'];
let index = 1;
const nobitex_api_url = `https://api.nobitex.ir/market/stats?srcCurrency=${currencies.join()}&dstCurrency=${pairs.join()}`;

// Format currency price
function formatPrice(price) {
    return new Intl.NumberFormat('en-US').format(price);
}

// Fetch currency price list
async function fetchApi() {
    try {
        const response = await fetch(nobitex_api_url);
        const data = await response.json();
        const stats = data.stats;
        const tableBody = document.querySelector("#table-body");
        
        // Load logos
        const logoUrls = {};
        currencies.concat(['rls']).forEach(curr => {
            logoUrls[curr] = chrome.runtime.getURL(`../assets/${curr}.svg`);
        });

        // Add usdt-rls row
        const usdtRlsLogo = `<span class="circle-logo">
            <img class="circle-logo-base" src="${logoUrls['usdt']}" />
            <img class="circle-logo-quote" src="${logoUrls['rls']}" />
        </span>`;
        const usdtRlsPrice = formatPrice(stats['usdt-rls']['latest']);
        tableBody.innerHTML += `<tr><th>${index++}</th><td>${usdtRlsLogo}</td><td class="d-flex align-center mt-1">${usdtRlsPrice}</td></tr>`;

        // Add other currency rows
        currencies.forEach(curr => {
            if (curr !== 'usdt') {
                pairs.forEach(pair => {
                    const baseLogo = `<span class="circle-logo">
                        <img class="circle-logo-base" src="${logoUrls[curr]}" />
                        <img class="circle-logo-quote" src="${logoUrls[pair]}" />
                    </span>`;
                    const price = formatPrice(stats[`${curr}-${pair}`]['latest']);
                    tableBody.innerHTML += `<tr><th>${index++}</th><td>${baseLogo}</td><td class="d-flex align-center mt-1">${price}</td></tr>`;
                });
            }
        });
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

fetchApi();
