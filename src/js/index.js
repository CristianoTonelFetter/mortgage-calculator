/**
 * Range slider component
 * @param {string} selector - Element selector
 * @param {function} onDrag - Drag callback
 * @param {number} min - Minimum limit
 * @param {number} max - Maximum limit
 * @param {number} step - Slider step
 * @param {number} value - Initial value
 */
class RangeSlider {
  constructor({ selector, onDrag, min, max, step, fieldSelector, value }) {
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

    // bindings
    this.getClientX = this.getClientX.bind(this);
    this.dragStart = this.dragStart.bind(this);
    this.getLimitRight = this.getLimitRight.bind(this);
    this.limitValue = this.limitValue.bind(this);
    this.getKnobPosition = this.getKnobPosition.bind(this);
    this.getSliderValue = this.getSliderValue.bind(this);
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
  getClientX(event) {
    return this.touchEvents.includes(event.type) ? event.touches[0].clientX : event.clientX;
  }

  /**
   * Right limit in pixels
   * @param {void}
   * @return {number}
   */
  getLimitRight() {
    return this.track.offsetWidth - this.knob.offsetWidth;
  }

  /**
   * Limit value
   * @param {number} sliderValue - Slider final value
   * @return {number}
   */
  limitValue(sliderValue) {
    let limitedValue = sliderValue;
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
  getKnobPosition(event) {
    let clientX;

    if (!event) {
      clientX = this.knob.offsetLeft;
    } else {
      clientX = this.getClientX(event);
    }

    // current knob position
    let knobPosition = clientX - this.knobOffset;

    // limiting knob position
    if (knobPosition < 0) {
      knobPosition = 0;
    } else if (knobPosition > this.getLimitRight()) {
      knobPosition = this.getLimitRight();
    }

    return knobPosition;
  }

  formatValue(sliderValue) {
    let formattedValue = sliderValue;
    if (this.step % 1 === 0) {
      // integer
      formattedValue = Math.ceil(sliderValue);
    } else {
      // float
      formattedValue = parseFloat(sliderValue.toFixed(1));
    }
    return formattedValue;
  }

  dragStart(event) {
    if (event.cancelable) {
      event.preventDefault();
    }
    this.knobOffset = this.getClientX(event) - this.knob.offsetLeft;
    this.dragging = true;
  }

  dragEnd() {
    this.dragging = false;
  }

  moveKnob() {
    const slideValue = parseInt(this.field.value, 10);

    const knobPosition =
      slideValue === this.min ? 0 : ((slideValue * 100) / this.max / 100) * this.getLimitRight();

    // set knob left offset
    this.knob.style.left = `${knobPosition}px`;

    // range indicator width
    this.range.style.width = `${knobPosition + this.knob.offsetWidth / 2}px`;
  }

  getSliderValue(knobPosition) {
    let sliderValue = (this.max * ((knobPosition * 100) / this.getLimitRight())) / 100;
    sliderValue = this.limitValue(this.formatValue(sliderValue));
    return sliderValue;
  }

  moving(event) {
    if (this.dragging) {
      this.moveKnob();

      // final value
      const knobPosition = this.getKnobPosition(event);
      const sliderValue = this.getSliderValue(knobPosition);

      this.field.value = sliderValue;

      // callback
      if (typeof onDrag === 'function') {
        this.onDrag(sliderValue);
      }
    }
  }

  addListeners() {
    this.track.addEventListener('mousedown', this.dragStart, false);
    this.track.addEventListener('touchstart', this.dragStart, false);
    window.addEventListener('mousemove', this.moving, false);
    window.addEventListener('touchmove', this.moving, false);
    window.addEventListener('mouseup', this.dragEnd, false);
    window.addEventListener('touchend', this.dragEnd, false);
  }

  init() {
    this.addListeners();

    if (this.minLabel) this.minLabel.innerHTML = this.min;
    if (this.maxLabel) this.maxLabel.innerHTML = this.max;

    this.moveKnob();
  }
}

const slider1 = new RangeSlider({
  selector: '#range-slider-1',
  min: 1,
  max: 40,
  step: 1,
  fieldSelector: '#yearsOfMortgage'
});

const slider2 = new RangeSlider({
  selector: '#range-slider-2',
  min: 0.1,
  max: 10,
  step: 0.1,
  fieldSelector: '#rateOfInterest'
});

(function init() {
  // init sliders
  window.addEventListener('load', function load() {
    slider1.init();
    slider2.init();
  });

  window.addEventListener('resize', function resize() {
    slider1.moveKnob();
    slider2.moveKnob();
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

      document.querySelector('#principle-and-interest').innerHTML = principleAndInterests.toFixed(
        2
      );
      document.querySelector('#tax').innerHTML = tax.toFixed(2);
      document.querySelector('#insurance').innerHTML = insurance.toFixed(2);
      document.querySelector('#total-monthly-payment').innerHTML = MonthlyPayment(
        principleAndInterests,
        tax,
        insurance
      ).toFixed(2);

      // expanding box
      const calculatorResult = document.querySelector('#calculator-result');
      calculatorResult.classList.add('result-box--expanded');

      // scroll to result box
      setTimeout(() => {
        calculatorResult.scrollIntoView({
          top: calculatorResult.offsetTop,
          behavior: 'smooth'
        });
      }, 300);
    },
    false
  );
})();
