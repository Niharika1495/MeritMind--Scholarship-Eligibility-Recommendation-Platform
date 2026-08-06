/**
 * Domain types for the scholarship discovery system.
 * These mirror the payloads the future FastAPI + MySQL backend will return,
 * so components never need to change when the mock services are swapped out.
 */

export type ScholarshipCategory =
  | "Merit"
  | "Need-based"
  | "Minority"
  | "Girls"
  | "Research"
  | "Sports";

export type Sector = "Government" | "Private";

export type YearLevel = "Fresher" | "Final year" | "Any year";

export type Scholarship = {
  id: string;
  name: string;
  provider: string;
  logo: string;
  amount: number;
  currency: string;
  deadline: string; // ISO date
  category: ScholarshipCategory;
  sector: Sector;
  state: string;
  branches: string[];
  yearLevels: YearLevel[];
  maxIncome: number;
  minCgpa: number;
  match: number;
  successProbability: number; // placeholder score, served by ML later
  educationLevels: string[];
  forWomen: boolean;
  forMinority: boolean;
  forDisability: boolean;
  official: string;
  officialApplyUrl?: string;
  sourceCollector?: string;
  tags: string[];
  summary: string;
  overview: string;
  benefits: string[];
  eligibility: string[];
  documents: string[];
  selectionProcess: string[];
  faqs: { q: string; a: string }[];
  timeline: { label: string; date: string; done: boolean }[];
  addedAt: string;
  reasons: string[];
  missing?: string[];
  deadlinePriority?: string;
  isEligible?: boolean;
  ineligibleReason?: string;
  ruleChecks?: { rule: string; label: string; passed: boolean; detail?: string }[];
  matchTier?: string;
};

export type SortKey = "match" | "deadline" | "amount" | "newest" | "alpha";

export type ScholarshipFilters = {
  search: string;
  providers: string[];
  categories: string[];
  states: string[];
  branches: string[];
  sectors: Sector[];
  yearLevel: YearLevel | null;
  amountMin: number;
  amountMax: number;
  deadlineWithinDays: number | null;
  cgpa: number | null;
  income: number | null;
  forWomen: boolean;
  forMinority: boolean;
  forDisability: boolean;
};

export type ScholarshipQuery = {
  filters: ScholarshipFilters;
  sort: SortKey;
  page: number;
  pageSize: number;
};

export type Page<T> = {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
};

export type MatchCheck = {
  label: string;
  passed: boolean;
};

export type Recommendation = {
  scholarship: Scholarship;
  checks: MatchCheck[];
  missing: string[];
};

export type RecommendationBucketId =
  | "top"
  | "highly"
  | "recent"
  | "expiring"
  | "improve";

export type RecommendationBucket = {
  id: RecommendationBucketId;
  title: string;
  caption: string;
  items: Recommendation[];
};

export type SearchSuggestion = {
  value: string;
  kind: "Scholarship" | "Provider" | "Category" | "Branch" | "State" | "Keyword";
};
