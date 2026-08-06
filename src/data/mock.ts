/**
 * Mock data layer for MeritMind.
 * All reads go through the tiny service functions at the bottom so that the
 * whole app can later be pointed at a REST API (FastAPI + MySQL) without
 * touching a single component.
 */

export type Scholarship = {
  id: string;
  name: string;
  provider: string;
  logo: string; // emoji stand-in for provider mark
  amount: number;
  currency: string;
  deadline: string; // ISO
  category: "Merit" | "Need-based" | "Minority" | "Girls" | "Research" | "Sports";
  state: string;
  branches: string[];
  maxIncome: number;
  minCgpa: number;
  match: number;
  official: string;
  tags: string[];
  summary: string;
  benefits: string[];
  eligibility: string[];
  documents: string[];
  timeline: { label: string; date: string; done: boolean }[];
  addedAt: string;
  reasons: string[];
};

export type StudentProfile = {
  name: string;
  initials: string;
  headline: string;
  city: string;
  state: string;
  course: string;
  branch: string;
  year: string;
  cgpa: number;
  income: number;
  category: string;
  strength: number;
  sections: { id: string; label: string; done: boolean; weight: number }[];
  achievements: { title: string; org: string; year: string; icon: string }[];
  skills: string[];
};

export type AppNotification = {
  id: string;
  kind: "deadline" | "new" | "match" | "profile";
  title: string;
  body: string;
  time: string;
  unread: boolean;
};

export type ApplicationTrack = {
  id: string;
  scholarshipId: string;
  stage: "Saved" | "Documents" | "Submitted" | "Result";
  updated: string;
};

const iso = (days: number) =>
  new Date(Date.now() + days * 86_400_000).toISOString().slice(0, 10);

