// src/components/form-style-provider.tsx
import { createContext, useContext, useState } from "react"

type FormStyle = "default" | "indigo-rounded"

type FormStyleProviderProps = {
  children: React.ReactNode
  defaultStyle?: FormStyle
  storageKey?: string
}

type FormStyleProviderState = {
  formStyle: FormStyle
  setFormStyle: (style: FormStyle) => void
}

const initialState: FormStyleProviderState = {
  formStyle: "default",
  setFormStyle: () => null,
}

const FormStyleContext = createContext<FormStyleProviderState>(initialState)

export function FormStyleProvider({
                                    children,
                                    defaultStyle = "default",
                                    storageKey = "form-style",
                                    ...props
                                  }: FormStyleProviderProps) {
  const [formStyle, setFormStyle] = useState<FormStyle>(
    () => (localStorage.getItem(storageKey) as FormStyle) || defaultStyle
  )

  const value = {
    formStyle,
    setFormStyle: (style: FormStyle) => {
      localStorage.setItem(storageKey, style)
      setFormStyle(style)
    },
  }

  return (
    <FormStyleContext.Provider {...props} value={value}>
      {children}
    </FormStyleContext.Provider>
  )
}

export const useFormStyle = () => {
  const context = useContext(FormStyleContext)

  if (context === undefined)
    throw new Error("useFormStyle must be used within a FormStyleProvider")

  return context
}