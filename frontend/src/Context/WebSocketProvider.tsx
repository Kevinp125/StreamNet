import { useContext, useState, useEffect, useRef, createContext, type ReactNode } from "react";
import { useAuthContext } from "./AuthProvider";
import type { Notification } from "@/types/AppTypes";
import { toast } from "sonner"; //function that calls the notif pop up

type WebSocketContextType = {
  socket: WebSocket | null; //can be of type websocket or null ehrn there isnt a connection yet
  isConnected: boolean;
  newNotification: Notification | null;
};

const WebSocketContext = createContext<WebSocketContextType>({
  socket: null,
  isConnected: false,
  newNotification: null,
});

export function WebSocketProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [newNotification, setNewNotification] = useState<Notification | null>(null); //adding this state so we can broadcast the new notification being added to any component
  const { session, notificationSettings } = useAuthContext(); //we dont want to establish socket connection if user isnt authenticated / logged in

  const settingsRef = useRef(notificationSettings);

  useEffect(() => {
    settingsRef.current = notificationSettings;
  }, [notificationSettings]);

  function handleNewNotification(notification: Notification) {
    function shouldShowPopup() {
      if (settingsRef.current === null) {
        return false; // Changed from true to false
      }

      //if user has push disabled auto return
      if (!settingsRef.current.push_enabled) {
        return false;
      }

      if (notification.priority !== "immediate") {
        return false;
      }

      switch (notification.type) {
        case "connection_request":
          return settingsRef.current.connection_request_enabled;
        case "connection_accepted":
          return settingsRef.current.connection_accepted_enabled;
        case "connection_denied":
          return settingsRef.current.connection_denied_enabled;
        case "private_event_invitation":
          return settingsRef.current.private_event_invitation_enabled;
        default:
          return true;
      }
    }

    if (shouldShowPopup()) {
      //if the notification is immediate priortiy we call toast function
      //below to display pop up to user. Otherwise user can just check when they go to dashboard
      //reduce the spammy feeling

      //We want to display the notification message and specify how long pop up lasts
      const toastSettings: any = {
        description: notification.message,
        duration: 4500,
      };

      //quality of life change if the user is not on the dash already add an action button with label Go that takes them to dash to take action on request
      if (window.location.pathname !== "/dashboard") {
        toastSettings.action = {
          label: "Go",
          onClick: () => {
            window.location.href = "/dashboard";
          },
        };
      }

      toast(notification.title, toastSettings);
    }

    setNewNotification(notification); //set state so component can access it
  }

  useEffect(() => {
    if (session?.user?.id) {
      //if we have a session currently we want to establish a connection...
      console.log("Making WebSocket connection..");

      //starting connection with server
      const ws = new WebSocket("ws://localhost:8080");

      //we do onopen with a callback because it checks if websocket connection was processed by server first
      ws.onopen = () => {
        console.log("WebSocket Connected");
        setIsConnected(true); //update that we are connected

        //send the server that we want to officially connect. Server processes this message and stores us in map of connections
        ws.send(
          JSON.stringify({
            type: "auth",
            token: session.access_token,
          }),
        );
      };

      ws.onmessage = event => {
        console.log("Server is sending us message", event.data);

        try {
          const data = JSON.parse(event.data);

          if (data.type === "notification") {
            console.log("Got new notification", data.data);
            handleNewNotification(data.data);
          }
        } catch (error) {
          console.error("Could not parse message", error);
        }
      };

      ws.onclose = () => {
        console.log("Websocket has been disconnected");
        setIsConnected(false);
      };

      ws.onerror = error => {
        console.error("Websocker error:", error);
        setIsConnected(false);
      };

      setSocket(ws);

      return () => {
        console.log("Cleaning ws connection");
        ws.close();
      };
    }
  }, [session?.user?.id]);

  return (
    <WebSocketContext.Provider value={{ socket, isConnected, newNotification }}>
      {children}
    </WebSocketContext.Provider>
  );
}

//hook that will allow us to acces websocket context whenver called from anywhere in app
export function useWebSocketContext() {
  return useContext(WebSocketContext);
}
