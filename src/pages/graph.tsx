import { useParams } from "react-router-dom"
import { Panels } from "../components/panels"
import { GraphPanel } from "../panels/graph"

export function GraphPage() {
  const params = useParams()
  return (
    <Panels.Container>
      <GraphPanel  params={params} />
      <Panels.Outlet />
    </Panels.Container>
  )
}
