import { TooltipContentProps } from "@radix-ui/react-tooltip"
import { useAtomValue, useSetAtom } from "jotai"
import { selectAtom } from "jotai/utils"
import React from "react"
import { useHotkeys } from "react-hotkeys-hook"
import {
  NavLinkProps,
  NavLink as RouterNavLink,
  useLocation,
  useMatch,
  useResolvedPath,
} from "react-router-dom"
import { useEvent, useNetworkState } from "react-use"
import { globalStateMachineAtom } from "../global-state"
import { useNavigateWithCache } from "../hooks/navigate-with-cache"
import { cx } from "../utils/cx"
import { isValidDateString, isValidWeekString, toDateString } from "../utils/date"
import { DropdownMenu } from "./dropdown-menu"
import { useSignOut } from "./github-auth"
import { IconButton } from "./icon-button"
import EventNoteIcon from "@mui/icons-material/EventNote";
import {
  CalendarFillIcon24,
  CalendarIcon24,
  ComposeIcon24,
  MoreIcon24,
  NoteFillIcon24,
  NoteIcon24,
  SettingsIcon16,
  TagFillIcon24,
  TagIcon24,
} from "./icons"
import Diversity2Icon from '@mui/icons-material/Diversity2';
import { usePanelActions, usePanels } from "./panels"
import { SyncStatusIcon, useSyncStatusText } from "./sync-status"
import { Tooltip } from "./tooltip"

export function NavBar({ position }: { position: "left" | "bottom" }) {
  const navigate = useNavigateWithCache()
  const signOut = useSignOut()
  const isCalendarActive = useIsCalendarActive()
  const isPlanejamentoActive = useIsPlanejamentoActive()
  // Open tooltips on the side opposite to the nav bar.
  const tooltipSide = ({ left: "right", bottom: "top" } as const)[position]

  useEvent("keydown", (event: KeyboardEvent) => {
    // Navigate to settings page with `command + ,`
    if (event.key === "," && (event.metaKey || event.ctrlKey)) {
      navigate("/settings")
      event.preventDefault()
    }
  })

  return (
    <nav
      className={cx(
        "w-full border-border-secondary",
        // Add a border separating the nav bar from the main content.
        { left: "border-r", bottom: "border-t" }[position],
      )}
    >
      <ul
        className={cx("flex p-2", { left: "h-full flex-col gap-2", bottom: "flex-row" }[position])}
      >
        <li className={cx({ left: "flex-grow-0", bottom: "flex-grow" }[position])}>
          <NavLink to="/" aria-label="Notas" tooltipSide={tooltipSide} end>
            {({ isActive }) => (isActive ? <NoteFillIcon24 /> : <NoteIcon24 />)}
          </NavLink>
        </li>
        <li className={cx({ left: "flex-grow-0", bottom: "flex-grow" }[position])}>
          <NavLink to="/graph" aria-label="Rede de Conhecimento" tooltipSide={tooltipSide} end>
            {({ isActive }) => (isActive ? <Diversity2Icon /> : <Diversity2Icon  additive="sum" />)}
          </NavLink>
        </li>
        <li className={cx({ left: "flex-grow-0", bottom: "flex-grow" }[position])}>
          <NavLink
            to={`/${toDateString(new Date())}`}
            aria-label="Calendário"
            active={isCalendarActive}
            tooltipSide={tooltipSide}
            end
          >
            {isCalendarActive ? (
              <CalendarFillIcon24>{new Date().getDate()}</CalendarFillIcon24>
            ) : (
              <CalendarIcon24>{new Date().getDate()}</CalendarIcon24>
            )}
          </NavLink>
        </li>
        <li className={cx({ left: "flex-grow-0", bottom: "flex-grow" }[position])}>
          <NavLink
            to={`/plan/${toDateString(new Date())}`}
            aria-label="Planejamento"
            active={isPlanejamentoActive}
            tooltipSide={tooltipSide}
            end
          >
            <EventNoteIcon/>
          </NavLink>
        </li>
        <li className={cx({ left: "flex-grow-0", bottom: "flex-grow" }[position])}>
          <NavLink to="/tags" aria-label="Tags" tooltipSide={tooltipSide} end>
            {({ isActive }) => (isActive ? <TagFillIcon24 /> : <TagIcon24 />)}
          </NavLink>
        </li>
        <li className={cx({ left: "flex-grow-0", bottom: "flex-grow" }[position])}>
          <NewNoteButton className="w-full" tooltipSide={tooltipSide} />
        </li>
        {/* Spacer */}
        {position === "left" ? <div className="flex-grow" /> : null}
        {position === "left" ? (
          <li className="flex-grow-0 empty:hidden">
            <SyncButton />
          </li>
        ) : null}
        <li className={cx({ left: "flex-grow-0", bottom: "flex-grow" }[position])}>
          <DropdownMenu modal={false}>
            <DropdownMenu.Trigger asChild>
              {/* TODO: Focus button when dialog closes. */}
              <IconButton aria-label="More actions" disableTooltip className="w-full">
                <MoreIcon24 />
              </IconButton>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content side={tooltipSide} align="end">
              <DropdownMenu.Item onClick={signOut}>Desconectar (Sair)</DropdownMenu.Item>
              <DropdownMenu.Separator />
              <DropdownMenu.Item
                href="https://github.com/danielmeloalencar/smart-learn/issues/new"
                target="_blank"
                rel="noopener noreferrer"
              >
                Compartilhar feedback
              </DropdownMenu.Item>
              <DropdownMenu.Item
                onClick={() => navigate("/documentation")}
              >
                Documentação
              </DropdownMenu.Item>
              <DropdownMenu.Item
              onClick={() => navigate("/shortcuts")}
              >
                Atalhos
              </DropdownMenu.Item>
              <DropdownMenu.Separator />
              {position === "bottom" ? <SyncDropdownMenuItem /> : null}
              <DropdownMenu.Item
                icon={<SettingsIcon16 />}
                onClick={() => navigate("/settings")}
                shortcut={["⌘", ","]}
              >
                Configurações
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu>
        </li>
      </ul>
    </nav>
  )
}

