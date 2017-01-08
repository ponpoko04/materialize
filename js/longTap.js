/*
 * jQueryオブジェクトをもらって、ロングタップ判定を行う。
 * ロングタップ判定=trueになったときにCallbackを実行するようにしようと思う。
 */
; (function ($) {
  var settings = {
    'judge-milliseconds': 750
  };

  $.fn.addEventLongTap = function (longTapRaiseEvent, options) {
    settings = $.extend(settings, options);

    var isLongTap = false;
    var timerid;
    $(this).each(function(){
      var $elem = $(this);
      $elem.on('touchstart', function () {
        timerid = setTimeout(function () {
          isLongTap = true;
        }, settings['judge-milliseconds']);
      });
      $elem.on('touchmove', function () {
        if (isLongTap) {
          isLongTap = false;
          $elem.trigger('longTapThenDraged');
        }
      });
      $elem.on('touchend touchcancel', function () {
        clearTimeout(timerid);
        if (isLongTap) {
          isLongTap = false;
          $elem.trigger('longTaped');
        }
      });
    });
    return this;
  };
})(jQuery);
