var rippleDomain = 'https://data.ripple.com/';
var accountBalanceEnd = 'v2/accounts/hash/balances';

var colors = [];

$(function() {

  setTimeout(insertInfoButton, 8000, '.asksTable');
  setTimeout(insertInfoButton, 8000, '.bidsTable');

  function insertInfoButton(tableClass) {
    $('thead tr:first th', tableClass).attr('colspan', '4');
    $('.headerRow', tableClass).append('<th class="moreinfo">More <span>info</span></th>');

    $('tbody tr', tableClass).each(function(i, obj) {
      var title = $(obj).attr('title');

      title = title.split('\n');
      var $accountBalance = $('<td class="account-balance"></td>');

      for (var j = 0; j < title.length; j++) {
        if (typeof colors[title[j]] === 'undefined') {
          var x = Math.round(0xffffff * Math.random()).toString(16);
          var y = (6 - x.length);
          var z = '000000';
          var z1 = z.substring(0,y);
          colors[title[j]] = '#' + z1 + x;
        }

        $('<div class="user-color" title="'+ title[j] +'">')
          .css({'background-color': colors[title[j]]})
          .on('click', function() {
            var title = $(this).attr('title');
            getBalance(title);
          })
          .appendTo($accountBalance);
      }

      $accountBalance.appendTo(obj);
    });
  }

  function getBalance(title) {
    var url = rippleDomain + accountBalanceEnd.replace('hash', title);
    $.get(url, {}, function(data, textStatus, jqXHR) {
      var balances = '';

      for (var i = 0; i < data.balances.length; i++) {
        if (data.balances[i].value == 0) {
          continue;
        }
        balances += data.balances[i].currency + ' = ' + data.balances[i].value + '<br />';
      }

      var dialogTitle = (this.url).split('/')[5];
      $.dialog({
        title: '<a href="https://bithomp.com/explorer/' + dialogTitle + '" target="_blank">' + dialogTitle + '</a>',
        columnClass: 'col-xs-8 col-xs-offset-2 col-md-6 col-md-offset-3',
        theme: 'dark',
        content: '<div class="balance">' + balances + '</div>',
        draggable: true,
        dragWindowBorder: false,
        aimation: 'zoom',
        icon: 'icon-ripple',
      });
    });
  }
});

