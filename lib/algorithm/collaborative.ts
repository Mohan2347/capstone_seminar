import { db } from "@/lib/db";
import { FeedbackAction } from "@prisma/client";

// Reward values for reinforcement learning
const ACTION_REWARD: Record<FeedbackAction, number> = {
  APPLIED: 1.0,
  SAVED: 0.7,
  VIEWED: 0.3,
  DISMISSED: -0.5,
};

/**
 * Computes a collaborative filtering score for a student-internship pair.
 *
 * Algorithm:
 * 1. Find other students with similar feedback patterns (user-based CF)
 * 2. Weight their interactions by profile similarity
 * 3. Aggregate weighted scores for the target internship
 *
 * Returns a score in [0, 1].
 */
export async function collaborativeScore(
  studentId: string,
  internshipId: string
): Promise<number> {
  // Get all feedback for the target internship from other students
  const internshipFeedback = await db.feedback.findMany({
    where: {
      internshipId,
      studentId: { not: studentId },
    },
    select: {
      studentId: true,
      action: true,
      rating: true,
    },
  });

  if (internshipFeedback.length === 0) return 0;

  // Get the current student's feedback history to find similar users
  const studentFeedback = await db.feedback.findMany({
    where: { studentId },
    select: { internshipId: true, action: true },
  });

  const studentInteractions = new Map(
    studentFeedback.map((f) => [f.internshipId, ACTION_REWARD[f.action]])
  );

  // Group feedback by peer student
  const peerMap = new Map<string, { action: FeedbackAction; rating: number | null }[]>();
  for (const f of internshipFeedback) {
    if (!peerMap.has(f.studentId)) peerMap.set(f.studentId, []);
    peerMap.get(f.studentId)!.push({ action: f.action, rating: f.rating });
  }

  // For each peer, compute similarity via shared internship interactions
  let weightedSum = 0;
  let totalWeight = 0;

  for (const [peerId, peerActions] of peerMap) {
    const peerFeedback = await db.feedback.findMany({
      where: { studentId: peerId },
      select: { internshipId: true, action: true },
    });

    // Jaccard-like similarity on shared internships
    const peerInteractions = new Map(
      peerFeedback.map((f) => [f.internshipId, ACTION_REWARD[f.action]])
    );

    const sharedInternships = [...studentInteractions.keys()].filter((id) =>
      peerInteractions.has(id)
    );

    let similarity = 0;
    if (sharedInternships.length > 0) {
      const dotProduct = sharedInternships.reduce(
        (sum, id) =>
          sum + studentInteractions.get(id)! * peerInteractions.get(id)!,
        0
      );
      const normA = Math.sqrt(
        [...studentInteractions.values()].reduce((s, v) => s + v * v, 0)
      );
      const normB = Math.sqrt(
        [...peerInteractions.values()].reduce((s, v) => s + v * v, 0)
      );
      similarity = normA > 0 && normB > 0 ? dotProduct / (normA * normB) : 0;
    }

    // Compute peer's average reward for this internship
    const peerReward =
      peerActions.reduce((sum, a) => {
        const reward = a.rating != null ? a.rating / 5 : ACTION_REWARD[a.action];
        return sum + reward;
      }, 0) / peerActions.length;

    const weight = Math.max(similarity, 0.01); // floor to include new data
    weightedSum += weight * peerReward;
    totalWeight += weight;
  }

  if (totalWeight === 0) return 0;
  const raw = weightedSum / totalWeight;
  // Normalize to [0, 1]
  return Math.max(0, Math.min(1, (raw + 1) / 2));
}

/**
 * Computes the RL reward signal for a feedback action + optional rating.
 */
export function computeReward(
  action: FeedbackAction,
  rating?: number | null
): number {
  if (rating != null) return rating / 5;
  return (ACTION_REWARD[action] + 1) / 2; // normalize to [0,1]
}
