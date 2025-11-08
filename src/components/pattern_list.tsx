"use client"

import { useEffect, useState } from "react"
import { Eye, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { ConfirmModal } from "./ui/confirmModal"
import { useAppToast } from "@/hooks/useAppToast" // 👈 importamos el hook

interface Pattern {
  id_pattern: number
  name_pattern: string
  description_pattern: string
}

export function PatternList({ searchTerm }: { searchTerm?: string }) {
  const [patterns, setPatterns] = useState<Pattern[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<number | null>(null)

  // 👇 Inicializamos los toasts
  const { toastSuccess, toastError } = useAppToast()

  useEffect(() => {
    fetchPatterns()
  }, [])

  const fetchPatterns = async () => {
    try {
      const res = await fetch("/api/patterns/list", { cache: "no-store" })
      if (!res.ok) throw new Error("Error al obtener los patrones")
      const data = await res.json()
      setPatterns(data)
      setError(null)
    } catch (err) {
      console.error("Error al cargar patrones:", err)
      setError("Error al cargar los patrones")
      toastError("❌ No se pudieron cargar los patrones")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClick = (id: number) => {
    setSelectedId(id)
    setConfirmOpen(true)
  }

  const confirmDelete = async () => {
    if (!selectedId) return
    try {
      const res = await fetch(`http://localhost:8080/api/pattern/delete/${selectedId}`, {
        method: "DELETE",
      })

      if (res.ok) {
        toastSuccess("Patrón eliminado correctamente")
        fetchPatterns()
      } else {
        toastError("Error al eliminar el patrón")
      }
    } catch (err) {
      console.error("Error eliminando patrón:", err)
      toastError("No se pudo conectar con el servidor")
    } finally {
      setConfirmOpen(false)
      setSelectedId(null)
    }
  }

  const normalize = (t?: string) =>
    (t || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()

  const filtered = patterns.filter((p) =>
    normalize(p.name_pattern).includes(normalize(searchTerm)) ||
    normalize(p.description_pattern).includes(normalize(searchTerm))
  )

  if (loading)
    return <p className="text-center py-10 text-blue-600">Cargando patrones...</p>

  if (error)
    return (
      <div className="text-center py-10 text-red-500">
        {error}
        <button className="processButton view ml-4" onClick={fetchPatterns}>
          Reintentar
        </button>
      </div>
    )

  if (patterns.length === 0)
    return <p className="text-center py-10 text-gray-500">No existen patrones todavía.</p>

  return (
    <>
      <div className="grid gap-6 mt-6">
        {filtered.map((pattern) => (
          <div key={pattern.id_pattern} className="processCardContainer">
            <div className="flex flex-col items-center p-6">
              <h2 className="text-lg font-semibold mb-2">{pattern.name_pattern}</h2>
              <p className="text-gray-600 mb-4">{pattern.description_pattern}</p>

              <div className="processButtonGroup">
                <Link href={`/patterns/${pattern.id_pattern}`}>
                  <button className="processButton view">
                    <Eye className="h-4 w-4" /> Ver
                  </button>
                </Link>

                <Link href={`/patterns/edit/${pattern.id_pattern}`}>
                  <button className="processButton edit">
                    <Edit className="h-4 w-4" /> Editar
                  </button>
                </Link>

                <button
                  className="processButton delete"
                  onClick={() => handleDeleteClick(pattern.id_pattern)}
                >
                  <Trash2 className="h-4 w-4" /> Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {confirmOpen && (
        <ConfirmModal
          title="Eliminar patrón"
          message="¿Seguro que deseas eliminar este patrón?"
          onConfirm={confirmDelete}
          onCancel={() => setConfirmOpen(false)}
        />
      )}
    </>
  )
}
