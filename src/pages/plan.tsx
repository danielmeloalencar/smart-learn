import { useParams } from "react-router-dom"
import { Panels } from "../components/panels"
import { PlanPanel } from "../panels/plan"

export function PlanPage() {
  const params = useParams()

  return (
    <Panels.Container>
      <PlanPanel   params={params} />
      <Panels.Outlet />
    </Panels.Container>
  )
}