export const scholarships: Scholarship[] = [
  {
    id: "nsp-merit-cum-means",
    name: "Merit-cum-Means Scholarship",
    provider: "National Scholarship Portal",
    logo: "🎓",
    amount: 120000,
    currency: "₹",
    deadline: iso(12),
    category: "Merit",
    state: "All India",
    branches: ["Computer Science", "Electronics", "Mechanical", "Civil"],
    maxIncome: 800000,
    minCgpa: 7.5,
    match: 96,
    official: "https://scholarships.gov.in",
    tags: ["Government", "Renewable", "Tuition + Stipend"],
    summary:
      "Full tuition support plus a monthly maintenance allowance for high-performing undergraduate students from families under the income ceiling.",
    benefits: [
      "Full tuition fee reimbursement up to ₹1,00,000 / year",
      "Monthly maintenance allowance of ₹1,000",
      "Renewable for the full duration of the degree",
    ],
    eligibility: [
      "Family income below ₹8,00,000 per year",
      "Minimum 7.5 CGPA in the last academic year",
      "Enrolled in an AICTE-approved institution",
    ],
    documents: [
      "Income certificate",
      "Latest marksheet",
      "Aadhaar-linked bank passbook",
      "Institute bonafide certificate",
    ],
    timeline: [
      { label: "Applications open", date: iso(-30), done: true },
      { label: "Document verification", date: iso(14), done: false },
      { label: "Institute approval", date: iso(28), done: false },
      { label: "Disbursement", date: iso(60), done: false },
    ],
    addedAt: iso(-2),
    reasons: [
      "Your 8.6 CGPA is comfortably above the 7.5 cut-off",
      "Family income fits the ₹8L ceiling",
      "Computer Science is an eligible branch",
    ],
  },
  {
    id: "aicte-pragati-girls",
    name: "AICTE Pragati Scholarship for Girls",
    provider: "AICTE",
    logo: "🌸",
    amount: 50000,
    currency: "₹",
    deadline: iso(5),
    category: "Girls",
    state: "All India",
    branches: ["Computer Science", "Electronics", "Information Technology"],
    maxIncome: 800000,
    minCgpa: 6,
    match: 91,
    official: "https://www.aicte-india.org",
    tags: ["Government", "Women in Tech", "Books allowance"],
    summary:
      "Encourages girl students in technical education with an annual grant covering fees, books and laptop purchase.",
    benefits: [
      "₹50,000 per year as incentive",
      "Covers fees, computer, stationery and equipment",
      "Two girls per family are eligible",
    ],
    eligibility: [
      "Female candidate admitted to first year of a degree course",
      "Family income up to ₹8,00,000",
      "Admission through centralised admission process",
    ],
    documents: ["Admission letter", "Income certificate", "Tenth marksheet", "Bank details"],
    timeline: [
      { label: "Portal opens", date: iso(-45), done: true },
      { label: "Last date to apply", date: iso(5), done: false },
      { label: "Verification", date: iso(20), done: false },
      { label: "Award announcement", date: iso(45), done: false },
    ],
    addedAt: iso(-1),
    reasons: [
      "Closes in 5 days — highest urgency in your list",
      "Your branch is in the eligible list",
      "Only 3 documents left to upload",
    ],
  },
  {
    id: "state-post-matric",
    name: "State Post-Matric Fee Waiver",
    provider: "State Department of Higher Education",
    logo: "🏛️",
    amount: 65000,
    currency: "₹",
    deadline: iso(21),
    category: "Need-based",
    state: "Maharashtra",
    branches: ["All branches"],
    maxIncome: 500000,
    minCgpa: 5,
    match: 84,
    official: "https://mahadbt.maharashtra.gov.in",
    tags: ["State", "Fee waiver", "Hostel support"],
    summary:
      "Tuition and hostel fee waiver for domicile students of the state whose family income is under ₹5,00,000.",
    benefits: ["Tuition fee waiver", "Hostel & mess subsidy", "Exam fee reimbursement"],
    eligibility: [
      "State domicile certificate required",
      "Family income below ₹5,00,000",
      "Regular attendance above 75%",
    ],
    documents: ["Domicile certificate", "Income certificate", "Fee receipt", "Attendance record"],
    timeline: [
      { label: "Applications open", date: iso(-20), done: true },
      { label: "College forwarding", date: iso(24), done: false },
      { label: "Sanction", date: iso(50), done: false },
    ],
    addedAt: iso(-4),
    reasons: [
      "You hold a Maharashtra domicile",
      "Income bracket matches the ₹5L ceiling",
      "Open to every engineering branch",
    ],
  },
  {
    id: "tata-capital-pankh",
    name: "Tata Capital Pankh Scholarship",
    provider: "Tata Capital",
    logo: "💠",
    amount: 90000,
    currency: "₹",
    deadline: iso(33),
    category: "Need-based",
    state: "All India",
    branches: ["All branches"],
    maxIncome: 400000,
    minCgpa: 6.5,
    match: 78,
    official: "https://www.tatacapital.com",
    tags: ["Corporate CSR", "80% of fees", "Mentorship"],
    summary:
      "Corporate CSR programme covering up to 80% of tuition fees for meritorious students from low-income families.",
    benefits: ["Up to 80% of tuition fees", "Mentor pairing", "Career readiness workshops"],
    eligibility: [
      "Scored 60% or above in the previous year",
      "Family income below ₹4,00,000",
      "Studying in India",
    ],
    documents: ["Previous marksheet", "Income proof", "Fee structure", "Aadhaar"],
    timeline: [
      { label: "Applications open", date: iso(-10), done: true },
      { label: "Shortlist", date: iso(40), done: false },
      { label: "Telephonic interview", date: iso(52), done: false },
    ],
    addedAt: iso(-6),
    reasons: [
      "Strong academic record fits their merit filter",
      "Includes 1:1 mentorship, matching your career goal",
    ],
  },
  {
    id: "inspire-research",
    name: "INSPIRE Research Fellowship",
    provider: "Department of Science & Technology",
    logo: "🔬",
    amount: 200000,
    currency: "₹",
    deadline: iso(48),
    category: "Research",
    state: "All India",
    branches: ["Computer Science", "Physics", "Chemistry", "Mathematics"],
    maxIncome: 2000000,
    minCgpa: 8,
    match: 88,
    official: "https://online-inspire.gov.in",
    tags: ["Research", "Top 1%", "Mentor grant"],
    summary:
      "Fellowship for students in the top 1% of their board or national exams pursuing natural and basic sciences research.",
    benefits: ["₹80,000 annual scholarship", "₹20,000 mentorship grant", "Summer research placement"],
    eligibility: [
      "Top 1% in board examination or JEE/NEET rank under 10,000",
      "CGPA of 8.0 and above",
      "Pursuing a science or engineering research track",
    ],
    documents: ["Rank certificate", "Marksheets", "Research statement", "Faculty recommendation"],
    timeline: [
      { label: "Call for applications", date: iso(-15), done: true },
      { label: "Statement submission", date: iso(45), done: false },
      { label: "Panel review", date: iso(75), done: false },
    ],
    addedAt: iso(-8),
    reasons: [
      "Your 8.6 CGPA clears the 8.0 research bar",
      "You listed research as a long-term interest",
    ],
  },
  {
    id: "sitaram-jindal",
    name: "Sitaram Jindal Foundation Scholarship",
    provider: "Sitaram Jindal Foundation",
    logo: "🪙",
    amount: 60000,
    currency: "₹",
    deadline: iso(60),
    category: "Merit",
    state: "All India",
    branches: ["All branches"],
    maxIncome: 600000,
    minCgpa: 7,
    match: 72,
    official: "https://www.sitaramjindalfoundation.org",
    tags: ["Trust", "Monthly stipend", "Rolling"],
    summary:
      "Monthly stipend paid directly to students with consistent academic performance and demonstrated financial need.",
    benefits: ["₹2,500 monthly stipend", "Rolling applications", "Renewable each year"],
    eligibility: ["65% aggregate marks", "Family income below ₹6,00,000", "Full-time student"],
    documents: ["Marksheet", "Income certificate", "Passport photo", "Bank details"],
    timeline: [
      { label: "Rolling intake", date: iso(-5), done: true },
      { label: "Review cycle", date: iso(35), done: false },
    ],
    addedAt: iso(-11),
    reasons: ["Rolling deadline gives you breathing room", "Simple 4-document application"],
  },
  {
    id: "khelo-india-sports",
    name: "Khelo India Athlete Grant",
    provider: "Ministry of Youth Affairs & Sports",
    logo: "🏅",
    amount: 500000,
    currency: "₹",
    deadline: iso(26),
    category: "Sports",
    state: "All India",
    branches: ["All branches"],
    maxIncome: 2500000,
    minCgpa: 5,
    match: 54,
    official: "https://kheloindia.gov.in",
    tags: ["Sports", "Training support", "Kit allowance"],
    summary:
      "Long-term athlete development grant covering training, coaching, equipment and education expenses.",
    benefits: ["₹5,00,000 annual support", "Coaching & nutrition", "Education cost cover"],
    eligibility: [
      "State or national level medal in the last 2 years",
      "Under 25 years of age",
      "Enrolled in recognised institution",
    ],
    documents: ["Medal certificate", "Age proof", "Coach recommendation", "Institute letter"],
    timeline: [
      { label: "Nomination window", date: iso(-8), done: true },
      { label: "Trial camp", date: iso(30), done: false },
    ],
    addedAt: iso(-14),
    reasons: ["Matches your district-level badminton achievement"],
  },
  {
    id: "minority-cultural",
    name: "Minority Community Talent Award",
    provider: "Ministry of Minority Affairs",
    logo: "🕊️",
    amount: 45000,
    currency: "₹",
    deadline: iso(9),
    category: "Minority",
    state: "All India",
    branches: ["All branches"],
    maxIncome: 300000,
    minCgpa: 6,
    match: 63,
    official: "https://scholarships.gov.in",
    tags: ["Government", "Fast approval", "Renewable"],
    summary:
      "Talent award for students from notified minority communities with a strong academic trajectory.",
    benefits: ["₹45,000 annual award", "Priority verification", "Renewable"],
    eligibility: [
      "Belongs to a notified minority community",
      "Family income below ₹3,00,000",
      "50% marks in previous exam",
    ],
    documents: ["Community certificate", "Income certificate", "Marksheet"],
    timeline: [
      { label: "Applications open", date: iso(-18), done: true },
      { label: "Last date", date: iso(9), done: false },
    ],
    addedAt: iso(-3),
    reasons: ["Short 3-document application", "Fast verification cycle"],
  },
];

