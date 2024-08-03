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

  const [counter, setCounter] = useState(0);

  useEffect(() => {
    if (!auth?.accessToken) {
      return;
    }
    console.log(`websocket attempt: ${counter}`);

    socketRef.current = io(import.meta.env.VITE_API_URL, {
      auth: {
        token: auth.accessToken,
      },
      reconnectionDelay: 1000, 
      reconnectionDelayMax: 5000 
    });

    const socket = socketRef.current;

    setCounter(counter+1);

    socket.on("connect", () => onConnection(socket));
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
function onConnection(socket: Socket) {
  console.log("connected to websocket");
  console.log(socket.connected);
};

function onDisconnect(){
  console.log("disconnected to websocket")
};

function onError(err: any){
  console.error("Socket error:", err);
};
