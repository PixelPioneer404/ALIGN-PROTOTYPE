import { GoogleGenerativeAI } from '@google/generative-ai';

// Rule-based deterministic extractor and intent analyzer
export function parseRequirementDetails(prompt) {
  const p = (prompt || '').toLowerCase().trim();

  // 1. Extract Annual Household Income FIRST
  let annualFamilyIncome = null;
  const incomeRegex = /(?:income|family income|household income|earning|salary)[^0-9]*(?:₹|rs\.?|inr)?\s*(\d+(?:\.\d+)?)\s*(?:lakh|lac|lakhs|l\b)?/i;
  const incomeMatch = p.match(incomeRegex);
  let promptWithoutIncome = p;
  if (incomeMatch) {
    const rawVal = parseFloat(incomeMatch[1]);
    const isLakh = incomeMatch[0].match(/(?:lakh|lac|lakhs|l\b)/i);
    annualFamilyIncome = isLakh ? Math.round(rawVal * 100000) : (rawVal < 100 ? Math.round(rawVal * 100000) : Math.round(rawVal));
    promptWithoutIncome = p.replace(incomeMatch[0], ' ');
  }

  // 2. Extract Requested Loan / Capital Amount from text without income
  let amount = null;
  const croreMatch = promptWithoutIncome.match(/(\d+(?:\.\d+)?)\s*(?:crore|cr)/i);
  const lakhMatch = promptWithoutIncome.match(/(\d+(?:\.\d+)?)\s*(?:lakh|lac|lakhs|l\b)/i);
  const thousandMatch = promptWithoutIncome.match(/(\d+(?:\.\d+)?)\s*(?:thousand|k\b)/i);
  const directNumMatch = promptWithoutIncome.match(/(?:₹|rs\.?|inr)\s*(\d{1,3}(?:,\d{3})+|\b\d{4,8}\b)/i) ||
                         promptWithoutIncome.match(/(\d{1,3}(?:,\d{3})+|\b\d{4,8}\b)\s*(?:loan|capital|rupees|working capital)/i) ||
                         promptWithoutIncome.match(/(?:need|needing|want|require|seeking)\s*(?:₹|rs\.?|inr)?\s*(\d{1,3}(?:,\d{3})+|\b\d{4,8}\b)/i) ||
                         promptWithoutIncome.match(/(?:₹|rs\.?|inr)?\s*(\d{1,3}(?:,\d{3})+|\b\d{4,8}\b)/i);

  if (croreMatch) {
    amount = Math.round(parseFloat(croreMatch[1]) * 10000000);
  } else if (lakhMatch) {
    amount = Math.round(parseFloat(lakhMatch[1]) * 100000);
  } else if (thousandMatch) {
    amount = Math.round(parseFloat(thousandMatch[1]) * 1000);
  } else if (directNumMatch) {
    const valStr = (directNumMatch[1] || '').replace(/,/g, '');
    const rawVal = parseInt(valStr, 10);
    if (!isNaN(rawVal) && rawVal >= 5000) amount = rawVal;
  }

  // If income wasn't captured explicitly but multiple lakh values exist
  if (annualFamilyIncome === null) {
    const allLakhs = [...p.matchAll(/(\d+(?:\.\d+)?)\s*(?:lakh|lac|lakhs|l\b)/gi)];
    if (allLakhs.length > 1 && amount !== null) {
      const secondVal = Math.round(parseFloat(allLakhs[1][1]) * 100000);
      if (secondVal !== amount) {
        annualFamilyIncome = secondVal;
      }
    }
  }

  // 3. Extract Location / District
  let location = null;
  const knownLocations = [
    "Kolkata", "Howrah", "Barasat", "Delhi", "New Delhi", "Mumbai", "Bangalore", "Bengaluru",
    "Chennai", "Hyderabad", "Patna", "Lucknow", "Jaipur", "Varanasi", "Ahmedabad", "Pune",
    "Bhopal", "Indore", "Ranchi", "Guwahati", "Chandigarh", "Bhubaneswar", "Coimbatore", "Surat"
  ];
  for (const loc of knownLocations) {
    if (p.includes(loc.toLowerCase())) {
      location = loc;
      break;
    }
  }

  // 4. Extract Category / Demographics
  let category = null;
  if (p.includes("women") || p.includes("woman") || p.includes("female") || p.includes("mahila")) {
    category = "women";
  } else if (p.includes("sc") || p.includes("scheduled caste") || p.includes("dalit")) {
    category = "sc";
  } else if (p.includes("st") || p.includes("scheduled tribe") || p.includes("tribal") || p.includes("adivasi")) {
    category = "st";
  } else if (p.includes("obc") || p.includes("other backward")) {
    category = "obc";
  } else if (p.includes("artisan") || p.includes("craftsman") || p.includes("vishwakarma") || p.includes("karigar")) {
    category = "artisan";
  } else if (p.includes("minority") || p.includes("muslim") || p.includes("christian") || p.includes("sikh")) {
    category = "minority";
  }

  // 5. Extract Specific Business Type & Purpose
  let purpose = null;
  let businessType = null;

  if (p.includes("tailor") || p.includes("sewing") || p.includes("garment") || p.includes("cloth") || p.includes("boutique")) {
    businessType = "tailoring";
    purpose = "business";
  } else if (p.includes("dairy") || p.includes("cow") || p.includes("cattle") || p.includes("milk") || p.includes("buffalo") || p.includes("animal husbandry")) {
    businessType = "dairy_farming";
    purpose = "agriculture";
  } else if (p.includes("artisan") || p.includes("potter") || p.includes("pottery") || p.includes("craft") || p.includes("handicraft") || p.includes("weaver") || p.includes("blacksmith") || p.includes("carpenter") || p.includes("carpentry") || p.includes("sculptor")) {
    businessType = "artisan_crafts";
    purpose = "business";
  } else if (p.includes("street vendor") || p.includes("vendor") || p.includes("hawker") || p.includes("food cart") || p.includes("thela") || p.includes("tea stall") || p.includes("snack")) {
    businessType = "street_vendor";
    purpose = "business";
  } else if (p.includes("retail") || p.includes("grocery") || p.includes("kirana") || p.includes("shop") || p.includes("store") || p.includes("stationery") || p.includes("supermarket")) {
    businessType = "retail_shop";
    purpose = "business";
  } else if (p.includes("education") || p.includes("college") || p.includes("university") || p.includes("course") || p.includes("study") || p.includes("btech") || p.includes("medical") || p.includes("degree")) {
    businessType = "higher_education";
    purpose = "education";
  } else if (p.includes("startup") || p.includes("tech") || p.includes("software") || p.includes("innovation") || p.includes("app") || p.includes("ai") || p.includes("biotech")) {
    businessType = "tech_startup";
    purpose = "business";
  } else if (p.includes("solar") || p.includes("renewable") || p.includes("green energy") || p.includes("rooftop solar")) {
    businessType = "solar_energy";
    purpose = "business";
  } else if (p.includes("transport") || p.includes("taxi") || p.includes("auto") || p.includes("commercial vehicle") || p.includes("rickshaw") || p.includes("ev")) {
    businessType = "transport_service";
    purpose = "business";
  } else if (p.includes("salon") || p.includes("beauty") || p.includes("parlour") || p.includes("barber") || p.includes("spa")) {
    businessType = "personal_services";
    purpose = "business";
  } else if (p.includes("food") || p.includes("bakery") || p.includes("catering") || p.includes("restaurant") || p.includes("pickle") || p.includes("spice")) {
    businessType = "food_processing";
    purpose = "business";
  } else if (p.includes("business") || p.includes("enterprise") || p.includes("venture") || p.includes("shop") || p.includes("work") || p.includes("unit")) {
    purpose = "business";
    // Not specific business type!
    businessType = null;
  }

  // Determine Missing Fields
  const missingFields = [];
  if (!businessType) missingFields.push('businessType');
  if (!amount || amount <= 0) missingFields.push('amount');
  if (annualFamilyIncome === null || annualFamilyIncome === undefined) missingFields.push('annualFamilyIncome');
  if (!location) missingFields.push('location');

  const isComplete = missingFields.length === 0;

  // Build tailored conversational next question
  let nextQuestion = null;
  if (!isComplete) {
    const questionParts = [];
    if (!businessType) questionParts.push("what specific kind of business or trade you are planning (e.g., tailoring, dairy, artisan pottery, retail shop, food unit)");
    if (!amount) questionParts.push("how much loan or capital you require");
    if (annualFamilyIncome === null) questionParts.push("your approximate annual family income");
    if (!location) questionParts.push("your district or city");

    if (questionParts.length === 4) {
      nextQuestion = "To match verified government schemes accurately, could you specify what kind of business you want to start, how much capital you need, your approximate annual family income, and your district?";
    } else {
      nextQuestion = `Could you please clarify ${questionParts.join(", and ")}?`;
    }
  }

  const detected = {
    purpose: purpose || 'business',
    businessType,
    amount,
    annualFamilyIncome,
    location,
    category
  };

  const clarificationSuggestions = {
    businessTypes: [
      "Tailoring & Garments",
      "Dairy & Cattle Farming",
      "Artisan Pottery & Crafts",
      "Retail / Kirana Store",
      "Street Vendor / Food Cart",
      "Carpentry & Woodwork",
      "Tech Startup / Innovation",
      "Higher Education Degree"
    ],
    amounts: [50000, 120000, 250000, 500000, 1000000, 2500000],
    incomeTiers: [150000, 300000, 500000, 800000],
    locations: ["Kolkata", "Delhi", "Varanasi", "Mumbai", "Jaipur", "Lucknow", "Bengaluru", "Patna", "Howrah"],
    categories: ["General", "Women Entrepreneur", "SC / ST", "OBC", "Traditional Artisan / Vishwakarma", "Minority"]
  };

  return {
    isComplete,
    missingFields,
    detected,
    nextQuestion,
    clarificationSuggestions,
    extracted: isComplete ? {
      purpose: detected.purpose || 'business',
      businessType: detected.businessType,
      amount: detected.amount,
      annualFamilyIncome: detected.annualFamilyIncome,
      location: detected.location,
      category: detected.category,
      educationStatus: detected.purpose === 'education' ? 'pursuing_degree' : null,
      extractedAt: new Date().toISOString(),
      source: 'local_nlp_parser'
    } : null
  };
}

