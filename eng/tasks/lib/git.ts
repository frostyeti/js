

export function getGitUrl() {
    const cmd = new Deno.Command("git", {
        args: ["config", "--get", "remote.origin.url"],
        stdout: "piped",
        stderr: "piped",
    });

    return new TextDecoder().decode(cmd.outputSync().stdout);
}