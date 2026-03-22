import { db } from "@/lib/db";
import { computeReward } from "./collaborative";
import type { FeedbackAction } from "@prisma/client";

/**
 * Reinforcement Learning weight updater.
 *
 * Uses a gradient-based policy update:
 *   w_content  += lr * reward * (contentScore - hybridScore)
 *   w_collab   += lr * reward * (collabScore  - hybridScore)
 * Then re-normalizes weights to sum to 1.
 *
 * This approximates a REINFORCE-style policy gradient where the hybrid
 * scoring function is the policy and the reward is the user signal.
 */
export async function updateWeightsFromFeedback(
  studentId: string,
  internshipId: string,
  action: FeedbackAction,
  rating?: number | null
): Promise<void> {
  const reward = computeReward(action, rating);

  // Fetch the existing recommendation scores
  const recommendation = await db.recommendation.findUnique({
    where: { studentId_internshipId: { studentId, internshipId } },
  });

  // Get or create model weights
  let weights = await db.modelWeights.findFirst();
  if (!weights) {
    weights = await db.modelWeights.create({
      data: {
        contentWeight: 0.6,
        collaborativeWeight: 0.4,
        threshold: 0.3,
        topK: 10,
        learningRate: 0.01,
      },
    });
  }

  if (!recommendation) return;

  const lr = weights.learningRate;
  const { contentScore, collaborativeScore, hybridScore } = recommendation;

  // Policy gradient update
  let newContentWeight =
    weights.contentWeight + lr * reward * (contentScore - hybridScore);
  let newCollabWeight =
    weights.collaborativeWeight +
    lr * reward * (collaborativeScore - hybridScore);

  // Clamp to reasonable bounds [0.1, 0.9]
  newContentWeight = Math.max(0.1, Math.min(0.9, newContentWeight));
  newCollabWeight = Math.max(0.1, Math.min(0.9, newCollabWeight));

  // Normalize to sum to 1
  const total = newContentWeight + newCollabWeight;
  newContentWeight = newContentWeight / total;
  newCollabWeight = newCollabWeight / total;

  // Adaptive threshold: lower slightly on positive reward, raise on negative
  let newThreshold = weights.threshold;
  if (reward > 0.5) {
    newThreshold = Math.max(0.1, weights.threshold - lr * 0.1);
  } else if (reward < 0.2) {
    newThreshold = Math.min(0.7, weights.threshold + lr * 0.1);
  }

  await db.modelWeights.update({
    where: { id: weights.id },
    data: {
      contentWeight: newContentWeight,
      collaborativeWeight: newCollabWeight,
      threshold: newThreshold,
    },
  });
}
