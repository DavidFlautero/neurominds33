export const TASK_STATES = [
  "DETECTED",
  "QUOTED",
  "APPROVED",
  "IN_PROGRESS",
  "DELIVERED",
  "VALIDATED_OK",
  "VALIDATED_PARTIAL",
  "VALIDATED_FAILED",
  "CLOSED",
] as const;

export type TaskState = (typeof TASK_STATES)[number];
