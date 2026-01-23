import { UserProgress } from "../types";

const STORAGE_KEY = "last_mile_progress_v1";

const DEFAULT_PROGRESS: UserProgress = {
  viewedMilestones: [],
  completedHelpSteps: [],
  lastActive: Date.now(),
};

export const loadProgress = (): UserProgress => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return DEFAULT_PROGRESS;
    return JSON.parse(stored) as UserProgress;
  } catch (e) {
    console.error("Failed to load progress", e);
    return DEFAULT_PROGRESS;
  }
};

export const saveProgress = (progress: UserProgress): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      ...progress,
      lastActive: Date.now()
    }));
  } catch (e) {
    console.error("Failed to save progress", e);
  }
};

export const markMilestoneViewed = (id: string): void => {
  const current = loadProgress();
  if (!current.viewedMilestones.includes(id)) {
    current.viewedMilestones.push(id);
    saveProgress(current);
  }
};

export const markHelpStepCompleted = (stepId: string): void => {
  const current = loadProgress();
  if (!current.completedHelpSteps.includes(stepId)) {
    current.completedHelpSteps.push(stepId);
    saveProgress(current);
  }
};