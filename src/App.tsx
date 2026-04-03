import { ConfigScreen } from "./components/config-screen"
import { TabataScreen } from "./components/tabata-screen"
import { useState } from "react"

export function App() {
  const [screen, setScreen] = useState<"config" | "timer">("config")
  return (
    <main className="container mx-auto flex h-svh flex-col items-center gap-2 px-4 py-2">
      <h1 className="text-2xl font-semibold">Tabata timer</h1>
      {screen === "config" && (
        <ConfigScreen onStart={() => setScreen("timer")} />
      )}
      {screen === "timer" && (
        <TabataScreen onBack={() => setScreen("config")} />
      )}
    </main>
  )
}

export default App
