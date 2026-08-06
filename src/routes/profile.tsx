import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, GraduationCap, MapPin, Pencil, Wallet, Plus, Trash2, X, Sparkles, Loader2 } from "lucide-react";
import { AppShell } from "@/components/meritmind/AppShell";
import { ProgressRing } from "@/components/meritmind/ProgressRing";
import { SectionHeading } from "@/components/meritmind/Bits";
import { inr, student } from "@/data/mock";
import { useAuth, type ProfileData } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: `${student.name} — MeritMind profile` },
      {
        name: "description",
        content:
          "Your academic, financial and achievement profile powers every match. Track profile strength and unlock more scholarships as you complete it.",
      },
      { property: "og:title", content: "Your MeritMind student profile" },
      {
        property: "og:description",
        content: "Profile strength, academics, finances, achievements and skills in one place.",
      },
    ],
  }),
  component: Profile,
});

function Profile() {
  const { getProfileData, updateProfile } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [newSkill, setNewSkill] = useState("");

  useEffect(() => {
    const p = getProfileData();
    if (p) {
      setProfile(p);
    }
  }, []);

  const refreshProfileState = () => {
    const p = getProfileData();
    if (p) {
      setProfile(p);
    }
  };

  const handleSaveSection = async (sectionKey: string, fields: Partial<ProfileData>) => {
    setSaving(true);
    try {
      await updateProfile(fields);
      toast.success("Profile section updated successfully!");
      refreshProfileState();
      setActiveModal(null);
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile section");
    } finally {
      setSaving(false);
    }
  };

  const handleAddSkill = async () => {
    if (!newSkill.trim() || !profile) return;
    const updatedSkills = [...(profile.skills || []), newSkill.trim()];
    await handleSaveSection("skills", { skills: updatedSkills });
    setNewSkill("");
  };

  const handleRemoveSkill = async (skillToRemove: string) => {
    if (!profile) return;
    const updatedSkills = (profile.skills || []).filter((s) => s !== skillToRemove);
    await handleSaveSection("skills", { skills: updatedSkills });
  };

  const currentFacts = [
    { icon: GraduationCap, label: "Course", value: `${student.course} · ${student.branch}` },
    { icon: MapPin, label: "Location", value: `${student.city}, ${student.state}` },
    { icon: Wallet, label: "Family income", value: `${inr(student.income)} / year` },
  ];

  return (
    <AppShell>
      <section className="surface relative overflow-hidden rounded-[2rem] p-6 sm:p-8">
        <div className="pointer-events-none absolute -left-24 -top-24 size-72 rounded-full gradient-hero opacity-10" />
        <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
          <div className="flex min-w-0 items-start gap-4">
            <span className="grid size-16 shrink-0 place-items-center rounded-3xl gradient-hero font-display text-xl font-black text-primary-foreground">
              {student.initials}
            </span>
            <div className="min-w-0">
              <h1 className="truncate font-display text-2xl font-extrabold sm:text-3xl">
                {student.name}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">{student.headline}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-primary-soft px-3 py-1 text-xs font-bold text-primary">
                  CGPA {student.cgpa}
                </span>
                <span className="rounded-full bg-muted px-3 py-1 text-xs font-bold text-muted-foreground">
                  {student.year}
                </span>
                <span className="rounded-full bg-muted px-3 py-1 text-xs font-bold text-muted-foreground">
                  {student.category} category
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ProgressRing value={student.strength} size={116} caption="strength" />
            <div className="min-w-0">
              <p className="text-sm font-bold">Profile strength</p>
              <p className="mt-1 max-w-[16rem] text-xs text-muted-foreground">
                Powers your match scores across 12,000+ official scholarships.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-4 grid gap-3 sm:grid-cols-3">
        {currentFacts.map((f) => (
          <div key={f.label} className="surface flex items-center gap-3 rounded-3xl p-5">
            <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-primary-soft text-primary">
              <f.icon className="size-5" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                {f.label}
              </p>
              <p className="truncate text-sm font-bold">{f.value}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="mt-12 grid gap-4 lg:grid-cols-[1.1fr_1fr]">
        <div className="surface rounded-[2rem] p-6">
          <SectionHeading eyebrow="Completion" title="Profile sections" />
          <ul className="space-y-3">
            {student.sections.map((sec) => (
              <li
                key={sec.id}
                className="flex items-center gap-3 rounded-2xl border border-border p-3.5"
              >
                <span
                  className={`grid size-8 shrink-0 place-items-center rounded-full text-xs font-bold ${
                    sec.done
                      ? "gradient-hero text-primary-foreground"
                      : "border border-dashed border-primary text-primary"
                  }`}
                >
                  {sec.done ? <Check className="size-4" /> : "+"}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold">{sec.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {sec.done ? "Completed" : `Adds ${sec.weight}% to your strength`}
                  </p>
                </div>
                <button
                  onClick={() => setActiveModal(sec.id)}
                  className="shrink-0 rounded-full border border-border px-3 py-1.5 text-xs font-bold text-muted-foreground transition-colors hover:bg-muted cursor-pointer"
                >
                  <Pencil className="mr-1 inline size-3" />
                  {sec.done ? "Edit" : "Add"}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <div className="surface rounded-[2rem] p-6">
            <div className="flex items-center justify-between">
              <SectionHeading eyebrow="Recognition" title="Achievements" />
              <button
                onClick={() => setActiveModal("achievements")}
                className="text-xs font-bold text-primary hover:underline cursor-pointer"
              >
                + Add / Edit
              </button>
            </div>
            {student.achievements && student.achievements.length > 0 ? (
              <ul className="space-y-3 mt-3">
                {student.achievements.map((a, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-accent-soft text-base">
                      {a.icon}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold leading-snug">{a.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {a.org} · {a.year}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-muted-foreground mt-2">No achievements added yet. Click + Add / Edit to add achievements, certifications, or hackathons.</p>
            )}
          </div>

          <div className="surface rounded-[2rem] p-6">
            <SectionHeading eyebrow="Strengths" title="Skills & interests" />
            <div className="mt-3 flex flex-wrap gap-2">
              {student.skills && student.skills.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs font-bold text-muted-foreground"
                >
                  {s}
                  <button
                    onClick={() => handleRemoveSkill(s)}
                    className="hover:text-destructive transition-colors ml-1"
                    title="Remove skill"
                  >
                    <X className="size-3" />
                  </button>
                </span>
              ))}
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  placeholder="Add skill..."
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddSkill();
                  }}
                  className="rounded-full border border-border bg-card px-3 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary w-28"
                />
                <button
                  onClick={handleAddSkill}
                  className="rounded-full bg-primary-soft px-3 py-1.5 text-xs font-bold text-primary cursor-pointer hover:bg-primary/20"
                >
                  + Add
                </button>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] gradient-hero p-6">
            <h3 className="font-display text-lg font-bold text-primary-foreground">
              Improve your profile, improve your odds
            </h3>
            <p className="mt-2 text-sm text-primary-foreground/85">
              Profiles with updated academic metrics & certificates get accurate 100% eligibility matching.
            </p>
            <Link
              to="/recommendations"
              className="mt-5 inline-block rounded-full bg-card px-4 py-2.5 text-sm font-bold"
            >
              See what unlocks
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION EDIT MODALS */}
      {activeModal && profile && (
        <EditSectionModal
          sectionId={activeModal}
          profile={profile}
          saving={saving}
          onClose={() => setActiveModal(null)}
          onSave={handleSaveSection}
        />
      )}
    </AppShell>
  );
}

function EditSectionModal({
  sectionId,
  profile,
  saving,
  onClose,
  onSave,
}: {
  sectionId: string;
  profile: ProfileData;
  saving: boolean;
  onClose: () => void;
  onSave: (key: string, data: Partial<ProfileData>) => Promise<void>;
}) {
  const [formData, setFormData] = useState<Partial<ProfileData>>({ ...profile });

  const handleChange = (field: keyof ProfileData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(sectionId, formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="surface relative w-full max-w-xl rounded-3xl p-6 shadow-2xl border border-border">
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <h3 className="font-display text-lg font-bold">
            Edit {sectionId === "personal" ? "Personal Information" :
                  sectionId === "address" ? "Address Information" :
                  sectionId === "academic" ? "Academic Information" :
                  sectionId === "eligibility" ? "Eligibility Information" :
                  "Achievements & Optional Details"}
          </h3>
          <button onClick={onClose} className="rounded-full p-1 text-muted-foreground hover:text-foreground">
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          {sectionId === "personal" && (
            <>
              <div>
                <label className="block text-xs font-bold text-muted-foreground mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name || ""}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="w-full rounded-2xl border border-border bg-card p-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-muted-foreground mb-1">Gender</label>
                <select
                  value={formData.gender || "Male"}
                  onChange={(e) => handleChange("gender", e.target.value)}
                  className="w-full rounded-2xl border border-border bg-card p-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Third Gender / Other</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-muted-foreground mb-1">Date of Birth</label>
                  <input
                    type="date"
                    required
                    value={formData.dob || ""}
                    onChange={(e) => handleChange("dob", e.target.value)}
                    className="w-full rounded-2xl border border-border bg-card p-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-muted-foreground mb-1">Mobile Number</label>
                  <input
                    type="tel"
                    required
                    value={formData.mobile || ""}
                    onChange={(e) => handleChange("mobile", e.target.value)}
                    className="w-full rounded-2xl border border-border bg-card p-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </>
          )}

          {sectionId === "address" && (
            <>
              <div>
                <label className="block text-xs font-bold text-muted-foreground mb-1">Domicile State</label>
                <select
                  value={formData.state || "Maharashtra"}
                  onChange={(e) => handleChange("state", e.target.value)}
                  className="w-full rounded-2xl border border-border bg-card p-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {["Andhra Pradesh", "Assam", "Delhi", "Gujarat", "Karnataka", "Kerala", "Maharashtra", "Punjab", "Tamil Nadu", "Telangana", "Uttar Pradesh", "West Bengal"].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-muted-foreground mb-1">District</label>
                  <input
                    type="text"
                    required
                    value={formData.district || ""}
                    onChange={(e) => handleChange("district", e.target.value)}
                    className="w-full rounded-2xl border border-border bg-card p-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-muted-foreground mb-1">City / Town</label>
                  <input
                    type="text"
                    required
                    value={formData.cityTownVillage || ""}
                    onChange={(e) => handleChange("cityTownVillage", e.target.value)}
                    className="w-full rounded-2xl border border-border bg-card p-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-muted-foreground mb-1">Pincode</label>
                <input
                  type="text"
                  required
                  value={formData.pinCode || ""}
                  onChange={(e) => handleChange("pinCode", e.target.value)}
                  className="w-full rounded-2xl border border-border bg-card p-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </>
          )}

          {sectionId === "academic" && (
            <>
              <div>
                <label className="block text-xs font-bold text-muted-foreground mb-1">Education Level</label>
                <select
                  value={formData.educationLevel || "Undergraduate"}
                  onChange={(e) => handleChange("educationLevel", e.target.value)}
                  className="w-full rounded-2xl border border-border bg-card p-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="School">School (Class 1-10)</option>
                  <option value="Intermediate">Intermediate (Class 11-12)</option>
                  <option value="Diploma">Diploma</option>
                  <option value="Undergraduate">Undergraduate (UG)</option>
                  <option value="Postgraduate">Postgraduate (PG)</option>
                  <option value="PhD">PhD / Doctorate</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-muted-foreground mb-1">Degree / Course</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. B.Tech, B.Sc, B.Com"
                    value={formData.courseName || ""}
                    onChange={(e) => handleChange("courseName", e.target.value)}
                    className="w-full rounded-2xl border border-border bg-card p-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-muted-foreground mb-1">Branch / Specialization</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Computer Science, Civil"
                    value={formData.specialization || ""}
                    onChange={(e) => handleChange("specialization", e.target.value)}
                    className="w-full rounded-2xl border border-border bg-card p-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-muted-foreground mb-1">College / Institution</label>
                <input
                  type="text"
                  required
                  value={formData.institutionName || ""}
                  onChange={(e) => handleChange("institutionName", e.target.value)}
                  className="w-full rounded-2xl border border-border bg-card p-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-muted-foreground mb-1">Year / Sem</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2nd year"
                    value={formData.currentYearSemester || ""}
                    onChange={(e) => handleChange("currentYearSemester", e.target.value)}
                    className="w-full rounded-2xl border border-border bg-card p-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-muted-foreground mb-1">Scale</label>
                  <select
                    value={formData.gradingScale || "CGPA"}
                    onChange={(e) => handleChange("gradingScale", e.target.value)}
                    className="w-full rounded-2xl border border-border bg-card p-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="CGPA">CGPA (10.0)</option>
                    <option value="Percentage">Percentage (100%)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-muted-foreground mb-1">Score / CGPA</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.gradesValue ?? ""}
                    onChange={(e) => handleChange("gradesValue", parseFloat(e.target.value) || 0)}
                    className="w-full rounded-2xl border border-border bg-card p-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </>
          )}

          {sectionId === "eligibility" && (
            <>
              <div>
                <label className="block text-xs font-bold text-muted-foreground mb-1">Annual Family Income (₹)</label>
                <input
                  type="number"
                  required
                  value={formData.income ?? ""}
                  onChange={(e) => handleChange("income", parseFloat(e.target.value) || 0)}
                  className="w-full rounded-2xl border border-border bg-card p-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-muted-foreground mb-1">Social Category</label>
                <select
                  value={formData.category || "General"}
                  onChange={(e) => handleChange("category", e.target.value)}
                  className="w-full rounded-2xl border border-border bg-card p-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="General">General</option>
                  <option value="EWS">EWS (Economically Weaker Section)</option>
                  <option value="OBC">OBC (Other Backward Classes)</option>
                  <option value="SC">SC (Scheduled Caste)</option>
                  <option value="ST">ST (Scheduled Tribe)</option>
                  <option value="Minority">Minority Community</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <label className="flex items-center gap-2 text-xs font-bold text-foreground cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!formData.minorityStatus}
                    onChange={(e) => handleChange("minorityStatus", e.target.checked)}
                    className="size-4 rounded border-border text-primary"
                  />
                  Belong to Minority Community
                </label>
                <label className="flex items-center gap-2 text-xs font-bold text-foreground cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!formData.disabilityStatus}
                    onChange={(e) => handleChange("disabilityStatus", e.target.checked)}
                    className="size-4 rounded border-border text-primary"
                  />
                  Specially-Abled / Person with Disability
                </label>
              </div>
            </>
          )}

          {sectionId === "achievements" && (
            <>
              <div>
                <label className="block text-xs font-bold text-muted-foreground mb-1">Certifications</label>
                <input
                  type="text"
                  placeholder="e.g. AWS Certified Cloud Practitioner"
                  value={formData.certifications || ""}
                  onChange={(e) => handleChange("certifications", e.target.value)}
                  className="w-full rounded-2xl border border-border bg-card p-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-muted-foreground mb-1">Hackathons & Competitions</label>
                <input
                  type="text"
                  placeholder="e.g. Winner Smart India Hackathon 2025"
                  value={formData.hackathons || ""}
                  onChange={(e) => handleChange("hackathons", e.target.value)}
                  className="w-full rounded-2xl border border-border bg-card p-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-muted-foreground mb-1">Academic Projects</label>
                <input
                  type="text"
                  placeholder="e.g. AI-powered Scholarship Engine"
                  value={formData.projects || ""}
                  onChange={(e) => handleChange("projects", e.target.value)}
                  className="w-full rounded-2xl border border-border bg-card p-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-muted-foreground mb-1">Research Papers / Publications</label>
                <input
                  type="text"
                  placeholder="e.g. IEEE ML in Financial Aid 2026"
                  value={formData.researchPapers || ""}
                  onChange={(e) => handleChange("researchPapers", e.target.value)}
                  className="w-full rounded-2xl border border-border bg-card p-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </>
          )}

          <div className="pt-4 flex justify-end gap-3 border-t border-border">
            <Button type="button" variant="outline" onClick={onClose} disabled={saving} className="rounded-full">
              Cancel
            </Button>
            <Button type="submit" disabled={saving} className="rounded-full gradient-hero font-bold px-6">
              {saving ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
