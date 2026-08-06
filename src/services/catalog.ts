/**
 * Mock scholarship catalog — the stand-in for the MySQL table the FastAPI
 * service will expose. Nothing outside src/services should import this file.
 */

import { scholarships as baseSeed } from "@/data/mock";
import type { Scholarship, ScholarshipCategory, Sector, YearLevel } from "@/types/scholarship";

const iso = (days: number) => new Date(Date.now() + days * 86_400_000).toISOString().slice(0, 10);

const defaultFaqs = (name: string, provider: string) => [
  {
    q: `Can I hold another scholarship along with ${name}?`,
    a: "Most awards allow one government plus one private scholarship at a time. Check the official notice before accepting two government awards.",
  },
  {
    q: "How is the money disbursed?",
    a: "Funds are transferred through DBT to the Aadhaar-linked bank account of the student, usually in two instalments per academic year.",
  },
  {
    q: "What happens if my documents are rejected?",
    a: `${provider} reopens the correction window for 7 days. You can re-upload the flagged document without submitting a fresh application.`,
  },
];

const defaultSelection = (provider: string) => [
  "Automated eligibility screening against your submitted profile",
  "Institute-level verification of marksheets and certificates",
  `Final merit list published by ${provider}`,
  "Award letter issued and funds released to the student account",
];

/** Derives the newer attributes for the original seed rows. */
function upgrade(s: (typeof baseSeed)[number]): Scholarship {
  const sector: Sector =
    s.tags.some((t) => /government|state/i.test(t)) || /ministry|aicte|department|portal/i.test(s.provider)
      ? "Government"
      : "Private";

  const yearLevels: YearLevel[] =
    s.id === "aicte-pragati-girls" ? ["Fresher"] : s.category === "Research" ? ["Final year"] : ["Any year"];

  let educationLevels: string[] = ["Undergraduate"];
  if (s.id === "nsp-merit-cum-means") {
    educationLevels = ["Undergraduate", "Postgraduate"];
  } else if (s.id === "aicte-pragati-girls") {
    educationLevels = ["Undergraduate", "Diploma", "Polytechnic"];
  } else if (s.id === "state-post-matric") {
    educationLevels = ["School", "Intermediate", "Diploma", "Polytechnic", "ITI", "Undergraduate", "Postgraduate"];
  } else if (s.id === "tata-capital-pankh") {
    educationLevels = ["School", "Intermediate", "Diploma", "Polytechnic", "Undergraduate"];
  } else if (s.id === "inspire-research") {
    educationLevels = ["Undergraduate", "Postgraduate", "PhD"];
  } else if (s.id === "sitaram-jindal") {
    educationLevels = ["School", "Intermediate", "ITI", "Diploma", "Undergraduate", "Postgraduate"];
  } else if (s.id === "khelo-india-sports" || s.id === "minority-cultural") {
    educationLevels = ["School", "Intermediate", "ITI", "Diploma", "Polytechnic", "Undergraduate", "Postgraduate", "PhD", "Other"];
  }

  return {
    ...s,
    sector,
    yearLevels,
    educationLevels,
    successProbability: Math.max(18, Math.min(94, Math.round(s.match * 0.82 + (s.amount > 150000 ? -8 : 6)))),
    forWomen: s.category === "Girls",
    forMinority: s.category === "Minority",
    forDisability: false,
    overview: `${s.summary} ${s.provider} publishes the notification on its official portal each cycle, and MeritMind mirrors the exact eligibility text so you can verify every line before applying.`,
    selectionProcess: defaultSelection(s.provider),
    faqs: defaultFaqs(s.name, s.provider),
  };
}

type ExtraInput = {
  id: string;
  name: string;
  provider: string;
  logo: string;
  amount: number;
  deadline: number;
  category: ScholarshipCategory;
  sector: Sector;
  state: string;
  branches: string[];
  yearLevels: YearLevel[];
  educationLevels: string[];
  maxIncome: number;
  minCgpa: number;
  match: number;
  official: string;
  tags: string[];
  summary: string;
  benefits: string[];
  eligibility: string[];
  documents: string[];
  addedAt: number;
  reasons: string[];
  forWomen?: boolean;
  forMinority?: boolean;
  forDisability?: boolean;
};

