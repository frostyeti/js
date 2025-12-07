import { stdout } from "../streams.js";

stdout.writeSync(new TextEncoder().encode("writeSync\n"));
stdout.write(new TextEncoder().encode("write\n"));
