import { useEffect } from "react"
import type { State } from "./tabata-timer"

const tickAudio = new Audio("/tabata-timer/sounds/tick.mp3")
const phaseAudio = new Audio("/tabata-timer/sounds/phase.mp3")

function playTick() {
  tickAudio.currentTime = 0
  tickAudio.play()
}

function playPhaseChange() {
  phaseAudio.currentTime = 0
  phaseAudio.play()
}

function vibrateShort() {
  if ("vibrate" in navigator) {
    navigator.vibrate(50)
  }
}

function vibrateLong() {
  if ("vibrate" in navigator) {
    navigator.vibrate([100, 50, 100])
  }
}

export function useFeedback(state: State) {
  const isCountdownPhase =
    state.phase === "prepare" ||
    state.phase === "work" ||
    state.phase === "rest"

  useEffect(() => {
    if (!state.isRunning) return
    if (!isCountdownPhase) return

    if (state.timeLeft > 0 && state.timeLeft <= 3) {
      playTick()
      vibrateShort()
    }

    if (state.timeLeft === 0) {
      playPhaseChange()
      vibrateLong()
    }
  }, [isCountdownPhase, state.timeLeft, state.phase, state.isRunning])
}
