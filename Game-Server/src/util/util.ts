export function genRanHexId(size: Number): string {
  return [...Array(size)]
    .map(() => Math.floor(Math.random() * 16).toString(16))
    .join("");
}

export function parseArrayEnv(envValue: string | undefined, defaultValue: number | string): number | string {
  if (envValue === undefined) return defaultValue;

  const arrayEnv = envValue.trim().split(",");
  const randomValueArrayEnv = arrayEnv[Math.floor(Math.random() * arrayEnv.length)]

  if(typeof defaultValue === 'string') {
    return randomValueArrayEnv;
  }
  const numberValue = Number(randomValueArrayEnv);

  return isNaN(numberValue) ? defaultValue : numberValue;
}

