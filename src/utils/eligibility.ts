import { student, type StudentProfile } from "@/data/mock";
import type { Scholarship } from "@/types/scholarship";

export type EligibilityStatus = "Eligible" | "Partially eligible" | "Not eligible";

export function eligibilityFor(
  s: Scholarship,
  p: StudentProfile = student,
): { status: EligibilityStatus; passed: number; total: number } {
  const checks = [
    p.cgpa >= s.minCgpa,
    p.income <= s.maxIncome,
    s.branches.includes(p.branch) || s.branches.includes("All branches"),
    s.state === "All India" || s.state === p.state,
    !s.forMinority && !s.forDisability,
  ];
  const passed = checks.filter(Boolean).length;
  const status: EligibilityStatus =
    passed === checks.length ? "Eligible" : passed >= 3 ? "Partially eligible" : "Not eligible";
  return { status, passed, total: checks.length };
}
