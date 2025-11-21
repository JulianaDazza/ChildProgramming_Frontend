"use client"

import { useEffect, useState } from "react"
import { Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { ConfirmModal } from "./ui/confirmModal"
import Loading from "@/app/loading"

// ⬅️ Interfaz corregida para que coincida con tu backend
interface Round {
  id_activity: number
  name_activity: string
  description_activity: string
  round_status: string
}

export function RoundList({ searchTerm }: { searchTerm?: string }) {
  const [rounds, setRounds] = useState<Round[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<number | null>(null)

  useEffect(() => {
    fetchRounds()
  }, [])

  const fetchRounds = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/round/list", { cache: "no-store" })
      if (!response.ok) throw new Error("Error al obtener rondas")
      const data = await response.json()
      setRounds(data)
    } catch {
      setError("Error al cargar las rondas")
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
    await fetch(`http://localhost:8080/api/round/delete/${selectedId}`, {
      method: "DELETE",
    })
    setConfirmOpen(false)
    setSelectedId(null)
    fetchRounds()
  }

  const normalize = (t?: string) =>
    (t || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()

  const filtered = rounds.filter(
    (r) =>
      normalize(r.name_activity).includes(normalize(searchTerm)) ||
      normalize(r.description_activity).includes(normalize(searchTerm))
  )

  if (loading) return <Loading />
  if (error) return <p className="text-center py-10 text-red-500">{error}</p>
  if (rounds.length === 0)
    return <p className="text-center py-10 text-gray-500">No existen rondas todavía.</p>

  return (
    <>
      <div className="grid gap-6 mt-6">
        {filtered.map((round) => (
          <div key={round.id_activity} className="processCardContainer">
            <div className="flex flex-col items-center p-6">
              <h2 className="text-lg font-semibold">{round.name_activity}</h2>
              <p className="text-gray-600 mb-4">{round.description_activity}</p>

              <p className="text-blue-600 text-sm font-medium">
                Estado: {round.round_status}
              </p>

              <div className="processButtonGroup">
                <Link href={`/rounds/${round.id_activity}/edit`}>
                  <button className="processButton edit">
                    <Edit className="h-4 w-4" /> Editar
                  </button>
                </Link>

                <button
                  className="processButton delete"
                  onClick={() => handleDeleteClick(round.id_activity)}
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
          title="Eliminar ronda"
          message="¿Seguro que deseas eliminar esta ronda?"
          onConfirm={confirmDelete}
          onCancel={() => setConfirmOpen(false)}
        />
      )}
    </>
  )
}
