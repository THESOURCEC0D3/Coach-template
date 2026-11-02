import { readFile, writeFile, chmod } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const parse = text => Object.fromEntries(text.split(/\r?\n/).filter(line => /^[A-Z][A-Z0-9_]*=/.test(line)).map(line => {
  const index = line.indexOf("=");
  return [line.slice(0, index), line.slice(index + 1).replace(/^(["'])(.*)\1$/, "$2")];
}));
try {
  const backend = parse(await readFile(path.join(root, "backend/.env"), "utf8"));
  const seeded = JSON.parse(await readFile(path.join(root, "backend/.local-storefront.json"), "utf8"));
  if (!seeded.publishable_key || !backend.INQUIRY_PROXY_SECRET || !backend.ORDER_ACCESS_SECRET) {
    throw new Error("Run the backend bootstrap first; required local configuration is missing.");
  }
  let existing = "";
  try { existing = await readFile(path.join(root, ".env.local"), "utf8"); } catch (error) { if (error.code !== "ENOENT") throw error; }
  const values = {
    SITE_URL: "http://localhost:3000",
    MEDUSA_BACKEND_URL: "http://localhost:9000",
    MEDUSA_PUBLISHABLE_KEY: seeded.publishable_key,
    INQUIRY_PROXY_SECRET: backend.INQUIRY_PROXY_SECRET,
    ORDER_ACCESS_SECRET: backend.ORDER_ACCESS_SECRET,
    ...parse(existing),
  };
  // Refresh only service-generated keys; preserve user-owned URLs and other entries.
  values.MEDUSA_PUBLISHABLE_KEY = seeded.publishable_key;
  values.INQUIRY_PROXY_SECRET = backend.INQUIRY_PROXY_SECRET;
  values.ORDER_ACCESS_SECRET = backend.ORDER_ACCESS_SECRET;
  await writeFile(path.join(root, ".env.local"), Object.entries(values).map(([key, value]) => `${key}=${value}`).join("\n") + "\n", { mode: 0o600 });
  await chmod(path.join(root, ".env.local"), 0o600);
  console.log("Local storefront configuration saved. No secret values were printed.");
} catch (error) {
  console.error(error.code === "ENOENT" ? "Start and bootstrap the local Medusa backend before preparing the storefront." : error.message);
  process.exitCode = 1;
}
