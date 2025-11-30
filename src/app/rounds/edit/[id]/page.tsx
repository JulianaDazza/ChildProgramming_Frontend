"use client"

import React, { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { RefreshCcw, Pencil, Trash2, PlusCircle } from "lucide-react"
import { ConfirmModal } from "@/components/ui/confirmModal"
import Link from "next/link"
import "../../../global.css"
import { useAppToast } from "@/hooks/useAppToast"

export default function RoundEditPage() {
  const router = useRouter()
  const { id } = useParams()
  const { toastSuccess, toastError, toastWarning } = useAppToast()
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null)


  const [formData, setFormData] = useState({
    name_activity: "",
    description_activity: "",
    id_process: "",
    round_status: "",
  })

  const [activities, setActivities] = useState([])

  const roundStatusList = [
    "PLANEAR_ESTRATEGIA",
    "APLICAR_ESTRATEGIA",
    "REVISAR_ESTRATEGIA",
    "ANALIZAR_ESTRATEGIA"
  ]

  const [processName, setProcessName] = useState("")

  // ============================
  // Cargar datos de la ronda
  // ============================
  useEffect(() => {
    const fetchRound = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/round/${id}`)
        if (!res.ok) throw new Error("Error al obtener la ronda")
        const data = await res.json()

        setFormData({
          name_activity: data.name_activity || "",
          description_activity: data.description_activity || "",
          id_process: data.id_process?.toString() || "",
          round_status: data.round_status || ""
        })

        setProcessName(data.name_process)

        // Aquí vienen las subactividades
        setActivities(data.subActivities || [])
      } catch (error) {
        console.error(error)
        toastError("No se pudo cargar la ronda.")
      }
    }

    if (id) fetchRound()
  }, [id])

  // ============================
  // Manejadores
  // ============================

  const handleChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value })
  }

  const deleteActivity = async (activityId: number) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/child_activity/delete/${activityId}`,
        { method: "DELETE" }
      )

      if (!response.ok) throw new Error("Error al eliminar")

      setActivities((prev) => prev.filter((a: any) => a.id_activity !== activityId))

      toastSuccess("Actividad eliminada")
    } catch (error) {
      console.error(error)
      toastError("No se pudo eliminar la actividad.")
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!formData.name_activity.trim()) {
      toastWarning("El nombre es obligatorio.")
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`http://localhost:8080/api/round/update/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name_activity: formData.name_activity,
          description_activity: formData.description_activity,
          id_process: Number(formData.id_process),
          round_status: formData.round_status,
          id_practice: null,
          id_thinklet: null,
        })
      })

      if (response.ok) {
        toastSuccess("Ronda actualizada correctamente")
        router.push("/rounds/list")
      } else {
        const text = await response.text()
        toastError(`Error al actualizar: ${text}`)
      }
    } catch (error) {
      console.error(error)
      toastError("Error conectando con el servidor.")
    } finally {
      setLoading(false)
    }
  }

  // ============================
  // RENDER
  // ============================

  return (
    <div className="processContainer">

      <main className="processMain">
        <div className="processHeader">
          <div className="processTitle">
            <Pencil className="refreshIcon" />
            <h1>Editar Ronda</h1>
          </div>
          <p>Modifica los datos de la ronda seleccionada</p>
        </div>

        {/* FORMULARIO DE EDICIÓN */}
        <form onSubmit={handleSubmit} className="processForm space-y-5">

          <div className="formRow">
            <label>Nombre de la ronda: *</label>
            <input
              type="text"
              value={formData.name_activity}
              onChange={(e) => handleChange("name_activity", e.target.value)}
              className="formInput"
            />
          </div>

          <div className="formRow">
            <label>Descripción:</label>
            <input
              type="text"
              value={formData.description_activity}
              onChange={(e) => handleChange("description_activity", e.target.value)}
              className="formInput"
            />
          </div>

          <div className="formRow">
            <label>Estado actual de la ronda:</label>
            <select
              value={formData.round_status}
              onChange={(e) => handleChange("round_status", e.target.value)}
              className="formInput"
            >
              {roundStatusList.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div className="formRow">
            <label>Proceso asociado:</label>
            <input
              type="text"
              value={processName}
              disabled
              className="formInput bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* LISTA DE ACTIVIDADES ASOCIADAS */}
          <div className="mt-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold mb-3">Actividades asociadas</h2>
            </div>

            {activities.length === 0 ? (
              <p className="text-gray-500 mt-2">No hay actividades registradas.</p>
            ) : (
              <ul className="space-y-3 mt-3">
                {activities.map((act: any) => (
                  <li
                    key={act.id_activity}
                    className="p-4 border rounded-xl flex justify-between items-center bg-gray-50"
                  >
                    <div>
                      <p className="font-semibold">{act.name_activity}</p>
                    </div>

                    <div className="activityActions">
                      <Link href={`/activities/edit/${act.id_activity}`}>
                        <button type="button" className="btnIconEdit">
                          <Pencil size={18} />
                        </button>
                      </Link>

                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(act.id_activity)}
                        className="btnIconDelete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <Link href={`/activities/new?round_id=${id}`}>
              <button className="btnPrimary flex items-center gap-2">
                <PlusCircle size={15} />
                Nueva Actividad
              </button>
            </Link>

          </div>

          <hr className="my-10" />
          {/* BOTONES */}
          <div className="buttonGroup flex justify-between mt-6">
            <Link href="/rounds/list">
              <button
                type="button"
                className="btnVolver border-2 border-blue-600 text-blue-600 font-semibold px-6 py-2 rounded-2xl hover:bg-blue-50 transition"
              >
                Cancelar
              </button>
            </Link>

            <button
              type="submit"
              className="btnCrear bg-blue-600 text-white font-semibold px-6 py-2 rounded-2xl hover:bg-blue-700 transition"
              disabled={loading}
            >
              {loading ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
          {confirmDeleteId !== null && (
            <ConfirmModal
              title="Eliminar actividad"
              message="¿Estás seguro de eliminar esta actividad? Esta acción no se puede deshacer."
              onConfirm={() => {
                deleteActivity(confirmDeleteId!)
                setConfirmDeleteId(null)
              }}
              onCancel={() => setConfirmDeleteId(null)}
            />
          )}
        </form>
      </main>
    </div>
  )
}
