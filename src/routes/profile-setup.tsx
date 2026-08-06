import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth, type ProfileData } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, ArrowLeft, ArrowRight, Check, GraduationCap, MapPin, Loader2, Sparkles, UserRound, Wallet } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/profile-setup")({
  head: () => ({
    meta: [
      { title: "Complete Profile — MeritMind" },
      { name: "description", content: "Tell us about your academics and background to unlock matching scholarships." },
    ],
  }),
  component: ProfileSetupPage,
});

const steps = [
  { id: "personal", title: "Personal Details", description: "Basic identifiers", icon: UserRound },
  { id: "address", title: "Address Details", description: "Residency details", icon: MapPin },
  { id: "education", title: "Academics", description: "Educational details", icon: GraduationCap },
  { id: "eligibility", title: "Eligibility Details", description: "Criteria filters", icon: Wallet },
  { id: "achievements", title: "Achievements", description: "Optional credentials", icon: Sparkles },
];

const indianStatesAndUTs = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry"
];

function ProfileSetupPage() {
  const { user, isProfileSetupCompleted, completeProfile, getProfileData } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");

  // Address
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [cityTownVillage, setCityTownVillage] = useState("");
  const [pinCode, setPinCode] = useState("");

  // Academic
  const [educationLevel, setEducationLevel] = useState("");
  const [courseName, setCourseName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [institutionName, setInstitutionName] = useState("");
  const [universityBoard, setUniversityBoard] = useState("");
  const [currentYearSemester, setCurrentYearSemester] = useState("");
  const [gradingScale, setGradingScale] = useState<"CGPA" | "Percentage">("CGPA");
  const [gradesValue, setGradesValue] = useState("");

  // Eligibility
  const [income, setIncome] = useState("");
  const [category, setCategory] = useState("");
  const [minorityStatus, setMinorityStatus] = useState(false);
  const [disabilityStatus, setDisabilityStatus] = useState(false);
  const [nationality, setNationality] = useState("Indian");
  const [aadhaarAvailable, setAadhaarAvailable] = useState(true);

  // Achievements
  const [skillsText, setSkillsText] = useState("");
  const [certifications, setCertifications] = useState("");
  const [projects, setProjects] = useState("");
  const [researchPapers, setResearchPapers] = useState("");
  const [publications, setPublications] = useState("");
  const [competitions, setCompetitions] = useState("");
  const [olympiads, setOlympiads] = useState("");
  const [hackathons, setHackathons] = useState("");
  const [internships, setInternships] = useState("");
  const [extracurriculars, setExtracurriculars] = useState("");
  const [sportsAchievements, setSportsAchievements] = useState("");

  // Guard routing & pre-fill
  useEffect(() => {
    if (!user) {
      navigate({ to: "/auth" });
    } else {
      // Pre-fill email and name from user session
      setEmail(user.email);
      if (!name) setName(user.name);

      // Load existing profile details if any
      const existing = getProfileData();
      if (existing) {
        setName(existing.name || user.name);
        setGender(existing.gender || "");
        setDob(existing.dob || "");
        setMobile(existing.mobile || "");
        setState(existing.state || "");
        setDistrict(existing.district || "");
        setCityTownVillage(existing.cityTownVillage || "");
        setPinCode(existing.pinCode || "");
        setEducationLevel(existing.educationLevel || "");
        setCourseName(existing.courseName || "");
        setSpecialization(existing.specialization || "");
        setInstitutionName(existing.institutionName || "");
        setUniversityBoard(existing.universityBoard || "");
        setCurrentYearSemester(existing.currentYearSemester || "");
        setGradingScale(existing.gradingScale || "CGPA");
        setGradesValue(existing.gradesValue ? String(existing.gradesValue) : "");
        setIncome(existing.income ? String(existing.income) : "");
        setCategory(existing.category || "");
        setMinorityStatus(existing.minorityStatus || false);
        setDisabilityStatus(existing.disabilityStatus || false);
        setNationality(existing.nationality || "Indian");
        setAadhaarAvailable(existing.aadhaarAvailable !== undefined ? existing.aadhaarAvailable : true);
        setSkillsText(existing.skills ? existing.skills.join(", ") : "");
        setCertifications(existing.certifications || "");
        setProjects(existing.projects || "");
        setResearchPapers(existing.researchPapers || "");
        setPublications(existing.publications || "");
        setCompetitions(existing.competitions || "");
        setOlympiads(existing.olympiads || "");
        setHackathons(existing.hackathons || "");
        setInternships(existing.internships || "");
        setExtracurriculars(existing.extracurriculars || "");
        setSportsAchievements(existing.sportsAchievements || "");
      }
    }
  }, [user, navigate]);

  // Section completion weights & calculation
  const calculateProgress = () => {
    let completed = 0;
    
    // Personal Info Complete
    if (name.trim() && gender && dob && /^\d{10}$/.test(mobile.trim())) completed += 20;
    
    // Address Complete
    if (state && district.trim() && cityTownVillage.trim() && /^\d{6}$/.test(pinCode.trim())) completed += 20;
    
    // Academics Complete
    if (educationLevel && courseName.trim() && institutionName.trim() && gradesValue.trim()) {
      const g = Number(gradesValue);
      const gradesValid = gradingScale === "Percentage" 
        ? (!isNaN(g) && g >= 0 && g <= 100)
        : (!isNaN(g) && g >= 0 && g <= 10);
      if (gradesValid) completed += 20;
    }
    
    // Eligibility Complete
    if (income.trim() && !isNaN(Number(income)) && category && nationality) completed += 20;
    
    // Optional / Achievements Complete (if any optional field is filled)
    const optionalFilled = skillsText.trim() || certifications.trim() || projects.trim() || 
                           researchPapers.trim() || publications.trim() || competitions.trim() || 
                           olympiads.trim() || hackathons.trim() || internships.trim() || 
                           extracurriculars.trim() || sportsAchievements.trim();
    if (optionalFilled) completed += 20;

    return completed;
  };

  // Validations per step
  const validateCurrentStep = () => {
    setValidationError(null);

    if (currentStep === 0) {
      if (!name.trim()) return "Full name is required.";
      if (!gender) return "Please select a gender.";
      if (!dob) return "Date of birth is required.";
      if (!mobile.trim()) return "Mobile number is required.";
      if (!/^\d{10}$/.test(mobile.trim())) return "Mobile number must be exactly 10 digits.";
    }

    if (currentStep === 1) {
      if (!state) return "State is required.";
      if (!district.trim()) return "District is required.";
      if (!cityTownVillage.trim()) return "City/Town/Village is required.";
      if (!pinCode.trim()) return "PIN Code is required.";
      if (!/^\d{6}$/.test(pinCode.trim())) return "PIN Code must be exactly 6 digits.";
    }

    if (currentStep === 2) {
      if (!educationLevel) return "Education level is required.";
      if (!courseName.trim()) return "Course / program name is required.";
      if (!institutionName.trim()) return "Institution name is required.";
      if (!gradesValue.trim()) return "Grades value is required.";
      
      const numGrades = Number(gradesValue);
      if (isNaN(numGrades) || numGrades < 0) return "Please enter a valid positive grading value.";
      if (gradingScale === "CGPA" && numGrades > 10) return "CGPA cannot exceed 10.0.";
      if (gradingScale === "Percentage" && numGrades > 100) return "Percentage cannot exceed 100%.";
    }

    if (currentStep === 3) {
      if (!income.trim()) return "Annual family income is required.";
      if (isNaN(Number(income)) || Number(income) < 0) return "Family income must be a valid positive number.";
      if (!category) return "Social category is required.";
      if (!nationality) return "Nationality is required.";
    }

    return null;
  };

  const handleNext = () => {
    const err = validateCurrentStep();
    if (err) {
      setValidationError(err);
      toast.warning(err);
      return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handlePrev = () => {
    setValidationError(null);
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validateCurrentStep();
    if (err) {
      setValidationError(err);
      toast.warning(err);
      return;
    }

    setSubmitting(true);
    try {
      const skillsArray = skillsText
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const profilePayload: ProfileData = {
        name,
        gender,
        dob,
        mobile,
        email,
        state,
        district,
        cityTownVillage,
        pinCode,
        educationLevel,
        courseName,
        specialization,
        institutionName,
        universityBoard,
        currentYearSemester,
        gradingScale,
        gradesValue: Number(gradesValue),
        income: Number(income),
        category,
        minorityStatus,
        disabilityStatus,
        nationality,
        aadhaarAvailable,
        skills: skillsArray,
        certifications,
        projects,
        researchPapers,
        publications,
        competitions,
        olympiads,
        hackathons,
        internships,
        extracurriculars,
        sportsAchievements,
      };

      await completeProfile(profilePayload);
      toast.success("Profile details saved successfully.");
      navigate({ to: "/dashboard" });
    } catch (err: any) {
      setValidationError(err.message || "Failed to save profile.");
      toast.error(err.message || "Failed to save profile.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) return null;

  const currentProgress = calculateProgress();

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-4 py-12">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[600px] aurora opacity-80" />

      <div className="relative z-10 w-full max-w-2xl">
        <div className="mb-8 text-center">
          <span className="grid mx-auto size-11 place-items-center rounded-3xl gradient-hero font-display text-lg font-black text-primary-foreground shadow">
            M
          </span>
          <h1 className="mt-4 font-display text-2xl font-black tracking-tight text-foreground sm:text-3xl">
            Let's build your profile
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Complete details to calculate exact matching scores and unlock recommendations.
          </p>
        </div>

        {/* Step Track progress bar */}
        <div className="mb-4 flex justify-between items-center px-2">
          {steps.map((s, index) => {
            const Icon = s.icon;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            return (
              <div key={s.id} className="flex flex-1 items-center last:flex-initial">
                <div className="flex flex-col items-center gap-1.5 relative">
                  <div
                    className={`grid size-10 place-items-center rounded-full border transition-all duration-300 ${
                      isActive
                        ? "border-primary bg-primary text-primary-foreground ring-4 ring-primary/20 scale-105"
                        : isCompleted
                        ? "border-success bg-success-soft text-success"
                        : "border-border bg-card text-muted-foreground"
                    }`}
                  >
                    {isCompleted ? <Check className="size-5" /> : <Icon className="size-5" />}
                  </div>
                  <span
                    className={`hidden sm:block text-[11px] font-bold ${
                      isActive ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {s.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`mx-2 h-0.5 flex-1 rounded-full transition-all duration-500 ${
                      isCompleted ? "bg-success" : "bg-border"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Completion percentage indicator bar */}
        <div className="mb-8 px-2">
          <div className="flex justify-between text-xs font-semibold text-muted-foreground mb-1.5">
            <span>Overall profile strength</span>
            <span className="text-primary font-bold">{currentProgress}% completed</span>
          </div>
          <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
            <div 
              className="h-full rounded-full gradient-hero transition-all duration-500" 
              style={{ width: `${currentProgress}%` }}
            />
          </div>
        </div>

        {/* Form Container */}
        <Card className="glass border-border/40 shadow-xl rounded-3xl overflow-hidden">
          <CardHeader>
            <CardTitle className="font-display text-lg font-bold flex items-center gap-2">
              {steps[currentStep]?.title}
              <span className="text-xs font-semibold bg-primary-soft text-primary px-2.5 py-1 rounded-full ml-auto">
                Step {currentStep + 1} of 5
              </span>
            </CardTitle>
            <CardDescription>{steps[currentStep]?.description}</CardDescription>
          </CardHeader>

          <CardContent className="min-h-[350px]">
            {validationError && (
              <div className="mb-5 flex items-center gap-2 rounded-xl bg-destructive/10 p-3.5 text-xs font-semibold text-destructive">
                <AlertCircle className="size-4 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            {/* Step 1: Personal Info */}
            {currentStep === 0 && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="fullname" className="font-semibold text-xs">Full Name *</Label>
                  <Input
                    id="fullname"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="rounded-xl border-input bg-card/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender" className="font-semibold text-xs">Gender *</Label>
                  <select
                    id="gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="flex h-9 w-full rounded-xl border border-input bg-card/50 px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dob" className="font-semibold text-xs">Date of Birth *</Label>
                  <Input
                    id="dob"
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="rounded-xl border-input bg-card/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mobile" className="font-semibold text-xs">Mobile Number *</Label>
                  <Input
                    id="mobile"
                    type="tel"
                    placeholder="10-digit mobile number"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="rounded-xl border-input bg-card/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="font-semibold text-xs">Email address (Read-only)</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    disabled
                    className="rounded-xl border-input bg-muted/70 opacity-80"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Address Info */}
            {currentStep === 1 && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="state" className="font-semibold text-xs">State / Union Territory *</Label>
                  <select
                    id="state"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="flex h-9 w-full rounded-xl border border-input bg-card/50 px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="">Select State/UT</option>
                    {indianStatesAndUTs.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="district" className="font-semibold text-xs">District *</Label>
                  <Input
                    id="district"
                    placeholder="Enter district name"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="rounded-xl border-input bg-card/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city" className="font-semibold text-xs">City / Town / Village *</Label>
                  <Input
                    id="city"
                    placeholder="Enter your town/village"
                    value={cityTownVillage}
                    onChange={(e) => setCityTownVillage(e.target.value)}
                    className="rounded-xl border-input bg-card/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pincode" className="font-semibold text-xs">PIN Code *</Label>
                  <Input
                    id="pincode"
                    type="text"
                    maxLength={6}
                    placeholder="6-digit PIN code"
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value)}
                    className="rounded-xl border-input bg-card/50"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Academic Info */}
            {currentStep === 2 && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="eduLevel" className="font-semibold text-xs">Current Education Level *</Label>
                  <select
                    id="eduLevel"
                    value={educationLevel}
                    onChange={(e) => {
                      setEducationLevel(e.target.value);
                      // Clear branch or details that don't belong to school level
                      if (e.target.value === "School" || e.target.value === "Intermediate") {
                        setSpecialization("");
                        setCurrentYearSemester("");
                      }
                    }}
                    className="flex h-9 w-full rounded-xl border border-input bg-card/50 px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="">Select Level</option>
                    <option value="School">School</option>
                    <option value="Intermediate">Intermediate / Higher Secondary</option>
                    <option value="Diploma">Diploma</option>
                    <option value="Polytechnic">Polytechnic</option>
                    <option value="ITI">ITI</option>
                    <option value="Undergraduate">Undergraduate</option>
                    <option value="Postgraduate">Postgraduate</option>
                    <option value="PhD">PhD / Research Scholar</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="courseName" className="font-semibold text-xs">
                    {educationLevel === "School" ? "Current Standard / Class *" : "Course / Program Name *"}
                  </Label>
                  <Input
                    id="courseName"
                    placeholder={educationLevel === "School" ? "e.g. Class 10, Class 8" : "e.g. B.Tech, M.Sc, Law, MBBS"}
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                    className="rounded-xl border-input bg-card/50"
                  />
                </div>

                {/* Show Branch/Specialization for non-school levels */}
                {educationLevel !== "School" && educationLevel !== "Intermediate" && (
                  <div className="space-y-2">
                    <Label htmlFor="specialization" className="font-semibold text-xs">
                      {educationLevel === "PhD" ? "Research Area / Specialization" : "Specialization / Branch"}
                    </Label>
                    <Input
                      id="specialization"
                      placeholder="e.g. Computer Science, Cardiology, Pharmacy"
                      value={specialization}
                      onChange={(e) => setSpecialization(e.target.value)}
                      className="rounded-xl border-input bg-card/50"
                    />
                  </div>
                )}

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="instName" className="font-semibold text-xs">Institution / College Name *</Label>
                  <Input
                    id="instName"
                    placeholder="Enter school, college, or institute name"
                    value={institutionName}
                    onChange={(e) => setInstitutionName(e.target.value)}
                    className="rounded-xl border-input bg-card/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="boardUniv" className="font-semibold text-xs">
                    {educationLevel === "School" || educationLevel === "Intermediate" ? "Affiliated Board" : "Affiliated University"}
                  </Label>
                  <Input
                    id="boardUniv"
                    placeholder="e.g. CBSE, ICSE, SPPU, State Board"
                    value={universityBoard}
                    onChange={(e) => setUniversityBoard(e.target.value)}
                    className="rounded-xl border-input bg-card/50"
                  />
                </div>

                {/* Year/Semester/Standard representation */}
                {educationLevel !== "School" && educationLevel !== "Intermediate" && (
                  <div className="space-y-2">
                    <Label htmlFor="yearSem" className="font-semibold text-xs">Current Year / Semester</Label>
                    <Input
                      id="yearSem"
                      placeholder="e.g. 3rd year, 6th semester"
                      value={currentYearSemester}
                      onChange={(e) => setCurrentYearSemester(e.target.value)}
                      className="rounded-xl border-input bg-card/50"
                    />
                  </div>
                )}

                {/* Score scale selection */}
                <div className="space-y-2">
                  <Label className="font-semibold text-xs">Grading System</Label>
                  <div className="flex gap-4 items-center h-9">
                    <label className="flex items-center gap-1.5 text-sm font-semibold cursor-pointer">
                      <input 
                        type="radio" 
                        name="scale" 
                        checked={gradingScale === "CGPA"}
                        onChange={() => setGradingScale("CGPA")}
                        className="accent-primary" 
                      />
                      CGPA (10-scale)
                    </label>
                    <label className="flex items-center gap-1.5 text-sm font-semibold cursor-pointer">
                      <input 
                        type="radio" 
                        name="scale" 
                        checked={gradingScale === "Percentage"}
                        onChange={() => setGradingScale("Percentage")}
                        className="accent-primary" 
                      />
                      Percentage (%)
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="grades" className="font-semibold text-xs">
                    {gradingScale === "CGPA" ? "Current CGPA *" : "Aggregate Percentage (%) *"}
                  </Label>
                  <Input
                    id="grades"
                    type="number"
                    step="0.01"
                    placeholder={gradingScale === "CGPA" ? "e.g. 8.6" : "e.g. 86.4"}
                    value={gradesValue}
                    onChange={(e) => setGradesValue(e.target.value)}
                    className="rounded-xl border-input bg-card/50"
                  />
                </div>
              </div>
            )}

            {/* Step 4: Eligibility Details */}
            {currentStep === 3 && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="income" className="font-semibold text-xs">Annual Family Income (₹) *</Label>
                  <Input
                    id="income"
                    type="number"
                    placeholder="e.g. 450000"
                    value={income}
                    onChange={(e) => setIncome(e.target.value)}
                    className="rounded-xl border-input bg-card/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category" className="font-semibold text-xs">Social Category *</Label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="flex h-9 w-full rounded-xl border border-input bg-card/50 px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="">Select category</option>
                    <option value="General">General</option>
                    <option value="OBC">OBC</option>
                    <option value="SC">SC</option>
                    <option value="ST">ST</option>
                    <option value="EWS">EWS</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nationality" className="font-semibold text-xs">Nationality *</Label>
                  <select
                    id="nationality"
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
                    className="flex h-9 w-full rounded-xl border border-input bg-card/50 px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="Indian">Indian</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-3 rounded-2xl border border-border">
                  <div>
                    <Label htmlFor="aadhaar" className="font-bold text-sm">Aadhaar Card Available?</Label>
                    <p className="text-[10px] text-muted-foreground">Used for direct DBT verification.</p>
                  </div>
                  <Switch
                    id="aadhaar"
                    checked={aadhaarAvailable}
                    onCheckedChange={setAadhaarAvailable}
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-2xl border border-border sm:col-span-2">
                  <div>
                    <Label htmlFor="disability" className="font-bold text-sm">Disability Status</Label>
                    <p className="text-xs text-muted-foreground">Select if you qualify for physical accessibility allowances.</p>
                  </div>
                  <Switch
                    id="disability"
                    checked={disabilityStatus}
                    onCheckedChange={setDisabilityStatus}
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-2xl border border-border sm:col-span-2">
                  <div>
                    <Label htmlFor="minority" className="font-bold text-sm">Minority Status</Label>
                    <p className="text-xs text-muted-foreground">Select if you belong to a recognized religious or ethnic minority in India.</p>
                  </div>
                  <Switch
                    id="minority"
                    checked={minorityStatus}
                    onCheckedChange={setMinorityStatus}
                  />
                </div>
              </div>
            )}

            {/* Step 5: Achievements & Extra details */}
            {currentStep === 4 && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="skills" className="font-semibold text-xs">Skills & Technical Interests (Comma separated)</Label>
                  <Input
                    id="skills"
                    placeholder="e.g. Python, React, Public speaking, Sketching"
                    value={skillsText}
                    onChange={(e) => setSkillsText(e.target.value)}
                    className="rounded-xl border-input bg-card/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="certifications" className="font-semibold text-xs">Certifications</Label>
                  <Input
                    id="certifications"
                    placeholder="e.g. Oracle Java, Google Cloud Associate"
                    value={certifications}
                    onChange={(e) => setCertifications(e.target.value)}
                    className="rounded-xl border-input bg-card/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="projects" className="font-semibold text-xs">Key Projects</Label>
                  <Input
                    id="projects"
                    placeholder="e.g. Waste management IoT system"
                    value={projects}
                    onChange={(e) => setProjects(e.target.value)}
                    className="rounded-xl border-input bg-card/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="research" className="font-semibold text-xs">Research Papers / Topics</Label>
                  <Input
                    id="research"
                    placeholder="e.g. NLP applications in agricultural pricing"
                    value={researchPapers}
                    onChange={(e) => setResearchPapers(e.target.value)}
                    className="rounded-xl border-input bg-card/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="publications" className="font-semibold text-xs">Publications Count / Journals</Label>
                  <Input
                    id="publications"
                    placeholder="e.g. IEEE Student track 2025"
                    value={publications}
                    onChange={(e) => setPublications(e.target.value)}
                    className="rounded-xl border-input bg-card/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hackathons" className="font-semibold text-xs">Hackathons & Olympiads</Label>
                  <Input
                    id="hackathons"
                    placeholder="e.g. Smart India Hackathon Finalist, NSO Rank 40"
                    value={hackathons}
                    onChange={(e) => setHackathons(e.target.value)}
                    className="rounded-xl border-input bg-card/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="internships" className="font-semibold text-xs">Internships</Label>
                  <Input
                    id="internships"
                    placeholder="e.g. Summer intern at DRDO"
                    value={internships}
                    onChange={(e) => setInternships(e.target.value)}
                    className="rounded-xl border-input bg-card/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sports" className="font-semibold text-xs">Sports Achievements</Label>
                  <Input
                    id="sports"
                    placeholder="e.g. State-level badminton silver medal"
                    value={sportsAchievements}
                    onChange={(e) => setSportsAchievements(e.target.value)}
                    className="rounded-xl border-input bg-card/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="extracurriculars" className="font-semibold text-xs">Extracurricular Activities</Label>
                  <Input
                    id="extracurriculars"
                    placeholder="e.g. College debate club head, NCC cadet"
                    value={extracurriculars}
                    onChange={(e) => setExtracurriculars(e.target.value)}
                    className="rounded-xl border-input bg-card/50"
                  />
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-between border-t border-border/40 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrev}
              disabled={currentStep === 0 || submitting}
              className="rounded-full px-5 py-4 cursor-pointer"
            >
              <ArrowLeft className="mr-1.5 size-4" /> Back
            </Button>

            {currentStep < steps.length - 1 ? (
              <Button
                type="button"
                onClick={handleNext}
                className="rounded-full gradient-hero px-6 py-4 font-bold text-primary-foreground cursor-pointer shadow hover:shadow-md"
              >
                Continue <ArrowRight className="ml-1.5 size-4" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="rounded-full bg-success text-success-foreground hover:bg-success/90 px-8 py-4 font-bold cursor-pointer shadow hover:shadow-md"
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-1.5 size-4 animate-spin" /> Saving details...
                  </>
                ) : (
                  <>
                    Complete Setup <Check className="ml-1.5 size-4" />
                  </>
                )}
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
