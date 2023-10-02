// supported currencies: BTC, ETH, and USDT
const nobitexApiUrl = "https://api.nobitex.ir/market/stats?srcCurrency=btc,usdt,eth&dstCurrency=rls,usdt";

// format currency price
function formatPrice(price) {
     return new Intl.NumberFormat('en-US').format(price)
}

// fetch currency price list
async function fetchAPIValue() {

     const response = await fetch(nobitexApiUrl);
     const json = await response.json();

     // extract stats value
     let value = json.stats;

     const tableBody = document.querySelector("#table-body");

     // BTC
     const btcUsdtPrice = formatPrice(value['btc-usdt']['latest'])
     const btcRialPrice = formatPrice(value['btc-rls']['latest'])
     tableBody.innerHTML += `<tr><td>BTC</td><td>${btcUsdtPrice}</td><td>${btcRialPrice}</td></tr>`

     // ETH
     const ethUsdtPrice = formatPrice(value['eth-usdt']['latest'])
     const ethRialPrice = formatPrice(value['eth-rls']['latest'])
     tableBody.innerHTML += `<tr><td>ETH</td><td>${ethUsdtPrice}</td><td>${ethRialPrice}</td></tr>`

     // USDT
     const usdtRialPrice = formatPrice(value['usdt-rls']['latest'])
     tableBody.innerHTML += `<tr><td>USDT</td><td>-</td><td>${usdtRialPrice}</td></tr>`

}

fetchAPIValue();
