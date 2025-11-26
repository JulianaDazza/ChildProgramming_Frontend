"use client"

import { useEffect, useState } from "react"
import { Eye, Edit, Trash2, Users } from "lucide-react"
import Link from "next/link"
import { ConfirmModal } from "../ui/confirmModal"
import { useAppToast } from "@/hooks/useAppToast"
import Loading from "@/app/loading"

/* Interfaz actualizada según el DTO del backend */
interface Activity {
  id_activity: number
  name_activity: string
  description_activity: string
  iterative: boolean

  id_process?: number
  id_practice?: number
  id_thinklet?: number

  name_process?: string
  name_practice?: string
  name_thinklet?: string
  parent_round_name?: string

  parent_round_id?: number | null
}

/* Props con filtros */
interface ActivityListProps {
  searchTerm?: string
  processFilter?: string
  roundFilter?: string
}

export function ActivityList({
  searchTerm,
  processFilter,
  roundFilter
}: ActivityListProps) {

  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const { toastSuccess, toastError } = useAppToast()

  useEffect(() => {
    fetchActivities()
  }, [])

  const fetchActivities = async () => {
    try {
      const response = await fetch("/api/activities/list")
      if (!response.ok) throw new Error("Error al obtener las actividades")
      const data = await response.json()
      setActivities(data)
      setError(null)
    } catch (err) {
      setError("Error al cargar las actividades")
      toastError("Error al cargar las actividades")
    } finally {
      setLoading(false)
    }
  }

  const normalize = (text: string) =>
    text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()

  /* APLICACIÓN DE FILTROS */
  const filtered = activities.filter((act) => {
    const query = normalize(searchTerm || "")

    const matchesSearch =
      normalize(act.name_activity).includes(query) ||
      normalize(act.description_activity || "").includes(query)

    const matchesProcess =
      processFilter ? act.id_process === Number(processFilter) : true

    const matchesRound =
      roundFilter ? act.parent_round_id === Number(roundFilter) : true

    return matchesSearch && matchesProcess && matchesRound
  })

  /* Loading */
  if (loading) return <Loading />

  /* Error */
  if (error) return (
    <div className="text-center py-10 text-red-500 text-lg">
      {error}
      <button className="processButton view ml-4" onClick={fetchActivities}>
        Reintentar
      </button>
    </div>
  )

  /* No actividades */
  if (filtered.length === 0)
    return (
      <div className="text-center py-10 text-gray-500">
        No hay actividades para los filtros seleccionados.
      </div>
    )

  return (
    <>
      <div className="grid gap-6 mt-6">
        {filtered.map((activity) => (
          <div key={activity.id_activity} className="processCardContainer">
            <div className="flex flex-col items-center justify-center p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                {activity.name_activity}
              </h2>
              <p className="text-gray-600 mb-1">{activity.description_activity}</p>

              <p className="text-sm text-gray-500 mb-3">
                {activity.name_process ? `Proceso: ${activity.name_process}` : ""}
                {activity.name_practice ? ` · Práctica: ${activity.name_practice}` : ""}
                {activity.name_thinklet ? ` · Thinklet: ${activity.name_thinklet}` : ""}
              </p>

              {activity.parent_round_name && (
                <p className="text-sm text-blue-600 mb-2">
                  Ronda asociada: {activity.parent_round_name}
                </p>
              )}

              <p className="text-xs text-gray-500 mb-4">
                {activity.iterative ? "Iterativa" : "No iterativa"}
              </p>

              <div className="processButtonGroup">
                <Link href={`/activities/${activity.id_activity}`}>
                  <button className="processButton view">
                    <Eye className="h-4 w-4" />
                    Ver
                  </button>
                </Link>

                <Link href={`/activities/edit/${activity.id_activity}`}>
                  <button className="processButton edit">
                    <Edit className="h-4 w-4" />
                    Editar
                  </button>
                </Link>

                <Link href={`/activities/assign/${activity.id_activity}`}>
                  <button className="processButton pdf">
                    <Users className="h-4 w-4" />
                    Asignar Roles
                  </button>
                </Link>

                <button
                  className="processButton delete"
                  onClick={() => {
                    setSelectedId(activity.id_activity)
                    setConfirmOpen(true)
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                  Eliminar
                </button>
              </div>

            </div>
          </div>
        ))}
      </div>

      {confirmOpen && (
        <ConfirmModal
          title="Eliminar actividad"
          message="¿Seguro que deseas eliminar esta actividad?"
          onConfirm={async () => {
            if (!selectedId) return
            await fetch(`http://localhost:8080/api/child_activity/delete/${selectedId}`, {
              method: "DELETE"
            })
            toastSuccess("Actividad eliminada correctamente")
            fetchActivities()
            setConfirmOpen(false)
          }}
          onCancel={() => setConfirmOpen(false)}
        />
      )}
    </>
  )
}
