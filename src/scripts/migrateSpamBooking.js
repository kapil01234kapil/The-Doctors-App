
import {connectDB} from "../lib/db.js"
import userModels from "../models/userModels.js"
const migrateSpamBooking = async () => {
  await connectDB();

  // Find users where spamBooking is a number (old structure)
  const result = await userModels.updateMany(
    { $expr: { $eq: [{ $type: "$spamBooking" }, "number"] } },
    [
      {
        $set: {
          spamBooking: {
            count: "$spamBooking", // keep the old number as count
            firstAttemptAt: null,
          },
        },
      },
    ]
  );

  console.log(`Updated ${result.modifiedCount} users`);
  process.exit();
};

migrateSpamBooking();
