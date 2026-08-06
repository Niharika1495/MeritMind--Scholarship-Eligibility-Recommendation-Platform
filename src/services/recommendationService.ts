import { apiRequest } from "./apiClient";
import type {
  MatchCheck,
  Recommendation,
  RecommendationBucket,
  Scholarship,
} from "@/types/scholarship";
import { student, type StudentProfile } from "@/data/mock";
import { inr } from "@/utils/format";

// Client-side helper to compute individual match details quickly on detail cards
function buildChecks(s: Scholarship, p: StudentProfile): MatchCheck[] {
  const studentEduLevel = (p as any).educationLevel || "Undergraduate";
  
  const passedEdu = s.educationLevels.includes(studentEduLevel);
  const passedState = s.state === "All India" || s.state === p.state;
  const passedIncome = p.income <= s.maxIncome;
  const passedGrades = p.cgpa >= s.minCgpa;
  const passedBranch = 
    s.branches.includes("All branches") || 
    s.branches.includes(p.branch) || 
    studentEduLevel === "School" || 
    studentEduLevel === "Intermediate";

  return [
    {
      label: `Fits your education level (${studentEduLevel})`,
      passed: passedEdu,
    },
    {
      label: `Matches your residency (${p.state || "All India"})`,
      passed: passedState,
    },
    {
      label: `Income fits the ${inr(s.maxIncome)} ceiling`,
      passed: passedIncome,
    },
    {
      label: `Clears required benchmark (${s.minCgpa} CGPA / equivalent)`,
      passed: passedGrades,
    },
    {
      label: passedBranch ? "Eligible specialization / branch" : `Available for branches: ${s.branches.slice(0, 2).join(", ")}`,
      passed: passedBranch,
    },
  ];
}

function buildMissing(s: Scholarship, p: StudentProfile, checks: MatchCheck[]): string[] {
  const missing: string[] = [];
  const studentEduLevel = (p as any).educationLevel || "Undergraduate";

  if (!s.educationLevels.includes(studentEduLevel)) {
    missing.push(`Targeted at levels: ${s.educationLevels.join(" / ")}`);
  }
  if (p.cgpa < s.minCgpa) {
    missing.push(`Increase grades to clear the ${s.minCgpa} CGPA benchmark`);
  }
  if (p.income > s.maxIncome) {
    missing.push(`Family income must be below ${inr(s.maxIncome)}`);
  }
  if (s.state !== "All India" && s.state !== p.state) {
    missing.push(`Domicile must be in ${s.state}`);
  }

  return missing.slice(0, 4);
}

function toRecommendation(s: Scholarship, p: StudentProfile): Recommendation {
  const checks = buildChecks(s, p);
  const passedCount = checks.filter((c) => c.passed).length;
  const match = Math.round((passedCount / checks.length) * 100);

  const updatedScholarship = {
    ...s,
    match,
    reasons: checks.filter((c) => c.passed).map((c) => c.label),
  };

  return {
    scholarship: updatedScholarship,
    checks,
    missing: buildMissing(updatedScholarship, p, checks),
  };
}

export const recommendationService = {
  buckets: async (): Promise<RecommendationBucket[]> => {
    return apiRequest<RecommendationBucket[]>("GET", "/recommendations");
  },

  forScholarship: (s: Scholarship, profile: StudentProfile = student) =>
    toRecommendation(s, profile),
};
