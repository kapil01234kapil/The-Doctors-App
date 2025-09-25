// lib/generateUniqueReferralCode.js

import crypto from "crypto";
import referralModel from "@/models/referralModels";

/**
 * Generate a short random referral code.
 * Uses hex string from crypto.randomBytes, then trims & uppercases it.
 * Example output: "A1B2C3D4"
 *
 * @param {number} length number of characters wanted (default 8)
 * @returns {string} generated code
 */
function generateReferralCode(length = 8) {
  // each random byte produces 2 hex characters, so we need ceil(length/2) bytes
  const bytes = Math.ceil(length / 2);
  return crypto
    .randomBytes(bytes)        // Buffer with cryptographically-strong random bytes
    .toString("hex")          // convert to hex string (2 chars per byte)
    .slice(0, length)         // trim to requested length (in chars)
    .toUpperCase();           // uppercase for consistency/readability
}

/**
 * Generate a referral code that is guaranteed unique (checked against DB).
 *
 * This function will:
 *  - generate a candidate,
 *  - check the DB to make sure the code doesn't already exist,
 *  - return the code if unique, otherwise retry up to maxAttempts.
 *
 * NOTE: This checks both possible field names in your DB:
 * - "referralCode" and (if your schema still uses the typo) "referalCode".
 *
 * @param {number} length how many chars the code should be (default 8)
 * @param {number} maxAttempts how many times to try before throwing (default 100)
 * @returns {Promise<string>} unique referral code
 */
export async function generateUniqueReferralCode(length = 8, maxAttempts = 100) {
  let attempts = 0;

  while (attempts < maxAttempts) {
    attempts += 1;

    const candidate = generateReferralCode(length);

    // Query DB to see if this candidate exists already.
    // We check both "referralCode" and "referalCode" to be safe.
    const found = await referralModel
      .findOne({ $or: [{ referralCode: candidate }, { referalCode: candidate }] })
      .lean()
      .exec();

    if (!found) {
      // Not found in DB → unique, return it
      return candidate;
    }

    // If found, loop and try again (another candidate)
  }

  // If we exhaust attempts, throw — caller should handle this
  throw new Error(
    `Could not generate a unique referral code after ${maxAttempts} attempts`
  );
}
