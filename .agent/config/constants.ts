/** GST rate applied to all service quotes in India (18%). */
export const GST_RATE = 0.18;

/** Number of hours a generated quote remains valid before expiry. */
export const QUOTE_VALIDITY_HOURS = 48;

/** Minimum AI confidence score required to proceed without human diagnosis review. */
export const DIAGNOSIS_CONFIDENCE_THRESHOLD = 0.70;

/** Maximum number of agent-to-agent routing hops allowed per session. */
export const MAX_AGENT_HOPS = 4;

/** Radius in kilometres within which providers are searched for a job. */
export const PROVIDER_SEARCH_RADIUS_KM = 20;

/** Minimum provider star rating (out of 5) required to be matched to a job. */
export const MIN_PROVIDER_RATING = 3.5;

/** Number of automated support attempts before escalating to a human agent. */
export const MAX_ESCALATION_ATTEMPTS = 3;

/** Maximum number of photos a user can upload per job. */
export const MAX_PHOTOS_PER_JOB = 3;

/** Maximum number of time slots shown to the user during scheduling. */
export const MAX_SLOTS_SHOWN = 3;

/** Claude model identifier used for all AI interactions. */
export const CLAUDE_MODEL = 'claude-sonnet-4-6';
