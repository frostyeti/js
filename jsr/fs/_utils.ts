import { fromFileUrl } from "@frostyeti/path";

export function toPathString(
    pathUrl: string | URL,
): string {
    return pathUrl instanceof URL ? fromFileUrl(pathUrl) : pathUrl;
}
