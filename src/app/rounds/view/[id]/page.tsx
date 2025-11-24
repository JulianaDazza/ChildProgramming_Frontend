"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  Loader2,
  Repeat,
  Pencil,
  Play,
  CheckCircle,
  Search,
} from "lucide-react"
import "../../../global.css"
import { useAppToast } from "@/hooks/useAppToast"

export default function RoundViewPage() {
  const { id } = useParams()
  const router = useRouter()
  const { toastError } = useAppToast()

  const [round, setRound] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Iconos
  const getIconForSubActivity = (name: string) => {
    name = name.trim().toUpperCase()

    switch (name) {
      case "PLANEAR_ESTRATEGIA":
        return <Pencil className="w-5 h-5 text-blue-100" stroke="white" strokeWidth={2} />
      case "APLICAR_ESTRATEGIA":
        return <Play className="w-5 h-5 text-green-100" stroke="white" strokeWidth={2} />
      case "REVISAR_ESTRATEGIA":
        return <CheckCircle className="w-5 h-5 text-yellow-100" stroke="white" strokeWidth={2} />
      case "ANALIZAR_ESTRATEGIA":
        return <Search className="w-5 h-5 text-purple-100" stroke="white" strokeWidth={2} />
      default:
        return <Repeat className="w-5 h-5 text-gray-100" />
    }
  }

  // Determinar color del círculo
  const getCircleColorClass = (subName: string) => {
    const normalized = subName.trim().toUpperCase()
    return normalized === round.round_status.trim().toUpperCase()
      ? "bg-green-600"
      : "bg-blue-600"
  }

  // Cargar info
  useEffect(() => {
    const fetchRound = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/round/${id}`)
        if (!res.ok) throw new Error("No se pudo obtener la ronda")

        const data = await res.json()
        setRound(data)
        setError(null)
      } catch (err) {
        console.error(err)
        setError("Error al cargar la ronda")
        toastError("No se pudo cargar la información de la ronda.")
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchRound()
  }, [id])

  // Loading
  if (loading)
    return (
      <div className="flex h-screen items-center justify-center gap-3">
        <Loader2 className="animate-spin text-blue-600 w-6 h-6" />
        <p className="text-blue-600 font-semibold">Cargando ronda...</p>
      </div>
    )

  // Error
  if (error)
    return (
      <div className="flex flex-col items-center justify-center h-screen text-red-500">
        <p>{error}</p>
        <button
          onClick={() => router.push("/rounds/list")}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Volver a la lista
        </button>
      </div>
    )

  if (!round)
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-500">
        <p>No se encontró la ronda.</p>
        <button
          onClick={() => router.push("/rounds/list")}
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
          
          {/* Volver */}
          <div className="flex items-center gap-3 mb-6">
            <Link href="/rounds/list" className="text-blue-600 hover:text-blue-800">
              <ArrowLeft className="inline w-5 h-5 mr-1" />
              Volver
            </Link>
          </div>

          {/* Cabecera */}
          <div className="processHeader">
            <div className="processTitleRow">
              <div className="catIconCircle small flex items-center justify-center">
                <Repeat className="w-5 h-5" stroke="white" />
              </div>
              <h1 className="heroTitle m-0">{round.name_activity}</h1>
            </div>
            <p className="text-gray-600">Detalles completos de la ronda</p>
          </div>

          {/* Info general */}
          <div className="mt-6 text-center">
            <p className="text-gray-700 text-lg mb-4">
              <strong>Descripción:</strong> {round.description_activity || "Sin descripción"}
            </p>

            <p className="text-gray-700 text-lg mb-2">
              <strong>Proceso:</strong> {round.name_process}
            </p>

            <p className="text-gray-700 text-lg mb-2">
              <strong>Estado actual:</strong> 
              <span className="font-semibold text-blue-700"> {round.round_status}</span>
            </p>
          </div>

            {/* Subactividades */}
            <div className="mt-12">

            {/* --- TÍTULO CENTRADO --- */}
            <div className="w-full flex justify-center mb-6">
                <h2 className="heroTitle text-center block w-full">Actividades de la Ronda</h2>
            </div>

            {round.subActivities?.length === 0 ? (
                <p className="text-center text-gray-600">
                No hay actividades internas registradas.
                </p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {round.subActivities.map((sub: any) => {
                    const isActive =
                    sub.name_activity.trim().toUpperCase() ===
                    round.round_status.trim().toUpperCase()

                    return (
                    <div
                        key={sub.id_activity}
                        className="bg-white border rounded-xl p-5 shadow-md hover:shadow-lg transition"
                    >

                        {/* Título con ícono */}
                        <div className="processTitleRow mb-2 flex items-center gap-3">
                        <div
                            className={`catIconCircle small flex items-center justify-center ${
                            isActive ? "!bg-green-600" : "!bg-blue-600"
                            }`}
                        >
                            {getIconForSubActivity(sub.name_activity)}
                        </div>

                        <h3
                            className={`text-lg font-semibold m-0 ${
                            isActive ? "text-green-700" : "text-gray-800"
                            }`}
                        >
                            {sub.name_activity}
                        </h3>
                        </div>

                        <p className="text-gray-700 mb-1">
                        <strong>Descripción:</strong> {sub.description_activity}
                        </p>

                        <p className="text-gray-700 mb-1">
                        <strong>Proceso:</strong> {sub.name_process}
                        </p>

                    </div>
                    )
                })}

                </div>
            )}
            </div>
            
        </div>
      </main>
    </div>
  )
}