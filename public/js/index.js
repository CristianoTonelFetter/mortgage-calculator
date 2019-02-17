"use strict";

/**
 * Range slider component
 * @param {string} selector - Element selector
 * @param {function} onDrag - Drag callback
 * @param {number} min - Minimum limit
 * @param {number} max - Maximum limit
 * @param {number} step - Slider step
 * @param {number} value - Initial value
 */
function rangeSlider(_ref) {
  var selector = _ref.selector,
      onDrag = _ref.onDrag,
      min = _ref.min,
      max = _ref.max,
      step = _ref.step,
      fieldSelector = _ref.fieldSelector,
      value = _ref.value;
  var dragging = false;
  var knobOffset = 0;
  var slider = document.querySelector(selector);
  var track = slider.querySelector('.slider__content');
  var knob = track.querySelector('.slider__dragger');
  var range = track.querySelector('.slider__range');
  var minLabel = slider.querySelector('.slider__label--min');
  var maxLabel = slider.querySelector('.slider__label--max');
  var field = document.querySelector(fieldSelector);
  /**
   * Mouse position
   * @param {object} event - Event object
   * @return {number} - pixels
   */

  function getClientX(event) {
    var touchEvents = ['touchmove', 'touchstart', 'touchend'];
    return touchEvents.includes(event.type) ? event.touches[0].clientX : event.clientX;
  }
  /**
   * Right limit in pixels
   * @param {void}
   * @return {number}
   */


  function getLimitRight() {
    return track.offsetWidth - knob.offsetWidth;
  }
  /**
   * Limit value
   * @param {number} sliderValue - Slider final value
   * @return {number}
   */


  function limitValue(sliderValue) {
    var limitedValue = sliderValue;

    if (sliderValue < min) {
      limitedValue = min;
    } else if (sliderValue > max) {
      limitedValue = max;
    }

    return limitedValue;
  }
  /**
   * Calculate knob position
   * @param {object} event - Event object
   * @return {number} - pixels
   */


  function calculateKnobPosition(e) {
    var clientX;

    if (!e) {
      clientX = knob.offsetLeft;
    } else {
      clientX = getClientX(e);
    } // current knob position


    var knobPosition = clientX - knobOffset; // limiting knob position

    if (knobPosition < 0) {
      knobPosition = 0;
    } else if (knobPosition > getLimitRight()) {
      knobPosition = getLimitRight();
    }

    return knobPosition;
  }

  function formatValue(sliderValue) {
    var formattedValue = sliderValue;

    if (step % 1 === 0) {
      // integer
      formattedValue = Math.ceil(sliderValue);
    } else {
      // float
      formattedValue = parseFloat(sliderValue.toFixed(1));
    }

    return formattedValue;
  }

  function dragStart(e) {
    if (e.cancelable) {
      e.preventDefault();
    }

    knobOffset = getClientX(e) - knob.offsetLeft;
    dragging = true;
  }

  function dragEnd() {
    dragging = false;
  }

  function moveKnob(knobPosition) {
    // set knob left offset
    knob.style.left = "".concat(knobPosition, "px"); // range indicator width

    range.style.width = "".concat(knobPosition + knob.offsetWidth / 2, "px");
  }

  function moving(e) {
    if (dragging) {
      var knobPosition = calculateKnobPosition(e);
      moveKnob(knobPosition); // final value

      var sliderValue = max * (knobPosition * 100 / getLimitRight()) / 100;
      sliderValue = limitValue(formatValue(sliderValue));

      if (field) {
        field.value = sliderValue;
      } // callback


      if (typeof onDrag === 'function') {
        onDrag(sliderValue);
      }
    }
  }

  function addListeners() {
    track.addEventListener('mousedown', dragStart, false);
    track.addEventListener('touchstart', dragStart, false);
    window.addEventListener('mousemove', moving, false);
    window.addEventListener('touchmove', moving, false);
    window.addEventListener('mouseup', dragEnd, false);
    window.addEventListener('touchend', dragEnd, false);
  }

  function init() {
    addListeners();
    var initialValue = value;

    if (field) {
      initialValue = parseInt(field.value, 10);
    }

    var position = initialValue === min ? 0 : initialValue * 100 / max / 100 * getLimitRight();
    if (minLabel) minLabel.innerHTML = min;
    if (maxLabel) maxLabel.innerHTML = max;
    moveKnob(position);
  }

  init();
}

function sliders() {
  rangeSlider({
    selector: '#range-slider-1',
    min: 1,
    max: 40,
    step: 1,
    fieldSelector: '#yearsOfMortgage'
  });
  rangeSlider({
    selector: '#range-slider-2',
    min: 0.1,
    max: 10,
    step: 0.1,
    fieldSelector: '#rateOfInterest'
  });
}

(function init() {
  // init sliders
  window.addEventListener('load', function load() {
    sliders();
  });
  window.addEventListener('resize', function resize() {
    sliders();
  }); // form submit

  document.getElementById('calculator-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var form = e.target;
    var isValid = true; // validation

    form.querySelectorAll('input[required]').forEach(function (field) {
      if (!field.value) {
        field.parentElement.classList.add('form-control--error');
        isValid = false;
      } else {
        field.parentElement.classList.remove('form-control--error');
      }
    }); // form is invalid, return

    if (!isValid) return;
    var yearsOfMortgage = document.querySelector('#yearsOfMortgage').value;
    var interestRate = document.querySelector('#rateOfInterest').value;
    var loanAmount = document.querySelector('#loanAmount').value;
    var annualTax = document.querySelector('#annualTax').value;
    var annualInsurance = document.querySelector('#annualInsurance').value;
    var tax = Tax(annualTax);
    var insurance = Insurance(annualInsurance);
    var principleAndInterests = PrincipleAndInterest(interestRate, loanAmount, yearsOfMortgage);
    document.querySelector('#principle-and-interest').innerHTML = principleAndInterests.toFixed(2);
    document.querySelector('#tax').innerHTML = tax.toFixed(2);
    document.querySelector('#insurance').innerHTML = insurance.toFixed(2);
    document.querySelector('#total-monthly-payment').innerHTML = MonthlyPayment(principleAndInterests, tax, insurance).toFixed(2); // expanding box

    document.querySelector('#calculator-result').classList.add('result-box--expanded');
  }, false);
})();