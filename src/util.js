export const downloadFile = (content, title) => {
    var element = document.createElement("a");
    element.setAttribute("href", content);
    element.setAttribute("download", title);
    element.setAttribute("target", "_blank");
    element.setAttribute("rel", "noopener noreferrer");

    element.style.display = "none";
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  };

const VIDEO_INTERACTION_STORAGE_KEY = "videoInteractionPendingCounts";

const safeParseCounts = (value) => {
  if (!value) return {};
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch (error) {
    return {};
  }
};

const normalizeCount = (value) => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric) || numeric < 0) return 0;
  return Math.floor(numeric);
};

const writePendingCounts = (counts) => {
  const serialized = JSON.stringify(counts);
  sessionStorage.setItem(VIDEO_INTERACTION_STORAGE_KEY, serialized);
  localStorage.setItem(VIDEO_INTERACTION_STORAGE_KEY, serialized);
};

export const getPendingVideoInteractionCounts = () => {
  const sessionValue = sessionStorage.getItem(VIDEO_INTERACTION_STORAGE_KEY);
  const localValue = localStorage.getItem(VIDEO_INTERACTION_STORAGE_KEY);
  const fromSession = safeParseCounts(sessionValue);
  const fromLocal = safeParseCounts(localValue);

  return {
    howToVote: Math.max(normalizeCount(fromSession.howToVote), normalizeCount(fromLocal.howToVote)),
    coercion: Math.max(normalizeCount(fromSession.coercion), normalizeCount(fromLocal.coercion)),
  };
};

export const incrementPendingVideoInteraction = (videoKey) => {
  if (videoKey !== "howToVote" && videoKey !== "coercion") return;
  const current = getPendingVideoInteractionCounts();
  current[videoKey] = normalizeCount(current[videoKey]) + 1;
  writePendingCounts(current);
};

export const clearPendingVideoInteractionCounts = () => {
  sessionStorage.removeItem(VIDEO_INTERACTION_STORAGE_KEY);
  localStorage.removeItem(VIDEO_INTERACTION_STORAGE_KEY);
};