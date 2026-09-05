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

      // Formulate explainable recommendation rationales
      if (scheme._id === 'SCHEME-NSFDC-MF-01') {
        recommendationRationale = 'Top recommendation: Tailored for micro-enterprises with the lowest concessional interest rate (6.5% p.a.) and 3-month moratorium.';
      } else if (scheme._id === 'SCHEME-NSFDC-AMFY-02') {
        recommendationRationale = 'Accredited microfinance option with fast-track processing, but carries a higher interest rate (15.0% p.a.).';
      } else if (scheme._id === 'SCHEME-NSFDC-TL-03') {
        recommendationRationale = 'Offers higher credit headroom (up to ₹45L) and extended tenure (up to 7 years) if you plan larger capital investments.';
      } else if (scheme._id === 'SCHEME-NSFDC-UNY-04') {
        recommendationRationale = 'First-generation enterprise scheme with flexible cooperative and small-finance bank routing.';
      } else {
        recommendationRationale = `Qualified government assistance under ${scheme.shortName}.`;
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
