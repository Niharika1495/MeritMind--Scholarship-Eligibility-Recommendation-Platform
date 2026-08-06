import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { student } from "@/data/mock";
import { apiRequest } from "@/services/apiClient";

export interface User {
  name: string;
  email: string;
}

export interface ProfileData {
  name: string;
  gender: string;
  dob: string;
  mobile: string;
  email: string;
  
  // Address Info
  state: string;
  district: string;
  cityTownVillage: string;
  pinCode: string;

  // Academic Info
  educationLevel: string;
  courseName: string;
  specialization: string;
  institutionName: string;
  universityBoard: string;
  currentYearSemester: string;
  gradingScale: "CGPA" | "Percentage";
  gradesValue: number;

  // Eligibility Info
  income: number;
  category: string;
  minorityStatus: boolean;
  disabilityStatus: boolean;
  nationality: string;
  aadhaarAvailable: boolean;

  // Optional fields
  skills: string[];
  certifications: string;
  projects: string;
  researchPapers: string;
  publications: string;
  competitions: string;
  olympiads: string;
  hackathons: string;
  internships: string;
  extracurriculars: string;
  sportsAchievements: string;
}

interface AuthContextType {
  user: User | null;
  isProfileSetupCompleted: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  completeProfile: (profile: ProfileData) => Promise<void>;
  updateProfile: (updatedProfile: Partial<ProfileData>) => Promise<void>;
  logout: () => void;
  getProfileData: () => ProfileData | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isProfileSetupCompleted, setIsProfileSetupCompleted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Sync state on mount from FastAPI backend
  useEffect(() => {
    async function restoreSession() {
      const token = localStorage.getItem("meritmind_token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Validate token with /me endpoint
        const me = await apiRequest<{ id: number; name: string; email: string; is_profile_setup_completed: boolean }>(
          "GET",
          "/auth/me"
        );
        
        const sessionUser = { name: me.name, email: me.email };
        setUser(sessionUser);
        localStorage.setItem("meritmind_current_user", JSON.stringify(sessionUser));

        if (me.is_profile_setup_completed) {
          const profile = await apiRequest<ProfileData>("GET", "/profile");
          if (profile) {
            localStorage.setItem("meritmind_user_profile", JSON.stringify(profile));
            localStorage.setItem("meritmind_profile_setup_completed", "true");
            setIsProfileSetupCompleted(true);
            syncMockStudent(profile);
          }
        } else {
          setIsProfileSetupCompleted(false);
          localStorage.removeItem("meritmind_user_profile");
          localStorage.setItem("meritmind_profile_setup_completed", "false");
        }
      } catch (e) {
        console.error("Failed to restore backend auth state, clearing session", e);
        // Clear broken token
        localStorage.removeItem("meritmind_token");
        localStorage.removeItem("meritmind_current_user");
        localStorage.removeItem("meritmind_user_profile");
        localStorage.setItem("meritmind_profile_setup_completed", "false");
        setUser(null);
        setIsProfileSetupCompleted(false);
      } finally {
        setLoading(false);
      }
    }

    restoreSession();
  }, []);

