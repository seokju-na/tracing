export function getProcessEnv(name: string) {
  if (typeof process !== 'undefined') {
    const env = process.env[name];
    return env;
  }
  return undefined;
}
