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

//function makes fetch request to the api that posts a connection on the database
export async function postStreamerConnection(accessToken: string, streamerId: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/connections`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      //pass in the request body the id of the streamer user is connecting with
      body: JSON.stringify({ connected_streamer_id: streamerId }),
    });

    if (!res.ok) {
      throw new Error(`Failed to connect with the streamer: ${res.status}`);
    }

    const result = await res.json();
    return result;
  } catch (err) {
    console.error(`Could not create connection`, err);
    throw new Error("Unable to create connection");
  }
}

//function makes a fetch request to the /connections api which returns an array of connections the user has
export async function fetchUserConnections(accessToken: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/connections`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch the connections ${res.status}`);
    }

    const result = await res.json();
    return result;
  } catch (err) {
    console.error(`Could not get connections`, err);
    throw new Error("Unable to get connections");
  }
}

//function makes a request to the api that updates the userWeights table whenever a user hits the connect button
export async function updateUserWeigths(accessToken: string, streamerToConnectId: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/connections/update-weight`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ streamerId: streamerToConnectId }),
    });

    if (!res.ok) {
      throw new Error("Weights were not updated succesfully");
    }
  } catch (err) {
    console.error(err);
  }
}

export async function addToNotInterestedAndUpdateWeights(accessToken: string, streamerId: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/not-interested`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ streamerId: streamerId }),
    });

    if (!res.ok) {
      throw new Error("Weights were not updated succesfully");
    }
  } catch (err) {
    console.error(err);
    throw err; //this passes it up to parent
  }
}
