export const MODULE_NAME = "[ST-Studio-Server]";
export const STATE_VERSION = 1;
export const SSE_KEEPALIVE_MS = 25_000;

export const scopeDirMap = {
  chat: "chats",
  character: "characters",
  group: "groups",
} as const;
