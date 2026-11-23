import { expect, test } from "bun:test"
import { getConnectivityMapFromSimpleRouteJson } from "../fixture-support/getConnectivityMapFromSimpleRouteJson"
import {
  GlobalDrcBranchPortfolioSolver,
  type HighDensityRoute,
  type SimpleRouteJson,
} from "../lib"
import { expectSrjRepairSnapshot } from "./fixtures/expectSrjRepairSnapshot"
import input from "./fixtures/usb-ground-pad-repair.json"

test("repair the USB ground trace beside MCU pin 15", async () => {
  const { srj, hdRoutes } = structuredClone(input) as {
    srj: SimpleRouteJson
    hdRoutes: HighDensityRoute[]
  }
  const solver = new GlobalDrcBranchPortfolioSolver({
    srj,
    hdRoutes,
    connMap: getConnectivityMapFromSimpleRouteJson(srj),
    broadMaxIterations: 12,
    broadPassMultiplier: 3,
  })
  solver.solve()
  expect(solver.solved).toBe(true)
  await expectSrjRepairSnapshot(
    srj,
    hdRoutes,
    solver.getOutput(),
    import.meta.path,
  )
})
