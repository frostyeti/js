import { fromFileUrl } from "@frostyeti/path";
export function toPathString(pathUrl) {
  return pathUrl instanceof URL ? fromFileUrl(pathUrl) : pathUrl;
}
