const RangeSlider = require('./rangeSlider');
const { PrincipleAndInterest, Tax, Insurance, MonthlyPayment } = require('./mortgage');

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

  let resizeThrottle = false;
  const resizeDelay = 30;
  window.addEventListener('resize', function resize() {
    if (!resizeThrottle) {
      slider1.moveKnob();
      slider2.moveKnob();

      resizeThrottle = true;

      setTimeout(() => {
        resizeThrottle = false;
      }, resizeDelay);
    }
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
