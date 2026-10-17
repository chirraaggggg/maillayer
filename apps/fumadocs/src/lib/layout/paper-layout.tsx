import type { ReactNode } from "react";

import { DocsLayout } from "@/components/paper-docs-layout";
import type { Breadcrumb } from "@/components/paper-docs-layout";

/**
 * Common documentation layout used by the /docs/$ route.
 *
 * It renders the paper-branded header, navigation rail, breadcrumbs, and the
 * narrow reading column for the page content.
 */
export function DocsPageLayout({
  breadcrumbs,
  title,
  description,
  children,
  actions,
}: {
  breadcrumbs: Breadcrumb[];
  title: string;
  description: string;
  children: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <DocsLayout breadcrumbs={breadcrumbs} title={title} description={description} actions={actions}>
      {children}
    </DocsLayout>
  );
}
