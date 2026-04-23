const esbuild = require("esbuild");

const isWatch = process.argv.includes("--watch");

async function main() {
  const ctx = await esbuild.context({
    entryPoints: ["src/code.ts"],
    bundle: true,
    outfile: "dist/code.js",
    platform: "browser",
    target: "es2017",
  });

  if (isWatch) {
    await ctx.watch();
    console.log("[token-exporter] watching for changes…");
  } else {
    await ctx.rebuild();
    await ctx.dispose();
    console.log("[token-exporter] built");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
