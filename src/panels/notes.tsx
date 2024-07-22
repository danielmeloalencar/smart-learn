import { useAtomValue } from "jotai"
import { selectAtom } from "jotai/utils"
import { LoadingIcon16, NoteIcon16 } from "../components/icons"
import { NoteList } from "../components/note-list"
import { Panel } from "../components/panel"
import { PanelProps } from "../components/panels"
import { RepoForm } from "../components/repo-form"
import { githubRepoAtom, globalStateMachineAtom } from "../global-state"

const isEmptyAtom = selectAtom(globalStateMachineAtom, (state) => state.matches("signedIn.empty"))

const isCloningRepoAtom = selectAtom(globalStateMachineAtom, (state) =>
  state.matches("signedIn.cloningRepo"),
)

const isClonedAtom = selectAtom(globalStateMachineAtom, (state) => state.matches("signedIn.cloned"))

export function NotesPanel({ id, onClose }: PanelProps) {
  const isEmpty = useAtomValue(isEmptyAtom)
  const isCloningRepo = useAtomValue(isCloningRepoAtom)
  const isCloned = useAtomValue(isClonedAtom)
  const githubRepo = useAtomValue(githubRepoAtom)

  return (
    <Panel id={id} title="Notas" icon={<NoteIcon16 />} onClose={onClose}>
      <div className="p-4">
        {isEmpty ? (
          <div className="flex w-full flex-col gap-4">
            <div className="flex flex-col gap-1">
              <h1 className="text-lg font-semibold">Escolhar um repositório</h1>
              <p className="text-text-secondary">
                Guarde suas notas em arquivos markdown num repositório do GitHub de sua escolha.
                Ao criar um repositório novo, o mesmo ficará privado.
              </p>
            </div>
            <RepoForm />
          </div>
        ) : null}

        {isCloningRepo ? (
          <span className="inline-flex items-center gap-2 leading-4 text-text-secondary">
            <LoadingIcon16 />
            Clonando {githubRepo?.owner}/{githubRepo?.name}…
          </span>
        ) : null}

        {isCloned ? <NoteList /> : null}
      </div>
    </Panel>
  )
}
