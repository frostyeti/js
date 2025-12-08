/**
 * Contract for a file system error.
 */
export interface FsError extends Error {
    code: string;
    address?: string;
    dest?: string;
    errno?: number;
}

/**
 * Contract for directory information.
 */
export interface DirectoryInfo {
    name: string;
    isFile: boolean;
    isDirectory: boolean;
    isSymlink: boolean;
}

/**
 * Contract for a walk entry.
 */
export interface WalkEntry extends DirectoryInfo {
    /** Full path of the entry. */
    path: string;
}

/** Options for {@linkcode remove} and {@linkcode removeSync}  */
export interface RemoveOptions {
    recursive?: boolean;
}

/** Options for  {@linkcode makeDir} and {@linkcode makeDirSync}  */
export interface CreateDirectoryOptions {
    recursive?: boolean;
    mode?: number;
}

/** Options for {@linkcode exists} and {@linkcode existsSync.} */
export interface ExistsOptions {
    /**
     * When `true`, will check if the path is readable by the user as well.
     *
     * @default {false}
     */
    isReadable?: boolean;
    /**
     * When `true`, will check if the path is a directory as well. Directory
     * symlinks are included.
     *
     * @default {false}
     */
    isDirectory?: boolean;
    /**
     * When `true`, will check if the path is a file as well. File symlinks are
     * included.
     *
     * @default {false}
     */
    isFile?: boolean;
}

/**
 * Options which can be set when using {@linkcode makeTempDir},
 * {@linkcode makeTempDirSync}, {@linkcode makeTempFile}, and
 * {@linkcode makeTempFileSync}.
 *
 * @category File System */
export interface MakeTempOptions {
    /** Directory where the temporary directory should be created (defaults to
     * the env variable `TMPDIR`, or the system's default, usually `/tmp`).
     *
     * Note that if the passed `dir` is relative, the path returned by
     * `makeTempFile()` and `makeTempDir()` will also be relative. Be mindful of
     * this when changing working directory. */
    dir?: string;
    /** String that should precede the random portion of the temporary
     * directory's name. */
    prefix?: string;
    /** String that should follow the random portion of the temporary
     * directory's name. */
    suffix?: string;
}

/**
 * Options for {@linkcode writeTextFile} and {@linkcode writeTextFileSync}.
 */
export interface WriteOptions {
    /**
     * If `true`, will append to the file instead of overwriting it.
     */
    append?: boolean;
    /**
     * The character encoding of the file.
     */
    create?: boolean;
    /**
     * The character encoding of the file.
     */
    signal?: AbortSignal;
    /**
     * The character encoding of the file.
     */
    mode?: number;
}

/**
 * Options for {@linkcode read} and {@linkcode readSync}.
 */
export interface ReadOptions {
    /**
     * An abort signal to allow cancellation of the file read operation.
     * If the signal becomes aborted the readFile operation will be stopped
     * and the promise returned will be rejected with an AbortError.
     */
    signal?: AbortSignal;
}

/** Provides information about a file and is returned by
 * {@linkcode Deno.stat}, {@linkcode Deno.lstat}, {@linkcode Deno.statSync},
 * and {@linkcode Deno.lstatSync} or from calling `stat()` and `statSync()`
 * on an {@linkcode Deno.FsFile} instance.
 *
 * @category File System
 */
export interface FileInfo {
    /** The name of the file, including the extension.  */
    name: string;

    /** The full path of the file */
    path?: string;

