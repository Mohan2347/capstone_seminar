import { generateEmbedding } from "@/lib/gemini";
import type { Student, Internship } from "@prisma/client";

type StudentJson = {
  skills: string[];
  experience: { title: string; company: string; description?: string }[];
  preferredRoles: string[];
  preferredIndustries: string[];
  preferredLocations: string[];
  workTypes: string[];
  personality: Record<string, number>;
};

type InternshipJson = {
  requiredSkills: string[];
  preferredSkills: string[];
};

/**
 * Builds a rich text representation of a student profile for embedding.
 * Mirrors what BERT would receive as input.
 */
export function buildStudentText(student: Student): string {
  const s = student as unknown as StudentJson & typeof student;
  const skills = (s.skills as string[]) ?? [];
  const experience = (s.experience as StudentJson["experience"]) ?? [];
  const preferredRoles = (s.preferredRoles as string[]) ?? [];
  const preferredIndustries = (s.preferredIndustries as string[]) ?? [];
  const preferredLocations = (s.preferredLocations as string[]) ?? [];
  const workTypes = (s.workTypes as string[]) ?? [];
  const personality = (s.personality as Record<string, number>) ?? {};

  const parts: string[] = [
    `Student profile: ${student.name}`,
    student.major ? `Major: ${student.major}` : "",
    student.university ? `University: ${student.university}` : "",
    student.gpa ? `GPA: ${student.gpa}` : "",
    student.bio ? `Bio: ${student.bio}` : "",
    skills.length > 0 ? `Skills: ${skills.join(", ")}` : "",
    preferredRoles.length > 0
      ? `Preferred roles: ${preferredRoles.join(", ")}`
      : "",
    preferredIndustries.length > 0
      ? `Preferred industries: ${preferredIndustries.join(", ")}`
      : "",
    preferredLocations.length > 0
      ? `Preferred locations: ${preferredLocations.join(", ")}`
      : "",
    workTypes.length > 0 ? `Work types: ${workTypes.join(", ")}` : "",
    experience.length > 0
      ? `Experience: ${experience
          .map((e) => `${e.title} at ${e.company}${e.description ? ": " + e.description : ""}`)
          .join("; ")}`
      : "",
    Object.keys(personality).length > 0
      ? `Personality traits: ${Object.entries(personality)
          .map(([k, v]) => `${k}=${v}`)
          .join(", ")}`
      : "",
  ].filter(Boolean);

  return parts.join(". ");
}

/**
 * Builds a rich text representation of an internship for embedding.
 */
export function buildInternshipText(internship: Internship): string {
  const i = internship as unknown as InternshipJson & typeof internship;
  const requiredSkills = (i.requiredSkills as string[]) ?? [];
  const preferredSkills = (i.preferredSkills as string[]) ?? [];

  const parts: string[] = [
    `Internship: ${internship.title}`,
    internship.industry ? `Industry: ${internship.industry}` : "",
    internship.description ? `Description: ${internship.description}` : "",
    requiredSkills.length > 0
      ? `Required skills: ${requiredSkills.join(", ")}`
      : "",
    preferredSkills.length > 0
      ? `Preferred skills: ${preferredSkills.join(", ")}`
      : "",
    internship.location ? `Location: ${internship.location}` : "",
    internship.workType ? `Work type: ${internship.workType}` : "",
    internship.duration ? `Duration: ${internship.duration}` : "",
    internship.requiredGpa ? `Minimum GPA: ${internship.requiredGpa}` : "",
  ].filter(Boolean);

  return parts.join(". ");
}

export async function computeStudentEmbedding(
  student: Student
): Promise<number[]> {
  const text = buildStudentText(student);
  return generateEmbedding(text);
}

export async function computeInternshipEmbedding(
  internship: Internship
): Promise<number[]> {
  const text = buildInternshipText(internship);
  return generateEmbedding(text);
}
