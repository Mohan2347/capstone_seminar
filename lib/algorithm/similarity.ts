/**
 * Computes cosine similarity between two embedding vectors.
 * Returns a value between -1 and 1 (practically 0–1 for text embeddings).
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length || a.length === 0) return 0;

  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Normalizes a score from [-1, 1] to [0, 1].
 */
export function normalizeScore(score: number): number {
  return (score + 1) / 2;
}

/**
 * Computes skills overlap score between student skills and internship required skills.
 * Acts as a hard-constraint bonus on top of embedding similarity.
 */
export function skillsOverlapScore(
  studentSkills: string[],
  requiredSkills: string[]
): number {
  if (requiredSkills.length === 0) return 1;

  const studentSkillsLower = new Set(
    studentSkills.map((s) => s.toLowerCase().trim())
  );
  const matched = requiredSkills.filter((s) =>
    studentSkillsLower.has(s.toLowerCase().trim())
  ).length;

  return matched / requiredSkills.length;
}

/**
 * GPA eligibility score: 1 if eligible, scaled penalty otherwise.
 */
export function gpaScore(
  studentGpa: number | null | undefined,
  requiredGpa: number | null | undefined
): number {
  if (!requiredGpa) return 1;
  if (!studentGpa) return 0.5; // unknown GPA — neutral
  if (studentGpa >= requiredGpa) return 1;
  // Partial credit: 0.5 * (studentGpa / requiredGpa)
  return 0.5 * (studentGpa / requiredGpa);
}
