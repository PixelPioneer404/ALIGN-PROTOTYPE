export class RuleEngineService {
  /**
   * Evaluate user requirement against all candidate schemes
   * @param {Array} schemes - List of scheme records
   * @param {Object} requirement - Structured user requirement
   * @returns {Array} List of evaluation objects
   */
  evaluateSchemes(schemes, requirement) {
    const {
      amount = 120000,
      annualFamilyIncome = 300000,
      purpose = 'business',
      businessType = 'tailoring',
    } = requirement;

    return schemes.map((scheme) => {
      const reasons = [];
      const violations = [];
      const missingInformation = [];

      // 1. Income Ceiling Check (Configurable limit e.g. ₹5,00,000)
      const schemeIncomeLimit = scheme.incomeLimit || 500000;
      if (annualFamilyIncome <= schemeIncomeLimit) {
        reasons.push(
          `Annual family income (₹${annualFamilyIncome.toLocaleString('en-IN')}) is within statutory ceiling of ₹${schemeIncomeLimit.toLocaleString('en-IN')}.`
        );
      } else {
        violations.push(
          `Annual family income (₹${annualFamilyIncome.toLocaleString('en-IN')}) exceeds statutory ceiling of ₹${schemeIncomeLimit.toLocaleString('en-IN')}.`
        );
      }

      // 2. Maximum Loan Amount Check
      if (amount <= scheme.maxLoanAmount) {
        reasons.push(
          `Requested loan (₹${amount.toLocaleString('en-IN')}) is within maximum assistance of ₹${scheme.maxLoanAmount.toLocaleString('en-IN')}.`
        );
      } else {
        violations.push(
          `Requested loan (₹${amount.toLocaleString('en-IN')}) exceeds maximum limit of ₹${scheme.maxLoanAmount.toLocaleString('en-IN')}.`
        );
      }

      // 3. Minimum Project Cost / Range Check (e.g. Term loan requires > ₹1.40L for large projects, but can support scaling)
      if (scheme.minProjectCost && amount < scheme.minProjectCost) {
        // For Term Loan, note that it typically finances above 1.40L, but check if scalable
        if (scheme.category === 'term_loan' && amount <= 140000) {
          reasons.push(
            `Scheme supports higher project costs up to ₹${(scheme.projectCostLimit / 100000).toFixed(1)}L if enterprise expansion is intended.`
          );
        } else {
          violations.push(
            `Requested amount is below the scheme minimum project threshold of ₹${scheme.minProjectCost.toLocaleString('en-IN')}.`
          );
        }
      }

      // 4. Purpose / Enterprise Domain Compatibility
      const userPurposes = [
        purpose.toLowerCase(),
        (businessType || '').toLowerCase()
      ].filter(Boolean);

      const schemePurposes = (scheme.purpose || []).map((p) => p.toLowerCase());

      const matchesPurpose = userPurposes.some((up) =>
        schemePurposes.some((sp) => sp.includes(up) || up.includes(sp) || sp === 'business')
      );

      if (matchesPurpose) {
        reasons.push(
          `Stated enterprise (${businessType || purpose}) is recognized under scheme vocational guidelines.`
        );
      } else {
        violations.push(
          `Scheme is designated for ${scheme.purpose.join(', ')} rather than ${businessType || purpose}.`
        );
      }

      const eligible = violations.length === 0;

      return {
        schemeId: scheme._id,
        scheme,
        eligible,
        reasons,
        violations,
        missingInformation
      };
    });
  }
}

export const ruleEngineService = new RuleEngineService();
export default ruleEngineService;
