import { InfoIcon16 } from "../components/icons"
import { Panel } from "../components/panel"

export function ShortcutPage() {
  return (
    <Panel icon={<InfoIcon16 />} title="Atalhos" layout="centered">
      <div className="grid gap-4 p-4">
        <h3 className="text-lg font-semibold leading-4">Atalhos</h3>
        <table className="bg-bg">
          <thead>
            <tr>
              <th>Ação</th>
              <th>Atalho</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2">Abrir menu</td>
              <td className="p-2 text-bg-selection">
                <kbd>⌘</kbd> <kbd>K</kbd>
              </td>
            </tr>
            <tr>
              <td className="p-2">Abrir nova nota</td>
              <td className="p-2 text-bg-selection">
                <kbd>⌘</kbd> <kbd>I</kbd>
              </td>
            </tr>
          </tbody>
        </table>

        <p className="text-lg font-semibold leading-4">Com foco dentro de um card...</p>
        <table className="bg-bg">
          <thead>
            <tr>
              <th>Ação</th>
              <th>Atalho</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2">Abre opções da nota</td>
              <td className="p-2 text-bg-selection">
                <kbd>⌘</kbd> <kbd>.</kbd>
              </td>
            </tr>
            <tr>
              <td className="p-2">Editar nota</td>
              <td className="p-2 text-bg-selection">
                <kbd>E</kbd>
              </td>
            </tr>
            <tr>
              <td className="p-2">Copia código markdown da nota</td>
              <td className="p-2 text-bg-selection">
                <kbd>⌘</kbd> <kbd>C</kbd>
              </td>
            </tr>
            <tr>
              <td className="p-2">Copia ID da nota</td>
              <td className="p-2 text-bg-selection">
                <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>C</kbd>
              </td>
            </tr>
            <tr>
              <td className="p-2">Deleta nota</td>
              <td className="p-2 text-bg-selection">
                <kbd>⌘</kbd> <kbd>⌫</kbd>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Panel>
  )
}
