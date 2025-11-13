"use client"

import { useEffect, useState } from "react"
import { Eye, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { ConfirmModal } from "./ui/confirmModal"
import { useAppToast } from "@/hooks/useAppToast" // 👈 Importamos el hook
import Loading from "@/app/loading"

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

  // 👇 Hook para mostrar notificaciones
  const { toastSuccess, toastError } = useAppToast()

  useEffect(() => {
    fetchPractices()
  }, [])

  const fetchPractices = async () => {
    try {
      const response = await fetch("/api/practices/list", { cache: "no-store" })
      if (!response.ok) throw new Error("Error al obtener prácticas")
      const data = await response.json()
      setPractices(data)
      setError(null)
    } catch (err) {
      console.error("Error al cargar prácticas:", err)
      setError("Error al cargar las prácticas")
      toastError("Error al cargar las prácticas")
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
      const res = await fetch(`http://localhost:8080/api/practice/delete/${selectedId}`, {
        method: "DELETE",
      })

      if (res.ok) {
        toastSuccess("Práctica eliminada correctamente")
        await fetchPractices()
      } else {
        toastError("Error al eliminar la práctica")
      }
    } catch (err) {
      console.error("Error al eliminar práctica:", err)
      toastError("No se pudo conectar con el servidor")
    } finally {
      setConfirmOpen(false)
      setSelectedId(null)
    }
  }

  const normalize = (t?: string) =>
    (t || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()

  const filtered = practices.filter(
    (p) =>
      normalize(p.name_practice).includes(normalize(searchTerm)) ||
      normalize(p.description_practice).includes(normalize(searchTerm))
  )

  if (loading)
      return <Loading/>

  if (error)
    return (
      <div className="text-center py-10 text-red-500 text-lg">
        {error}
        <button className="processButton view ml-4" onClick={fetchPractices}>
          Reintentar
        </button>
      </div>
    )

  if (practices.length === 0)
    return (
      <p className="text-center py-10 text-gray-500">
        No existen prácticas todavía.
      </p>
    )

  return (
    <>
      <div className="grid gap-6 mt-6">
        {filtered.map((practice) => (
          <div key={practice.id_practice} className="processCardContainer">
            <div className="flex flex-col items-center p-6">
              <h2 className="text-lg font-semibold">{practice.name_practice}</h2>
              <p className="text-gray-600 mb-4">{practice.description_practice}</p>
              <p className="text-gray-600 mb-4">{practice.type_practice}</p>

              <div className="processButtonGroup">

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
