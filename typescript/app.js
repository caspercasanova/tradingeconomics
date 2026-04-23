"use strict";
exports.__esModule = true;
var tradingeconomics_stream_1 = require("tradingeconomics-stream");
var key = '';
var secret = '';
if (process.env.apikey) {
    var apikey = process.env.apikey;
    if (apikey.includes(':')) {
        key = apikey.split(':')[0];
        secret = apikey.split(':')[1];
    }
}
if (!key || !secret) {
    throw new Error('API key is required. Please subscribe to a plan at https://tradingeconomics.com/api/pricing.aspx to get an API key.');
}
console.log("Credentials:", key);
var subscribe = function (asset) {
    var client = new tradingeconomics_stream_1.TEClient({
        key: key,
        secret: secret
    });
    client.subscribe(asset);
    client.on('message', function (msg) {
        console.log("Got price for asset ".concat(asset, ":"), msg.price);
    });
};
subscribe('EURUSD:CUR');
