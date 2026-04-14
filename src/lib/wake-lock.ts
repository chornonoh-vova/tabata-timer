import { useEffect } from "react"

export function useWakeLock(isActive: boolean) {
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
