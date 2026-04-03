import { useEffect, useState } from "react"

export type Config = {
  prepare: number
  work: number
  rest: number
  rounds: number
  cooldown: number
}

const CONFIG_KEY = "tabata-timer-config"

const DEFAULT_CONFIG: Config = {
  prepare: 5,
  work: 20,
  rest: 10,
  rounds: 8,
  cooldown: 5,
}

export function useConfig() {
  const [config, setConfig] = useState<Config>(() => {
    const saved = localStorage.getItem(CONFIG_KEY)

    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (err) {
        console.error("cannot parse saved config, falling back to default", err)
      }
    }

    return DEFAULT_CONFIG
  })

  const updateConfigValue = (key: keyof Config, value: number) => {
    setConfig((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  useEffect(() => {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config))
  }, [config])

  return {
    config,
    updateConfigValue,
  }
}
