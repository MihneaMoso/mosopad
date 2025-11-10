import fs from "node:fs/promises";
const os = await import("node:os");
const path = await import("node:path");
const { execFile } = await import("node:child_process");
const { promisify } = await import("node:util");

export async function compile(rawContent: string, optimizationLevel: string, options: string[]) {
    let data = {
        compile: { stdout: "", stderr: "" },
        run: {stdout: "", stderr: ""},
        error: "",
    };
    const execFileAsync = promisify(execFile);

    let tmpDir: string | undefined;
    data.compile = { stdout: "", stderr: "" };
    data.run = { stdout: "", stderr: "" };

    try {
        tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "cpp-"));
        const srcPath = path.join(tmpDir, "temp.cpp");
        const outPath = path.join(
            tmpDir,
            process.platform === "win32" ? "temp.exe" : "temp.out"
        );

        await fs.writeFile(srcPath, String(rawContent ?? ""), "utf8");

        // Compile
        try {
            const { stdout, stderr } = await execFileAsync(
                "g++",
                [srcPath, optimizationLevel, ...options, "-o", outPath],
                {
                    timeout: 15000,
                    windowsHide: true,
                }
            );
            data.compile.stdout = stdout ?? "";
            data.compile.stderr = stderr ?? "";
        } catch (e: any) {
            data.compile.stdout = e?.stdout ?? "";
            data.compile.stderr =
                e?.stderr ?? e?.message ?? "Compilation failed";
            data.error = "compilation_failed";
            // Skip execution if compilation failed
        }

        // Run only if compilation succeeded (no stderr from compiler and no explicit error)
        if (!data.error) {
            try {
                const { stdout, stderr } = await execFileAsync(outPath, [], {
                    cwd: tmpDir,
                    timeout: 5000,
                    windowsHide: true,
                });
                data.run.stdout = stdout ?? "";
                data.run.stderr = stderr ?? "";
            } catch (e: any) {
                data.run.stdout = e?.stdout ?? "";
                data.run.stderr = e?.stderr ?? e?.message ?? "Execution failed";
                data.error = "execution_failed";
            }
        }
    } finally {
        if (tmpDir) {
            await fs
                .rm(tmpDir, { recursive: true, force: true })
                .catch(() => {});
        }
    }

    return data;
}
