//File will contain the typings that are used multiple times throughout my app

//StreamerProfile type is what makes up a streamer
export type StreamerProfile = {
  id: string;
  name: string;
  twitchUser: string;
  email: string;
  profilePic: string;
  description: string;
  targetAudience: string;
  tags: string[];
  date_of_birth: string;
  created_at: string;
  requestStatus: string;
};

export type Notification = {
  id: string;
  type: string;
  title: string;
  message: string;
  contextData: any;
  status: string;
  priority: string;
  created_at: string;
};