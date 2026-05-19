import { readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { MongoClient } from "mongodb";
import { normalizeFullCmsData } from "../src/lib/validation.js";

const currentFile = fileURLToPath(import.meta.url);
const serverRoot = path.resolve(path.dirname(currentFile), "..");
const workspaceRoot = path.resolve(serverRoot, "..");

await loadEnvFile();

const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";
const databaseName = process.env.MONGODB_DATABASE || "zumar_law_firm";
const collectionName = process.env.MONGODB_COLLECTION || "cms_content";
const sourceFile = process.argv[2]
  ? path.resolve(process.cwd(), process.argv[2])
  : path.join(workspaceRoot, "client", "data", "cms-content.json");

const client = new MongoClient(mongoUri, {
  maxPoolSize: Number(process.env.MONGODB_MAX_POOL_SIZE || 10),
  serverSelectionTimeoutMS: Number(process.env.MONGODB_SERVER_SELECTION_TIMEOUT_MS || 5000)
});

try {
  const raw = await readFile(sourceFile, "utf8");
  const normalized = normalizeFullCmsData(JSON.parse(raw));
  normalized.settings = {
    ...(normalized.settings || {}),
    updatedAt: new Date().toISOString()
  };

  await client.connect();
  const collection = client.db(databaseName).collection(collectionName);

  await collection.replaceOne(
    { _id: "singleton" },
    { _id: "singleton", ...normalized },
    { upsert: true }
  );

  console.log(`Seeded MongoDB ${databaseName}.${collectionName} from ${sourceFile}`);
} finally {
  await client.close();
}

async function loadEnvFile() {
  const envPath = path.join(serverRoot, ".env");

  try {
    const content = await readFile(envPath, "utf8");

    for (const line of content.split(/\r?\n/)) {
      const trimmed = line.trim();

      if (!trimmed || trimmed.startsWith("#")) {
        continue;
      }

      const equalsIndex = trimmed.indexOf("=");

      if (equalsIndex === -1) {
        continue;
      }

      const key = trimmed.slice(0, equalsIndex).trim();
      const value = trimmed.slice(equalsIndex + 1).trim().replace(/^["']|["']$/g, "");

      if (key && process.env[key] === undefined) {
        process.env[key] = value;
      }
    }
  } catch {
    // The script can still run with process environment variables only.
  }
}
