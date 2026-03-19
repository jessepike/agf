import { source } from "@/lib/source";
import { readFileSync } from "fs";
import { join } from "path";

export const dynamic = "force-static";

export async function GET() {
  const pages = source.getPages();

  const lines: string[] = [
    "# AGF — Agentic Governance Framework",
    "",
    "> A reference architecture for governed agentic systems.",
    "> Integrates NIST AI RMF, OWASP, CSA, EU AI Act, ISO/IEC 42001,",
    "> OpenTelemetry, Singapore IMDA, MITRE ATLAS, and academic research",
    "> into a single coherent governance framework.",
    ">",
    "> Website: https://agf.jessepike.dev",
    "> GitHub: https://github.com/jessepike/agf",
    "",
    "## Pages",
    "",
  ];

  for (const page of pages) {
    const title = page.data.title;
    const description = page.data.description ?? "";
    lines.push(`- [${title}](${page.url}): ${description}`);
  }

  lines.push("");
  lines.push("## Full Content");
  lines.push("");

  for (const page of pages) {
    const title = page.data.title;
    const description = page.data.description ?? "";

    lines.push("---");
    lines.push(`# ${title}`);
    if (description) {
      lines.push(`> ${description}`);
    }
    lines.push(`URL: ${page.url}`);
    lines.push("");

    // Try to read raw MDX source from disk
    try {
      const slugPath = page.url.replace("/docs/", "").replace(/\/$/, "");
      const mdxPath = join(
        process.cwd(),
        "content/docs",
        slugPath ? `${slugPath}.mdx` : "index.mdx"
      );
      const raw = readFileSync(mdxPath, "utf-8");

      // Strip frontmatter
      const content = raw.replace(/^---[\s\S]*?---\n*/, "");
      // Strip import statements
      const cleaned = content.replace(/^import\s+.*;\n*/gm, "");
      // Strip JSX image components, replace with alt text
      const noJsx = cleaned.replace(
        /<Image\s+[^>]*alt="([^"]*)"[^>]*\/>/g,
        "[Image: $1]"
      );

      lines.push(noJsx.trim());
    } catch {
      lines.push(`See: ${page.url}`);
    }

    lines.push("");
    lines.push("");
  }

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
