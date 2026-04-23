/// <reference types="@figma/plugin-typings" />

import { OKLCH_PRECISION, FLOAT_UNIT, TEXT_STYLES_OUTPUT, TEXT_STYLE_PROPS } from "./config";

declare const __html__: string;

// ── Types ─────────────────────────────────────────────────────────────────

interface CollectionInfo {
  id: string;
  name: string;
  count: number;
  suggestedPath: string;
  autoSplit: boolean;
}

interface ExportMapping {
  collectionId: string;
  collectionName: string;
  path: string;       // base path; for autoSplit this is the folder
  autoSplit: boolean;
}

interface TokenFile {
  path: string;
  content: string;
}

type ExportMode = "separate" | "single";

// ── Bootstrap ─────────────────────────────────────────────────────────────

figma.showUI(__html__, { width: 540, height: 640, title: "Token Exporter" });

figma.ui.onmessage = async (msg: {
  type: string;
  mappings?: ExportMapping[];
  mode?: ExportMode;
}) => {
  switch (msg.type) {
    case "scan":   await handleScan(); break;
    case "export": if (msg.mappings) await handleExport(msg.mappings, msg.mode ?? "separate"); break;
    case "close":  figma.closePlugin(); break;
  }
};

// ── Handlers ──────────────────────────────────────────────────────────────

async function handleScan() {
  try {
    const [collections, variables] = await Promise.all([
      figma.variables.getLocalVariableCollectionsAsync(),
      figma.variables.getLocalVariablesAsync(),
    ]);

    const info: CollectionInfo[] = collections.map((c) => ({
      id: c.id,
      name: c.name,
      count: variables.filter((v) => v.variableCollectionId === c.id).length,
      suggestedPath: suggestPath(c.name),
      autoSplit: isAutoSplit(c.name),
    }));

    figma.ui.postMessage({ type: "scan-result", collections: info });
  } catch (err) {
    figma.ui.postMessage({ type: "error", message: String(err) });
  }
}

async function handleExport(mappings: ExportMapping[], mode: ExportMode) {
  try {
    const [collections, variables] = await Promise.all([
      figma.variables.getLocalVariableCollectionsAsync(),
      figma.variables.getLocalVariablesAsync(),
    ]);

    const variableMap = new Map(variables.map((v) => [v.id, v]));
    const mappingById = new Map(mappings.map((m) => [m.collectionId, m]));

    // Detect base-path collisions among auto-split collections
    const autoSplitBases = mappings.filter((m) => m.autoSplit).map((m) => m.path);
    const collidingBases = new Set(
      autoSplitBases.filter((p, i) => autoSplitBases.indexOf(p) !== i)
    );

    // file path → variable lines
    const fileMap = new Map<string, string[]>();

    for (const collection of collections) {
      const mapping = mappingById.get(collection.id);
      if (!mapping) continue;

      const vars = variables.filter((v) => v.variableCollectionId === collection.id);
      const modeId = collection.defaultModeId;

      for (const variable of vars) {
        const value = variable.valuesByMode[modeId];
        if (value === undefined) continue;

        const cssValue = toCssValue(value, variableMap);
        if (cssValue === null) continue;

        const filePath = resolveOutputPath(variable.name, mapping, collidingBases);
        const cssName = toCssName(variable.name);

        if (!fileMap.has(filePath)) fileMap.set(filePath, []);
        fileMap.get(filePath)!.push(`  ${cssName}: ${cssValue};`);
      }
    }

    let files: TokenFile[];

    if (mode === "single") {
      // Merge everything into one file with path comments
      const sections = Array.from(fileMap.entries()).map(
        ([path, lines]) => `/* ${path} */\n:root {\n${lines.join("\n")}\n}`
      );
      files = [{ path: "tokens.css", content: sections.join("\n\n") + "\n" }];
    } else {
      files = Array.from(fileMap.entries()).map(([path, lines]) => ({
        path,
        content: `:root {\n${lines.join("\n")}\n}\n`,
      }));
    }

    // Append text style utility classes if configured
    if (TEXT_STYLES_OUTPUT) {
      const textStyleFile = await buildTextStyleClasses();
      if (textStyleFile) files.push(textStyleFile);
    }

    figma.ui.postMessage({ type: "export-result", files });
  } catch (err) {
    figma.ui.postMessage({ type: "error", message: String(err) });
  }
}

// ── Text style class generation ────────────────────────────────────────────

/**
 * Derives the semantic token prefix from a Figma text style name.
 *
 * Figma style names use slash hierarchy: "label/default", "title-hero/default".
 * The first segment is the role; that role is the prefix for semantic vars
 * e.g. "label" → --label-font-family, --label-font-size, etc.
 */
