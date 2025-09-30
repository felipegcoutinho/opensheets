"use client"
import React from "react"

type EntityNameContext = {
  name: string | null
  setName: (value: string | null) => void
}

const Ctx = React.createContext<EntityNameContext | undefined>(undefined)

export function EntityNameStoreProvider({ children }: { children: React.ReactNode }) {
  const [name, setName] = React.useState<string | null>(null)
  const value = React.useMemo(() => ({ name, setName }), [name])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useEntityNameStore() {
  const ctx = React.useContext(Ctx)
  if (!ctx) throw new Error("EntityNameStoreProvider ausente no topo da árvore")
  return ctx
}

