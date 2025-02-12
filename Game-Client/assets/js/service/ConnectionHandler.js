import GameService from "./GameService.js";

const ConnectionHandler = {
  connected: false,
  socket: null,
  url: null,
  gameService: new GameService(),
  init: (url, onConnectedCallBack, onDisconnectedCallBack) => {
    let { socket } = ConnectionHandler;

    try {
      socket = io(url);
    } catch (err) {
      console.error(err);
      return
    }

    socket.onAny((eventName, data) => {
      console.log(`Evento: ${eventName}`);
      console.log(`Type: ${data.type}`);
    });
    
    socket.on("connect", (data) => {
      onConnectedCallBack();
      
      socket.on("connectionStatus", (data) => {
        ConnectionHandler.connected = true;
        socket.emit("message", { type: "SEARCH_GAME", content: "Hola" });
      });

      socket.on("message", (data) => {
        console.log(`Data: ${data.content}`);
        ConnectionHandler.gameService.do(data);
       /*  socket.emit("message", { type: "HELLO", content: "Hello world!" }); */
      });

      socket.on("disconnect", () => {
        ConnectionHandler.connected = false;
        onDisconnectedCallBack();
      });
    });
  },
};

export default ConnectionHandler;
