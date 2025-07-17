import { useContext, useState, useEffect, createContext, type ReactNode } from "react";
import { useAuthContext } from "./AuthProvider";
import type { Notification } from "@/types/AppTypes";

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
  const { session } = useAuthContext(); //we dont want to establish socket connection if user isnt authenticated / logged in

  function handleNewNotification(notification: Notification) {
    if (notification.priority === "immediate") {
      //TODO Show POP UP
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
            userId: session.user.id,
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
