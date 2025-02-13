import { DefaultEventsMap, Server, Socket } from "socket.io";
import http from "http";
import { GameService } from "../game/GameService";
import { AnyTxtRecord } from "dns";
import PlayerHanlde from "../game/PlayerHandle";
import { PlayerData } from "../player/entities/Player";

export class ServerService {
  private io: Server<
    DefaultEventsMap,
    DefaultEventsMap,
    DefaultEventsMap,
    any
  > | null;



  public actionList: Record<string, (socket : Socket , data?: any) => void> = {
    "SEARCH_GAME": this.do_SearchGame,
    "MOVE_PLAYER": this.do_movePlayer,
    "ROTATE_PLAYER" : this.do_rotatePlayer
  };
  

  private static instance: ServerService;
  private constructor() {
    this.io = null;
  }

  static getInstance(): ServerService {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new ServerService();
    return this.instance;
  }

  public init(
    httpServer: http.Server<
      typeof http.IncomingMessage,
      typeof http.ServerResponse
    >
  ) {
    this.io = new Server(httpServer, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    this.io.on("connection", (socket) => {
      console.log("Un cliente se ha conectado:", socket.id);
      socket.emit("connectionStatus", { status: true });
   
      socket.on("message", (data) => {
        const doType = this.actionList[data.type];
        if (doType !== undefined) {
          doType(socket, data.content);
        }
      });

      socket.on("disconnect", () => {
        console.log("Un cliente se ha desconectado:", socket.id);
        GameService.getInstance().removePlayer(socket.id);
      });
      
    });
  }

  public addPlayerToRoom(playerId: string, roomName: string | null) {
    if (roomName != null) {
      this.io?.sockets.sockets.get(playerId)?.join(roomName);
    }
  }

  public sendMessageToRoom(
    roomName: string | null,
    type: string,
    content: any
  ) {
    console.log("------------------------");
    console.log("Enviando un mensaje a una sala:");
    console.log(`Tipo: ${type.toString()}`);

    console.log(`Contenido: ${JSON.stringify(content, null, 2)}`);

    console.log("------------------------");
    console.log("");

    if (this.io != null) {
      if (roomName != null) {
        this.io?.to(roomName).emit("message", {
          type: type,
          content: content,
        });
      }
    }
  }

  public sendMessageToRoomExceptPlayer(
    playerId: string,
    roomName: string | null,
    type: string,
    content: any
  ) {
    console.log("------------------------");
    console.log("Enviando un mensaje a una sala exepto a un jugador:");
    console.log(`Tipo: ${type.toString()}`);

    console.log(`Contenido: ${JSON.stringify(content, null, 2)}`);

    console.log("------------------------");
    console.log("");

    if (this.io != null) {
      if (roomName != null) {
        this.io?.to(roomName).except(playerId).emit("message", {
          type: type,
          content: content,
        });
      }
    }
  }

  public sendMessageToPlayer(playerId: string, type: string, content: any) {
    console.log("------------------------");
    console.log("Enviando un mensaje a un jugador:");
    console.log(`Tipo: ${type.toString()}`);

    console.log(`Contenido: ${JSON.stringify(content, null, 2)}`);

    console.log("------------------------");
    console.log("");

    this.io?.sockets.sockets.get(playerId)?.emit("message", {
      type: type,
      content: content,
    });
  }

  public gameStartMessage() {


  }

  private do_SearchGame(socket: Socket) {
    GameService.getInstance().addPlayer(
      GameService.getInstance().buildPlayer(socket.id)
    );
  }

  private do_movePlayer(socket: Socket, data: PlayerData) {
    console.log(data)
    PlayerHanlde.movePlayer(socket.id, data);
  }

  private do_rotatePlayer(socket: Socket,data: PlayerData) {
    PlayerHanlde.rotatePlayer(socket.id, data);
  }

  /*   private doMovePlayer(socket: Socket, data: any) {
    GameService.getInstance().movePlayer(socket.id, data.direction);
  } 

  private doPlayerAction(socket: Socket, data: any) {
    GameService.getInstance().playerAction(socket.id, data.action);
  } */
}
