"use client";

import { useState, useEffect } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Loader2,
  Plus,
  Trash2,
  Edit,
  Building2,
  Briefcase,
  Users,
  ToggleLeft,
  ToggleRight,
  Save,
} from "lucide-react";

const companySchema = z.object({
  name: z.string().min(1, "Required"),
  industry: z.string().optional(),
  description: z.string().optional(),
  website: z.string().optional(),
});

const internshipSchema = z.object({
  title: z.string().min(1, "Required"),
  description: z.string().min(1, "Required"),
  industry: z.string().optional(),
  location: z.string().optional(),
  workType: z.string().optional(),
  duration: z.string().optional(),
  stipend: z.string().optional(),
  openings: z.coerce.number().int().min(1).default(1),
  requiredGpa: z.string().optional(),
  requiredSkillsStr: z.string().optional(),
  preferredSkillsStr: z.string().optional(),
  deadline: z.string().optional(),
});

type CompanyForm = z.infer<typeof companySchema>;
type InternshipForm = z.infer<typeof internshipSchema>;

type Internship = {
  id: string;
  title: string;
  industry: string | null;
  location: string | null;
  workType: string | null;
  isActive: boolean;
  _count: { recommendations: number; feedback: number };
};

type Company = {
  id: string;
  name: string;
  industry: string | null;
  description: string | null;
  website: string | null;
  internships: Internship[];
};

