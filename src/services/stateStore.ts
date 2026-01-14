import fs from "node:fs/promises";
import path from "node:path";
import type { StatePayload } from "../types";
import { createDefaultState, normalizeStoredState } from "../utils/state";

export async function readStateFile(filePath: string): Promise<StatePayload> {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    const parsed = JSON.parse(raw);
    return normalizeStoredState(parsed);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return { revision: 0, state: createDefaultState() };
    }
    throw error;
  }
}

export async function writeStateFile(
  filePath: string,
  payload: StatePayload
): Promise<void> {
  const dirPath = path.dirname(filePath);
  await fs.mkdir(dirPath, { recursive: true });
  const tempPath = `${filePath}.tmp`;
  const contents = JSON.stringify(payload, null, 2);
  await fs.writeFile(tempPath, contents, "utf8");
  await fs.rename(tempPath, filePath);
}
