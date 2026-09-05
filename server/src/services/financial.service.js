/**
 * Pure Deterministic Financial Engine
 * Zero Generative AI Math
 */

export class FinancialService {
  /**
   * Calculate reducing-balance monthly installment, total repayment, and total interest for a single scheme
   */
  calculateSingleScheme({ principal, annualInterestRate, tenureMonths, maxTenureMonths = 360, maxLoanAmount = Infinity, moratoriumMonths = 0 }) {
    // 1. Enforce statutory regulatory constraints
    const tenureCapped = tenureMonths > maxTenureMonths;
    const effectiveTenureMonths = tenureCapped ? maxTenureMonths : tenureMonths;

    const amountCapped = principal > maxLoanAmount;
    const effectivePrincipal = amountCapped ? maxLoanAmount : principal;

    // 2. Zero-interest edge case handling
    if (annualInterestRate === 0) {
      const monthlyEMI = Math.round((effectivePrincipal / effectiveTenureMonths) * 100) / 100;
      return {
        monthlyEMI,
        totalRepayment: effectivePrincipal,
        totalInterest: 0,
        effectivePrincipal,
        effectiveTenureMonths,
        tenureCapped,
        amountCapped,
        moratoriumMonths
      };
    }

    // 3. Standard reducing-balance formula: E = P * r * (1+r)^n / ((1+r)^n - 1)
    const monthlyRate = annualInterestRate / (12 * 100);
    const factor = Math.pow(1 + monthlyRate, effectiveTenureMonths);
    const monthlyEMI = Math.round(
      (effectivePrincipal * monthlyRate * factor / (factor - 1)) * 100
    ) / 100;

    const totalRepayment = Math.round((monthlyEMI * effectiveTenureMonths) * 100) / 100;
    const totalInterest = Math.round((totalRepayment - effectivePrincipal) * 100) / 100;

    return {
      monthlyEMI,
      totalRepayment,
      totalInterest,
      effectivePrincipal,
      effectiveTenureMonths,
      tenureCapped,
      amountCapped,
      moratoriumMonths
    };
  }

  /**
   * Calculate financial details for multiple schemes given a universal loan amount and tenure
   */
  calculateMultiple(loanAmount, tenureMonths, schemes) {
    return schemes.map((scheme) => {
      const calculation = this.calculateSingleScheme({
        principal: loanAmount,
        annualInterestRate: scheme.interestRate,
        tenureMonths,
        maxTenureMonths: scheme.maxTenureMonths,
        maxLoanAmount: scheme.maxLoanAmount,
        moratoriumMonths: scheme.moratoriumMonths || 0
      });

      return {
        schemeId: scheme._id,
        schemeName: scheme.name,
        shortName: scheme.shortName,
        category: scheme.category,
        interestRate: scheme.interestRate,
        maxLoanAmount: scheme.maxLoanAmount,
        maxTenureMonths: scheme.maxTenureMonths,
        ...calculation
      };
    });
  }

  /**
   * Compute delta comparison between old calculations and new calculations for what-if scenarios
   */
  computeDeltas(oldCalcs, newCalcs) {
    return newCalcs.map((newCalc) => {
      const oldCalc = oldCalcs.find((o) => o.schemeId === newCalc.schemeId) || oldCalcs[0];
      return {
        ...newCalc,
        previousEMI: oldCalc.monthlyEMI,
        emiDelta: Math.round((newCalc.monthlyEMI - oldCalc.monthlyEMI) * 100) / 100,
        previousTotalInterest: oldCalc.totalInterest,
        interestDelta: Math.round((newCalc.totalInterest - oldCalc.totalInterest) * 100) / 100
      };
    });
  }
}

export const financialService = new FinancialService();
export default financialService;
