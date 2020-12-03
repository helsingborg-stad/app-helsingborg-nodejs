export function normalizePort(val: string): any {
  const port = parseInt(val, 10);

  if (Number.isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

export function readNumber(
  value: string | undefined,
  defaultValue: number
): number {
  if (value) {
    try {
      const parsed = Number(value);
      if (!isNaN(parsed)) {
        return parsed;
      }
    } catch (error) {
      // don't care
    }
  }
  return defaultValue;
}
