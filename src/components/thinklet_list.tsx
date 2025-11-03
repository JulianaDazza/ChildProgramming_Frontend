"use client"

import { useEffect, useState } from "react"
import { Eye, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { ConfirmModal } from "./ui/confirmModal"

interface Thinklet {
  id_thinklet: number
  name_thinklet: string
  description_thinklet: string
}

export function ThinkletList({ searchTerm }: { searchTerm?: string }) {
  const [thinklets, setThinklets] = useState<Thinklet[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<number | null>(null)

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
    } catch {
      setError("Error al cargar los thinklets")
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
      await fetch(`http://localhost:8080/api/thinklet/delete/${selectedId}`, { method: "DELETE" })
      await fetchThinklets()
    } catch {
      alert("Error al eliminar el thinklet")
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

  if (loading) return <p className="text-center py-10 text-blue-600 text-lg">Cargando thinklets...</p>
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
    return <p className="text-center py-10 text-gray-500">No existen thinklets todavía.</p>

  return (
    <>
      <div className="grid gap-6 mt-6">
        {filtered.map((thinklet) => (
          <div key={thinklet.id_thinklet} className="processCardContainer">
            <div className="flex flex-col items-center p-6">
              <div className="catIconCircle">
                <img src="/caticon.svg" alt="Cat Icon" />
              </div>
              <h2 className="text-lg font-semibold text-gray-800 mb-2">{thinklet.name_thinklet}</h2>
              <p className="text-gray-700 mb-4">{thinklet.description_thinklet}</p>

              <div className="processButtonGroup">
                <Link href={`/thinklets/${thinklet.id_thinklet}`}>
                  <button className="processButton view">
                    <Eye className="h-4 w-4" /> Ver
                  </button>
                </Link>
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
