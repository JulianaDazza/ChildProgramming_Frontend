"use client"

import { useEffect, useState } from "react"
import { Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { ConfirmModal } from "./ui/confirmModal"
import { useAppToast } from "@/hooks/useAppToast"
import Loading from "@/app/loading"

interface Pattern {
  id_pattern: number
  name_pattern: string
  description_pattern: string
}

interface Thinklet {
  id_thinklet: number
  name_thinklet: string
  description_thinklet: string
  pattern?: Pattern | null 
}

export function ThinkletList({ searchTerm }: { searchTerm?: string }) {
  const [thinklets, setThinklets] = useState<Thinklet[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const { toastSuccess, toastError } = useAppToast()

  useEffect(() => {
    fetchThinklets()
  }, [])

  const fetchThinklets = async () => {
    try {
      const response = await fetch("/api/thinklets/list", { cache: "no-store" })
      if (!response.ok) throw new Error("Error al obtener thinklets")
      const data = await response.json()
      setThinklets(data)
      setError(null)
    } catch (err) {
      console.error("Error al cargar thinklets:", err)
      setError("Error al cargar los thinklets")
      toastError("Error al cargar los thinklets")
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
      const res = await fetch(`http://localhost:8080/api/thinklet/delete/${selectedId}`, {
        method: "DELETE",
      })

      if (res.ok) {
        toastSuccess("Thinklet eliminado correctamente")
        await fetchThinklets()
      } else {
        toastError("Error al eliminar el thinklet")
      }
    } catch (err) {
      console.error("Error eliminando thinklet:", err)
      toastError("No se pudo conectar con el servidor")
    } finally {
      setConfirmOpen(false)
      setSelectedId(null)
    }
  }

  const normalize = (t?: string) =>
    (t || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()

  const filtered = thinklets.filter(
    (t) =>
      normalize(t.name_thinklet).includes(normalize(searchTerm)) ||
      normalize(t.description_thinklet).includes(normalize(searchTerm))
  )

  if (loading) return <Loading />

  if (error)
    return (
      <div className="text-center py-10 text-red-500 text-lg">
        {error}
        <button className="processButton view ml-4" onClick={fetchThinklets}>
          Reintentar
        </button>
      </div>
    )

  if (thinklets.length === 0)
    return (
      <p className="text-center py-10 text-gray-500">
        No existen thinklets todavía.
      </p>
    )

  return (
    <>
      <div className="grid gap-6 mt-6 justify-center">
        {filtered.map((thinklet) => (
          <div key={thinklet.id_thinklet} className="processCardContainer">
            <div className="flex flex-col items-center p-6 text-center">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                {thinklet.name_thinklet}
              </h2>

              <p className="text-gray-700 mb-4">
                {thinklet.description_thinklet}
              </p>

              {/* 🔹 Patrón asociado */}
              {thinklet.pattern ? (
                <div className="patternInfoCard">
                  <h3 className="text-blue-700 font-semibold mb-1">
                    Patrón asociado:
                  </h3>
                  <p className="text-gray-800 font-medium">
                    {thinklet.pattern.name_pattern}
                  </p>
                </div>
              ) : (
                <p className="text-gray-400 italic mb-2">
                  Sin patrón asociado
                </p>
              )}

              <div className="processButtonGroup mt-4">
                <Link href={`/thinklets/edit/${thinklet.id_thinklet}`}>
                  <button className="processButton edit">
                    <Edit className="h-4 w-4" /> Editar
                  </button>
                </Link>

                <button
                  className="processButton delete"
                  onClick={() => handleDeleteClick(thinklet.id_thinklet)}
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
          title="Eliminar thinklet"
          message="¿Seguro que deseas eliminar este thinklet?"
          onConfirm={confirmDelete}
          onCancel={() => setConfirmOpen(false)}
        />
      )}
    </>
  )
}