export const student: StudentProfile = {
  name: "Aarushi Menon",
  initials: "AM",
  headline: "Third-year CSE student chasing a fully-funded degree",
  city: "Pune",
  state: "Maharashtra",
  course: "B.Tech",
  branch: "Computer Science",
  year: "3rd year",
  cgpa: 8.6,
  income: 480000,
  category: "General",
  strength: 72,
  sections: [
    { id: "personal", label: "Personal details", done: true, weight: 15 },
    { id: "academic", label: "Academic record", done: true, weight: 25 },
    { id: "financial", label: "Financial details", done: true, weight: 20 },
    { id: "achievements", label: "Achievements", done: true, weight: 12 },
    { id: "skills", label: "Skills & interests", done: false, weight: 13 },
    { id: "documents", label: "Document locker", done: false, weight: 15 },
  ],
  achievements: [
    { title: "Smart India Hackathon finalist", org: "MoE Innovation Cell", year: "2025", icon: "🏆" },
    { title: "District badminton silver", org: "Pune District Association", year: "2024", icon: "🏸" },
    { title: "Published paper on edge ML", org: "IEEE student track", year: "2025", icon: "📄" },
  ],
  skills: ["Python", "Machine Learning", "React", "Public speaking", "Data storytelling"],
};

export const notifications: AppNotification[] = [
  {
    id: "n1",
    kind: "deadline",
    title: "AICTE Pragati closes in 5 days",
    body: "Two documents are still pending in your locker.",
    time: "18 min ago",
    unread: true,
  },
  {
    id: "n2",
    kind: "match",
    title: "New 96% match found",
    body: "Merit-cum-Means Scholarship fits your academic and income profile.",
    time: "2 hours ago",
    unread: true,
  },
  {
    id: "n3",
    kind: "new",
    title: "4 new scholarships added",
    body: "Fresh listings collected from official state portals this morning.",
    time: "Yesterday",
    unread: false,
  },
  {
    id: "n4",
    kind: "profile",
    title: "Your profile strength grew to 72%",
    body: "Adding skills would unlock 6 more research scholarships.",
    time: "3 days ago",
    unread: false,
  },
];