function styleNameToRole(name: string): string {
  return name.split("/")[0].toLowerCase().replace(/\s+/g, "-");
}

async function buildTextStyleClasses(): Promise<TokenFile | null> {
  const styles = await figma.getLocalTextStylesAsync();
  if (styles.length === 0) return null;

  // Deduplicate by role — one class per role, using the first matching style
  const seen = new Set<string>();
  const classes: string[] = [];

  for (const style of styles) {
    const role = styleNameToRole(style.name);
    if (seen.has(role)) continue;
    seen.add(role);

    const props = TEXT_STYLE_PROPS.map((prop) => {
      const suffix = cssPropertyToTokenSuffix(prop);
      return `  ${prop}: var(--${role}-${suffix});`;
    });

    classes.push(`.ts-${role} {\n${props.join("\n")}\n}`);
  }

  if (classes.length === 0) return null;

  const header = `/* auto-generated — do not edit. Regenerate via Figma token export. */\n`;
  return {
    path: TEXT_STYLES_OUTPUT,
    content: header + classes.join("\n\n") + "\n",
  };
}

function cssPropertyToTokenSuffix(prop: typeof TEXT_STYLE_PROPS[number]): string {
  const map: Record<typeof TEXT_STYLE_PROPS[number], string> = {
    "font-family":    "font-family",
    "font-size":      "font-size",
    "font-weight":    "font-weight",
    "line-height":    "line-height",
    "letter-spacing": "letter-spacing",
  };
  return map[prop];
}

// ── Path resolution ────────────────────────────────────────────────────────

function resolveOutputPath(
  variableName: string,
  mapping: ExportMapping,
  collidingBases: Set<string>
): string {
  if (!mapping.autoSplit) return mapping.path;

  const segment = variableName.split("/")[0].toLowerCase().replace(/\s+/g, "-");
  const base = mapping.path;

  // Collision: two collections share the same base folder → add collection slug subfolder
  if (collidingBases.has(base)) {
    const slug = mapping.collectionName.toLowerCase().replace(/\s+/g, "-");
    return `${base}/${slug}/${segment}.css`;
  }

  return `${base}/${segment}.css`;
}

function suggestPath(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes("component")) return "src/tokens/components";
  return `src/tokens/${lower.replace(/\s+/g, "-")}.css`;
}

function isAutoSplit(name: string): boolean {
  return name.toLowerCase().includes("component");
}

// ── Helpers ───────────────────────────────────────────────────────────────

function toCssName(name: string): string {
  return "--" + name.toLowerCase().replace(/\//g, "-").replace(/\s+/g, "-");
}

function toCssValue(value: VariableValue, variableMap: Map<string, Variable>): string | null {
  if (typeof value === "object" && "type" in value && value.type === "VARIABLE_ALIAS") {
    const ref = variableMap.get(value.id);
    if (!ref) return null;
    return `var(${toCssName(ref.name)})`;
  }
  if (typeof value === "object" && "r" in value) return colorToOklch(value as RGBA);
  if (typeof value === "number") return FLOAT_UNIT ? `${value}${FLOAT_UNIT}` : String(value);
  if (typeof value === "string") return value;
  return null;
}

function colorToOklch(color: RGB | RGBA): string {
  const toLinear = (c: number) =>
    c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);

  const rl = toLinear(color.r);
  const gl = toLinear(color.g);
  const bl = toLinear(color.b);

  const l = 0.4122214708 * rl + 0.5363325363 * gl + 0.0514459929 * bl;
  const m = 0.2119034982 * rl + 0.6806995451 * gl + 0.1073969566 * bl;
  const s = 0.0883024619 * rl + 0.2817188376 * gl + 0.6299787005 * bl;

  const l_ = Math.cbrt(l);
  const m_ = Math.cbrt(m);
  const s_ = Math.cbrt(s);

  const L  =  0.2104542553 * l_ + 0.793617785  * m_ - 0.0040720468 * s_;
  const a  =  1.9779984951 * l_ - 2.428592205  * m_ + 0.4505937099 * s_;
  const b  =  0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_;

  const C    = Math.sqrt(a * a + b * b);
  const rawH = Math.atan2(b, a) * (180 / Math.PI);
  const H    = rawH < 0 ? rawH + 360 : rawH;

  const p     = OKLCH_PRECISION;
  const Lstr  = (L * 100).toFixed(p) + "%";
  const Cstr  = C.toFixed(p);
  const Hstr  = C < 0.0001 ? "0" : H.toFixed(p);
  const alpha = "a" in color ? (color as RGBA).a : 1;
  const aStr  = alpha !== undefined && alpha < 0.9999 ? ` / ${alpha.toFixed(p)}` : "";

  return `oklch(${Lstr} ${Cstr} ${Hstr}${aStr})`;
}
