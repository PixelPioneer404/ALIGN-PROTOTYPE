export class RankingService {
  /**
   * Rank eligible schemes deterministically using multi-attribute utility scoring
   * @param {Array} evaluatedSchemes - Output from RuleEngineService
   * @param {Object} requirement - User requirement
   * @returns {Array} Ranked schemes with explainable rationales
   */
  rankSchemes(evaluatedSchemes, requirement) {
    const eligibleList = evaluatedSchemes.filter((e) => e.eligible);

    const scored = eligibleList.map((item) => {
      const { scheme } = item;
      let score = 0;
      let recommendationRationale = '';

      // Factor 1: Interest Rate Competitiveness (Max 40 points)
      // Lower rate = higher score
      const rateScore = Math.max(0, 40 - (scheme.interestRate * 2));
      score += rateScore;

      // Factor 2: Amount Fit (Max 30 points)
      // Closer the amount is to maxLoanAmount without exceeding, better fit
      const ratio = requirement.amount / scheme.maxLoanAmount;
      if (ratio >= 0.5 && ratio <= 1.0) {
        score += 30;
      } else if (ratio < 0.5) {
        score += 20;
      } else {
        score += 10;
      }

      // Factor 3: Purpose Specificity (Max 20 points)
      const isDirectCategoryMatch = scheme.category === 'microfinance' && requirement.amount <= 140000;
      if (isDirectCategoryMatch) {
        score += 20;
      } else {
        score += 10;
      }

      // Factor 4: Moratorium & Tenure Flexibility (Max 10 points)
      if (scheme.moratoriumMonths >= 3) {
        score += 10;
      } else {
        score += 5;
      }

      // Formulate explainable recommendation rationales dynamically
      if (scheme._id === 'SCHEME-NSFDC-MF-01') {
        recommendationRationale = 'Top concessional recommendation: Lowest fixed interest rate (6.5% p.a.) with 3-month moratorium for micro-enterprises.';
      } else if (scheme._id === 'SCHEME-PM-VISHWAKARMA-09') {
        recommendationRationale = 'Artisan empowerment: Highly subsidized 5.0% interest rate, collateral-free credit, plus ₹15,000 toolkit incentive.';
      } else if (scheme._id === 'SCHEME-MUDRA-SHISHU-06') {
        recommendationRationale = 'Quick zero-collateral micro-credit up to ₹50,000 for seed inventory, small tools, and street vendor equipment.';
      } else if (scheme._id === 'SCHEME-MUDRA-KISHORE-07') {
        recommendationRationale = 'MSME scaling credit up to ₹5 Lakh at 9.5% p.a. with 6-month moratorium for commercial equipment.';
      } else if (scheme._id === 'SCHEME-MUDRA-TARUN-08') {
        recommendationRationale = 'Industrial and commercial expansion credit up to ₹10 Lakh for established small enterprises.';
      } else if (scheme._id === 'SCHEME-PMEGP-10') {
        recommendationRationale = 'Prime Minister Employment Generation Programme with high credit-linked capital subsidy (15% to 35% margin money).';
      } else if (scheme._id === 'SCHEME-STANDUP-INDIA-11') {
        recommendationRationale = 'Flagship bank term-loan (₹10L to ₹1 Crore) dedicated to SC, ST, and Women founders for greenfield ventures.';
      } else if (scheme._id === 'SCHEME-NABARD-DAIRY-12') {
        recommendationRationale = 'Specialized dairy and livestock scheme with 25-33% capital subsidy and 6-month animal acclimatization moratorium.';
      } else if (scheme._id === 'SCHEME-PM-SVANIDHI-13') {
        recommendationRationale = 'Urban street vendor working capital with 7% interest subsidy on timely repayment and digital cashbacks.';
      } else if (scheme._id === 'SCHEME-STARTUP-INDIA-SEED-14') {
        recommendationRationale = 'DPIIT recognized startup seed support with prototype validation grants up to ₹20L and debt up to ₹50L.';
      } else if (scheme._id === 'SCHEME-NSFDC-AMFY-02') {
        recommendationRationale = 'Accredited microfinance option with fast-track MFI group routing (15.0% p.a.).';
      } else if (scheme._id === 'SCHEME-NSFDC-TL-03') {
        recommendationRationale = 'High capital headroom (up to ₹45L) and 7-year repayment window for manufacturing and service setups.';
      } else if (scheme._id === 'SCHEME-NSFDC-UNY-04') {
        recommendationRationale = 'First-generation self-employment scheme with flexible cooperative and small-finance bank access.';
      } else if (scheme._id === 'SCHEME-NSFDC-ELS-05') {
        recommendationRationale = 'Concessional 6.5% academic loan covering full tuition with repayment moratorium during entire course duration.';
      } else {
        recommendationRationale = `Qualified government assistance under ${scheme.shortName} (${scheme.interestRate}% p.a.).`;
      }

      return {
        ...item,
        score: Math.round(score),
        recommendationRationale
      };
    });

    // Sort descending by score
    scored.sort((a, b) => b.score - a.score);

    // Mark top recommendation
    if (scored.length > 0) {
      scored[0].isTopRecommendation = true;
    }

    return scored;
  }
}

export const rankingService = new RankingService();
export default rankingService;
