const REGEX = /^(.*\/)([^/]+)\/node_modules$/;

export function getDirName(path: string) {
  const match = path.match(REGEX);

  if (match) {
    return {
      prefix: match[1],
      dir: match[2],
    };
  } else {
    return null;
  }
}
