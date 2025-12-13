import { MongoClient } from "https://deno.land/x/mongo@v0.32.0/mod.ts";

const client = new MongoClient();
await client.connect(Deno.env.get("MONGO_URI"));

const db = client.database("DesignIQ");
const imageHistory = db.collection("ImageHistory");

export async function storeImageHistory(
  userEmail: string,
  prompt: string,
  imageUrl: string,
) {
  try {
    if (!userEmail || !prompt || !imageUrl) {
      return {
        success: false,
        error: "Missing required fields (userEmail, prompt, imageUrl)",
      };
    }

    const time = new Date();

    // Check if DB connection exists
    if (!imageHistory) {
      return {
        success: false,
        error: "Database connection error: imageHistory collection is undefined",
      };
    }

    // Find existing user history document
    let existing;
    try {
      existing = await imageHistory.findOne({ userEmail });
    } catch (err) {
      return {
        success: false,
        error: "Failed to query database",
        details: err instanceof Error ? err.message : String(err),
      };
    }

    // If user does not exist, insert new record
    if (!existing) {
      try {
        await imageHistory.insertOne({
          userEmail,
          history: [{ prompt, imageUrl, time }],
        });
      } catch (err) {
        return {
          success: false,
          error: "Failed to insert new history record",
          details: err instanceof Error ? err.message : String(err),
        };
      }

      return { success: true };
    }

    // If user exists, update
    try {
      await imageHistory.updateOne(
        { userEmail },
        { $push: { history: { prompt, imageUrl, time } } },
      );
    } catch (err) {
      return {
        success: false,
        error: "Failed to update existing history record",
        details: err instanceof Error ? err.message : String(err),
      };
    }

    return { success: true };

  } catch (err) {
    // Catch any unexpected error
    return {
      success: false,
      error: "Unexpected server error",
      details: err instanceof Error ? err.message : String(err),
    };
  }
}

export async function getImageHistory(userEmail: string) {
  const userData = await imageHistory.findOne({ userEmail });

  if (!userData) {
    return [];
  }

  return userData.history;
}
