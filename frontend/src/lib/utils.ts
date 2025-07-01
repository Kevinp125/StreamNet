import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

const API_BASE_URL = import.meta.env.VITE_SERVER_URL;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

//function fetches the streamer card info from the /api/users/me api call
export async function fetchStreamerCardInfo(accessToken: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/users/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch the user profile: ${res.status}`);
    }

    const data = await res.json();
    return data.profile;
  } catch (err) {
    console.error(`Could not fetch user profile`, err);
    throw new Error("Unable to fetch profile");
  }
}