  // Helper to update the mock student object so the rest of the application matches
  const syncMockStudent = (profile: ProfileData) => {
    student.name = profile.name;
    
    // Generate initials
    const parts = profile.name.trim().split(/\s+/);
    let initials = "ME";
    const f = parts[0];
    const l = parts[parts.length - 1];
    if (parts.length > 1 && f && l) {
      initials = (f.charAt(0) + l.charAt(0)).toUpperCase();
    } else if (f) {
      initials = f.substring(0, 2).toUpperCase();
    }
    student.initials = initials;

    student.headline = `${profile.educationLevel} student pursuing ${profile.courseName} at ${profile.institutionName}`;
    student.city = profile.cityTownVillage;
    student.state = profile.state;
    student.course = profile.courseName;
    student.branch = profile.specialization || "General";
    student.year = profile.currentYearSemester || "1st year";
    (student as any).educationLevel = profile.educationLevel;
    (student as any).disabilityStatus = profile.disabilityStatus;
    (student as any).minorityStatus = profile.minorityStatus;
    
    if (profile.gradingScale === "Percentage") {
      student.cgpa = Number((profile.gradesValue / 10).toFixed(2));
    } else {
      student.cgpa = Number(profile.gradesValue);
    }
    
    student.income = Number(profile.income);
    student.category = profile.category;
    student.skills = profile.skills;

    // Build achievements array dynamically from custom fields
    const achs = [];
    if (profile.certifications && profile.certifications.trim()) {
      achs.push({ title: profile.certifications, org: "Certification", year: "2026", icon: "📜" });
    }
    if (profile.hackathons && profile.hackathons.trim()) {
      achs.push({ title: profile.hackathons, org: "Hackathon / Competition", year: "2026", icon: "🏆" });
    }
    if (profile.projects && profile.projects.trim()) {
      achs.push({ title: profile.projects, org: "Academic Project", year: "2026", icon: "💻" });
    }
    if (profile.researchPapers && profile.researchPapers.trim()) {
      achs.push({ title: profile.researchPapers, org: "Research Paper", year: "2026", icon: "🔬" });
    }
    if (profile.sportsAchievements && profile.sportsAchievements.trim()) {
      achs.push({ title: profile.sportsAchievements, org: "Sports Achievement", year: "2026", icon: "🏅" });
    }
    student.achievements = achs;

    // Check completion of the 5 key sections to calculate completion percentage
    const personalDone = !!profile.name && !!profile.gender && !!profile.dob && !!profile.mobile;
    const addressDone = !!profile.state && !!profile.district && !!profile.cityTownVillage && !!profile.pinCode;
    const academicDone = !!profile.educationLevel && !!profile.courseName && !!profile.institutionName && profile.gradesValue !== undefined;
    const eligibilityDone = profile.income !== undefined && !!profile.category && !!profile.nationality;
    const achievementsDone = profile.skills.length > 0 || achs.length > 0 || !!profile.internships || !!profile.extracurriculars;

    student.sections = [
      { id: "personal", label: "Personal Information", done: personalDone, weight: 20 },
      { id: "address", label: "Address Information", done: addressDone, weight: 20 },
      { id: "academic", label: "Academic Information", done: academicDone, weight: 20 },
      { id: "eligibility", label: "Eligibility Information", done: eligibilityDone, weight: 20 },
      { id: "achievements", label: "Achievements & Optional", done: achievementsDone, weight: 20 },
    ];

    student.strength = student.sections.reduce((acc, s) => acc + (s.done ? s.weight : 0), 0);
  };

  const login = async (email: string, password: string) => {
    // API Call
    const res = await apiRequest<{ access_token: string; token_type: string }>(
      "POST",
      "/auth/login",
      { email, password }
    );

    // Save token in localStorage
    localStorage.setItem("meritmind_token", res.access_token);

    // Fetch user details
    const me = await apiRequest<{ id: number; name: string; email: string; is_profile_setup_completed: boolean }>(
      "GET",
      "/auth/me"
    );

    const sessionUser = { name: me.name, email: me.email };
    setUser(sessionUser);
    localStorage.setItem("meritmind_current_user", JSON.stringify(sessionUser));

    // Fetch profile if completed
    if (me.is_profile_setup_completed) {
      const profile = await apiRequest<ProfileData>("GET", "/profile");
      if (profile) {
        localStorage.setItem("meritmind_user_profile", JSON.stringify(profile));
        localStorage.setItem("meritmind_profile_setup_completed", "true");
        setIsProfileSetupCompleted(true);
        syncMockStudent(profile);
      }
    } else {
      localStorage.removeItem("meritmind_user_profile");
      localStorage.setItem("meritmind_profile_setup_completed", "false");
      setIsProfileSetupCompleted(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    await apiRequest<any>("POST", "/auth/register", { name, email, password });
  };

  const completeProfile = async (profile: ProfileData) => {
    if (!user) throw new Error("Must be logged in to complete profile setup.");

    // Put to profile API
    await apiRequest<ProfileData>("PUT", "/profile", profile);

    localStorage.setItem("meritmind_user_profile", JSON.stringify(profile));
    localStorage.setItem("meritmind_profile_setup_completed", "true");
    setIsProfileSetupCompleted(true);
    syncMockStudent(profile);
  };

  const updateProfile = async (updatedFields: Partial<ProfileData>) => {
    const current = getProfileData();
    if (!current) {
      throw new Error("No profile data found to update.");
    }

    const merged: ProfileData = {
      ...current,
      ...updatedFields,
    };

    await apiRequest<ProfileData>("PUT", "/profile", merged);

    localStorage.setItem("meritmind_user_profile", JSON.stringify(merged));
    localStorage.setItem("meritmind_profile_setup_completed", "true");
    setIsProfileSetupCompleted(true);
    syncMockStudent(merged);
  };

  const logout = () => {
    // Stateless token clean
    apiRequest("POST", "/auth/logout").catch(() => {});

    setUser(null);
    setIsProfileSetupCompleted(false);
    localStorage.removeItem("meritmind_token");
    localStorage.removeItem("meritmind_current_user");
    localStorage.removeItem("meritmind_user_profile");
    localStorage.setItem("meritmind_profile_setup_completed", "false");
    
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  };

  const getProfileData = (): ProfileData | null => {
    if (!user) return null;
    const profile = localStorage.getItem("meritmind_user_profile");
    return profile ? JSON.parse(profile) : null;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isProfileSetupCompleted,
        loading,
        login,
        signup,
        completeProfile,
        updateProfile,
        logout,
        getProfileData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
