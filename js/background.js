chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.create({ url: 'https://xrpcharts.ripple.com/#/markets/XRP/USD:rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B?interval=15m&range=1d&type=line' });
});