function useIsCalendarActive() {
  const location = useLocation()
  const path = location.pathname.slice(1)
  return isValidDateString(path) || isValidWeekString(path)
}

function useIsPlanejamentoActive() {
  const location = useLocation()
  const path = location.pathname.slice(1)
  return isValidDateString(path) 
}

function NavLink({
  active,
  tooltipSide,
  ...props
}: Omit<NavLinkProps, "to"> & {
  to: string
  active?: boolean
  tooltipSide?: TooltipContentProps["side"]
}) {
  const navigate = useNavigateWithCache()
  const path = useResolvedPath(props.to)
  const match = useMatch({
    path: path.pathname,
    end: props.end,
    caseSensitive: props.caseSensitive,
  })
  const isActive = active || match !== null

  return (
    <Tooltip>
      <Tooltip.Trigger asChild>
        <RouterNavLink
          className={cx(
            "focus-ring inline-flex w-full justify-center rounded-sm p-2 transition-transform duration-100 hover:bg-bg-secondary active:scale-95 coarse:p-3",
            isActive ? "text-text" : "text-text-secondary",
          )}
          {...props}
          onClick={(event) => {
            event.preventDefault()
            navigate(props.to)
          }}
        />
      </Tooltip.Trigger>
      <Tooltip.Content side={tooltipSide}>{props["aria-label"]}</Tooltip.Content>
    </Tooltip>
  )
}

function NewNoteButton({
  tooltipSide,
  className,
}: {
  tooltipSide: TooltipContentProps["side"]
  className?: string
}) {
  // const navigate = useNavigateWithCache()
  const panels = usePanels()
  const { openPanel } = usePanelActions()
  const routerNavigate = useNavigateWithCache()

  const navigate = React.useCallback(
    (url: string) => {
      if (openPanel) {
        // If we're in a panels context, navigate by opening a panel
        openPanel(url, panels.length - 1)
      } else {
        // Otherwise, navigate using the router
        routerNavigate(url)
      }
    },
    [openPanel, panels, routerNavigate],
  )

  useHotkeys(
    "mod+i",
    (event) => {
      navigate(`/${Date.now()}`)
      event.preventDefault()
    },
    {
      enableOnFormTags: true,
      enableOnContentEditable: true,
    },
  )

  return (
    <IconButton
      className={className}
      aria-label="Nova nota"
      tooltipSide={tooltipSide}
      onClick={() => navigate(`/${Date.now()}`)}
      shortcut={["⌘", "I"]}
    >
      <ComposeIcon24 />
    </IconButton>
  )
}

const isClonedAtom = selectAtom(globalStateMachineAtom, (state) => state.matches("signedIn.cloned"))

function SyncButton() {
  const isCloned = useAtomValue(isClonedAtom)
  const send = useSetAtom(globalStateMachineAtom)
  const syncStatusText = useSyncStatusText()
  const { online } = useNetworkState()

  if (!isCloned) return null

  return (
    <IconButton
      aria-label={syncStatusText}
      tooltipSide="right"
      onClick={() => send({ type: "SYNC" })}
      disabled={!online}
    >
      <SyncStatusIcon size={24} />
    </IconButton>
  )
}

function SyncDropdownMenuItem() {
  const isCloned = useAtomValue(isClonedAtom)
  const send = useSetAtom(globalStateMachineAtom)
  const syncStatusText = useSyncStatusText()
  const { online } = useNetworkState()

  if (!isCloned) return null

  return (
    <DropdownMenu.Item
      icon={<SyncStatusIcon size={16} />}
      onClick={() => send({ type: "SYNC" })}
      disabled={!online}
    >
      {syncStatusText}
    </DropdownMenu.Item>
  )
}
