import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FileText, Upload, Trash2, ExternalLink, ShieldCheck, Eye, RefreshCw, AlertCircle } from "lucide-react";
import { AppShell } from "@/components/meritmind/AppShell";
import { documentService, type VaultDocument } from "@/services/documentService";

export const Route = createFileRoute("/vault")({
  component: VaultPage,
});

const DOC_TYPES = [
  { key: "Aadhaar", label: "Aadhaar Card", desc: "Identity & Age Proof" },
  { key: "Income Certificate", label: "Income Certificate", desc: "Issued by Tehsildar / Revenue Authority" },
  { key: "Bonafide Certificate", label: "Bonafide Student Certificate", desc: "Current College Enrollment Proof" },
  { key: "Caste Certificate", label: "Caste / Category Certificate", desc: "SC / ST / OBC / EWS Proof" },
  { key: "Disability Certificate", label: "Disability Certificate", desc: "Specially-abled student proof (if applicable)" },
  { key: "Resume", label: "Student Resume / CV", desc: "For merit & CSR mentorship shortlists" },
];

function VaultPage() {
  const [docs, setDocs] = useState<VaultDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingType, setUploadingType] = useState<string | null>(null);

  const fetchDocs = async () => {
    setLoading(true);
    try {
      const data = await documentService.list();
      setDocs(data);
    } catch {
      // fallback empty
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, docType: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingType(docType);
    try {
      await documentService.upload(file, docType);
      await fetchDocs();
    } catch {
      alert("Failed to upload document. Please ensure backend is running.");
    } finally {
      setUploadingType(null);
    }
  };

  const handleDelete = async (docId: string) => {
    if (!confirm("Are you sure you want to delete this document from your vault?")) return;
    try {
      await documentService.delete(docId);
      await fetchDocs();
    } catch {
      alert("Failed to delete document.");
    }
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1 text-xs font-bold text-primary">
            <ShieldCheck className="size-3.5" /> Secure Storage
          </span>
          <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">Document Vault</h1>
          <p className="mt-1.5 text-base text-muted-foreground">
            Keep your official certificates saved locally for easy access whenever you fill provider forms.
          </p>
        </div>

        {/* Security Banner Requirement (Phase 4) */}
        <div className="flex items-start gap-3.5 rounded-3xl border border-accent/30 bg-accent-soft/40 p-5">
          <AlertCircle className="mt-0.5 size-5 shrink-0 text-accent" />
          <div className="text-sm">
            <h4 className="font-bold text-foreground">Convenience Storage Only</h4>
            <p className="mt-0.5 text-muted-foreground leading-relaxed">
              MeritMind stores your files securely for your reference. <strong>MeritMind NEVER submits these files directly to scholarship providers.</strong> Applications must always be completed on official provider portals.
            </p>
          </div>
        </div>

        {/* Document Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DOC_TYPES.map((dt) => {
            const uploadedDoc = docs.find((d) => d.docType === dt.key);
            const isUploading = uploadingType === dt.key;

            return (
              <div
                key={dt.key}
                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="grid size-10 place-items-center rounded-2xl bg-muted text-primary">
                      <FileText className="size-5" />
                    </span>
                    {uploadedDoc ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2.5 py-0.5 text-[11px] font-bold text-success">
                        Uploaded
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                        Not Added
                      </span>
                    )}
                  </div>

                  <h3 className="mt-4 font-display text-base font-bold">{dt.label}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{dt.desc}</p>

                  {uploadedDoc && (
                    <div className="mt-3 rounded-2xl bg-muted/60 p-3 text-xs">
                      <p className="font-semibold truncate text-foreground">{uploadedDoc.filename}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {(uploadedDoc.fileSize / 1024).toFixed(1)} KB · Added {new Date(uploadedDoc.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-5 flex items-center gap-2 pt-3 border-t border-border/50">
                  {uploadedDoc ? (
                    <>
                      <a
                        href={documentService.downloadUrl(uploadedDoc.id)}
                        target="_blank"
                        rel="noreferrer"
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-border px-3 py-2 text-xs font-bold transition-colors hover:bg-muted"
                      >
                        <Eye className="size-3.5" /> Preview
                      </a>
                      <label className="flex items-center justify-center gap-1.5 rounded-full border border-border px-3 py-2 text-xs font-bold cursor-pointer transition-colors hover:bg-muted">
                        <RefreshCw className="size-3.5" /> Replace
                        <input
                          type="file"
                          accept=".pdf,.png,.jpg,.jpeg"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, dt.key)}
                        />
                      </label>
                      <button
                        onClick={() => handleDelete(uploadedDoc.id)}
                        aria-label="Delete document"
                        className="grid size-8 place-items-center rounded-full text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </>
                  ) : (
                    <label className="flex flex-1 items-center justify-center gap-2 rounded-full gradient-hero px-4 py-2.5 text-xs font-bold text-primary-foreground cursor-pointer transition-transform active:scale-95">
                      <Upload className="size-3.5" />
                      {isUploading ? "Uploading..." : "Upload Document"}
                      <input
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, dt.key)}
                      />
                    </label>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
