import { Note, NoteId } from "../schema"

export async function exportAsGist({
  githubToken,
  noteId,
  note,
}: {
  githubToken: string
  noteId: NoteId
  note: Note
}) {
  const filename = `${noteId}.md`

  const timestamp = new Date().toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    timeZoneName: "short",
  })

  const description = `${
    note.title ? `${note.title} · ` : ""
  }Exportada de Meu Segundo Cérebro (https://meusegundocerebro.netlify.app/) em ${timestamp}`

  const response = await fetch("https://api.github.com/gists", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${githubToken}`,
    },
    body: JSON.stringify({
      description,
      public: false,
      files: {
        [filename]: {
          content: note.content,
        },
      },
    }),
  })

  if (!response.ok) {
    console.error(`Failed to export as gist: ${response.status}`)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = (await response.json()) as any

  return data.html_url
}
