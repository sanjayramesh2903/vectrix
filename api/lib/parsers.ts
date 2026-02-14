/**
 * Dependency parsers for various lockfile formats.
 * Each parser takes raw file content and returns a normalized dependency list.
 */

export interface ParsedDependency {
  name: string;
  version: string;
  isDirect: boolean;
  ecosystem: "npm" | "pypi" | "go";
}

/**
 * Parse package-lock.json (v2/v3 format)
 */
export function parseNpmLockfile(content: string): ParsedDependency[] {
  const lock = JSON.parse(content);
  const deps: ParsedDependency[] = [];
  const seen = new Set<string>();

  // Read top-level dependencies from package.json packages field (v2/v3)
  const packages = lock.packages ?? {};
  const directNames = new Set<string>();

  // The root entry "" contains the project's own deps
  const root = packages[""] ?? {};
  for (const name of Object.keys(root.dependencies ?? {})) {
    directNames.add(name);
  }
  for (const name of Object.keys(root.devDependencies ?? {})) {
    directNames.add(name);
  }

  for (const [path, meta] of Object.entries<Record<string, unknown>>(packages)) {
    if (path === "") continue; // skip root

    // path looks like "node_modules/lodash" or "node_modules/@scope/pkg"
    const name = path.replace(/^node_modules\//, "");
    if (name.includes("node_modules/")) continue; // skip nested dupes
    const version = (meta.version as string) ?? "unknown";
    const key = `${name}@${version}`;

    if (seen.has(key)) continue;
    seen.add(key);

    deps.push({
      name,
      version,
      isDirect: directNames.has(name),
      ecosystem: "npm",
    });
  }

  // Fallback for v1 lockfiles
  if (deps.length === 0 && lock.dependencies) {
    for (const [name, meta] of Object.entries<Record<string, unknown>>(lock.dependencies)) {
      const version = (meta.version as string) ?? "unknown";
      deps.push({ name, version, isDirect: true, ecosystem: "npm" });
    }
  }

  return deps;
}

/**
 * Parse package.json (direct dependencies only, no lockfile)
 */
export function parsePackageJson(content: string): ParsedDependency[] {
  const pkg = JSON.parse(content);
  const deps: ParsedDependency[] = [];

  for (const [name, version] of Object.entries<string>(pkg.dependencies ?? {})) {
    deps.push({
      name,
      version: version.replace(/^[\^~>=<]/, ""),
      isDirect: true,
      ecosystem: "npm",
    });
  }
  for (const [name, version] of Object.entries<string>(pkg.devDependencies ?? {})) {
    deps.push({
      name,
      version: version.replace(/^[\^~>=<]/, ""),
      isDirect: true,
      ecosystem: "npm",
    });
  }

  return deps;
}

/**
 * Parse requirements.txt (Python)
 */
export function parseRequirementsTxt(content: string): ParsedDependency[] {
  const deps: ParsedDependency[] = [];

  for (const raw of content.split("\n")) {
    const line = raw.trim();
    if (!line || line.startsWith("#") || line.startsWith("-")) continue;

    const match = line.match(/^([a-zA-Z0-9_.-]+)\s*(?:==|>=|<=|~=|!=)\s*([^\s;#]+)/);
    if (match) {
      deps.push({
        name: match[1].toLowerCase(),
        version: match[2],
        isDirect: true,
        ecosystem: "pypi",
      });
    } else {
      // Package without version specifier
      const nameOnly = line.match(/^([a-zA-Z0-9_.-]+)/);
      if (nameOnly) {
        deps.push({
          name: nameOnly[1].toLowerCase(),
          version: "latest",
          isDirect: true,
          ecosystem: "pypi",
        });
      }
    }
  }

  return deps;
}

/**
 * Parse go.sum (Go modules)
 */
export function parseGoSum(content: string): ParsedDependency[] {
  const deps: ParsedDependency[] = [];
  const seen = new Set<string>();

  for (const raw of content.split("\n")) {
    const line = raw.trim();
    if (!line) continue;

    // Format: module version hash
    const parts = line.split(/\s+/);
    if (parts.length < 3) continue;

    const name = parts[0];
    const version = parts[1].replace("/go.mod", "");
    const key = `${name}@${version}`;

    if (seen.has(key)) continue;
    seen.add(key);

    deps.push({
      name,
      version,
      isDirect: false, // go.sum includes all transitive deps
      ecosystem: "go",
    });
  }

  return deps;
}

/**
 * Auto-detect file type and parse
 */
export function parseLockfile(
  filename: string,
  content: string
): ParsedDependency[] {
  if (filename === "package-lock.json") return parseNpmLockfile(content);
  if (filename === "package.json") return parsePackageJson(content);
  if (filename === "requirements.txt") return parseRequirementsTxt(content);
  if (filename === "go.sum") return parseGoSum(content);
  throw new Error(`Unsupported lockfile format: ${filename}`);
}
