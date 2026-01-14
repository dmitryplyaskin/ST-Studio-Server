import type { Request, Response } from "express";

export interface PluginInfo {
  id: string;
  name: string;
  description: string;
}

export interface Plugin {
  init: (router: import("express").Router) => Promise<void>;
  exit: () => Promise<void>;
  info: PluginInfo;
}

export type Scope = "global" | "chat" | "character" | "group";

export type StatePayload = {
  revision: number;
  state: Record<string, unknown>;
};

export type RequestWithUser = Request & {
  user?: {
    profile?: { handle?: string };
    directories?: { root?: string };
  };
};

export type SSEClient = Response;
