import {useEffect, useState, useContext, createContext, ReactNode, useRef} from 'react';
import io, {Socket} from "socket.io-client";
import { useAuth } from './useAuth';
//------------------------------------------------------------------
interface SocketContextType{
  socket: Socket | null;
};
//------------------------------------------------------------------
const SocketContext = createContext<SocketContextType>({
  socket: null,
});

export const SocketProvider = ({children}: {children: ReactNode}) => {
  const {auth} = useAuth();

  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!auth?.accessToken) {
      return;
    }

    socketRef.current = io(import.meta.env.VITE_API_URL, {
      auth: {
        token: auth.accessToken,
      },
    });

    console.log(socketRef.current);

    const socket = socketRef.current;

    socket.on("connect", onConnection);
    socket.on("disconnect", onDisconnect);
    socket.on("error", onError);
    socket.on("connect_error", onError);

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("error");
      socket.disconnect();
    }
  }, [auth?.accessToken]);

  return (
    <SocketContext.Provider value={{socket: socketRef.current}}>
      {children}
    </SocketContext.Provider>
  )
}

export default function useSocket(): SocketContextType {
  return (
    useContext(SocketContext)
  )
}

// ---------- listener function -----------------------------------------------------
function onConnection() {
  console.log("connected to websocket");
};

function onDisconnect(){
  console.log("disconnected to websocket")
};

function onError(err: any){
  console.error("Socket error:", err);
};
