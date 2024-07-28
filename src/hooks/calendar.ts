import { useAtomValue, useSetAtom } from "jotai"
import { selectAtom } from "jotai/utils"
import React from "react"
import { globalStateMachineAtom,  calendarsAtom } from "../global-state"
import {  NoteId, Calendar,CalendarId } from "../schema"

export function useCalendarById(id: CalendarId) {
  const calendarAtom = React.useMemo(() => selectAtom(calendarsAtom, (calendars) => calendars.get(id)), [id])
  const calendar = useAtomValue(calendarAtom)
  return calendar
}

export function useSaveCalendar() {
  const send = useSetAtom(globalStateMachineAtom)

  const saveCalendar = React.useCallback(
    ({ id, content }: Pick<Calendar, "id" | "content">) => {
      send({
        type: "WRITE_FILES",
        markdownFiles: { [`${id}.json`]: content },
      })
    },
    [send],
  )

  return saveCalendar
}

export function useDeleteNote() {
  const send = useSetAtom(globalStateMachineAtom)

  const deleteNote = React.useCallback(
    (id: NoteId) => {
      send({ type: "DELETE_FILE", filepath: `${id}.md` })
    },
    [send],
  )

  return deleteNote
}
