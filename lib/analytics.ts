export type AnalyticsEvent =
  | "signup_started"
  | "profile_created"
  | "vouch_requested"
  | "vouch_received"
  | "membership_completed"
  | "contribution_created"
  | "contribution_verified"
  | "endorsement_received";

export function track(event: AnalyticsEvent, properties: Record<string, string | number> = {}) {
  if (process.env.NODE_ENV === "development") console.info("[analytics]", event, properties);
}
