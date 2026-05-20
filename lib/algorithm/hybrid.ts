import { db } from "@/lib/db";
import { cosineSimilarity, skillsOverlapScore, gpaScore } from "./similarity";
import { collaborativeScore } from "./collaborative";
import {
  computeStudentEmbedding,
  computeInternshipEmbedding,
} from "./embeddings";
import type { Student, Internship } from "@prisma/client";

export interface ScoredInternship {
  internship: Internship & { company: { name: string; logoUrl: string | null } };
  contentScore: number;
  collaborativeScore: number;
  hybridScore: number;
  rank: number;
}

/**
 * Retrieves or computes the embedding for a student.
 */
async function getStudentEmbedding(student: Student): Promise<number[]> {
  if (student.embedding) return student.embedding as number[];
  try {
    const embedding = await computeStudentEmbedding(student);
    await db.student.update({
      where: { id: student.id },
      data: { embedding, embeddingUpdatedAt: new Date() },
    });
    return embedding;
  } catch (error) {
    console.error("Failed to compute student embedding:", error);
    return new Array(768).fill(0); // Fallback to avoid breaking
  }
}

/**
 * Retrieves or computes the embedding for an internship.
 */
async function getInternshipEmbedding(
  internship: Internship
): Promise<number[]> {
  if (internship.embedding) return internship.embedding as number[];
  try {
    const embedding = await computeInternshipEmbedding(internship);
    await db.internship.update({
      where: { id: internship.id },
      data: { embedding, embeddingUpdatedAt: new Date() },
    });
    return embedding;
  } catch (error) {
    console.error(`Failed to compute internship embedding for ${internship.id}:`, error);
    return new Array(768).fill(0); // Fallback to avoid breaking
  }
}

/**
 * Computes the content-based score for a student-internship pair.
 * Combines: embedding cosine similarity + skills overlap + GPA eligibility.
 */
async function computeContentScore(
  student: Student,
  internship: Internship
): Promise<number> {
  const [studentEmb, internshipEmb] = await Promise.all([
    getStudentEmbedding(student),
    getInternshipEmbedding(internship),
  ]);

  const embeddingScore = (cosineSimilarity(studentEmb, internshipEmb) + 1) / 2;

  const skills = (student.skills as string[]) ?? [];
  const required = (internship.requiredSkills as string[]) ?? [];
  const skillScore = skillsOverlapScore(skills, required);
  const gScore = gpaScore(student.gpa, internship.requiredGpa);

  // Weighted combination: 60% embedding, 25% skills, 15% GPA
  return 0.6 * embeddingScore + 0.25 * skillScore + 0.15 * gScore;
}

/**
 * Main recommendation engine.
 * Returns top-K ranked internships for a student.
 */
export async function generateRecommendations(
  studentId: string,
  options?: { forceRefresh?: boolean }
): Promise<ScoredInternship[]> {
  const [student, internships, weights] = await Promise.all([
    db.student.findUniqueOrThrow({ where: { id: studentId } }),
    db.internship.findMany({
      where: { isActive: true },
      include: { company: { select: { name: true, logoUrl: true } } },
    }),
    db.modelWeights.findFirst(),
  ]);

  const modelWeights = weights ?? {
    contentWeight: 0.6,
    collaborativeWeight: 0.4,
    threshold: 0.3,
    topK: 10,
  };

  const scored: Omit<ScoredInternship, "rank">[] = [];

  // Compute scores in batches to avoid rate limiting
  for (const internship of internships) {
    const [cScore, cfScore] = await Promise.all([
      computeContentScore(student, internship),
      collaborativeScore(studentId, internship.id),
    ]);

    const hybrid =
      modelWeights.contentWeight * cScore +
      modelWeights.collaborativeWeight * cfScore;

    if (hybrid >= modelWeights.threshold) {
      scored.push({
        internship,
        contentScore: cScore,
        collaborativeScore: cfScore,
        hybridScore: hybrid,
      });
    }
  }

  // Sort descending by hybrid score
  scored.sort((a, b) => b.hybridScore - a.hybridScore);

  // Select top-K
  const topK = scored.slice(0, modelWeights.topK);

  // Persist recommendations to DB (upsert)
  await Promise.all(
    topK.map(async (item, idx) => {
      await db.recommendation.upsert({
        where: {
          studentId_internshipId: {
            studentId,
            internshipId: item.internship.id,
          },
        },
        create: {
          studentId,
          internshipId: item.internship.id,
          contentScore: item.contentScore,
          collaborativeScore: item.collaborativeScore,
          hybridScore: item.hybridScore,
          rank: idx + 1,
        },
        update: {
          contentScore: item.contentScore,
          collaborativeScore: item.collaborativeScore,
          hybridScore: item.hybridScore,
          rank: idx + 1,
        },
      });
    })
  );

  return topK.map((item, idx) => ({ ...item, rank: idx + 1 }));
}
