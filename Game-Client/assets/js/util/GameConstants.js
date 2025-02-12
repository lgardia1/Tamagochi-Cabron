export const Direction = {
  "Up": Math.PI / 2,
  "Right": 0,
  "Left": Math.PI,
  "Down": (3 * Math.PI) / 2,
};

export const PlayerStatus = {
  NO_CONNECTED: 0,
  CONNECTED: 1,
  MOVING: 3,
  IDLE: 2,
  DIE: 4,
};

export const GameStatus = {
  WAITING: 0,
  PLAYING: 1,
  ENDED: 2,
};
