import { expect, test } from "bun:test"
import {
  applySafeTraceLayerMoveForError,
  cloneRoutes,
} from "../lib/solvers/GlobalDrcForceImproveSolver/solverHelpers"
import type { HighDensityRoute } from "../types/high-density-types"
import type { SimpleRouteJson } from "../lib/types"

test("a trace layer repair rejects a forbidden inner signal layer", (): void => {
  const srj: SimpleRouteJson = {
    layerCount: 4,
    minTraceWidth: 0.1,
    bounds: { minX: -5, maxX: 5, minY: -5, maxY: 5 },
    connections: [],
    obstacles: [],
  }
  const route: HighDensityRoute = {
    connectionName: "signal",
    traceThickness: 0.1,
    viaDiameter: 0.3,
    vias: [],
    route: [
      { x: -4, y: 0, z: 0 },
      { x: 4, y: 0, z: 0 },
    ],
  }
  const error = { type: "pcb_trace_error", center: { x: 0, y: 0 } }
  const unrestricted = cloneRoutes([route])
  expect(
    applySafeTraceLayerMoveForError(srj, unrestricted, error, 0, 1, 0),
  ).toBe(true)
  const restricted = cloneRoutes([{ ...route, allowedZLayers: [0, 3] }])
  expect(applySafeTraceLayerMoveForError(srj, restricted, error, 0, 1, 0)).toBe(
    false,
  )
  expect(restricted[0]!.route).toEqual(route.route)
  expect(applySafeTraceLayerMoveForError(srj, restricted, error, 0, 3, 0)).toBe(
    true,
  )
  expect(restricted[0]!.allowedZLayers).toEqual([0, 3])
})
