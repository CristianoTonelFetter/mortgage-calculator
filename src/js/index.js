/**
 * Principle & Interest:
 * @param {number} interestRate - Element selector
 * @param {number} loanAmount - Drag callback
 * @param {number} yearsOfMortgage - Minimum limit
 * @return {number}
 */
function PrincipleAndInterest(interestRate, loanAmount, yearsOfMortgage) {
  return (
    ((interestRate / 100 / 12) * loanAmount) /
    (1 - (1 + interestRate / 100 / 12) ** (-yearsOfMortgage * 12))
  );
}

/**
 * Tax
 * @param {number} annualTax
 * @return {number}
 */
function Tax(annualTax) {
  return annualTax / 12;
}

/**
 * Insurance
 * @param {number} annualInsurance
 * @return {number}
 */
function Insurance(annualInsurance) {
  return annualInsurance / 12;
}

/**
 * Monthly payment
 * @param {number} principleAndInterests
 * @param {number} tax
 * @param {number} insurance
 * @return {number}
 */
function MonthlyPayment(principleAndInterests, tax, insurance) {
  return principleAndInterests + tax + insurance;
}

/**
 * Range slider component
 * @param {string} selector - Element selector
 * @param {function} onDrag - Drag callback
 * @param {number} min - Minimum limit
 * @param {number} max - Maximum limit
 * @param {number} step - Slider step
 * @param {number} value - Initial value
 */
function rangeSlider({ selector, onDrag, min, max, step, fieldSelector, value }) {
  let dragging = false;
  let knobOffset = 0;
  const slider = document.querySelector(selector);
  const track = slider.querySelector('.slider__content');
  const knob = track.querySelector('.slider__dragger');
  const range = track.querySelector('.slider__range');
  const minLabel = slider.querySelector('.slider__label--min');
  const maxLabel = slider.querySelector('.slider__label--max');
  const field = document.querySelector(fieldSelector);

  /**
   * Mouse position
   * @param {object} event - Event object
   * @return {number} - pixels
   */
  function getClientX(event) {
    const touchEvents = ['touchmove', 'touchstart', 'touchend'];
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
    let limitedValue = sliderValue;
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
    let clientX;

    if (!e) {
      clientX = knob.offsetLeft;
    } else {
      clientX = getClientX(e);
    }

    // current knob position
    let knobPosition = clientX - knobOffset;

    // limiting knob position
    if (knobPosition < 0) {
      knobPosition = 0;
    } else if (knobPosition > getLimitRight()) {
      knobPosition = getLimitRight();
    }

    return knobPosition;
  }

  function formatValue(sliderValue) {
    let formattedValue = sliderValue;
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
    knob.style.left = `${knobPosition}px`;

    // range indicator width
    range.style.width = `${knobPosition + knob.offsetWidth / 2}px`;
  }

  function moving(e) {
    if (dragging) {
      const knobPosition = calculateKnobPosition(e);

      moveKnob(knobPosition);

      // final value
      let sliderValue = (max * ((knobPosition * 100) / getLimitRight())) / 100;
      sliderValue = limitValue(formatValue(sliderValue));

      if (field) {
        field.value = sliderValue;
      }

      // callback
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

    let initialValue = value;

    if (field) {
      initialValue = parseInt(field.value, 10);
    }
    const position =
      initialValue === min ? 0 : ((initialValue * 100) / max / 100) * getLimitRight();

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

// init sliders
window.addEventListener('load', function load() {
  sliders();
});

window.addEventListener('resize', function resize() {
  sliders();
});

// form submit
document.getElementById('calculator-form').addEventListener(
  'submit',
  e => {
    e.preventDefault();

    const form = e.target;
    let isValid = true;

    // validation
    form.querySelectorAll('input[required]').forEach(field => {
      if (!field.value) {
        field.parentElement.classList.add('form-control--error');
        isValid = false;
      } else {
        field.parentElement.classList.remove('form-control--error');
      }
    });

    // form is invalid, return
    if (!isValid) return;

    const yearsOfMortgage = document.querySelector('#yearsOfMortgage').value;
    const interestRate = document.querySelector('#rateOfInterest').value;
    const loanAmount = document.querySelector('#loanAmount').value;
    const annualTax = document.querySelector('#annualTax').value;
    const annualInsurance = document.querySelector('#annualInsurance').value;

    const tax = Tax(annualTax);
    const insurance = Insurance(annualInsurance);
    const principleAndInterests = PrincipleAndInterest(interestRate, loanAmount, yearsOfMortgage);

    document.querySelector('#principle-and-interest').innerHTML = principleAndInterests.toFixed(2);
    document.querySelector('#tax').innerHTML = tax.toFixed(2);
    document.querySelector('#insurance').innerHTML = insurance.toFixed(2);
    document.querySelector('#total-monthly-payment').innerHTML = MonthlyPayment(
      principleAndInterests,
      tax,
      insurance
    ).toFixed(2);

    // expanding box
    document.querySelector('#calculator-result').classList.add('result-box--expanded');
  },
  false
);
