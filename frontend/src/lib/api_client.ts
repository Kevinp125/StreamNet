const API_BASE_URL = import.meta.env.VITE_SERVER_URL;

//function fetches the streamer card info from the /api/users/me api call
export async function fetchStreamerInfo(accessToken: string) {
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

//function makes fetch request to api that returns all streamers sorted based on the scoring algorithm. Highest score will be first streamer
export async function fetchRecommendedStreamers(accessToken: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/users/get-all`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch recommeneded streamers: ${res.status}`);
    }

    const recommendedStreamers = await res.json();
    return recommendedStreamers;
  } catch (err) {
    console.error(`Could not fetch recommended streamers`, err);
    throw new Error("Unable to fetch streamers");
  }
}
