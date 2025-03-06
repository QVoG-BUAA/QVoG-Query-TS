import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["src/index.ts", "src/index.*.ts"],
    format: ["cjs", "esm"],
    clean: true,
});
