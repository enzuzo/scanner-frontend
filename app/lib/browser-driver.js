// Not user-controllable — scanner-proxy's browser driver choice (Playwright vs
// the experimental patchright fork) is an ops/debugging knob, not something to
// expose in the scan form. Defaults to Playwright (undefined — route.ts omits
// the param entirely, matching scanner-proxy's own default) unless explicitly
// overridden via SCANNER_BROWSER_DRIVER.

/** @param {Record<string, string | undefined>} env @returns {"patchright" | undefined} */
export function resolveBrowserDriver(env) {
    return env.SCANNER_BROWSER_DRIVER === 'patchright' ? 'patchright' : undefined;
}
