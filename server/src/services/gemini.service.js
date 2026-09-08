import { GoogleGenerativeAI } from '@google/generative-ai';

// Rule-based deterministic extractor used as fallback when API key is not configured or network drops
function fallbackExtractRequirement(prompt) {
  const p = prompt.toLowerCase();

  // Extract Amount (e.g. 1.2 lakh, 1,20,000, 80000, 80 thousand)
  let amount = 120000;
  const lakhMatch = p.match(/(\d+(?:\.\d+)?)\s*(?:lakh|lac|lakhs|l)/i);
  const thousandMatch = p.match(/(\d+(?:\.\d+)?)\s*(?:thousand|k)/i);
  const directNumMatch = p.match(/₹?\s*(\d{1,3}(?:,\d{3})+|\d{4,8})/);

  if (lakhMatch) {
    amount = Math.round(parseFloat(lakhMatch[1]) * 100000);
  } else if (thousandMatch) {
    amount = Math.round(parseFloat(thousandMatch[1]) * 1000);
  } else if (directNumMatch) {
    amount = parseInt(directNumMatch[1].replace(/,/g, ''), 10);
  }

  // Extract Annual Income (e.g. income is around 3 lakh, 3,00,000)
  let annualFamilyIncome = 300000;
  const incomeLakhMatch = p.match(/(?:income|family income|earning)[^0-9]*(\d+(?:\.\d+)?)\s*(?:lakh|lac|lakhs|l)/i);
  const incomeNumMatch = p.match(/(?:income|family income|earning)[^0-9]*₹?\s*(\d{1,3}(?:,\d{3})+|\d{4,8})/i);

  if (incomeLakhMatch) {
    annualFamilyIncome = Math.round(parseFloat(incomeLakhMatch[1]) * 100000);
  } else if (incomeNumMatch) {
    annualFamilyIncome = parseInt(incomeNumMatch[1].replace(/,/g, ''), 10);
  } else {
    // Check if second lakh mention is income
    const allLakhs = [...p.matchAll(/(\d+(?:\.\d+)?)\s*(?:lakh|lac|lakhs|l)/gi)];
    if (allLakhs.length > 1) {
      annualFamilyIncome = Math.round(parseFloat(allLakhs[1][1]) * 100000);
    }
  }

  // Extract Location
  let location = "Kolkata";
  const cities = ["Kolkata", "Howrah", "Barasat", "Delhi", "Mumbai", "Bangalore", "Chennai", "Hyderabad", "Patna", "Lucknow", "Jaipur"];
  for (const city of cities) {
    if (p.includes(city.toLowerCase())) {
      location = city;
      break;
    }
  }

  // Extract Business Type & Purpose
  let purpose = "business";
  let businessType = "tailoring";
  if (p.includes("tailor") || p.includes("sewing") || p.includes("garment")) {
    businessType = "tailoring";
    purpose = "business";
  } else if (p.includes("education") || p.includes("college") || p.includes("course") || p.includes("study")) {
    businessType = "higher_education";
    purpose = "education";
  } else if (p.includes("artisan") || p.includes("craft") || p.includes("pottery")) {
    businessType = "artisan_workshop";
    purpose = "business";
  } else if (p.includes("dairy") || p.includes("cow") || p.includes("milk")) {
    businessType = "dairy_farming";
    purpose = "business";
  } else if (p.includes("retail") || p.includes("grocery") || p.includes("shop")) {
    businessType = "retail_shop";
    purpose = "business";
  }

  return {
    purpose,
    businessType,
    amount,
    annualFamilyIncome,
    location,
    educationStatus: purpose === "education" ? "pursuing_degree" : null,
    extractedAt: new Date().toISOString(),
    source: "local_nlp_parser"
  };
}

// Rule-based what-if delta interpreter
function fallbackWhatIf(currentScenario, query) {
  const q = query.toLowerCase();
  const delta = {};

  // Tenure query: "5 years", "60 months", "2 years"
  const yearMatch = q.match(/(\d+)\s*(?:years?|yrs?)/i);
  const monthMatch = q.match(/(\d+)\s*(?:months?|mo)/i);
  if (yearMatch) {
    delta.tenureMonths = parseInt(yearMatch[1], 10) * 12;
  } else if (monthMatch) {
    delta.tenureMonths = parseInt(monthMatch[1], 10);
  }

  // Amount query: "80,000", "80k", "1 lakh", "reduce loan to 80000"
  const lakhMatch = q.match(/(\d+(?:\.\d+)?)\s*(?:lakh|lac|lakhs|l)/i);
  const thousandMatch = q.match(/(\d+(?:\.\d+)?)\s*(?:thousand|k)/i);
  const directNumMatch = q.match(/₹?\s*(\d{1,3}(?:,\d{3})+|\d{4,8})/);

  if (lakhMatch) {
    delta.loanAmount = Math.round(parseFloat(lakhMatch[1]) * 100000);
  } else if (thousandMatch) {
    delta.loanAmount = Math.round(parseFloat(thousandMatch[1]) * 1000);
  } else if (directNumMatch) {
    delta.loanAmount = parseInt(directNumMatch[1].replace(/,/g, ''), 10);
  }

  return delta;
}

