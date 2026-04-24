"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import {
  Plus,
  Trash2,
  Save,
  Loader2,
  GraduationCap,
  Wrench,
  Briefcase,
  Heart,
  Brain,
  Sparkles,
} from "lucide-react";

const experienceSchema = z.object({
  title: z.string().min(1, "Required"),
  company: z.string().min(1, "Required"),
  duration: z.string().optional(),
  description: z.string().optional(),
});

const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  bio: z.string().optional(),
  resumeUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  gpa: z.string().optional(),
  major: z.string().optional(),
  university: z.string().optional(),
  graduationYear: z.string().optional(),
  experience: z.array(experienceSchema).default([]),
  personality: z
    .object({
      openness: z.number().min(0).max(100).default(50),
      conscientiousness: z.number().min(0).max(100).default(50),
      extraversion: z.number().min(0).max(100).default(50),
      agreeableness: z.number().min(0).max(100).default(50),
      neuroticism: z.number().min(0).max(100).default(50),
    })
    .default({
      openness: 50,
      conscientiousness: 50,
      extraversion: 50,
      agreeableness: 50,
      neuroticism: 50,
    }),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const PERSONALITY_TRAITS = [
  { key: "openness", label: "Openness", desc: "Curiosity and creativity" },
  { key: "conscientiousness", label: "Conscientiousness", desc: "Organization and dependability" },
  { key: "extraversion", label: "Extraversion", desc: "Sociability and assertiveness" },
  { key: "agreeableness", label: "Agreeableness", desc: "Cooperation and empathy" },
  { key: "neuroticism", label: "Neuroticism", desc: "Emotional sensitivity" },
] as const;

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isNew, setIsNew] = useState(false);

  // AI Extraction Stats
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  // Tag fields
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [preferredRoles, setPreferredRoles] = useState<string[]>([]);
  const [roleInput, setRoleInput] = useState("");
  const [preferredIndustries, setPreferredIndustries] = useState<string[]>([]);
  const [industryInput, setIndustryInput] = useState("");
  const [preferredLocations, setPreferredLocations] = useState<string[]>([]);
  const [locationInput, setLocationInput] = useState("");
  const [workTypes, setWorkTypes] = useState<string[]>([]);

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema) as Resolver<ProfileFormValues>,
    defaultValues: {
      personality: {
        openness: 50,
        conscientiousness: 50,
        extraversion: 50,
        agreeableness: 50,
        neuroticism: 50,
      },
    },
  });

  const { fields: expFields, append: appendExp, remove: removeExp } = useFieldArray({
    control,
    name: "experience",
  });

  const personality = watch("personality");

  useEffect(() => {
    fetch("/api/students")
      .then((r) => r.json())
      .then((data) => {
        if (data.student) {
          const s = data.student;
          reset({
            name: s.name,
            bio: s.bio ?? "",
            resumeUrl: s.resumeUrl ?? "",
            gpa: s.gpa != null ? String(s.gpa) : "",
            major: s.major ?? "",
            university: s.university ?? "",
            graduationYear: s.graduationYear != null ? String(s.graduationYear) : "",
            experience: s.experience ?? [],
            personality: s.personality ?? {
              openness: 50,
              conscientiousness: 50,
              extraversion: 50,
              agreeableness: 50,
              neuroticism: 50,
            },
          });
          setSkills(s.skills ?? []);
          setPreferredRoles(s.preferredRoles ?? []);
          setPreferredIndustries(s.preferredIndustries ?? []);
          setPreferredLocations(s.preferredLocations ?? []);
          setWorkTypes(s.workTypes ?? []);
        } else {
          setIsNew(true);
        }
        setLoading(false);
      });
  }, [reset]);

  const handleAiUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAiLoading(true);
    setAiError("");
    
    const formData = new FormData();
    formData.append("resume", file);

    try {
      const res = await fetch("/api/parser", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || "Failed to parse");

      const aiProfile = data.profile;
      
      // Selectively reset profile while keeping non-parsed things intact
      reset({
        name: aiProfile.name || watch("name"),
        bio: aiProfile.bio || watch("bio"),
        resumeUrl: watch("resumeUrl"),
        gpa: aiProfile.gpa || watch("gpa"),
        major: aiProfile.major || watch("major"),
        university: aiProfile.university || watch("university"),
        graduationYear: aiProfile.graduationYear || watch("graduationYear"),
        experience: aiProfile.experience?.length ? aiProfile.experience : watch("experience"),
        personality: watch("personality"),
      });

      if (aiProfile.skills?.length) {
        setSkills(prev => [...new Set([...prev, ...aiProfile.skills])]);
      }

      toast.success("AI Autofill Complete!", { description: "Review extracted data below." });
    } catch (err: any) {
      setAiError(err.message);
      toast.error("Extraction Failed");
    } finally {
      setAiLoading(false);
      e.target.value = ""; // Reset the input visual
    }
  };

  const addTag = (
    input: string,
    list: string[],
    setter: (v: string[]) => void,
    inputSetter: (v: string) => void
  ) => {
    const val = input.trim();
    if (val && !list.includes(val)) {
      setter([...list, val]);
    }
    inputSetter("");
  };

  const removeTag = (
    val: string,
    list: string[],
    setter: (v: string[]) => void
  ) => setter(list.filter((t) => t !== val));

  const toggleWorkType = (type: string) => {
    setWorkTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const onSubmit = async (values: ProfileFormValues) => {
    setSaving(true);
    const payload = {
      ...values,
      gpa: values.gpa ? parseFloat(values.gpa) : undefined,
      graduationYear: values.graduationYear ? parseInt(values.graduationYear) : undefined,
      skills,
      preferredRoles,
      preferredIndustries,
      preferredLocations,
      workTypes,
    };

    const method = isNew ? "POST" : "PUT";
    const res = await fetch("/api/students", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSaving(false);

    if (res.ok) {
      setIsNew(false);
      toast.success("Profile saved successfully!");
    } else {
      const err = await res.json();
      toast.error("Failed to save profile", {
        description: JSON.stringify(err.error),
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">
          {isNew ? "Create Your Profile" : "Edit Profile"}
        </h1>
        <p className="text-muted-foreground mt-1">
          A complete profile leads to better recommendations.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Info */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2 text-foreground">
              <GraduationCap className="h-4 w-4 text-primary" />
              Academic Background
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-foreground/80 text-sm">Full Name *</Label>
                <Input
                  {...register("name")}
                  placeholder="Jane Doe"
                  className="mt-1 bg-muted border-border text-foreground placeholder:text-muted-foreground/50"
                />
                {errors.name && (
                  <p className="text-destructive text-xs mt-1">{errors.name.message}</p>
                )}
              </div>
              <div>
                <Label className="text-foreground/80 text-sm">CGPA (0–10)</Label>
                <Input
                  {...register("gpa")}
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  placeholder="8.5"
                  className="mt-1 bg-muted border-border text-foreground placeholder:text-muted-foreground/50"
                />
              </div>
            </div>

            <div>
              <Label className="text-foreground/80 text-sm">Resume Link (Google Drive, Portfolio, etc.)</Label>
              <Input
                {...register("resumeUrl")}
                placeholder="https://drive.google.com/..."
                className="mt-1 bg-muted border-border text-foreground placeholder:text-muted-foreground/50"
              />
              {errors.resumeUrl && (
                <p className="text-destructive text-xs mt-1">{errors.resumeUrl.message}</p>
              )}
            </div>

            <div>
              <Label className="text-foreground/80 text-sm">Bio</Label>
              <Textarea
                {...register("bio")}
                placeholder="Tell us about yourself..."
                rows={3}
                className="mt-1 bg-muted border-border text-foreground placeholder:text-muted-foreground/50 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-foreground/80 text-sm">Major</Label>
                <Input
                  {...register("major")}
                  placeholder="Computer Science"
                  className="mt-1 bg-muted border-border text-foreground placeholder:text-muted-foreground/50"
                />
              </div>
              <div>
                <Label className="text-foreground/80 text-sm">University</Label>
                <Input
                  {...register("university")}
                  placeholder="MIT"
                  className="mt-1 bg-muted border-border text-foreground placeholder:text-muted-foreground/50"
                />
              </div>
            </div>

            <div>
              <Label className="text-foreground/80 text-sm">Graduation Year</Label>
              <Input
                {...register("graduationYear")}
                type="number"
                placeholder="2026"
                className="mt-1 bg-muted border-border text-foreground placeholder:text-muted-foreground/50 w-32"
              />
            </div>
          </CardContent>
        </Card>

        {/* Skills */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2 text-foreground">
              <Wrench className="h-4 w-4 text-chart-4" />
              Skills
            </CardTitle>
            <CardDescription className="text-muted-foreground text-sm">
              Add your technical and soft skills.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-3">
              <Input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag(skillInput, skills, setSkills, setSkillInput);
                  }
                }}
                placeholder="e.g. Python, React, SQL..."
                className="bg-muted border-border text-foreground placeholder:text-muted-foreground/50"
              />
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="border-border text-muted-foreground hover:bg-muted"
                onClick={() => addTag(skillInput, skills, setSkills, setSkillInput)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map((s) => (
                <Badge
                  key={s}
                  className="bg-secondary/30 text-secondary-foreground border-secondary/50 cursor-pointer"
                  onClick={() => removeTag(s, skills, setSkills)}
                >
                  {s} ×
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Experience */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2 text-foreground">
              <Briefcase className="h-4 w-4 text-chart-5" />
              Experience
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {expFields.map((field, idx) => (
              <div
                key={field.id}
                className="p-4 bg-muted/50 rounded-lg border border-border space-y-3"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground">
                    Experience {idx + 1}
                  </p>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 h-7 px-2"
                    onClick={() => removeExp(idx)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-muted-foreground text-xs">Job Title</Label>
                    <Input
                      {...register(`experience.${idx}.title`)}
                      placeholder="Software Intern"
                      className="mt-1 bg-muted border-border text-foreground placeholder:text-muted-foreground/50 text-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">Company</Label>
                    <Input
                      {...register(`experience.${idx}.company`)}
                      placeholder="Google"
                      className="mt-1 bg-muted border-border text-foreground placeholder:text-muted-foreground/50 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Duration</Label>
                  <Input
                    {...register(`experience.${idx}.duration`)}
                    placeholder="Jun 2024 – Aug 2024"
                    className="mt-1 bg-muted border-border text-foreground placeholder:text-muted-foreground/50 text-sm"
                  />
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Description</Label>
                  <Textarea
                    {...register(`experience.${idx}.description`)}
                    placeholder="What did you work on?"
                    rows={2}
                    className="mt-1 bg-muted border-border text-foreground placeholder:text-muted-foreground/50 resize-none text-sm"
                  />
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="border-border text-muted-foreground hover:bg-muted"
              onClick={() =>
                appendExp({ title: "", company: "", duration: "", description: "" })
              }
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Experience
            </Button>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2 text-foreground">
              <Heart className="h-4 w-4 text-chart-1" />
              Preferences
            </CardTitle>
            <CardDescription className="text-muted-foreground text-sm">
              Help the algorithm understand what you&apos;re looking for.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <TagField
              label="Preferred Roles"
              tags={preferredRoles}
              input={roleInput}
              setInput={setRoleInput}
              onAdd={() => addTag(roleInput, preferredRoles, setPreferredRoles, setRoleInput)}
              onRemove={(t) => removeTag(t, preferredRoles, setPreferredRoles)}
              placeholder="e.g. Frontend Engineer, Data Analyst..."
              badgeClass="bg-primary/15 text-primary border-primary/25"
            />
            <Separator className="bg-border" />
            <TagField
              label="Preferred Industries"
              tags={preferredIndustries}
              input={industryInput}
              setInput={setIndustryInput}
              onAdd={() =>
                addTag(industryInput, preferredIndustries, setPreferredIndustries, setIndustryInput)
              }
              onRemove={(t) =>
                removeTag(t, preferredIndustries, setPreferredIndustries)
              }
              placeholder="e.g. FinTech, Healthcare, SaaS..."
              badgeClass="bg-secondary/30 text-secondary-foreground border-secondary/50"
            />
            <Separator className="bg-border" />
            <TagField
              label="Preferred Locations"
              tags={preferredLocations}
              input={locationInput}
              setInput={setLocationInput}
              onAdd={() =>
                addTag(locationInput, preferredLocations, setPreferredLocations, setLocationInput)
              }
              onRemove={(t) =>
                removeTag(t, preferredLocations, setPreferredLocations)
              }
              placeholder="e.g. San Francisco, Remote, New York..."
              badgeClass="bg-accent/40 text-accent-foreground border-accent/50"
            />
            <Separator className="bg-border" />
            <div>
              <Label className="text-foreground/80 text-sm mb-2 block">Work Type</Label>
              <div className="flex gap-2 flex-wrap">
                {["remote", "hybrid", "onsite"].map((type) => (
                  <Badge
                    key={type}
                    onClick={() => toggleWorkType(type)}
                    className={`cursor-pointer capitalize ${
                      workTypes.includes(type)
                        ? "bg-primary/20 text-primary border-primary/30"
                        : "bg-muted text-muted-foreground border-border"
                    }`}
                  >
                    {type}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personality */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2 text-foreground">
              <Brain className="h-4 w-4 text-primary" />
              Personality Traits
            </CardTitle>
            <CardDescription className="text-muted-foreground text-sm">
              Big Five personality model — influences recommendation matching.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {PERSONALITY_TRAITS.map((trait) => (
              <div key={trait.key}>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <Label className="text-foreground/80 text-sm">{trait.label}</Label>
                    <p className="text-xs text-muted-foreground/60">{trait.desc}</p>
                  </div>
                  <span className="text-sm font-mono text-primary">
                    {personality?.[trait.key] ?? 50}
                  </span>
                </div>
                <Slider
                  min={0}
                  max={100}
                  step={1}
                  value={[personality?.[trait.key] ?? 50]}
                  onValueChange={([v]) =>
                    setValue(`personality.${trait.key}`, v)
                  }
                  className="w-full"
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* AI Auto-fill from Resume */}
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2 text-primary">
              <Sparkles className="h-4 w-4" />
              Auto-Fill using AI
            </CardTitle>
            <CardDescription className="text-sm">
              Upload your PDF or DOCX resume to instantly extract your skills, bio, and experience directly into this form!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Input
                type="file"
                accept=".pdf,.docx"
                disabled={aiLoading}
                className="max-w-sm file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                onChange={handleAiUpload}
              />
              {aiLoading && <Loader2 className="h-5 w-5 animate-spin text-primary" />}
            </div>
            {aiError && <p className="text-destructive text-sm mt-2">{aiError}</p>}
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={saving}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8"
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Profile
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

function TagField({
  label,
  tags,
  input,
  setInput,
  onAdd,
  onRemove,
  placeholder,
  badgeClass,
}: {
  label: string;
  tags: string[];
  input: string;
  setInput: (v: string) => void;
  onAdd: () => void;
  onRemove: (t: string) => void;
  placeholder: string;
  badgeClass: string;
}) {
  return (
    <div>
      <Label className="text-foreground/80 text-sm mb-2 block">{label}</Label>
      <div className="flex gap-2 mb-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onAdd();
            }
          }}
          placeholder={placeholder}
          className="bg-muted border-border text-foreground placeholder:text-muted-foreground/50 text-sm"
        />
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="border-border text-muted-foreground hover:bg-muted"
          onClick={onAdd}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.map((t) => (
          <Badge
            key={t}
            className={`${badgeClass} cursor-pointer`}
            onClick={() => onRemove(t)}
          >
            {t} ×
          </Badge>
        ))}
      </div>
    </div>
  );
}