export default function CompanyPage() {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingInternship, setEditingInternship] = useState<string | null>(null);

  const companyForm = useForm<CompanyForm>({
    resolver: zodResolver(companySchema) as Resolver<CompanyForm>,
  });

  const internshipForm = useForm<InternshipForm>({
    resolver: zodResolver(internshipSchema) as Resolver<InternshipForm>,
    defaultValues: { openings: 1 },
  });

  useEffect(() => {
    fetch("/api/company")
      .then((r) => r.json())
      .then((data) => {
        if (data.company) {
          setCompany(data.company);
          companyForm.reset({
            name: data.company.name,
            industry: data.company.industry ?? "",
            description: data.company.description ?? "",
            website: data.company.website ?? "",
          });
        } else {
          setIsNew(true);
        }
        setLoading(false);
      });
  }, [companyForm]);

  const saveCompany = async (values: CompanyForm) => {
    setSaving(true);
    const method = isNew ? "POST" : "PUT";
    const res = await fetch("/api/company", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    setSaving(false);
    if (res.ok) {
      const data = await res.json();
      setCompany((prev) =>
        prev ? { ...prev, ...data.company } : { ...data.company, internships: [] }
      );
      setIsNew(false);
      toast.success("Company profile saved!");
    } else {
      toast.error("Failed to save");
    }
  };

  const postInternship = async (values: InternshipForm) => {
    if (!company) return;
    setSaving(true);

    const payload = {
      title: values.title,
      description: values.description,
      industry: values.industry,
      location: values.location,
      workType: values.workType || undefined,
      duration: values.duration,
      stipend: values.stipend,
      openings: values.openings,
      requiredGpa: values.requiredGpa ? parseFloat(values.requiredGpa) : undefined,
      requiredSkills: values.requiredSkillsStr
        ? values.requiredSkillsStr.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
      preferredSkills: values.preferredSkillsStr
        ? values.preferredSkillsStr.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
      deadline: values.deadline || undefined,
    };

    const url = editingInternship
      ? `/api/internships/${editingInternship}`
      : "/api/internships";
    const method = editingInternship ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSaving(false);
    if (res.ok) {
      toast.success(
        editingInternship ? "Internship updated!" : "Internship posted!"
      );
      setDialogOpen(false);
      setEditingInternship(null);
      internshipForm.reset();
      // Refresh company data
      const data = await fetch("/api/company").then((r) => r.json());
      setCompany(data.company);
    } else {
      toast.error("Failed to save internship");
    }
  };

  const toggleActive = async (id: string, current: boolean) => {
    await fetch(`/api/internships/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !current }),
    });
    setCompany((prev) =>
      prev
        ? {
            ...prev,
            internships: prev.internships.map((i) =>
              i.id === id ? { ...i, isActive: !current } : i
            ),
          }
        : null
    );
    toast.success(!current ? "Internship activated" : "Internship deactivated");
  };

  const deleteInternship = async (id: string) => {
    if (!confirm("Delete this internship?")) return;
    await fetch(`/api/internships/${id}`, { method: "DELETE" });
    setCompany((prev) =>
      prev
        ? {
            ...prev,
            internships: prev.internships.filter((i) => i.id !== id),
          }
        : null
    );
    toast.success("Internship deleted");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Building2 className="h-6 w-6 text-primary" />
          Company Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage your company profile and internship listings.
        </p>
      </div>

      {/* Company Profile */}
      <Card className="bg-card border-border mb-6">
        <CardHeader className="pb-4">
          <CardTitle className="text-base text-foreground">Company Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={companyForm.handleSubmit(saveCompany)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-foreground/80 text-sm">Company Name *</Label>
                <Input
                  {...companyForm.register("name")}
                  placeholder="Acme Corp"
                  className="mt-1 bg-muted border-border text-foreground placeholder:text-muted-foreground/50"
                />
              </div>
              <div>
                <Label className="text-foreground/80 text-sm">Industry</Label>
                <Input
                  {...companyForm.register("industry")}
                  placeholder="Technology"
                  className="mt-1 bg-muted border-border text-foreground placeholder:text-muted-foreground/50"
                />
              </div>
            </div>
            <div>
              <Label className="text-foreground/80 text-sm">Description</Label>
              <Textarea
                {...companyForm.register("description")}
                rows={3}
                placeholder="Tell students about your company..."
                className="mt-1 bg-muted border-border text-foreground placeholder:text-muted-foreground/50 resize-none"
              />
            </div>
            <div>
              <Label className="text-foreground/80 text-sm">Website</Label>
              <Input
                {...companyForm.register("website")}
                placeholder="https://example.com"
                className="mt-1 bg-muted border-border text-foreground placeholder:text-muted-foreground/50"
              />
            </div>
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={saving}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                {isNew ? "Create Company" : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Internship Listings */}
      {company && (
        <>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">
              Internship Listings
              <span className="text-muted-foreground text-sm font-normal ml-2">
                ({company.internships.length})
              </span>
            </h2>
            <Dialog
              open={dialogOpen}
              onOpenChange={(open) => {
                setDialogOpen(open);
                if (!open) {
                  setEditingInternship(null);
                  internshipForm.reset();
                }
              }}
            >
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Post Internship
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-border text-foreground max-w-2xl max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-foreground">
                    {editingInternship ? "Edit Internship" : "Post New Internship"}
                  </DialogTitle>
                </DialogHeader>
                <form
                  onSubmit={internshipForm.handleSubmit(postInternship)}
                  className="space-y-4 mt-4"
                >
                  <div>
                    <Label className="text-foreground/80 text-sm">Title *</Label>
                    <Input
                      {...internshipForm.register("title")}
                      placeholder="Software Engineering Intern"
                      className="mt-1 bg-muted border-border text-foreground placeholder:text-muted-foreground/50"
                    />
                  </div>
                  <div>
                    <Label className="text-foreground/80 text-sm">Description *</Label>
                    <Textarea
                      {...internshipForm.register("description")}
                      rows={4}
                      placeholder="Describe the role, responsibilities and what interns will learn..."
                      className="mt-1 bg-muted border-border text-foreground placeholder:text-muted-foreground/50 resize-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-foreground/80 text-sm">Industry</Label>
                      <Input
                        {...internshipForm.register("industry")}
                        placeholder="Technology"
                        className="mt-1 bg-muted border-border text-foreground placeholder:text-muted-foreground/50"
                      />
                    </div>
                    <div>
                      <Label className="text-foreground/80 text-sm">Location</Label>
                      <Input
                        {...internshipForm.register("location")}
                        placeholder="San Francisco, CA"
                        className="mt-1 bg-muted border-border text-foreground placeholder:text-muted-foreground/50"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label className="text-foreground/80 text-sm">Work Type</Label>
                      <select
                        {...internshipForm.register("workType")}
                        className="mt-1 w-full bg-muted border border-border text-foreground rounded-md px-3 py-2 text-sm"
                      >
                        <option value="">Select...</option>
                        <option value="remote">Remote</option>
                        <option value="hybrid">Hybrid</option>
                        <option value="onsite">Onsite</option>
                      </select>
                    </div>
                    <div>
                      <Label className="text-foreground/80 text-sm">Duration</Label>
                      <Input
                        {...internshipForm.register("duration")}
                        placeholder="3 months"
                        className="mt-1 bg-muted border-border text-foreground placeholder:text-muted-foreground/50"
                      />
                    </div>
                    <div>
                      <Label className="text-foreground/80 text-sm">Openings</Label>
                      <Input
                        {...internshipForm.register("openings")}
                        type="number"
                        min={1}
                        className="mt-1 bg-muted border-border text-foreground"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-foreground/80 text-sm">Stipend</Label>
                      <Input
                        {...internshipForm.register("stipend")}
                        placeholder="$2000/month"
                        className="mt-1 bg-muted border-border text-foreground placeholder:text-muted-foreground/50"
                      />
                    </div>
                    <div>
                      <Label className="text-foreground/80 text-sm">Min GPA</Label>
                      <Input
                        {...internshipForm.register("requiredGpa")}
                        type="number"
                        step="0.01"
                        placeholder="3.0"
                        className="mt-1 bg-muted border-border text-foreground placeholder:text-muted-foreground/50"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-foreground/80 text-sm">
                      Required Skills{" "}
                      <span className="text-muted-foreground/60">(comma-separated)</span>
                    </Label>
                    <Input
                      {...internshipForm.register("requiredSkillsStr")}
                      placeholder="Python, Machine Learning, SQL"
                      className="mt-1 bg-muted border-border text-foreground placeholder:text-muted-foreground/50"
                    />
                  </div>
                  <div>
                    <Label className="text-foreground/80 text-sm">
                      Preferred Skills{" "}
                      <span className="text-muted-foreground/60">(comma-separated)</span>
                    </Label>
                    <Input
                      {...internshipForm.register("preferredSkillsStr")}
                      placeholder="TensorFlow, Docker, AWS"
                      className="mt-1 bg-muted border-border text-foreground placeholder:text-muted-foreground/50"
                    />
                  </div>
                  <div>
                    <Label className="text-foreground/80 text-sm">Application Deadline</Label>
                    <Input
                      {...internshipForm.register("deadline")}
                      type="datetime-local"
                      className="mt-1 bg-muted border-border text-foreground"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="border-border text-muted-foreground hover:bg-muted"
                      onClick={() => setDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={saving}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      {saving ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : null}
                      {editingInternship ? "Update" : "Post Internship"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {company.internships.length === 0 ? (
            <div className="text-center py-16 bg-card rounded-2xl border border-border">
              <Briefcase className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-muted-foreground">No internships posted yet.</p>
              <p className="text-muted-foreground/60 text-sm mt-1">
                Click &quot;Post Internship&quot; to add your first listing.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {company.internships.map((internship) => (
                <Card key={internship.id} className="bg-card border-border">
                  <CardContent className="p-4 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-foreground truncate">
                          {internship.title}
                        </h3>
                        <Badge
                          className={
                            internship.isActive
                              ? "bg-chart-5/20 text-chart-5 border-chart-5/30 text-xs"
                              : "bg-muted text-muted-foreground border-border text-xs"
                          }
                        >
                          {internship.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        {internship.industry && <span>{internship.industry}</span>}
                        {internship.location && <span>{internship.location}</span>}
                        {internship.workType && (
                          <span className="capitalize">{internship.workType}</span>
                        )}
                        <Separator orientation="vertical" className="h-3 bg-border" />
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {internship._count.recommendations} matches
                        </span>
                        <span className="flex items-center gap-1">
                          <Briefcase className="h-3 w-3" />
                          {internship._count.feedback} interactions
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-muted-foreground hover:text-foreground hover:bg-muted"
                        onClick={() => toggleActive(internship.id, internship.isActive)}
                      >
                        {internship.isActive ? (
                          <ToggleRight className="h-4 w-4" />
                        ) : (
                          <ToggleLeft className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-muted-foreground hover:text-foreground hover:bg-muted"
                        onClick={() => {
                          setEditingInternship(internship.id);
                          setDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => deleteInternship(internship.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
