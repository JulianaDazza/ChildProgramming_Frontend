"use client"

import { useEffect, useState } from "react"
import { Eye, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { ConfirmModal } from "./ui/confirmModal"

interface Practice {
  id_practice: number
  name_practice: string
  description_practice: string
  type_practice: string
}

export function PracticeList({ searchTerm }: { searchTerm?: string }) {
  const [practices, setPractices] = useState<Practice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<number | null>(null)

  useEffect(() => {
    fetchPractices()
  }, [])

  const fetchPractices = async () => {
    try {
      const response = await fetch("/api/practices/list", { cache: "no-store" })
      if (!response.ok) throw new Error("Error al obtener prácticas")
      const data = await response.json()
      setPractices(data)
    } catch {
      setError("Error al cargar las prácticas")
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
    await fetch(`http://localhost:8080/api/practice/delete/${selectedId}`, { method: "DELETE" })
    setConfirmOpen(false)
    setSelectedId(null)
    fetchPractices()
  }

  const normalize = (t?: string) =>
    (t || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
  const filtered = practices.filter(
    (p) =>
      normalize(p.name_practice).includes(normalize(searchTerm)) ||
      normalize(p.description_practice).includes(normalize(searchTerm))
  )

  if (loading) return <p className="text-center py-10 text-blue-600">Cargando prácticas...</p>
  if (error) return <p className="text-center py-10 text-red-500">{error}</p>
  if (practices.length === 0)
    return <p className="text-center py-10 text-gray-500">No existen prácticas todavía.</p>

  return (
    <>
      <div className="grid gap-6 mt-6">
        {filtered.map((practice) => (
          <div key={practice.id_practice} className="processCardContainer">
            <div className="flex flex-col items-center p-6">
              <h2 className="text-lg font-semibold">{practice.name_practice}</h2>
              <p className="text-gray-600 mb-4">{practice.description_practice}</p>
              <div className="processButtonGroup">
                <Link href={`/practices/${practice.id_practice}`}>
                  <button className="processButton view">
                    <Eye className="h-4 w-4" /> Ver
                  </button>
                </Link>
                <Link href={`/practices/edit/${practice.id_practice}`}>
                  <button className="processButton edit">
                    <Edit className="h-4 w-4" /> Editar
                  </button>
                </Link>
                <button
                  className="processButton delete"
                  onClick={() => handleDeleteClick(practice.id_practice)}
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
          title="Eliminar práctica"
          message="¿Seguro que deseas eliminar esta práctica?"
          onConfirm={confirmDelete}
          onCancel={() => setConfirmOpen(false)}
        />
      )}
    </>
  )
}
