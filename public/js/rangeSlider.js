"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

(function () {
  function r(e, n, t) {
    function o(i, f) {
      if (!n[i]) {
        if (!e[i]) {
          var c = "function" == typeof require && require;
          if (!f && c) return c(i, !0);
          if (u) return u(i, !0);
          var a = new Error("Cannot find module '" + i + "'");
          throw a.code = "MODULE_NOT_FOUND", a;
        }

        var p = n[i] = {
          exports: {}
        };
        e[i][0].call(p.exports, function (r) {
          var n = e[i][1][r];
          return o(n || r);
        }, p, p.exports, r, e, n, t);
      }

      return n[i].exports;
    }

    for (var u = "function" == typeof require && require, i = 0; i < t.length; i++) {
      o(t[i]);
    }

    return o;
  }

  return r;
})()({
  1: [function (require, module, exports) {
    /**
     * Range slider component
     * @param {string} selector - Element selector
     * @param {function} onDrag - Drag callback
     * @param {number} min - Minimum limit
     * @param {number} max - Maximum limit
     * @param {number} step - Slider step
     * @param {number} value - Initial value
     */
    var RangeSlider =
    /*#__PURE__*/
    function () {
      function RangeSlider(_ref) {
        var selector = _ref.selector,
            onDrag = _ref.onDrag,
            min = _ref.min,
            max = _ref.max,
            step = _ref.step,
            fieldSelector = _ref.fieldSelector,
            value = _ref.value;

        _classCallCheck(this, RangeSlider);

        this.dragging = false;
        this.knobOffset = 0;
        this.slider = document.querySelector(selector);
        this.track = this.slider.querySelector('.slider__content');
        this.knob = this.track.querySelector('.slider__dragger');
        this.range = this.track.querySelector('.slider__range');
        this.minLabel = this.slider.querySelector('.slider__label--min');
        this.maxLabel = this.slider.querySelector('.slider__label--max');
        this.field = document.querySelector(fieldSelector);
        this.onDrag = onDrag;
        this.min = min;
        this.max = max;
        this.step = step;
        this.value = value;
        this.touchEvents = ['touchmove', 'touchstart', 'touchend'];
        this.getClientX = this.getClientX.bind(this);
        this.dragStart = this.dragStart.bind(this);
        this.getLimitRight = this.getLimitRight.bind(this);
        this.limitValue = this.limitValue.bind(this);
        this.calculateKnobPosition = this.calculateKnobPosition.bind(this);
        this.formatValue = this.formatValue.bind(this);
        this.dragStart = this.dragStart.bind(this);
        this.dragEnd = this.dragEnd.bind(this);
        this.moveKnob = this.moveKnob.bind(this);
        this.moving = this.moving.bind(this);
        this.addListeners = this.addListeners.bind(this);
        this.init = this.init.bind(this);
      }
      /**
       * Mouse position
       * @param {object} event - Event object
       * @return {number} - pixels
       */


      _createClass(RangeSlider, [{
        key: "getClientX",
        value: function getClientX(event) {
          return this.touchEvents.includes(event.type) ? event.touches[0].clientX : event.clientX;
        }
        /**
         * Right limit in pixels
         * @param {void}
         * @return {number}
         */

      }, {
        key: "getLimitRight",
        value: function getLimitRight() {
          return this.track.offsetWidth - this.knob.offsetWidth;
        }
        /**
         * Limit value
         * @param {number} sliderValue - Slider final value
         * @return {number}
         */

      }, {
        key: "limitValue",
        value: function limitValue(sliderValue) {
          var limitedValue = sliderValue;

          if (sliderValue < this.min) {
            limitedValue = this.min;
          } else if (sliderValue > this.max) {
            limitedValue = this.max;
          }

          return limitedValue;
        }
        /**
         * Calculate knob position
         * @param {object} event - Event object
         * @return {number} - pixels
         */

      }, {
        key: "calculateKnobPosition",
        value: function calculateKnobPosition(event) {
          var clientX;

          if (!event) {
            clientX = this.knob.offsetLeft;
          } else {
            clientX = this.getClientX(event);
          } // current knob position


          var knobPosition = clientX - this.knobOffset; // limiting knob position

          if (knobPosition < 0) {
            knobPosition = 0;
          } else if (knobPosition > this.getLimitRight()) {
            knobPosition = this.getLimitRight();
          }

          return knobPosition;
        }
      }, {
        key: "formatValue",
        value: function formatValue(sliderValue) {
          var formattedValue = sliderValue;

          if (this.step % 1 === 0) {
            // integer
            formattedValue = Math.ceil(sliderValue);
          } else {
            // float
            formattedValue = parseFloat(sliderValue.toFixed(1));
          }

          return formattedValue;
        }
      }, {
        key: "dragStart",
        value: function dragStart(event) {
          if (event.cancelable) {
            event.preventDefault();
          }

          this.knobOffset = this.getClientX(event) - this.knob.offsetLeft;
          this.dragging = true;
        }
      }, {
        key: "dragEnd",
        value: function dragEnd() {
          this.dragging = false;
        }
      }, {
        key: "moveKnob",
        value: function moveKnob(event) {
          var initialValue = this.value;
          var knobPosition;

          if (!event) {
            if (this.field) {
              initialValue = parseInt(this.field.value, 10);
            }

            knobPosition = initialValue === this.min ? 0 : initialValue * 100 / this.max / 100 * this.getLimitRight();
          } else {
            knobPosition = this.calculateKnobPosition(event);
          } // set knob left offset


          this.knob.style.left = "".concat(knobPosition, "px"); // range indicator width

          this.range.style.width = "".concat(knobPosition + this.knob.offsetWidth / 2, "px");
        }
      }, {
        key: "moving",
        value: function moving(event) {
          if (this.dragging) {
            var knobPosition = this.calculateKnobPosition(event);
            this.moveKnob(event); // final value

            var sliderValue = this.max * (knobPosition * 100 / this.getLimitRight()) / 100;
            sliderValue = this.limitValue(this.formatValue(sliderValue));

            if (this.field) {
              this.field.value = sliderValue;
            } // callback


            if (typeof onDrag === 'function') {
              this.onDrag(sliderValue);
            }
          }
        }
      }, {
        key: "addListeners",
        value: function addListeners() {
          this.track.addEventListener('mousedown', this.dragStart, false);
          this.track.addEventListener('touchstart', this.dragStart, false);
          window.addEventListener('mousemove', this.moving, false);
          window.addEventListener('touchmove', this.moving, false);
          window.addEventListener('mouseup', this.dragEnd, false);
          window.addEventListener('touchend', this.dragEnd, false);
        }
      }, {
        key: "init",
        value: function init() {
          this.addListeners();
          if (this.minLabel) this.minLabel.innerHTML = this.min;
          if (this.maxLabel) this.maxLabel.innerHTML = this.max;
          this.moveKnob();
        }
      }]);

      return RangeSlider;
    }();

    module.exports = RangeSlider;
  }, {}]
}, {}, [1]);