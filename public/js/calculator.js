"use strict";

/**
 * Principle & Interest:
 * @param {number} interestRate - Element selector
 * @param {number} loanAmount - Drag callback
 * @param {number} yearsOfMortgage - Minimum limit
 * @return {number}
 */
function PrincipleAndInterest(interestRate, loanAmount, yearsOfMortgage) {
  return interestRate / 100 / 12 * loanAmount / (1 - Math.pow(1 + interestRate / 100 / 12, -yearsOfMortgage * 12));
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

exports = {
  PrincipleAndInterest: PrincipleAndInterest,
  Tax: Tax,
  Insurance: Insurance,
  MonthlyPayment: MonthlyPayment
};