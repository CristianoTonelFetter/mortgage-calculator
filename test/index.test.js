const assert = require('assert');
const { PrincipleAndInterest, Tax, Insurance, MonthlyPayment } = require('../src/js/mortgage');

describe('Mortgage Calculator Tests', () => {
  it('Should calculate Principle And Interest correctly', () => {
    const interestRate = 0.8;
    const loanAmount = 100000;
    const yearsOfMortgage = 30;

    assert.equal(
      PrincipleAndInterest(interestRate, loanAmount, yearsOfMortgage),
      312.5353055344215
    );
  });

  it('Should calculate Tax correctly', () => {
    const annualTax = 12;

    assert.equal(Tax(annualTax), 1);
  });

  it('Should calculate Insurance correctly', () => {
    const annualInsurance = 300;

    assert.equal(Insurance(annualInsurance), 25);
  });

  it('Should calculate Monthly Payment correctly', () => {
    const principleAndInterests = 733.27;
    const tax = 83.33;
    const insurance = 25;

    assert.equal(MonthlyPayment(principleAndInterests, tax, insurance), 841.6);
  });
});