export const applications: ApplicationTrack[] = [
  { id: "a1", scholarshipId: "aicte-pragati-girls", stage: "Documents", updated: "today" },
  { id: "a2", scholarshipId: "nsp-merit-cum-means", stage: "Submitted", updated: "2 days ago" },
  { id: "a3", scholarshipId: "state-post-matric", stage: "Saved", updated: "5 days ago" },
  { id: "a4", scholarshipId: "inspire-research", stage: "Result", updated: "last week" },
];

export const savedIds = [
  "aicte-pragati-girls",
  "nsp-merit-cum-means",
  "inspire-research",
  "state-post-matric",
];

export const journey = [
  { id: "profile", label: "Create profile", caption: "Basics captured", status: "done" as const },
  { id: "academic", label: "Academic details", caption: "8.6 CGPA verified", status: "done" as const },
  { id: "discover", label: "Discover", caption: "48 matches unlocked", status: "done" as const },
  { id: "recommend", label: "Recommendations", caption: "6 strong picks waiting", status: "current" as const },
  { id: "track", label: "Track applications", caption: "2 in progress", status: "next" as const },
  { id: "improve", label: "Improve profile", caption: "Unlock 6 more", status: "next" as const },
];

export const stats = [
  { label: "Scholarships tracked", value: "12,480" },
  { label: "Official sources", value: "260+" },
  { label: "Awarded to students", value: "₹86 Cr" },
  { label: "Avg. match accuracy", value: "94%" },
];

