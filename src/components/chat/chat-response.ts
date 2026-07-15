export type ChatAssistantResponsePurpose =
  | "welcome"
  | "answer"
  | "recommendation"
  | "system"
  | "stopped";

export type ChatResponseFeedbackPolicy = "none" | "rateable";

export function getChatResponseFeedbackPolicy(
  purpose: ChatAssistantResponsePurpose,
): ChatResponseFeedbackPolicy {
  return purpose === "answer" || purpose === "recommendation"
    ? "rateable"
    : "none";
}
