import { useAtomValue, useSetAtom } from "jotai"
import { selectAtom } from "jotai/utils"
import React from "react"
import { useLocation } from "react-router-dom"
import { useEvent, useNetworkState } from "react-use"
import { globalStateMachineAtom } from "../global-state"
import { useThemeColorProvider } from "../hooks/theme-color"
import { CommandMenu } from "./command-menu"
import { ErrorIcon16 } from "./icons"
import { InsertTemplateDialog } from "./insert-template"
import { Panels } from "./panels"
import { SyntaxHighlighter } from "./syntax-highlighter"
import { useMedia } from "react-use"

const errorAtom = selectAtom(globalStateMachineAtom, (state) => state.context.error)

export function RootLayout({ children }: { children: React.ReactNode }) {
  useThemeColorProvider()
  const error = useAtomValue(errorAtom)
  const send = useSetAtom(globalStateMachineAtom)
  const { online } = useNetworkState()
  const location = useLocation()
  const isDesktop = useMedia("(min-width: 640px)")
  // Sync when the app becomes visible again
  useEvent("visibilitychange", () => {
    if (document.visibilityState === "visible" && online) {
      send({ type: "SYNC" })
    }
  })

  // Sync when the app comes back online
  useEvent("online", () => {
    send({ type: "SYNC" })
  })

  return (
    <Panels.Provider key={location.pathname}>
      <CommandMenu />
      <InsertTemplateDialog />
      <div className="flex h-screen w-screen flex-col pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] [@supports(height:100svh)]:h-[100svh]">
        {children}
        {error ? (
          <div className="flex items-center gap-3 bg-[var(--red-a4)] px-4 py-2 text-[var(--red-12)]">
            <div>
              <ErrorIcon16 />
            </div>
            <span className="font-mono">{error.message}</span>
          </div>
        ) : null}
        <DevBar />
        {isDesktop && <div className="text-center text-text-tertiary ">Copyright © 2024 Daniel Melo Alencar - danielmalencar2011@gmail.com - <a href="https://www.linkedin.com/in/daniel-melo-alencar/">Contato</a></div> }
      </div>
    </Panels.Provider>
  )
}

// Shows the current state of the global state machine for debugging purposes
function DevBar() {
  const state = useAtomValue(globalStateMachineAtom)

  if (!import.meta.env.DEV) return null

  return (
    <div className="flex border-t border-border-secondary px-4 py-2">
      <SyntaxHighlighter language="javascript">{JSON.stringify(state.value)}</SyntaxHighlighter>
    </div>
  )
}
