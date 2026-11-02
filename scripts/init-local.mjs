import { access, readFile, writeFile } from "node:fs/promises";
import { randomBytes } from "node:crypto";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const target = path.join(root, "backend/.env");
try {
  await access(target);
  console.log("Existing backend configuration preserved.");
} catch (error) {
  if (error.code !== "ENOENT") throw error;
  const template = await readFile(path.join(root, "backend/.env.example"), "utf8");
  const values = Object.fromEntries(template.split(/\r?\n/).filter(line => /^[A-Z][A-Z0-9_]*=/.test(line)).map(line => {
    const index = line.indexOf("=");
    return [line.slice(0, index), line.slice(index + 1)];
  }));
  for (const name of ["JWT_SECRET", "COOKIE_SECRET", "ORDER_ACCESS_SECRET", "INQUIRY_PROXY_SECRET"]) values[name] = randomBytes(32).toString("hex");
  values.S3_ACCESS_KEY_ID = `trophy-${randomBytes(6).toString("hex")}`;
  values.S3_SECRET_ACCESS_KEY = randomBytes(32).toString("hex");
  values.RUSTFS_ACCESS_KEY = values.S3_ACCESS_KEY_ID;
  values.RUSTFS_SECRET_KEY = values.S3_SECRET_ACCESS_KEY;
  await writeFile(target, Object.entries(values).map(([key, value]) => `${key}=${value}`).join("\n") + "\n", { mode: 0o600, flag: "wx" });
  console.log("Local backend configuration created with random secrets. Values were not printed.");
}
