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

export async function sendConnectionRequest(accessToken: string, receiverId: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/connections/send-request`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ receiver_id: receiverId }),
    });

    if (!res.ok) {
      throw new Error("Could not send a connection request");
    }

    return await res.json();
  } catch (err) {
    console.error(err);
    throw err; //this passes it up to parent
  }
}

export async function fetchPendingRequests(accessToken: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/connections/pending-requests`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("Could not fetch all the pending requests");
    }

    return await res.json();
  } catch (err) {
    console.error(err);
    throw err; //this passes it up to parent
  }
}

export async function setConnectionRequestStatusAndPostIfAccept(
  accessToken: string,
  decision: string,
  requestId: string,
) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/connections`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ decision: decision, requestId: requestId }),
    });

    if (!res.ok) {
      throw new Error("Could update request status and / or post");
    }
    return await res.json();
  } catch (err) {
    console.error(err);
    throw err; //this passes it up to parent
  }
}

export async function removeConnection(accessToken: string, connected_streamer: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/connections`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ connected_streamer_id: connected_streamer }),
    });

    if (!res.ok) {
      throw new Error("Was not able to remove the connection");
    }
    return await res.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function postEvent(accessToken: string, eventData: any) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/events`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eventData),
    });

    if (!res.ok) {
      throw new Error("Was not able to add a new event");
    }
    return await res.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function fetchEvents(accessToken: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/events`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("Was not able to fetch the events");
    }
    return await res.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function postEventRsvp(accessToken: string, rsvpInfo: any) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/events/rsvp`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(rsvpInfo),
    });

    if (!res.ok) {
      throw new Error("Was not able to update the rsvp status.");
    }
    return await res.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function fetchNotifications(accessToken: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/notifications`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("Could not fetch notifications");
    }
    return await res.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function updateNotificationStatus(
  accessToken: string,
  notificationId: string,
  status: string,
) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/notifications/${notificationId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    if (!res.ok) {
      throw new Error("Could not update notification status");
    }
    return await res.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function getNotificationSettings(accessToken: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/notifications/settings`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("Could not fetch notification settings");
    }

    const data = await res.json();
    return data.settings;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function updateNotificationSettings(accessToken: string, newSettings: any) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/notifications/settings`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newSettings),
    });

    if (!res.ok) {
      throw new Error("Could not update notification settings");
    }

    return { success: true };
  } catch (err) {
    console.error(err);
    throw err;
  }
}
