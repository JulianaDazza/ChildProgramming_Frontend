"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Loader2 } from "lucide-react"
import "../../global.css"

interface ActivityDetail {
  id_activity: number
  name_activity: string
  description_activity: string
  iterative: boolean
  name_process?: string
  name_practice?: string
  name_thinklet?: string

  parent_round_id?: number | null
  parent_round_name?: string | null
}

export default function ActivityDetailPage() {
  const { id } = useParams()
  const router = useRouter()

  const [activity, setActivity] = useState<ActivityDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/child_activity/${id}`)
        if (!res.ok) throw new Error("No se pudo obtener la actividad")
        const data = await res.json()
        setActivity(data)
        setError(null)
      } catch (err) {
        console.error("Error cargando actividad:", err)
        setError("Error al cargar la actividad")
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchActivity()
  }, [id])

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center gap-3">
        <Loader2 className="animate-spin text-blue-600 w-6 h-6" />
        <p className="text-blue-600 font-semibold">Cargando actividad...</p>
      </div>
    )

  if (error)
    return (
      <div className="flex flex-col items-center justify-center h-screen text-red-500">
        <p>{error}</p>
        <button
          onClick={() => router.push("/activities/list")}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Volver a la lista
        </button>
      </div>
    )

  if (!activity)
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-500">
        <p>No se encontró la actividad.</p>
        <button
          onClick={() => router.push("/activities/list")}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Volver
        </button>
      </div>
    )

  return (
    <div className="processContainer">
      <main className="processMain">
        <div className="contentWrapper">
          <div className="flex items-center gap-3 mb-6">
            <Link href="/activities/list" className="text-blue-600 hover:text-blue-800">
              <ArrowLeft className="inline w-5 h-5 mr-1" />
              Volver
            </Link>
          </div>

          <div className="processHeader">
            <div className="processTitleRow">
              <div className="catIconCircle small">
                <img src="/whitetask.svg" alt="icono de actividad" />
              </div>
              <h1 className="heroTitle m-0">{activity.name_activity}</h1>
            </div>
            <p className="text-gray-600">Detalles completos de la actividad</p>
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-700 text-lg mb-4">
              <strong>Descripción:</strong> {activity.description_activity || "Sin descripción"}
            </p>

            <p className="text-gray-700 text-lg mb-2">
              <strong>Iterativa:</strong> {activity.iterative ? "Sí" : "No"}
            </p>

            {activity.name_process && (
              <p className="text-gray-700 text-lg mb-2">
                <strong>Proceso:</strong> {activity.name_process}
              </p>
            )}

            {activity.name_practice && (
              <p className="text-gray-700 text-lg mb-2">
                <strong>Práctica:</strong> {activity.name_practice}
              </p>
            )}

            {activity.name_thinklet && (
              <p className="text-gray-700 text-lg mb-2">
                <strong>Thinklet:</strong> {activity.name_thinklet}
              </p>
            )}

            {activity.parent_round_name && (
              <p className="text-gray-700 text-lg mb-2">
                <strong>Ronda asociada:</strong> {activity.parent_round_name}
              </p>
            )}

          </div>
        </div>
      </main>
    </div>
  )
}
 