// Backward-compatible fallback parser
function fallbackExtractRequirement(prompt) {
  const result = parseRequirementDetails(prompt);
  if (result.isComplete && result.extracted) {
    return result.extracted;
  }
  // Default values ONLY when explicitly requested as a non-interactive fallback
  return {
    purpose: result.detected.purpose || 'business',
    businessType: result.detected.businessType || 'tailoring',
    amount: result.detected.amount || 120000,
    annualFamilyIncome: result.detected.annualFamilyIncome !== null ? result.detected.annualFamilyIncome : 300000,
    location: result.detected.location || 'Kolkata',
    category: result.detected.category || null,
    educationStatus: null,
    extractedAt: new Date().toISOString(),
    source: 'local_nlp_parser'
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

  async extractRequirement(prompt) {
    if (!prompt) throw new Error('Prompt is required.');
    const details = parseRequirementDetails(prompt);
    if (details.isComplete && details.extracted) {
      return details.extracted;
    }
    return fallbackExtractRequirement(prompt);
  }

  async extractRequirementConversational(messages) {
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      throw new Error('Messages array is required.');
    }

    const fullText = messages.map(m => `${m.role}: ${m.content}`).join('\n');
    const localResult = parseRequirementDetails(fullText);

    if (this.useMock || !this.genAI) {
      return localResult;
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
- businessType: specific type of business or vocation (e.g. "tailoring", "dairy", "artisan crafts", "retail", "education"). If user only says generic "business" without specific trade, businessType must be null.
- amount: integer in INR (e.g. 1.2 lakh becomes 120000, 50k becomes 50000)
- annualFamilyIncome: integer in INR (e.g. 3 lakh becomes 300000)
- location: string (city or district, e.g. "Kolkata", "Varanasi")

If ANY of the mandatory fields are missing or null, set "isComplete" to false, list the missing fields in "missingFields", and formulate a polite, conversational "nextQuestion" asking ONLY for the missing information.
If ALL mandatory fields are present, set "isComplete" to true, "missingFields" to [], and provide the "extracted" object.

Return strictly a JSON object matching this schema:
{
  "isComplete": boolean,
  "missingFields": string[],
  "nextQuestion": string | null,
  "extracted": {
    "purpose": string,
    "businessType": string,
    "amount": number,
    "annualFamilyIncome": number,
    "location": string,
    "category": string | null,
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

      // Merge suggestions and detected fields
      parsed.clarificationSuggestions = localResult.clarificationSuggestions;
      parsed.detected = localResult.detected;

      if (parsed.isComplete && parsed.extracted) {
        parsed.extracted.extractedAt = new Date().toISOString();
        parsed.extracted.source = this.modelName;
      }

      return parsed;
    } catch (err) {
      console.warn('[GeminiService] Gemini API call failed, falling back to local extractor:', err.message);
      return localResult;
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
