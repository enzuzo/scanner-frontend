// Local-only escape hatch so `next dev` can run against a real backend (e.g.
// staging) without Google OAuth credentials configured. Never takes effect in
// a production build/start, even if LOCAL_AUTH_BYPASS is set by mistake.

/** @param {Record<string, string | undefined>} env @returns {boolean} */
export function isLocalAuthBypassEnabled(env) {
    return env.LOCAL_AUTH_BYPASS === 'true' && env.NODE_ENV !== 'production';
}
