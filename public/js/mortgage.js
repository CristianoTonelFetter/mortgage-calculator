"use strict";

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
     * Principle & Interest:
     * @param {number} interestRate
     * @param {number} loanAmount
     * @param {number} yearsOfMortgage
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

    module.exports = {
      PrincipleAndInterest: PrincipleAndInterest,
      Tax: Tax,
      Insurance: Insurance,
      MonthlyPayment: MonthlyPayment
    };
  }, {}]
}, {}, [1]);