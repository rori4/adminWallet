import { Express } from "express";
import { getHealth } from './api/health';
import { sendBundle as sendFlashbotsBundle } from "./api/flashbots";

/**
 * Define all routes to be hosted by express server.
 * @param app Express server
 */
const initRoutes = (app: Express) => {
    app.get("/health", getHealth);
    app.post("/flashbots", sendFlashbotsBundle);
}

export default initRoutes;
