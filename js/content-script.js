var rippleDomain = 'https://data.ripple.com/';
var accountBalanceEnd = 'v2/accounts/hash/balances';
$(function() {

  setTimeout(showAccountBalance, 5000, '.asksTable');
  setTimeout(showAccountBalance, 5000, '.bidsTable');

  function showAccountBalance(table) {
    $('thead tr:first th', table).attr('colspan', '4');
    $('.headerRow', table).append('<th>Account balance</th>');
    $('tbody tr', table).each(function(i, obj) {
      $(obj).append('<td class="account-balance"></td>');
      var title = $(obj).attr('title').split('\n');

      var url = '';
      for (var j = 0; j < title.length; j++) {
        url = rippleDomain + accountBalanceEnd.replace('hash', title[j]);
        $.get(url, {}, function(data) {
          var balances = '';
          for (var i = 0; i < data.balances.length; i++) {
            if (data.balances[i].value == 0) {
              continue;
            }
            balances += data.balances[i].currency + ' = ' + data.balances[i].value + '<br />';
          }

          $('.account-balance', obj).append(balances);
          $('.account-balance', obj).append('---------------<br />');
        });
      }
    });
  }
});

