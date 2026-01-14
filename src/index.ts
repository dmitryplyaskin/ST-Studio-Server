import type { Router } from "express";
import { registerEventRoutes } from "./routes/events";
import { registerStateRoutes } from "./routes/state";
import { logger } from "./services/logger";
import { SseHub } from "./services/sseHub";
import type { Plugin, PluginInfo } from "./types";

const sseHub = new SseHub();

/**
 * Initialize the plugin.
 * @param router Express Router
 */
export async function init(router: Router): Promise<void> {
  registerEventRoutes(router, sseHub);
  registerStateRoutes(router);

  logger.info("Plugin loaded!");
}

export async function exit(): Promise<void> {
  sseHub.closeAll();
  logger.warn("Plugin exited");
}

export const info: PluginInfo = {
  id: "st-studio",
  name: "ST Studio Server",
  description: "Server plugin for ST Studio state storage.",
};

const plugin: Plugin = {
  init,
  exit,
  info,
};

export default plugin;
