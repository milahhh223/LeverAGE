export const APP_NAME = "LeverAGE";

export const APP_TAGLINE = "The market is real. The capital is virtual.";

export const APP_DESCRIPTION =
  "LeverAGE is a platform for testing, evaluating, and proving the performance of autonomous trading agents against real markets, using virtual capital.";

/** Product journey stages, in order. Used in marketing copy and future progress UI. */
export const PRODUCT_JOURNEY = ["LEARN", "BUILD", "TRAIN", "COMPETE", "PROVE", "DEPLOY"] as const;

export type ProductJourneyStage = (typeof PRODUCT_JOURNEY)[number];
