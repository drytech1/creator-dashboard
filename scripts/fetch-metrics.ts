const CRON_SECRET = process.env.CRON_SECRET;
const API_URL = process.env.API_URL || "http://localhost:3000";

async function fetchMetrics() {
  if (!CRON_SECRET) {
    console.error("Error: CRON_SECRET environment variable is required");
    process.exit(1);
  }

  try {
    console.log("Fetching metrics for all users...");
    
    const response = await fetch(`${API_URL}/api/cron/fetch-metrics`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${CRON_SECRET}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Error:", data.error);
      process.exit(1);
    }

    console.log("✅ Success!");
    console.log(`Processed ${data.processed} users`);
    
    data.results.forEach((result: any) => {
      console.log(`\n${result.email}:`);
      console.log(`  Platforms: ${result.platforms.join(", ") || "none"}`);
      if (result.errors.length > 0) {
        console.log(`  Errors: ${result.errors.join(", ")}`);
      }
    });
  } catch (error) {
    console.error("Error fetching metrics:", error);
    process.exit(1);
  }
}

fetchMetrics();
