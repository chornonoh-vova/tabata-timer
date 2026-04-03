import { useEffect } from "react"
import type { State } from "./tabata-timer"

export function useWakeLock(state: State) {
  const isActive = state.isRunning && state.phase !== "done"

  useEffect(() => {
    let lock: WakeLockSentinel | null = null

    async function request() {
      try {
        if ("wakeLock" in navigator) {
          lock = await navigator.wakeLock.request("screen")
        }
      } catch (err) {
        console.error("Wake lock failed", err)
      }
    }

    if (isActive) {
      request()
    }

    return () => {
      lock?.release()
      lock = null
    }
  }, [isActive])
}
