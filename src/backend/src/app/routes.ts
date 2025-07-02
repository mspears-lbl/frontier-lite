import { Router, Request, Response } from 'express';
import passport from 'passport';
import * as handlers from './handlers';
import { rateLimiterUI } from '../utils/rate-limiter';

export const router = Router();

/** Handles calls for health checks */
router.get(
    '/health',
    handlers.healthCheckHandler
);

// router.post(
//     '/threat-data',
//     handlers.GetThreatDataHandler.handleRequest
// );

router.get(
    '/threat-data/:z/:x/:y.mvt/:id',
    // passport.authenticate('jwt', {session: false}),
    handlers.GetThreatDataHandler.handleRequest
);

router.get(
    '/threat-info/:z/:x/:y.mvt',
    // passport.authenticate('jwt', {session: false}),
    handlers.GetThreatInfoHandler.handleRequest
);

router.post(
    '/threats-in-bounds',
    // passport.authenticate('jwt', {session: false}),
    handlers.getThreatsInBounds
);

router.post(
    '/find-locations',
    // passport.authenticate('jwt', {session: false}),
    handlers.GetLocationsHandler.handleRequest
);