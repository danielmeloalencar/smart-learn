import { Panels } from "../components/panels"
import { PlanPanel } from "../panels/plan"

export function PlanPage() {

  return (
    <Panels.Container>
      <PlanPanel />
      <Panels.Outlet />
    </Panels.Container>
  )
}
