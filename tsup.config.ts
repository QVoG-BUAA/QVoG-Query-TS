import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["src/index.ts", "src/index.py.ts", "src/index.ark.ts"],
    format: ["cjs", "esm"],
    clean: true,
});
