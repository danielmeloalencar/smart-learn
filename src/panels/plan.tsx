import { Scheduler } from "@aldabil/react-scheduler"
import { ptBR } from "date-fns/locale"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import { DragEvent, useRef, useState } from "react"

import { useSaveCalendar, useCalendarById } from "../hooks/calendar"
import { EventActions, ProcessedEvent, SchedulerRef } from "@aldabil/react-scheduler/types"
import { Panel } from "../components/panel"
import { Button } from "../components/button"
import EventNoteIcon from "@mui/icons-material/EventNote"
import { useThemeDetector } from "../hooks/useDarkMode"
import { TagIcon16 } from "../components/icons"
import { PanelProps } from "../components/panels"

const defaultView = "day"
const statusToColor: { [key: string]: string } = {
  atrasado: "#722735",
  concluido: "#276e27",
  pendente: "#31467d",
}
export function PlanPanel({ id, onClose }: PanelProps) {
  const [AgendaMode, setAgendaMode] = useState(false)
  const [view, setView] = useState(defaultView)
  const saveCalendar = useSaveCalendar()
  const calendar = useCalendarById("calendar")
  const filename = "calendar"

  const calendarRef = useRef<SchedulerRef>(null)

  function saveCalendarFunction(content: string) {
    saveCalendar({ id: filename, content: content })
  }

  // convert json string to array of  proccessedEvents
  function convertJsonToProcessedEvent(json: string | undefined): ProcessedEvent[] {
    if (!json) return []
    const parsed = JSON.parse(json) as ProcessedEvent[]
    const events = parsed.map((event: ProcessedEvent) => {
      return {
        event_id: event.event_id,
        title: event.title,
        start: new Date(event.start),
        end: new Date(event.end),
        allDay: event.allDay,
        color: statusToColor[event.status],
        status: event.status,
      }
    })
    return events
  }

  function addEventToSave(event: ProcessedEvent) {
    const events = calendarRef.current?.scheduler.events
    if (events) {
      const newEvents = [...events, { ...event, color: "" }]
      saveCalendarFunction(JSON.stringify(newEvents))
    }
  }

  const handleConfirm = async (
    event: ProcessedEvent,
    action: EventActions,
  ): Promise<ProcessedEvent> => {
    /**
     * Make sure to return 4 mandatory fields:
     * event_id: string|number
     * title: string
     * start: Date|string
     * end: Date|string
     * ....extra other fields depend on your custom fields/editor properties
     */
    // Simulate http request: return added/edited event
    return new Promise((res, rej) => {
      if (action === "edit") {
        const events = calendarRef.current?.scheduler.events
        if (events) {
          const newEvents = events.map((ev) => {
            if (ev.event_id === event.event_id) {
              return event
            }
            return ev
          })
          saveCalendarFunction(JSON.stringify(newEvents))
        }
      } else if (action === "create") {
        addEventToSave({ ...event, event_id: Math.random(), color: "" })
      }

      res({
        ...event,
        event_id: event.event_id || Math.random(),
      })
    })
  }

  const handleDelete = async (deletedId: string) => {
    console.log("handleDelete =", deletedId)
    const events = calendarRef.current?.scheduler.events
    if (events) {
      const newEvents = events.filter((ev) => ev.event_id !== deletedId)
      saveCalendarFunction(JSON.stringify(newEvents))
    }
  }

  // função handleEventDrop conforme a documentação:
  //Function(event: DragEvent, droppedOn: Date, updatedEvent: ProcessedEvent, originalEvent: ProcessedEvent). Return a promise, used to update remote data of the dropped event. Return an event to update s  event: DragEvent,e is managed within component
  const handleEventDrop = async (
    event: DragEvent<HTMLButtonElement>,
    droppedOn: Date,
    updatedEvent: ProcessedEvent,
    originalEvent: ProcessedEvent,
  ): Promise<ProcessedEvent | void> => {
    console.log("handleEventDrop =", event, droppedOn, updatedEvent, originalEvent)
    const events = calendarRef.current?.scheduler.events
    if (events) {
      const newEvents = events.map((ev) => {
        if (ev.event_id === updatedEvent.event_id) {
          return { ...ev, start: updatedEvent.start, end: updatedEvent.end }
        }
        return ev
      })
      saveCalendarFunction(JSON.stringify(newEvents))
    }
  }

  const darkTheme = createTheme({
    palette: {
      mode: "dark",
      primary: {
        main: "#4ccce6",
        contrastText: "#EEEEEC",
      },
      secondary: {
        main: "#d58493",
        contrastText: "#EEEEEC",
      },
      text: {
        primary: "#EEEEEC",
        secondary: "#EEEEEC",
      },
    },
    typography: {
      fontFamily: "Arial",
      fontSize: 12,
      caption: {
        fontSize: 14,
      },
      h1: {
        fontSize: 16,
      },
    },
  })

  const isDarkMode = useThemeDetector()

  return (
    <Panel id={id} title="Planejamento" icon={<TagIcon16 />} onClose={onClose}>
      <div className="flex flex-col gap-2 p-4">
        <div className="flex w-full flex-row gap-4 overflow-y-auto p-2">
          <Button
            title="Dia"
            onClick={() => {
              calendarRef?.current?.scheduler.handleState("day", "view")
              setView("day")
            }}
            variant={view === "day" ? "primary" : "secondary"}
          >
            Dia
          </Button>
          <Button
            title="Semana"
            onClick={() => {
              calendarRef?.current?.scheduler.handleState("week", "view")
              setView("week")
            }}
            variant={view === "week" ? "primary" : "secondary"}
          >
            Semana
          </Button>
          <Button
            title="Mês"
            onClick={() => {
              calendarRef?.current?.scheduler.handleState("month", "view")
              setView("month")
            }}
            variant={view === "month" ? "primary" : "secondary"}
          >
            Mês
          </Button>
          <div className="flex flex-1 justify-end">
            <Button
              title="Agenda"
              onClick={() => {
                calendarRef?.current?.scheduler.toggleAgenda()
                setAgendaMode(!AgendaMode)
              }}
              variant={AgendaMode ? "primary" : "secondary"}
            >
              <EventNoteIcon />
              Modo Agenda
            </Button>
          </div>
        </div>
        <div className="flex w-full flex-col gap-4 overflow-y-auto p-2">
          <ThemeProvider theme={isDarkMode ? darkTheme : {}}>
            <Scheduler
              ref={calendarRef}
              events={convertJsonToProcessedEvent(calendar?.content)}
              locale={ptBR}
              fields={[
                {
                  name: "status",
                  type: "select",
                  // Should provide options with type:"select"
                  options: [
                    { id: 1, text: "Pendente", value: "pendente" },
                    { id: 2, text: "Concluído", value: "concluido" },
                    { id: 3, text: "Atrasado", value: "atrasado" },
                  ],
                  config: { label: "Status", required: true, errMsg: "Selecione um status" },
                },
              ]}
              month={{
                weekStartOn: 0,
                weekDays: [0, 1, 2, 3, 4, 5, 6],
                startHour: 5,
                endHour: 24,
                disableGoToDay: false,
              }}
              day={{
                startHour: 5,
                endHour: 24,
                step: 30,
              }}
              week={{
                weekDays: [0, 1, 2, 3, 4, 5],
                weekStartOn: 6,
                startHour: 5,
                endHour: 24,
                step: 30,
                disableGoToDay: false,
              }}
              translations={{
                navigation: {
                  month: "Mês",
                  week: "Semana",
                  day: "Dia",
                  today: "Hoje",
                  agenda: "Agenda",
                },
                form: {
                  addTitle: "Adicionar Evento",
                  editTitle: "Editar Evento",
                  confirm: "Confirmar",
                  delete: "Deletar",
                  cancel: "Cancelar",
                },
                event: {
                  title: "Título",
                  start: "Começo",
                  end: "Fim",
                  allDay: "Dia Todo",
                },
                validation: {
                  required: "Obrigatório",
                  invalidEmail: "Email inválido",
                  onlyNumbers: "Apenas números são permitidos",
                  min: "Mínimo de {{min}} letras",
                  max: "Máximo de {{max}} letras",
                },
                moreEvents: "Mais...",
                noDataToDisplay: "Nenhum dado para exibir",
                loading: "Carregando...",
              }}
              navigation={true}
              disableViewNavigator
              hourFormat="24"
              onConfirm={handleConfirm}
              onDelete={handleDelete}
              onEventDrop={handleEventDrop}
              view={defaultView}
              alwaysShowAgendaDays={false}
            />
          </ThemeProvider>
        </div>
      </div>
    </Panel>
  )
}