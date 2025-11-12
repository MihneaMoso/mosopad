// import { FILE } from "node:dns";
import fs from "node:fs/promises";
const os = await import("node:os");
const path = await import("node:path");
const { execFile } = await import("node:child_process");
const { promisify } = await import("node:util");

const LIMITS = {
    FILE_SIZE: 100_000, // 100KB
    LINE_COUNT: 5000, // Max lines
    COMPILE_TIME: 15_000, // 15 seconds
    RUN_TIME: 5_000, // 5 seconds
};

export async function compile(
    rawContent: string,
    optimizationLevel: string,
    options: string[]
) {
    let data = {
        compile: { stdout: "", stderr: "" },
        run: { stdout: "", stderr: "" },
        error: "",
    };

    // limit file size
    if (!rawContent || typeof rawContent !== "string") {
        data.error = "invalid_input";
        data.compile.stderr = "No code provided";
        return data;
    }

    const contentSize = Buffer.byteLength(rawContent, "utf-8");
    if (contentSize > LIMITS.FILE_SIZE) {
        data.error = "file_too_large";
        data.compile.stderr = `File size (${contentSize} bytes) exceeds limit of ${(
            LIMITS.FILE_SIZE / 1024
        ).toFixed(1)}KB.`;
        return data;
    }

    const lineCount = rawContent.split("\n").length;
    if (lineCount > LIMITS.LINE_COUNT) {
        data.error = "too_many_lines";
        data.compile.stderr = `Code has ${lineCount} lines, limit is ${LIMITS.LINE_COUNT}`;
        return data;
    }

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
                    timeout: LIMITS.COMPILE_TIME,
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
                    timeout: LIMITS.RUN_TIME,
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