export class GeminiService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || null;
    // gemini-1.5-flash is free on non-billing Google AI Studio accounts (15 RPM, 1M TPM, 1,500 RPD)
    this.modelName = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
    this.useMock = process.env.USE_MOCK_AI === 'true' || !this.apiKey;
    if (this.apiKey) {
      this.genAI = new GoogleGenerativeAI(this.apiKey);
    }
  }

  async extractRequirementConversational(messages) {
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      throw new Error('Messages array is required.');
    }

    const fullText = messages.map(m => `${m.role}: ${m.content}`).join('\n');

    if (this.useMock || !this.genAI) {
      console.log('[GeminiService] Using resilient NLP extractor (no API key / mock mode)');
      // For mock, just pretend it's complete if it's long enough, else ask
      if (fullText.length < 20 && messages.length === 1) {
        return {
          isComplete: false,
          nextQuestion: "Could you tell me what kind of business you want to start, how much loan you need, your annual family income, and where you live?"
        };
      }
      return {
        isComplete: true,
        extracted: fallbackExtractRequirement(fullText)
      };
    }

    try {
      const model = this.genAI.getGenerativeModel({
        model: this.modelName,
        generationConfig: {
          temperature: 0.0,
          responseMimeType: 'application/json',
        }
      });

      const systemInstruction = `
You are an expert financial requirement parser for ALIGN, an Indian government scheme discovery platform.
Given a conversation history between an applicant and an AI assistant, extract structured parameters.
The mandatory fields needed to find a scheme are:
- businessType: the type of business or purpose (e.g. "tailoring", "dairy", "retail", "education")
- amount: integer in INR (e.g. 1.2 lakh becomes 120000)
- annualFamilyIncome: integer in INR (e.g. 3 lakh becomes 300000)
- location: string (city or district, e.g. "Kolkata")

If ANY of the mandatory fields are missing, set "isComplete" to false, and formulate a polite, conversational "nextQuestion" asking ONLY for the missing information.
If ALL mandatory fields are present, set "isComplete" to true, and provide the "extracted" object.

Return strictly a JSON object matching this schema:
{
  "isComplete": boolean,
  "nextQuestion": string | null,
  "extracted": {
    "purpose": string (one of ["business", "education", "agriculture", "services", "other"]),
    "businessType": string,
    "amount": number,
    "annualFamilyIncome": number,
    "location": string,
    "educationStatus": string | null
  } | null
}
`;

      const result = await model.generateContent([
        { text: systemInstruction },
        { text: `Conversation:\n${fullText}` }
      ]);

      const text = result.response.text();
      const parsed = JSON.parse(text);

      if (parsed.isComplete && parsed.extracted) {
        parsed.extracted.extractedAt = new Date().toISOString();
        parsed.extracted.source = this.modelName;
      }

      return parsed;
    } catch (err) {
      console.warn('[GeminiService] Gemini API call failed, falling back to local extractor:', err.message);
      return {
        isComplete: true,
        extracted: fallbackExtractRequirement(fullText)
      };
    }
  }

  async parseWhatIfQuery(currentScenario, query) {
    if (this.useMock || !this.genAI) {
      return fallbackWhatIf(currentScenario, query);
    }

    try {
      const model = this.genAI.getGenerativeModel({
        model: this.modelName,
        generationConfig: {
          temperature: 0.0,
          responseMimeType: 'application/json',
        }
      });

      const promptText = `
Current financing scenario:
- Loan Amount: ₹${currentScenario.loanAmount}
- Tenure: ${currentScenario.tenureMonths} months

User what-if question: "${query}"

Extract the changed parameters into JSON with optional fields:
{
  "loanAmount": number or null,
  "tenureMonths": number or null
}
For example, "What if I repay over 5 years?" -> { "tenureMonths": 60 }
For example, "What if I borrow ₹80,000?" -> { "loanAmount": 80000 }
`;

      const result = await model.generateContent(promptText);
      const text = result.response.text();
      const parsed = JSON.parse(text);
      const delta = {};
      if (parsed.loanAmount) delta.loanAmount = Number(parsed.loanAmount);
      if (parsed.tenureMonths) delta.tenureMonths = Number(parsed.tenureMonths);
      return delta;
    } catch (err) {
      console.warn('[GeminiService] What-if Gemini error, using fallback:', err.message);
      return fallbackWhatIf(currentScenario, query);
    }
  }

  async explainWhatIfImpact(delta, oldCalcs, newCalcs, query) {
    // Generate clear, calm, transparent plain-language summary of changes
    if (delta.loanAmount && !delta.tenureMonths) {
      const diffAmount = newCalcs[0]?.monthlyEMI - oldCalcs[0]?.monthlyEMI;
      const formattedDiff = Math.abs(Math.round(diffAmount)).toLocaleString('en-IN');
      const action = diffAmount < 0 ? 'reduces' : 'increases';
      return `Lowering your loan to ₹${Number(delta.loanAmount).toLocaleString('en-IN')} ${action} your monthly EMI across all options by approximately ₹${formattedDiff} and saves significant total interest.`;
    }

    if (delta.tenureMonths) {
      const years = Math.round(delta.tenureMonths / 12);
      return `Adjusting repayment tenure to ${years} years (${delta.tenureMonths} months) rebalances your monthly commitments. Note that schemes with lower maximum statutory limits (such as Micro Finance capped at 3 years) remain bounded to their official maximum period.`;
    }

    return "Your updated financing scenario has been recalculated deterministically across all compared schemes.";
  }
}

export const geminiService = new GeminiService();
export default geminiService;
