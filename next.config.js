const { PHASE_DEVELOPMENT_SERVER } = require('next/constants');

/** @type {(phase: string) => import('next').NextConfig} */
module.exports = (phase) => phase === PHASE_DEVELOPMENT_SERVER
  // Dev also loads *.dev.ts routes: the /api/hyphen proxy (worker.js does that job in production).;
