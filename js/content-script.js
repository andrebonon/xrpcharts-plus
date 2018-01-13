var RIPPLE_DOMAIN = 'https://data.ripple.com/',
    BALANCES_ENDPOINT = 'v2/accounts/accountHash/balances';
    DONATE_HASH = 'rEragc9BrrDjtCAoHYvCULYSbQx3gkiXxW';

var colors = [];

var XRPChartsPins = {
  init: function() {
    var that = this;
    this.insertMoreInfoHeaders();

    var $tableTR = $('#bookTables table tbody tr');
    var $objTD = $('<td class="account-balance"></td>');
    $objTD.appendTo($tableTR);

    this.buildPins($tableTR);
    setInterval(function() { that.buildPins($tableTR); }, 500);
  },

  buildPins: function($tableTR) {
    var that = this;
    $tableTR.each(function(i, objTR) {
      var $objTR = $(this);
      var accountHash = $objTR.attr('title').split('\n');
      var $trTD = $('td.account-balance', $objTR);
      $trTD.html('');
      $objTR.css({
        'border': '0px'
      });
      that.getMoreInfoCell(accountHash, $trTD);
    });
  },

  insertMoreInfoHeaders: function() {
    $('.bidsTable thead tr:first th', '#bookTables').attr('colspan', '4');
    $('.asksTable thead tr:first th', '#bookTables').attr('colspan', '4');
    $('.headerRow', '#bookTables').append('<th class="moreinfo">More <span>info</span></th>');
  },

  getMoreInfoCell: function(accountHash, $objTD) {
    for (var j = 0; j < accountHash.length; j++) {
      // Get colors.
      if (typeof colors[accountHash[j]] === 'undefined') {
        colors[accountHash[j]] = this.getHexColor();
      }

      // Create pins.
      var $pinCircle = this.getPinCircle(accountHash[j]);
      $pinCircle.appendTo($objTD);
    }
  },

  getHexColor: function() {
    var num = Math.round(0xffffff * Math.random()).toString(16);
    var diff = (6 - num.length);
    var format = '000000';
    var hexa = format.substring(0,diff);

    return '#' + hexa + num;
  },

  getPinCircle: function(accountHash) {
    var that = this;
    var $userPin = $('<div class="user-pin ' + accountHash + '" title="'+ accountHash +'">');

    $userPin
      .css({
        'background-color': colors[accountHash]
      })
      .on('click', function() {
        var accountHash = $(this).attr('title');
        that.getBalance(accountHash);
      })
      .mouseenter(function() {
        var $pins = $('.user-pin.' + accountHash);

        $pins.addClass('focused');

        $tr = $('.user-pin.' + accountHash).parent().parent();
        $tr.css({
          'border-right': '1px solid #fff'
        });
      })
      .mouseleave(function() {
        var $pins = $('.user-pin.' + accountHash);

        $pins.removeClass('focused');

        $tr = $('.user-pin.' + accountHash).parent().parent();
        $tr.css({
          'border': '0px'
        });
      });

    return $userPin;
  },

  getBalance: function(accountHash) {
    var url = RIPPLE_DOMAIN + BALANCES_ENDPOINT.replace('accountHash', accountHash);
    $.get(url, {}, function(data, textStatus, jqXHR) {
      var balances = '';

      for (var i = 0; i < data.balances.length; i++) {
        if (data.balances[i].value == 0) {
          continue;
        }
        balances += data.balances[i].currency + ' = ' + data.balances[i].value + '<br />';
      }

      var dialogTitle = (this.url).split('/')[5];
      $.confirm({
        title: 'Account Balance',
        columnClass: 'col-xs-8 col-xs-offset-2 col-md-6 col-md-offset-3',
        theme: 'dark',
        content: '<div class="account-title"><a href="https://bithomp.com/explorer/' + dialogTitle + '" target="_blank">' + dialogTitle + '</a></div><div class="balance">' + balances + '</div>',
        draggable: true,
        dragWindowBorder: false,
        aimation: 'zoom',
        icon: 'icon-ripple',
        closeIcon: true,
        type: 'blue',
        typeAnimated: true,
        buttons: {
          beer: {
            btnClass: 'btn-blue',
            text:'Donate =)',
            action: function() {
              var $temp = $('<input>');
              $('body').append($temp);
              $temp.val(DONATE_HASH).select();
              document.execCommand('copy');
              $temp.remove();

              $.alert('How do you like it? I hope your encouragement.<br /><br /><strong>' + DONATE_HASH + '</strong> <br /> Copied!');
              return false;
            }
          },
        }
      });
    });
  },
};

// Document Ready.
$(function() {

  var bidsTable = false;
  var asksTable = false;
  var displayTable = false;
  var observer = new MutationObserver(function(mutations) {
    // For the sake of...observation...let's listen the mutation and
    // stop it when we find the asksTable and bidsTable
    try {
      mutations.forEach(function(mutation) {
        if (bidsTable && asksTable && displayTable) {
          throw "loaded";
        }

        if (mutation.target.id !== 'bookTables') {
          return;
        }

        if (typeof mutation.target.attributes.style !== 'undefined' && mutation.target.attributes.style.value == 'opacity: 1;') {
          displayTable = true;
        }

        if (typeof mutation.addedNodes[0] === 'undefined') {
          return;
        }

        if (mutation.addedNodes[0].className == 'bidsTable') {
          bidsTable = true;
        }

        if (mutation.addedNodes[0].className == 'asksTable') {
          asksTable = true;
        }
      });
    }
    // Where the magic begins.
    catch(err) {
      observer.disconnect();
      setTimeout(function() {
        XRPChartsPins.init();
      }, 500);
    }
  });

  // Notify me of everything!
  var observerConfig = {
    attributes: true,
    childList: true,
    characterData: true,
    subtree: true,
  };

  // Node, config
  // We'll listen to all changes to body and child nodes
  var targetNode = document.body;
  observer.observe(targetNode, observerConfig);
});
