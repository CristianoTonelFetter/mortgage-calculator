/**
 * Principle & Interest:
 * @param {number} interestRate
 * @param {number} loanAmount
 * @param {number} yearsOfMortgage
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

module.exports = { PrincipleAndInterest, Tax, Insurance, MonthlyPayment };