export const stories = [
  {
    name: "Rohan Deshmukh",
    quote:
      "MeritMind found a state fee waiver I never knew existed. My family paid nothing for third year.",
    detail: "₹1.2L awarded · NIT Nagpur",
    avatar: "🧑🏽‍🎓",
  },
  {
    name: "Fatima Sheikh",
    quote:
      "The deadline coach nudged me nine days before Pragati closed. I applied with a day to spare.",
    detail: "₹50K awarded · COEP Pune",
    avatar: "👩🏽‍💻",
  },
  {
    name: "Ananya Rao",
    quote:
      "It told me exactly which two profile fields were blocking research fellowships. Filling them changed everything.",
    detail: "INSPIRE fellow · IISc",
    avatar: "👩🏻‍🔬",
  },
];

export const faqs = [
  {
    q: "Is MeritMind a scholarship directory?",
    a: "No. A directory hands you a list. MeritMind reads your academic, financial and personal profile and coaches you toward the few scholarships you can genuinely win.",
  },
  {
    q: "Where does the scholarship data come from?",
    a: "Listings are collected from official government, state and verified corporate CSR portals. Every card links straight to the official application page.",
  },
  {
    q: "How is the match percentage calculated?",
    a: "It blends eligibility fit, income bracket, academic performance, branch relevance and how much time is left before the deadline.",
  },
  {
    q: "Do you charge students?",
    a: "Discovery, matching, deadline reminders and tracking are free for students. We never ask for an application fee on behalf of a provider.",
  },
  {
    q: "Will you remind me before a deadline?",
    a: "Yes. You get a nudge at 14, 7 and 2 days, and a final reminder the morning a deadline closes.",
  },
];

/* ------------------------------------------------------------------ *
 * Placeholder service layer — swap these bodies for REST calls later.
 * ------------------------------------------------------------------ */

export const scholarshipService = {
  list: () => scholarships,
  byId: (id: string) => scholarships.find((s) => s.id === id),
  recommended: () => [...scholarships].sort((a, b) => b.match - a.match).slice(0, 6),
  upcoming: () =>
    [...scholarships].sort((a, b) => a.deadline.localeCompare(b.deadline)).slice(0, 4),
  recentlyAdded: () => [...scholarships].sort((a, b) => b.addedAt.localeCompare(a.addedAt)).slice(0, 4),
  saved: () => scholarships.filter((s) => savedIds.includes(s.id)),
  related: (id: string) => scholarships.filter((s) => s.id !== id).slice(0, 3),
};

export const daysLeft = (deadline: string) =>
  Math.max(0, Math.ceil((new Date(deadline).getTime() - Date.now()) / 86_400_000));

export const inr = (n: number) =>
  n >= 100000 ? `₹${(n / 100000).toFixed(n % 100000 === 0 ? 0 : 1)}L` : `₹${(n / 1000).toFixed(0)}K`;

export const categories = [
  "All",
  "Merit",
  "Need-based",
  "Girls",
  "Minority",
  "Research",
  "Sports",
] as const;

export const statesList = ["All India", "Maharashtra", "Karnataka", "Delhi", "Tamil Nadu"];
export const branchList = [
  "All branches",
  "Computer Science",
  "Electronics",
  "Mechanical",
  "Civil",
  "Information Technology",
];
