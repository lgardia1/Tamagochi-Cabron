export const Direction = {
  "Up": (3 * Math.PI) / 2,
  "Right": Math.PI,
  "Left": 0,
  "Down":  Math.PI / 2,
};

export const Message = {
  "SEARCH_GAME" : "SEARCH_GAME",
  "MOVE_PLAYER" : "MOVE_PLAYER",
  "ROTATE_PLAYER" : "ROTATE_PLAYER"
}

export const PlayerStatus = {
  NO_CONNECTED: 0,
  CONNECTED: 1,
  MOVING: 3,
  IDLE: 2,
  DIE: 4,
};

export const GameStatus = {
  WAITING: 0,
  COUNTDOWN: 1,
  PLAYING: 2,
  ENDED: 3,
};