function make(x: ExtraInput): Scholarship {
  return {
    id: x.id,
    name: x.name,
    provider: x.provider,
    logo: x.logo,
    amount: x.amount,
    currency: "₹",
    deadline: iso(x.deadline),
    category: x.category,
    sector: x.sector,
    state: x.state,
    branches: x.branches,
    yearLevels: x.yearLevels,
    educationLevels: x.educationLevels,
    maxIncome: x.maxIncome,
    minCgpa: x.minCgpa,
    match: x.match,
    successProbability: Math.max(18, Math.min(94, Math.round(x.match * 0.84))),
    forWomen: x.forWomen ?? false,
    forMinority: x.forMinority ?? false,
    forDisability: x.forDisability ?? false,
    official: x.official,
    tags: x.tags,
    summary: x.summary,
    overview: `${x.summary} The award is reviewed every cycle by ${x.provider}; MeritMind tracks the official notification so the eligibility text you read here matches the source.`,
    benefits: x.benefits,
    eligibility: x.eligibility,
    documents: x.documents,
    selectionProcess: defaultSelection(x.provider),
    faqs: defaultFaqs(x.name, x.provider),
    timeline: [
      { label: "Applications open", date: iso(x.addedAt - 10), done: true },
      { label: "Document verification", date: iso(Math.max(1, x.deadline - 4)), done: false },
      { label: "Last date to apply", date: iso(x.deadline), done: false },
      { label: "Result & disbursement", date: iso(x.deadline + 35), done: false },
    ],
    addedAt: iso(x.addedAt),
    reasons: x.reasons,
  };
}

