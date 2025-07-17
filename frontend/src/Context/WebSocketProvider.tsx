import { useContext, useState, useEffect, createContext, type ReactNode } from "react";
import { useAuthContext } from "./AuthProvider";

type WebSocketContextType = {
  socket: WebSocket | null; //can be of type websocket or null ehrn there isnt a connection yet
  isConnected: boolean;
}

const WebSocketContext = createContext<WebSocketContextType>({
  socket:null,
  isConnected:false
});

export function WebSocketProvider({children}: {children: ReactNode}){
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { session } = useAuthContext();
}