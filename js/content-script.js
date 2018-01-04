var rippleDomain = 'https://data.ripple.com/';
var accountBalanceEnd = 'v2/accounts/hash/balances';
$(function() {

  setTimeout(insertInfoButton, 6000, '.asksTable');
  setTimeout(insertInfoButton, 6000, '.bidsTable');

  function insertInfoButton(tableClass) {
    $('thead tr:first th', tableClass).attr('colspan', '4');
    $('.headerRow', tableClass).append('<th>Account balance</th>');

    $('tbody tr', tableClass).each(function(i, obj) {
      $('<td class="account-balance"><span>[+info]</span></td>')
      .on('click', function() {
        var title = $(this).parent().attr('title');
        getBalance(title);
      })
      .appendTo(obj);;
    });
  }

  function getBalance(title) {
    title = title.split('\n');

    var url = '';
    for (var j = 0; j < title.length; j++) {
      url = rippleDomain + accountBalanceEnd.replace('hash', title[j]);
      $.get(url, {}, function(data, textStatus, jqXHR) {
        var balances = '';
        for (var i = 0; i < data.balances.length; i++) {
          if (data.balances[i].value == 0) {
            continue;
          }
          balances += data.balances[i].currency + ' = ' + data.balances[i].value + '<br />';
        }

        $.dialog({
          title: (this.url).split('/')[5],
          columnClass: 'col-md-6 col-md-offset-3',
          theme: 'dark',
          content: '<div class="balance">' + balances + '</div>',
          draggable: true,
          dragWindowBorder: false,
          aimation: 'zoom',
          icon: 'icon-ripple'
        });
      });
    }
  }
});