const extras: Scholarship[] = [
  make({
    id: "reliance-foundation-ug",
    name: "Reliance Foundation Undergraduate Scholarship",
    provider: "Reliance Foundation",
    logo: "🔷",
    amount: 200000,
    deadline: 18,
    category: "Merit",
    sector: "Private",
    state: "All India",
    branches: ["Computer Science", "Electronics", "Mechanical", "Information Technology"],
    yearLevels: ["Fresher"],
    educationLevels: ["Undergraduate"],
    maxIncome: 1500000,
    minCgpa: 8,
    match: 92,
    official: "https://www.scholarships.reliancefoundation.org",
    tags: ["Corporate", "Mentorship", "Alumni network"],
    summary:
      "One of India's largest private undergraduate awards, giving up to ₹2,00,000 across the degree plus lifelong access to the Reliance scholar network.",
    benefits: [
      "Up to ₹2,00,000 grant across the degree",
      "Access to the Reliance Foundation scholar community",
      "Leadership and career mentoring sessions",
    ],
    eligibility: [
      "First-year undergraduate student in India",
      "Family income below ₹15,00,000 per year",
      "Strong Class 12 or entrance exam performance",
    ],
    documents: ["Class 12 marksheet", "Entrance exam scorecard", "Income proof", "Admission proof"],
    addedAt: -1,
    reasons: [
      "Your academic percentile is inside their shortlist band",
      "Income ceiling is generous at ₹15L",
      "Adds a mentor network you said you wanted",
    ],
  }),
  make({
    id: "swami-vivekananda-single-girl",
    name: "Swami Vivekananda Single Girl Child Fellowship",
    provider: "University Grants Commission",
    logo: "🌺",
    amount: 82000,
    deadline: 7,
    category: "Girls",
    sector: "Government",
    state: "All India",
    branches: ["All branches"],
    yearLevels: ["Any year"],
    educationLevels: ["Postgraduate", "PhD"],
    maxIncome: 2500000,
    minCgpa: 6.5,
    match: 87,
    official: "https://www.ugc.gov.in",
    tags: ["Government", "Single girl child", "No income bar"],
    summary:
      "Fellowship for single girl children pursuing higher education, with no upper income limit and a monthly stipend paid for two years.",
    benefits: ["₹82,000 per year for two years", "No family income ceiling", "Direct benefit transfer"],
    eligibility: [
      "Only girl child of her parents",
      "Enrolled in a recognised university programme",
      "Age under 30 at the time of admission",
    ],
    documents: ["Affidavit of single girl child", "Admission letter", "Marksheets", "Bank details"],
    addedAt: -2,
    reasons: ["No income barrier at all", "Closes in a week — act now"],
    forWomen: true,
  }),
  make({
    id: "nhfdc-disability-support",
    name: "NHFDC Scholarship for Students with Disabilities",
    provider: "National Handicapped Finance & Development Corporation",
    logo: "♿",
    amount: 70000,
    deadline: 30,
    category: "Need-based",
    sector: "Government",
    state: "All India",
    branches: ["All branches"],
    yearLevels: ["Any year"],
    educationLevels: ["Diploma", "Polytechnic", "Undergraduate", "Postgraduate", "PhD"],
    maxIncome: 800000,
    minCgpa: 5,
    match: 58,
    official: "https://scholarships.gov.in",
    tags: ["Government", "Accessibility grant", "Assistive devices"],
    summary:
      "Covers tuition, maintenance and assistive technology costs for students with 40% or more benchmark disability.",
    benefits: [
      "Tuition reimbursement up to ₹40,000",
      "Maintenance allowance of ₹3,000 per month",
      "One-time assistive device grant",
    ],
    eligibility: [
      "Benchmark disability of 40% or above",
      "Family income below ₹8,00,000",
      "Enrolled in a recognised institution",
    ],
    documents: ["UDID / disability certificate", "Income certificate", "Fee receipt", "Marksheet"],
    addedAt: -5,
    reasons: ["Open to every branch and every year"],
    forDisability: true,
  }),
  make({
    id: "hdfc-parivartan-ecss",
    name: "HDFC Bank Parivartan ECS Scholarship",
    provider: "HDFC Bank",
    logo: "🏦",
    amount: 75000,
    deadline: 14,
    category: "Need-based",
    sector: "Private",
    state: "All India",
    branches: ["All branches"],
    yearLevels: ["Any year"],
    educationLevels: ["School", "Intermediate", "Diploma", "ITI", "Undergraduate", "Postgraduate"],
    maxIncome: 600000,
    minCgpa: 6,
    match: 81,
    official: "https://www.hdfcbank.com/personal/about-us/csr",
    tags: ["Corporate CSR", "Crisis support", "Quick decision"],
    summary:
      "Support for students facing a personal or financial crisis — job loss, medical emergency or a death in the family — that threatens their studies.",
    benefits: ["Up to ₹75,000 per year", "Fast-tracked crisis review", "Renewable on request"],
    eligibility: [
      "Family income below ₹6,00,000",
      "Documented personal or financial crisis in the last 3 years",
      "Minimum 55% in the previous examination",
    ],
    documents: ["Income proof", "Crisis supporting document", "Marksheet", "Fee structure"],
    addedAt: -3,
    reasons: ["Short application with a fast decision cycle", "Fits your income bracket"],
  }),
  make({
    id: "karnataka-vidyasiri",
    name: "Vidyasiri Food & Hostel Allowance",
    provider: "Karnataka Backward Classes Welfare Department",
    logo: "🏫",
    amount: 42000,
    deadline: 40,
    category: "Need-based",
    sector: "Government",
    state: "Karnataka",
    branches: ["All branches"],
    yearLevels: ["Any year"],
    educationLevels: ["Diploma", "Undergraduate", "Postgraduate"],
    maxIncome: 250000,
    minCgpa: 5,
    match: 46,
    official: "https://sw.kar.nic.in",
    tags: ["State", "Hostel", "Food allowance"],
    summary:
      "State allowance replacing hostel accommodation for students who could not get a government hostel seat.",
    benefits: ["₹3,500 monthly for 10 months", "No repayment", "Renewable annually"],
    eligibility: [
      "Karnataka domicile",
      "Family income below ₹2,50,000",
      "Not availing a government hostel seat",
    ],
    documents: ["Domicile certificate", "Income certificate", "Caste certificate", "Bonafide"],
    addedAt: -9,
    reasons: ["Only relevant if you study in Karnataka"],
  }),
  make({
    id: "loreal-young-women-science",
    name: "L'Oréal India For Young Women in Science",
    provider: "L'Oréal India",
    logo: "🧪",
    amount: 250000,
    deadline: 55,
    category: "Research",
    sector: "Private",
    state: "All India",
    branches: ["Physics", "Chemistry", "Mathematics", "Computer Science"],
    yearLevels: ["Fresher"],
    educationLevels: ["Undergraduate"],
    maxIncome: 600000,
    minCgpa: 8.5,
    match: 76,
    official: "https://www.foryoungwomeninscience.com",
    tags: ["Corporate", "Women in science", "Full tuition"],
    summary:
      "Fully funds a science degree for young women who scored exceptionally in Class 12 and intend to build a research career.",
    benefits: ["Tuition covered up to ₹2,50,000", "Annual scholar summit", "Industry mentor"],
    eligibility: [
      "Female candidate under 21 years",
      "85% or above in Class 12 science stream",
      "Family income below ₹6,00,000",
    ],
    documents: ["Class 12 marksheet", "Income certificate", "Statement of purpose", "ID proof"],
    addedAt: -7,
    reasons: ["Research intent matches your profile", "High award value"],
    forWomen: true,
  }),
  make({
    id: "maulana-azad-minority-merit",
    name: "Maulana Azad Minority Merit Award",
    provider: "Maulana Azad Education Foundation",
    logo: "📗",
    amount: 55000,
    deadline: 11,
    category: "Minority",
    sector: "Government",
    state: "All India",
    branches: ["All branches"],
    yearLevels: ["Any year"],
    educationLevels: ["Intermediate", "Undergraduate", "Postgraduate"],
    maxIncome: 350000,
    minCgpa: 6.5,
    match: 66,
    official: "https://www.maef.nic.in",
    tags: ["Government", "Minority", "Renewable"],
    summary:
      "Merit award for students from notified minority communities studying professional and technical courses.",
    benefits: ["₹55,000 per year", "Renewable for course duration", "Priority verification"],
    eligibility: [
      "Notified minority community certificate",
      "Family income below ₹3,50,000",
      "60% or above in the previous year",
    ],
    documents: ["Community certificate", "Income certificate", "Marksheet", "Bank passbook"],
    addedAt: -6,
    reasons: ["Renewable across the full degree"],
    forMinority: true,
  }),
  make({
    id: "final-year-placement-boost",
    name: "Final Year Placement Readiness Grant",
    provider: "Nasscom Foundation",
    logo: "🚀",
    amount: 35000,
    deadline: 24,
    category: "Merit",
    sector: "Private",
    state: "All India",
    branches: ["Computer Science", "Information Technology", "Electronics"],
    yearLevels: ["Final year"],
    educationLevels: ["Undergraduate", "Postgraduate"],
    maxIncome: 900000,
    minCgpa: 7,
    match: 89,
    official: "https://nasscomfoundation.org",
    tags: ["Corporate", "Final year", "Certification cover"],
    summary:
      "Covers certification, interview travel and project costs for final-year engineering students entering placements.",
    benefits: ["₹35,000 grant", "Two paid certifications", "Mock interview programme"],
    eligibility: [
      "Final-year engineering student",
      "CGPA of 7.0 or above",
      "Family income below ₹9,00,000",
    ],
    documents: ["Bonafide certificate", "Latest marksheet", "Income declaration", "Resume"],
    addedAt: 0,
    reasons: [
      "Built specifically for final-year students",
      "Your CGPA clears the 7.0 bar comfortably",
      "Newest listing in your feed",
    ],
  }),
];

export const catalog: Scholarship[] = [...baseSeed.map(upgrade), ...extras];

export const catalogById = (id: string) => catalog.find((s) => s.id === id);