    /** True if this is info for a regular file. Mutually exclusive to
     * `FileInfo.isDirectory` and `FileInfo.isSymlink`. */
    isFile: boolean;
    /** True if this is info for a regular directory. Mutually exclusive to
     * `FileInfo.isFile` and `FileInfo.isSymlink`. */
    isDirectory: boolean;
    /** True if this is info for a symlink. Mutually exclusive to
     * `FileInfo.isFile` and `FileInfo.isDirectory`. */
    isSymlink: boolean;
    /** The size of the file, in bytes. */
    size: number;
    /** The last modification time of the file. This corresponds to the `mtime`
     * field from `stat` on Linux/Mac OS and `ftLastWriteTime` on Windows. This
     * may not be available on all platforms. */
    mtime: Date | null;
    /** The last access time of the file. This corresponds to the `atime`
     * field from `stat` on Unix and `ftLastAccessTime` on Windows. This may not
     * be available on all platforms. */
    atime: Date | null;
    /** The creation time of the file. This corresponds to the `birthtime`
     * field from `stat` on Mac/BSD and `ftCreationTime` on Windows. This may
     * not be available on all platforms. */
    birthtime: Date | null;
    /** ID of the device containing the file. */
    dev: number;
    /** Inode number.
     *
     * _Linux/Mac OS only._ */
    ino: number | null;
    /** The underlying raw `st_mode` bits that contain the standard Unix
     * permissions for this file/directory.
     *
     * _Linux/Mac OS only._ */
    mode: number | null;
    /** Number of hard links pointing to this file.
     *
     * _Linux/Mac OS only._ */
    nlink: number | null;
    /** User ID of the owner of this file.
     *
     * _Linux/Mac OS only._ */
    uid: number | null;
    /** Group ID of the owner of this file.
     *
     * _Linux/Mac OS only._ */
    gid: number | null;
    /** Device ID of this file.
     *
     * _Linux/Mac OS only._ */
    rdev: number | null;
    /** Blocksize for filesystem I/O.
     *
     * _Linux/Mac OS only._ */
    blksize: number | null;
    /** Number of blocks allocated to the file, in 512-byte units.
     *
     * _Linux/Mac OS only._ */
    blocks: number | null;
    /**  True if this is info for a block device.
     *
     * _Linux/Mac OS only._ */
    isBlockDevice: boolean | null;
    /**  True if this is info for a char device.
     *
     * _Linux/Mac OS only._ */
    isCharDevice: boolean | null;
    /**  True if this is info for a fifo.
     *
     * _Linux/Mac OS only._ */
    isFifo: boolean | null;
    /**  True if this is info for a socket.
     *
     * _Linux/Mac OS only._ */
    isSocket?: boolean | null;
}

/** Options that can be used with {@linkcode symlink} and
 * {@linkcode symlinkSync}.
 *
 * @category File System */
export interface SymlinkOptions {
    /** If the symbolic link should be either a file or directory. This option
     * only applies to Windows and is ignored on other operating systems. */
    type: "file" | "dir";
}

/**
 * The mode to use when seeking a file. The mode can be one of the following:
 * - `start`: Seek from the start of the file.
 * - `current`: Seek from the current position.
 * - `end`: Seek from the end of the file.
 */
export type SeekMode = "start" | "current" | "end";

/**
 * The type of file system operation to perform. The type can be one of the
 * following:
 * - `write`: Write to the file.
 * - `read`: Read from the file.
 * - `lock`: Lock the file.
 * - `seek`: Seek in the file.
 * - `truncate`: Truncate the file.
 */
export type FsSupports = "write" | "read" | "lock" | "seek" | "truncate";

/**
 * Options that can be used with {@linkcode open} and {@linkcode openSync}.
 */
export interface OpenOptions {
    /** Sets the option for read access. This option, when `true`, means that
     * the file should be read-able if opened.
     *
     * @default {true} */
    read?: boolean;
    /** Sets the option for write access. This option, when `true`, means that
     * the file should be write-able if opened. If the file already exists,
     * any write calls on it will overwrite its contents, by default without
     * truncating it.
     *
     * @default {false} */
    write?: boolean;
    /** Sets the option for the append mode. This option, when `true`, means
     * that writes will append to a file instead of overwriting previous
     * contents.
     *
     * Note that setting `{ write: true, append: true }` has the same effect as
     * setting only `{ append: true }`.
     *
     * @default {false} */
    append?: boolean;
    /** Sets the option for truncating a previous file. If a file is
     * successfully opened with this option set it will truncate the file to `0`
     * size if it already exists. The file must be opened with write access
     * for truncate to work.
     *
     * @default {false} */
    truncate?: boolean;
    /** Sets the option to allow creating a new file, if one doesn't already
     * exist at the specified path. Requires write or append access to be
     * used.
     *
     * @default {false} */
    create?: boolean;
    /** If set to `true`, no file, directory, or symlink is allowed to exist at
     * the target location. Requires write or append access to be used. When
     * createNew is set to `true`, create and truncate are ignored.
     *
     * @default {false} */
    createNew?: boolean;
    /** Permissions to use if creating the file (defaults to `0o666`, before
     * the process's umask).
     *
     * Ignored on Windows. */
    mode?: number;
}
