import { useEffect, useReducer } from "react"
import type { Config } from "./config"

export type Phase = "prepare" | "work" | "rest" | "cooldown" | "done"

export type State = {
  phase: Phase
  timeLeft: number
  round: number
  isRunning: boolean
  config: Config
}

type Action = { type: "PLAY" } | { type: "PAUSE" } | { type: "TICK" }

function init(config: Config): State {
  return {
    phase: config.prepare > 0 ? "prepare" : "work",
    timeLeft: config.prepare > 0 ? config.prepare : config.work,
    round: 1,
    isRunning: true,
    config,
  }
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "PLAY":
      return { ...state, isRunning: true }
    case "PAUSE":
      return { ...state, isRunning: false }
    case "TICK":
      if (!state.isRunning) return state

      if (state.timeLeft === 0) {
        return nextPhase(state)
      }

      return {
        ...state,
        timeLeft: Math.max(0, state.timeLeft - 1),
      }
    default:
      return state
  }
}

function nextPhase(state: State): State {
  switch (state.phase) {
    case "prepare":
      return {
        ...state,
        phase: "work",
        timeLeft: state.config.work,
      }
    case "work": {
      return {
        ...state,
        phase: "rest",
        timeLeft: state.config.rest,
      }
    }
    case "rest":
      if (state.round === state.config.rounds) {
        return state.config.cooldown > 0
          ? { ...state, phase: "cooldown", timeLeft: state.config.cooldown }
          : { ...state, phase: "done", isRunning: false }
      }

      return {
        ...state,
        phase: "work",
        round: state.round + 1,
        timeLeft: state.config.work,
      }
    case "cooldown":
      return {
        ...state,
        phase: "done",
        isRunning: false,
      }
    case "done":
      return state
    default:
      return state
  }
}

export function useTabataTimer(config: Config) {
  const [state, dispatch] = useReducer(reducer, config, init)

  useEffect(() => {
    if (!state.isRunning) return

    const id = setInterval(() => {
      dispatch({ type: "TICK" })
    }, 1000)

    return () => clearInterval(id)
  }, [dispatch, state.isRunning])

  const pause = () => {
    dispatch({ type: "PAUSE" })
  }

  const play = () => {
    dispatch({ type: "PLAY" })
  }

  return {
    state,
    pause,
    play,
  }
}

export function getElapsedTime(state: State): number {
  const { config, phase, timeLeft, round } = state

  if (phase === "done") {
    return (
      config.prepare +
      (config.work + config.rest) * config.rounds +
      config.cooldown
    )
  }

  let elapsed = 0

  // 1. Prepare phase (only once at the very beginning)
  if (phase !== "prepare") {
    elapsed += config.prepare
  }

  // 2. Completed full rounds before current one
  const completedRounds = round - 1
  elapsed += completedRounds * (config.work + config.rest)

  // 3. Phases inside current round
  if (phase === "rest" || phase === "cooldown") {
    elapsed += config.work
  }

  // 4. Cooldown reached only after all rounds
  if (phase === "cooldown") {
    elapsed += config.rest
  }

  // 5. Progress inside current phase
  const phaseDuration =
    phase === "prepare"
      ? config.prepare
      : phase === "work"
        ? config.work
        : phase === "rest"
          ? config.rest
          : phase === "cooldown"
            ? config.cooldown
            : 0

  elapsed += phaseDuration - timeLeft

  return elapsed
}
