import { stderr } from "../streams.js";

stderr.writeSync(new TextEncoder().encode("writeSync\n"));
stderr.write(new TextEncoder().encode("write\n"));
