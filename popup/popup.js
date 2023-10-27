// Parameters
const currencies = [
    'usdt', 'btc', 'eth', 'trx', 'doge', 'shib', 'bch', 'ltc', 'etc', 'ada',
    'bnb', 'eos', 'xlm', 'xrp', 'uni', 'link', 'dai', 'dot', 'aave', 'ftm',
    'matic', 'axs', 'mana', 'sand', 'avax', 'usdc', 'gmt', 'mkr', 'sol', 'atom',
    'grt', 'bat', 'near', 'ape', 'qnt', 'chz', 'xmr', 'egala', 'busd', 'algo',
    'hbar', '1inch', 'yfi', 'flow', 'snx', 'enj', 'crv', 'fil', 'wbtc', 'ldo',
    'dydx', 'apt', 'mask', 'comp', 'bal', 'lrc', 'lpt', 'ens', 'sushi', 'api3',
    'one', 'glm', 'dao', 'cvc', 'nmr', 'storj', 'snt', 'ant', 'zrx', 'slp',
    'egld', 'imx', 'blur', '100k_floki', '1b_babydoge', '1m_nft', '1m_btt', 't', 'celr', 'arb',
    'magic', 'gmx', 'band', 'cvx', 'ton', 'ssv', 'mdt', 'omg', 'wld', 'rdnt',
    'jst'
];
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
            logoUrls[curr] = chrome.runtime.getURL(`../assets/currencies/${curr}.svg`);
        });

        // Add usdt-rls row
        const usdtRlsLogo = `<span class="circle-logo">
            <img class="circle-logo-base" src="${logoUrls['usdt']}" />
            <img class="circle-logo-quote" src="${logoUrls['rls']}" />
        </span>`;
        const usdtRlsPrice = formatPrice(stats['usdt-rls']['latest'] / 10);
        tableBody.innerHTML += `<tr>
            <th>${index++}</th>
            <td>${usdtRlsLogo}</td>
            <td class="d-flex align-center mt-1">${usdtRlsPrice}</td>
            <td class="dayChange">-</td>
            <td>-</td>
        </tr>`;

        // Add other currency rows
        currencies.forEach(curr => {
            if (curr !== 'usdt') {
                pairs.forEach(pair => {
                    const baseLogo = `<span class="circle-logo">
                        <img class="circle-logo-base" src="${logoUrls[curr]}" />
                        <img class="circle-logo-quote" src="${logoUrls[pair]}" />
                    </span>`;
                    const price = formatPrice(stats[`${curr}-${pair}`]['latest'] / (pair == 'rls' ? 10 : 1));
                    const dayChange = stats[`${curr}-${pair}`]['dayChange'];
                    const dayChangeCssClass = dayChange > 0 ? 'positive' : 'negative';
                    const volumeSrc = formatPrice(stats[`${curr}-${pair}`]['volumeSrc']);
                    tableBody.innerHTML += `<tr>
                        <th>${index++}</th>
                        <td>${baseLogo}</td>
                        <td class="d-flex align-center mt-1">${price}</td>
                        <td class="dayChange ${dayChangeCssClass}">${dayChange}%</td>
                        <td>${volumeSrc}</td>
                    </tr>`;
                });
            }
        });
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

fetchApi();
