const LOCATION_KEY = "dam_user_location_v1";

export type StoredUserLocation = {
  lat: number;
  lng: number;
  accuracy?: number;
  recordedAt: string;
};

export function getStoredUserLocation(): StoredUserLocation | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(LOCATION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredUserLocation;
    if (typeof parsed.lat !== "number" || typeof parsed.lng !== "number") return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveStoredUserLocation(loc: StoredUserLocation): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCATION_KEY, JSON.stringify(loc));
  } catch {
    /* ignore */
  }
}
