"use client"
import { useEffect } from "react"
import { useEntityNameStore } from "@/components/entity-name-store"

export default function EntityNameSetter({ name }: { name: string | null }) {
  const { setName } = useEntityNameStore()
  useEffect(() => {
    setName(name ?? null)
    return () => setName(null)
  }, [name, setName])
  return null
}

