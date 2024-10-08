import * as Tooltip from "@radix-ui/react-tooltip"
import "@total-typescript/ts-reset"
import React from "react"
import ReactDOM from "react-dom/client"
import { ErrorBoundary, FallbackProps } from "react-error-boundary"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Button } from "./components/button"
import { GitHubAuth } from "./components/github-auth"
import { Markdown } from "./components/markdown"
import { NavLayout } from "./components/nav-layout"
import { RootLayout } from "./components/root-layout"
import { FilePage } from "./pages/file"
import { NotePage } from "./pages/note"
import { NotesPage } from "./pages/notes"
import { SettingsPage } from "./pages/settings"
import { TagPage } from "./pages/tag"
import { TagsPage } from "./pages/tags"
import "./styles/index.css"
import { ShortcutPage } from "./pages/shortcuts"
import { PlanPage } from "./pages/plan"
import { GraphPage } from "./pages/graph"
import { DocumentationPage } from "./pages/documentation"

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div role="alert" className="space-y-4 p-4">
      <Markdown>{`# Error\n\n\`\`\`\n${error.message}\n\`\`\``}</Markdown>
      <Button onClick={resetErrorBoundary}>Tentar novamente</Button>
    </div>
  )
}



ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Tooltip.Provider>
        <BrowserRouter>
          <GitHubAuth>
            <RootLayout>
              <Routes>
                <Route path="/" element={<NavLayout />}>
                  <Route index element={<NotesPage />} />
                  <Route path="tags" element={<TagsPage />} />
                  <Route path="tags/*" element={<TagPage />} />
                  <Route path="file" element={<FilePage />} />
                  <Route path="settings" element={<SettingsPage />} />
                  <Route path="shortcuts" element={<ShortcutPage />} />
                  <Route path="documentation" element={<DocumentationPage />} />
                  <Route path="plan/*" element={<PlanPage />} />
                  <Route path="graph/*" element={<GraphPage />} />
                  <Route path="*" element={<NotePage />} />

                </Route>
              </Routes>
            </RootLayout>
          </GitHubAuth>
        </BrowserRouter>
      </Tooltip.Provider>
    </ErrorBoundary>
  </React.StrictMode>,
)
