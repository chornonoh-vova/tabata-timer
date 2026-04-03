import { useConfig } from "@/lib/config"
import {
  FieldGroup,
  Field,
  FieldLabel,
  FieldSet,
  FieldLegend,
} from "./ui/field"
import { Input } from "./ui/input"
import { Button } from "./ui/button"

export function ConfigScreen({ onStart }: { onStart: () => void }) {
  const { config, updateConfigValue } = useConfig()

  return (
    <form
      id="tabata-timer-config"
      className="w-full max-w-sm rounded-4xl border p-4"
      onSubmit={(event) => {
        event.preventDefault()
        onStart()
      }}
    >
      <FieldSet>
        <FieldLegend>Setup tabata</FieldLegend>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="prepare-time">Prepare time (s)</FieldLabel>
            <Input
              id="prepare-time"
              type="number"
              required
              min={0}
              value={config.prepare}
              onChange={(event) =>
                updateConfigValue("prepare", event.target.valueAsNumber)
              }
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="work-time">Work time (s)</FieldLabel>
            <Input
              id="work-time"
              type="number"
              required
              min={10}
              value={config.work}
              onChange={(event) =>
                updateConfigValue("work", event.target.valueAsNumber)
              }
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="rest-time">Rest time (s)</FieldLabel>
            <Input
              id="rest-time"
              type="number"
              required
              min={5}
              value={config.rest}
              onChange={(event) =>
                updateConfigValue("rest", event.target.valueAsNumber)
              }
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="rounds-count">Rounds</FieldLabel>
            <Input
              id="rounds-count"
              type="number"
              required
              min={1}
              value={config.rounds}
              onChange={(event) =>
                updateConfigValue("rounds", event.target.valueAsNumber)
              }
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="cooldown-time">Cooldown time (s)</FieldLabel>
            <Input
              id="cooldown-time"
              type="number"
              required
              min={0}
              value={config.cooldown}
              onChange={(event) =>
                updateConfigValue("cooldown", event.target.valueAsNumber)
              }
            />
          </Field>
          <Field>
            <Button type="submit" form="tabata-timer-config">
              Start
            </Button>
          </Field>
        </FieldGroup>
      </FieldSet>
    </form>
  )
}
