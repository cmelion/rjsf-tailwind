// src/components/samples.tsx
import { useEffect } from "react"
import { useStore } from "@/store"
import { AppState } from "@/types/store"

const selector = (state: AppState) => ({
  label: state.label,
  setLabel: state.setLabel,
  availableSamples: state.availableSamples,
  loading: state.loading,
  error: state.error,
  fetchSamples: state.fetchSamples,
  resetState: state.resetState
})

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ")
}

export default function Samples() {
  const { label, setLabel, availableSamples, loading, error, fetchSamples, resetState } = useStore(selector)

  // Only fetch samples if we don't already have them
  useEffect(() => {
    resetState();
    if (availableSamples.length === 0) {
      fetchSamples()
    }
  }, [fetchSamples, resetState, availableSamples.length])



  if (loading && availableSamples.length === 0) {
    return <div className="py-4">Loading samples...</div>
  }

  if (error && availableSamples.length === 0) {
    return <div className="py-4 text-red-500">Error: {error}</div>
  }

  if (availableSamples.length === 0) {
    return <div className="py-4">No samples available</div>
  }

  return (
    <div>
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Select a tab
        </label>
        <select
          id="tabs"
          name="tabs"
          className="w-full bg-background focus:border-primary focus:ring-primary"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        >
          {availableSamples.map((sample) => (
            <option className="w-full" key={sample} value={sample}>
              {sample}
            </option>
          ))}
        </select>
      </div>
      <div className="hidden sm:flex sm:flex-wrap">
        <div className="flex flex-wrap gap-2" aria-label="Tabs">
          {availableSamples.map((sample) => (
            <button
              aria-label={sample}
              role="button"
              key={sample}
              className={classNames(
                sample === label
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted",
                "rounded-full text-center px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary",
              )}
              onClick={() => setLabel(sample)}
            >
              {sample}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}