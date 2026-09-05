import PDFDocument from 'pdfkit';

export class PDFService {
  /**
   * Dynamically generate a publication-grade application checklist PDF
   * @param {Object} data - { scheme, partner, userRequirement, financialSummary }
   * @param {WritableStream} outputStream - Express response stream
   */
  generateChecklistPDF(data, outputStream) {
    const {
      scheme = {},
      partner = {},
      userRequirement = {},
      financialSummary = {}
    } = data;

    const doc = new PDFDocument({
      size: 'A4',
      margin: 40,
      info: {
        Title: `ALIGN Checklist - ${scheme.shortName || 'Government Scheme'}`,
        Author: 'ALIGN Decision Support System (SIH 2026)',
        Subject: 'Government Financial Assistance Application Checklist'
      }
    });

    doc.pipe(outputStream);

    // Primary Colors
    const primaryColor = '#002046';
    const secondaryColor = '#16a34a';
    const textColor = '#1E2227';
    const mutedColor = '#57606A';

    // 1. Header & Branding
    doc
      .rect(40, 40, 515, 65)
      .fill('#FAF8F5');

    doc
      .fontSize(22)
      .fillColor(primaryColor)
      .font('Helvetica-Bold')
      .text('ALIGN', 55, 52)
      .fontSize(9)
      .fillColor(secondaryColor)
      .font('Helvetica-Bold')
      .text('DECISION SUPPORT & SCHEME DISCOVERY DOSSIER', 55, 78)
      .fontSize(8)
      .fillColor(mutedColor)
      .font('Helvetica')
      .text(`Generated: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })} | Reference ID: ALN-${Date.now().toString().slice(-6)}`, 55, 90);

    // 2. Summary Table Grid
    let yPos = 120;

    // Applicant Box
    doc
      .rect(40, yPos, 250, 95)
      .strokeColor('#E5DFD7')
      .stroke();

    doc
      .fontSize(10)
      .fillColor(primaryColor)
      .font('Helvetica-Bold')
      .text('1. APPLICANT PROFILE', 50, yPos + 10)
      .fontSize(8)
      .fillColor(textColor)
      .font('Helvetica')
      .text(`Enterprise: ${userRequirement.businessType || userRequirement.purpose || 'Tailoring'}`, 50, yPos + 28)
      .text(`Requested Loan: Rs. ${Number(userRequirement.amount || 120000).toLocaleString('en-IN')}`, 50, yPos + 42)
      .text(`Family Income: Rs. ${Number(userRequirement.annualFamilyIncome || 300000).toLocaleString('en-IN')}/year`, 50, yPos + 56)
      .text(`District: ${userRequirement.location || 'Kolkata, West Bengal'}`, 50, yPos + 70);

    // Target Scheme Box
    doc
      .rect(305, yPos, 250, 95)
      .strokeColor('#E5DFD7')
      .stroke();

    doc
      .fontSize(10)
      .fillColor(primaryColor)
      .font('Helvetica-Bold')
      .text('2. TARGET SCHEME TERMS', 315, yPos + 10)
      .fontSize(8)
      .fillColor(textColor)
      .font('Helvetica')
      .text(`Scheme: ${scheme.name || 'NSFDC Micro Finance Scheme'}`, 315, yPos + 28)
      .text(`Concessional Rate: ${scheme.interestRate || 6.5}% p.a.`, 315, yPos + 42)
      .text(`Max Assistance: Rs. ${(Number(scheme.maxLoanAmount || 125000) / 100000).toFixed(2)} Lakh`, 315, yPos + 56)
      .text(`Repayment: Up to ${scheme.maxTenureMonths || 36} Months (${scheme.moratoriumMonths || 3}m Moratorium)`, 315, yPos + 70);

    // 3. Selected Channel Partner Box
    yPos = 225;
    doc
      .rect(40, yPos, 515, 65)
      .strokeColor('#E5DFD7')
      .stroke();

    doc
      .fontSize(10)
      .fillColor(primaryColor)
      .font('Helvetica-Bold')
      .text('3. DESIGNATED NODAL CHANNEL PARTNER (WHERE TO APPLY)', 50, yPos + 10)
      .fontSize(8)
      .fillColor(textColor)
      .font('Helvetica')
      .text(`Agency: ${partner.name || 'West Bengal SC, ST & OBC Dev Corp (WBSCSTDFCL)'} [${partner.type || 'SCA'}]`, 50, yPos + 26)
      .text(`Address: ${partner.address || 'Bikash Bhavan, Salt Lake, Kolkata 700091'}`, 50, yPos + 38)
      .text(`Nodal Desk: ${partner.contact?.nodalOfficerName || 'District Welfare Officer'} | Phone: ${partner.contact?.phone || '+91 33 2334 1234'}`, 50, yPos + 50);

    // 4. Required Statutory Document Checklist
    yPos = 305;
    doc
      .fontSize(11)
      .fillColor(primaryColor)
      .font('Helvetica-Bold')
      .text('4. REQUIRED DOCUMENT CHECKLIST (BRING ORIGINALS & 2 COPIES)', 40, yPos);

    yPos += 18;
    const docs = scheme.documents || [
      { name: 'Identity & Address Proof (Aadhaar / Voter ID)', issuingAuthority: 'UIDAI' },
      { name: 'Family Income Certificate (<= Rs. 5,00,000)', issuingAuthority: 'SDO / BDO / Revenue Officer' },
      { name: 'Community / Target Group Certificate', issuingAuthority: 'District Welfare Officer' },
      { name: 'Equipment Quotation / Machine Bill', issuingAuthority: 'Registered Equipment Supplier' },
      { name: 'Savings Bank Passbook Copy with IFSC', issuingAuthority: 'Any Commercial / Rural Bank' },
    ];

    docs.forEach((item, index) => {
      // Draw checkbox square
      doc
        .rect(45, yPos + 2, 10, 10)
        .strokeColor('#7A828B')
        .stroke();

      doc
        .fontSize(9)
        .fillColor(textColor)
        .font('Helvetica-Bold')
        .text(`${item.name}`, 65, yPos + 2)
        .fontSize(7.5)
        .fillColor(mutedColor)
        .font('Helvetica')
        .text(`Issuing Authority: ${item.issuingAuthority || 'Competent Authority'}`, 65, yPos + 14);

      yPos += 26;
    });

    // 5. Application Process Roadmap
    yPos += 8;
    doc
      .fontSize(11)
      .fillColor(primaryColor)
      .font('Helvetica-Bold')
      .text('5. STEP-BY-STEP SUBMISSION ROADMAP', 40, yPos);

    yPos += 18;
    const steps = scheme.applicationProcess || [
      { stepNumber: 1, title: 'Dossier Assembly', description: 'Procure income certificate and machine quotation.' },
      { stepNumber: 2, title: 'Branch Desk Submission', description: 'Submit physical dossier at designated channel partner office.' },
      { stepNumber: 3, title: 'Field Scrutiny', description: 'Nodal officer verifies residence and business feasibility.' },
      { stepNumber: 4, title: 'Sanction & Disbursement', description: 'Direct loan release to equipment vendor / bank account.' }
    ];

    steps.forEach((step) => {
      doc
        .fontSize(8.5)
        .fillColor(primaryColor)
        .font('Helvetica-Bold')
        .text(`Step ${step.stepNumber}: ${step.title}`, 45, yPos)
        .fontSize(8)
        .fillColor(mutedColor)
        .font('Helvetica')
        .text(`${step.description}`, 45, yPos + 11);

      yPos += 24;
    });

    // 6. Regulatory Disclaimers & Official Footer
    yPos = 745;
    doc
      .rect(40, yPos, 515, 50)
      .fill('#F3EFEA');

    doc
      .fontSize(7.5)
      .fillColor(textColor)
      .font('Helvetica-Bold')
      .text('IMPORTANT STATUTORY DISCLAIMER', 50, yPos + 8)
      .font('Helvetica')
      .fontSize(6.8)
      .fillColor(mutedColor)
      .text('ALIGN is an AI-assisted decision-support platform designed to decode government financial assistance. ALIGN does not approve loans or submit government applications directly. Official sanction is subject to physical verification, statutory eligibility, and branch manager discretion.', 50, yPos + 18, { width: 495 })
      .text('Official Scheme Source: National Scheduled Castes Finance & Development Corp (NSFDC) | https://nsfdc.nic.in', 50, yPos + 38);

    doc.end();
  }
}

export const pdfService = new PDFService();
export default pdfService;
