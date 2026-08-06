import { apiRequest } from "./apiClient";
import type {
  Page,
  Scholarship,
  ScholarshipFilters,
  ScholarshipQuery,
  SearchSuggestion,
  SortKey,
} from "@/types/scholarship";

export const AMOUNT_BOUNDS = { min: 0, max: 500000 } as const;

export const emptyFilters: ScholarshipFilters = {
  search: "",
  providers: [],
  categories: [],
  states: [],
  branches: [],
  sectors: [],
  yearLevel: null,
  amountMin: AMOUNT_BOUNDS.min,
  amountMax: AMOUNT_BOUNDS.max,
  deadlineWithinDays: null,
  cgpa: null,
  income: null,
  forWomen: false,
  forMinority: false,
  forDisability: false,
};

export const sortOptions: { key: SortKey; label: string }[] = [
  { key: "match", label: "Highest match" },
  { key: "deadline", label: "Deadline" },
  { key: "amount", label: "Highest amount" },
  { key: "newest", label: "Newest" },
  { key: "alpha", label: "Alphabetical" },
];

export const scholarshipService = {
  query: async ({ filters, sort, page, pageSize }: ScholarshipQuery): Promise<Page<Scholarship>> => {
    // Build query params
    const params = new URLSearchParams({
      search: filters.search,
      sort,
      page: String(page),
      pageSize: String(pageSize),
    });
    
    // Add arrays
    filters.categories.forEach(c => params.append("categories", c));
    filters.sectors.forEach(s => params.append("sectors", s));
    filters.states.forEach(st => params.append("states", st));

    return apiRequest<Page<Scholarship>>("GET", `/scholarships?${params.toString()}`);
  },

  byId: async (id: string): Promise<Scholarship | undefined> => {
    try {
      return await apiRequest<Scholarship>("GET", `/scholarships/${id}`);
    } catch {
      return undefined;
    }
  },

  related: async (id: string, _limit = 3): Promise<Scholarship[]> => {
    return apiRequest<Scholarship[]>("GET", `/scholarships/${id}/related`);
  },

  byIds: async (ids: string[]): Promise<Scholarship[]> => {
    if (!ids.length) return [];
    try {
      const items = await Promise.all(
        ids.map(async (id) => {
          try {
            return await apiRequest<Scholarship>("GET", `/scholarships/${id}`);
          } catch {
            return null;
          }
        })
      );
      return items.filter((x): x is Scholarship => x !== null);
    } catch {
      return [];
    }
  },

  suggest: async (term: string, _limit = 7): Promise<SearchSuggestion[]> => {
    if (!term.trim()) return [];
    return apiRequest<SearchSuggestion[]>("GET", `/scholarships/suggest?term=${encodeURIComponent(term)}`);
  },

  facets: async () => {
    return apiRequest<any>("GET", "/scholarships/facets");
  },
};

export const facetsSync = {
  providers: [
    "AICTE",
    "Department of Science & Technology",
    "HDFC Bank",
    "L'Oréal India",
    "Ministry of Education",
    "Ministry of Minority Affairs",
    "Nasscom Foundation",
    "National Handicapped Finance & Development Corporation",
    "Reliance Foundation",
    "Sitaram Jindal Foundation",
    "Sports Authority of India",
    "State Welfare Departments",
    "Tata Capital",
    "University Grants Commission"
  ],
  categories: ["Girls", "Merit", "Minority", "Need-based", "Research", "Sports"],
  states: ["All India", "Karnataka"],
  branches: [
    "All branches",
    "Biology",
    "Chemistry",
    "Computer Science",
    "Earth Sciences",
    "Electronics",
    "Information Technology",
    "Mathematics",
    "Mechanical",
    "Physics"
  ],
  sectors: ["Government", "Private"] as const,
};

export function countActiveFilters(f: ScholarshipFilters) {
  let n = 0;
  n += f.providers.length + f.categories.length + f.states.length + f.branches.length + f.sectors.length;
  if (f.yearLevel) n += 1;
  if (f.amountMin !== AMOUNT_BOUNDS.min || f.amountMax !== AMOUNT_BOUNDS.max) n += 1;
  if (f.deadlineWithinDays !== null) n += 1;
  if (f.cgpa !== null) n += 1;
  if (f.income !== null) n += 1;
  if (f.forWomen) n += 1;
  if (f.forMinority) n += 1;
  if (f.forDisability) n += 1;
  return n;
}
