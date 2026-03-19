import { DocsLayout } from "fumadocs-ui/layouts/docs";
import type { ReactNode } from "react";
import { source } from "@/lib/source";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      tree={source.pageTree}
      nav={{
        title: (
          <span className="font-semibold tracking-tight">AGF</span>
        ),
      }}
      links={[
        {
          text: "jessepike.dev",
          url: "https://jessepike.dev",
          external: true,
        },
      ]}
      githubUrl="https://github.com/jessepike/agf"
      sidebar={{
        defaultOpenLevel: 1,
      }}
      themeSwitch={{ enabled: false }}
    >
      {children}
    </DocsLayout>
  );
}
