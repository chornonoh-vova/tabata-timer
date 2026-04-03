import { useConfig } from "@/lib/config"
import { getElapsedTime, useTabataTimer, type Phase } from "@/lib/tabata-timer"
import { useWakeLock } from "@/lib/wake-lock"
import {
  ArrowTurnBackwardIcon,
  BeachIcon,
  CheckmarkCircle02Icon,
  DumbbellIcon,
  HourglassIcon,
  PauseCircleIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import type { ReactNode } from "react"
import { Button } from "./ui/button"
import { Progress, ProgressLabel, ProgressValue } from "./ui/progress"
import { formatTime } from "@/lib/format"
import { useFeedback } from "@/lib/feedback"

const icons: Record<Phase, ReactNode> = {
  prepare: <HugeiconsIcon icon={HourglassIcon} />,
  work: <HugeiconsIcon icon={DumbbellIcon} />,
  rest: <HugeiconsIcon icon={PauseCircleIcon} />,
  cooldown: <HugeiconsIcon icon={BeachIcon} />,
  done: <HugeiconsIcon icon={CheckmarkCircle02Icon} />,
}

export function TabataScreen({ onBack }: { onBack: () => void }) {
  const { config } = useConfig()
  const { state, pause, play } = useTabataTimer(config)

  useWakeLock(state)
  useFeedback(state)

  const timeTotal =
    state.config.prepare +
    (state.config.work + state.config.rest) * state.config.rounds +
    state.config.cooldown

  const timeElapsed = getElapsedTime(state)

  return (
    <div className="flex h-full w-full max-w-sm flex-col gap-2 rounded-4xl border p-4 sm:max-w-full">
      <div className="flex w-full items-center justify-between gap-2 text-2xl">
        <h2 className="inline-flex items-center gap-1">
          {icons[state.phase]}
          {state.phase}
        </h2>
        <p>
          {state.round}/{state.config.rounds}
        </p>
      </div>
      {state.phase !== "done" && (
        <>
          <Progress value={(timeElapsed / timeTotal) * 100}>
            <ProgressLabel>Total progress</ProgressLabel>
            <ProgressValue />
          </Progress>
          {state.timeLeft ? (
            <p className="my-auto self-center text-8xl">
              {formatTime(state.timeLeft)}
            </p>
          ) : (
            <p className="my-auto self-center text-5xl">
              Next: {state.phase === "prepare" && "Work"}
              {state.phase === "work" && "Rest"}
              {state.phase === "rest" &&
                state.round < state.config.rounds &&
                "Work"}
              {state.phase === "rest" &&
                state.round === state.config.rounds &&
                (state.config.cooldown ? "Cooldown" : "Done")}
            </p>
          )}
          {state.isRunning ? (
            <Button onClick={pause}>Pause</Button>
          ) : (
            <Button onClick={play}>Continue</Button>
          )}
        </>
      )}
      {state.phase === "done" && (
        <ul className="my-auto self-center text-center text-xl">
          <li>✅ {state.config.rounds} rounds completed</li>
          <li>
            🔥 Total work: {formatTime(state.config.work * state.config.rounds)}
          </li>
          <li>⏱️ Total time: {formatTime(timeTotal)}</li>
        </ul>
      )}
      <Button variant="outline" onClick={onBack}>
        <HugeiconsIcon icon={ArrowTurnBackwardIcon} />
        Back
      </Button>
    </div>
  )
}
