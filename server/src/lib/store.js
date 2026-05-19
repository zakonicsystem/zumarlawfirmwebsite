import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { MongoClient } from "mongodb";
import { normalizeFullCmsData } from "./validation.js";

const currentFile = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFile);
const serverRoot = path.resolve(currentDirectory, "../..");
const workspaceRoot = path.resolve(serverRoot, "..");
const fallbackClientData = path.join(workspaceRoot, "client", "data", "cms-content.json");
const cmsDocumentId = "singleton";

let clientPromise = null;
let dbPromise = null;

export function resolveDataFile(configuredPath) {
  if (configuredPath) {
    return path.isAbsolute(configuredPath) ? configuredPath : path.resolve(serverRoot, configuredPath);
  }

  return path.join(serverRoot, "data", "cms-content.json");
}

export function createStore(config) {
  if (config.mongoUri) {
    return createMongoStore(config);
  }

  return createFileStore(config.dataFile);
}

export function createFileStore(dataFile) {
  return {
    mode: "file",
    async health() {
      await ensureDataFile(dataFile);
      return { ok: true, mode: "file", dataFile };
    },
    async read() {
      return readFileCmsData(dataFile);
    },
    async write(data) {
      return writeFileCmsData(dataFile, data);
    },
    async update(updater) {
      const current = await readFileCmsData(dataFile);
      const next = await updater(current);
      return writeFileCmsData(dataFile, next);
    },
    async close() {}
  };
}

export function createMongoStore(config) {
  const collectionName = config.mongoCollection || "cms_content";

  return {
    mode: "mongodb",
    async health() {
      const db = await getDatabase(config);
      await db.command({ ping: 1 });
      return { ok: true, mode: "mongodb", database: db.databaseName, collection: collectionName };
    },
    async read() {
      const collection = await getCmsCollection(config, collectionName);
      let document = await collection.findOne({ _id: cmsDocumentId });

      if (!document) {
        document = await seedMongoCmsData(config, collection);
      }

      return normalizeFullCmsData(withoutMongoId(document));
    },
    async write(data) {
      const collection = await getCmsCollection(config, collectionName);
      const normalized = withUpdatedAt(normalizeFullCmsData(data));

      await collection.replaceOne(
        { _id: cmsDocumentId },
        { _id: cmsDocumentId, ...normalized },
        { upsert: true }
      );

      return normalized;
    },
    async update(updater) {
      const current = await this.read();
      const next = await updater(current);
      return this.write(next);
    },
    async close() {
      if (clientPromise) {
        const client = await clientPromise;
        await client.close();
        clientPromise = null;
        dbPromise = null;
      }
    }
  };
}

async function getCmsCollection(config, collectionName) {
  const db = await getDatabase(config);
  const collection = db.collection(collectionName);

  await collection.createIndex({ "services.slug": 1 });
  await collection.createIndex({ "blogs.slug": 1 });
  await collection.createIndex({ "news.slug": 1 });

  return collection;
}

async function getDatabase(config) {
  if (!dbPromise) {
    dbPromise = getClient(config).then((client) => client.db(config.mongoDatabase || "zumar_law_firm"));
  }

  return dbPromise;
}

async function getClient(config) {
  if (!clientPromise) {
    const client = new MongoClient(config.mongoUri, {
      maxPoolSize: Number(config.mongoMaxPoolSize || 10),
      serverSelectionTimeoutMS: Number(config.mongoServerSelectionTimeoutMs || 5000)
    });
    clientPromise = client.connect();
  }

  return clientPromise;
}

async function seedMongoCmsData(config, collection) {
  const seed = withUpdatedAt(await readSeedData(config.dataFile));
  await collection.replaceOne(
    { _id: cmsDocumentId },
    { _id: cmsDocumentId, ...seed },
    { upsert: true }
  );
  return { _id: cmsDocumentId, ...seed };
}

async function readSeedData(dataFile) {
  try {
    await ensureDataFile(dataFile);
    const raw = await fs.readFile(dataFile, "utf8");
    return normalizeFullCmsData(JSON.parse(raw));
  } catch {
    return normalizeFullCmsData(await readFallbackData());
  }
}

async function readFileCmsData(dataFile) {
  await ensureDataFile(dataFile);
  const raw = await fs.readFile(dataFile, "utf8");
  return normalizeFullCmsData(JSON.parse(raw));
}

async function writeFileCmsData(dataFile, data) {
  const normalized = withUpdatedAt(normalizeFullCmsData(data));

  await fs.mkdir(path.dirname(dataFile), { recursive: true });
  await fs.writeFile(dataFile, `${JSON.stringify(normalized, null, 2)}\n`, "utf8");
  return normalized;
}

async function ensureDataFile(dataFile) {
  await fs.mkdir(path.dirname(dataFile), { recursive: true });

  try {
    await fs.access(dataFile);
    return;
  } catch {
    const fallback = await readFallbackData();
    await fs.writeFile(dataFile, `${JSON.stringify(fallback, null, 2)}\n`, "utf8");
  }
}

async function readFallbackData() {
  try {
    const raw = await fs.readFile(fallbackClientData, "utf8");
    return JSON.parse(raw);
  } catch {
    return {
      settings: {
        updatedAt: new Date().toISOString()
      },
      categories: [],
      homeSections: [],
      branches: [],
      serviceAreas: [],
      services: [],
      blogs: [],
      news: [],
      appointments: []
    };
  }
}

function withUpdatedAt(data) {
  return {
    ...data,
    settings: {
      ...(data.settings || {}),
      updatedAt: new Date().toISOString()
    }
  };
}

function withoutMongoId(document) {
  const { _id, ...data } = document || {};
  return data;
}
