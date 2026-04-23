import defaultMdxComponents from "fumadocs-ui/mdx";
import { Confidence } from "@/components/confidence";
import { Status } from "@/components/status";

export function getMDXComponents(components?: Record<string, unknown>) {
  return {
    ...defaultMdxComponents,
    Confidence,
    Status,
    ...components,
  };
}
