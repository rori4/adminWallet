import { Express } from "express";
import { getHealth } from './api/health';

/**
 * Define all routes to be hosted by express server.
 * @param app Express server
 */
const initRoutes = (app: Express) => {
    app.get("/health", getHealth);
}

export default initRoutes;
