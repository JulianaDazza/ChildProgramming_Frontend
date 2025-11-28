"use client"

import React, { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { RefreshCcw } from "lucide-react"
import Link from "next/link"
import "../../../global.css"
import { useAppToast } from "@/hooks/useAppToast"

export default function ActivityEditPage() {
  const router = useRouter()
  const { id } = useParams()
  const { toastSuccess, toastError, toastWarning } = useAppToast()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    name_activity: "",
    description_activity: "",
    id_process: "",
    id_practice: "",
    id_thinklet: "",
    parent_round_id: "",
  })

  const [errors, setErrors] = useState({
    name_activity: false,
    id_process: false,
  })

  const [processes, setProcesses] = useState<any[]>([])
  const [practices, setPractices] = useState<any[]>([])
  const [thinklets, setThinklets] = useState<any[]>([])
  const [rounds, setRounds] = useState<any[]>([])

  // Cargar datos iniciales
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [procRes, pracRes, thinkRes, roundRes] = await Promise.all([
          fetch("http://localhost:8080/api/colaborative_process/list"),
          fetch("http://localhost:8080/api/practice/list"),
          fetch("http://localhost:8080/api/thinklet/list"),
          fetch("http://localhost:8080/api/round/list"),
        ])

        setProcesses(await procRes.json())
        setPractices(await pracRes.json())
        setThinklets(await thinkRes.json())
        setRounds(await roundRes.json())

        // Cargar actividad específica
        const actRes = await fetch(`http://localhost:8080/api/child_activity/${id}`)
        if (!actRes.ok) throw new Error("Error al obtener la actividad")
        const data = await actRes.json()

        setFormData({
          name_activity: data.name_activity || "",
          description_activity: data.description_activity || "",
          id_process: data.id_process ? data.id_process.toString() : "",
          id_practice: data.id_practice ? data.id_practice.toString() : "",
          id_thinklet: data.id_thinklet ? data.id_thinklet.toString() : "",
          parent_round_id: data.parent_round_id ? data.parent_round_id.toString() : "",
        })
      } catch (error) {
        console.error("Error cargando datos:", error)
        toastError("No se pudo cargar la información de la actividad.")
      }
    }

    if (id) fetchAll()
  }, [id])

  // Manejar cambios en los campos
  const handleChange = (field: string, value: string | boolean) => {
    setFormData({ ...formData, [field]: value })
    setErrors({ ...errors, [field]: false }) // limpia el error visual
  }

  // Guardar cambios
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Validar campos requeridos
    const newErrors = {
      name_activity: !formData.name_activity.trim(),
      id_process: !formData.id_process,
    }

    if (newErrors.name_activity || newErrors.id_process) {
      setErrors(newErrors)
      toastWarning("Completa los campos obligatorios antes de continuar")
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`http://localhost:8080/api/child_activity/update/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name_activity: formData.name_activity,
          description_activity: formData.description_activity,
          id_process: Number(formData.id_process),
          id_practice: formData.id_practice ? Number(formData.id_practice) : null,
          id_thinklet: formData.id_thinklet ? Number(formData.id_thinklet) : null,
          parent_round_id: formData.parent_round_id ? Number(formData.parent_round_id) : null,
        }),
      })

      if (response.ok) {
        toastSuccess("Actividad actualizada correctamente")
        router.push("/activities/list")
      } else {
        const errorText = await response.text()
        toastError(`Error al actualizar la actividad: ${errorText}`)
      }
    } catch (error) {
      console.error("Error actualizando actividad:", error)
      toastError("No se pudo conectar con el servidor.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="processContainer">

      <main className="processMain">
        <div className="processHeader">
          <div className="processTitle">
            <RefreshCcw className="refreshIcon" />
            <h1>Editar Actividad</h1>
          </div>
          <p>Modifica los datos de la actividad seleccionada</p>
        </div>

        <form onSubmit={handleSubmit} className="processForm space-y-5">
          {/* Nombre obligatorio */}
          <div className="formRow">
            <label>Nombre de la actividad: *</label>
            <input
              type="text"
              value={formData.name_activity}
              onChange={(e) => handleChange("name_activity", e.target.value)}
              className={`formInput ${errors.name_activity ? "inputError" : ""}`}
            />
          </div>

          {/* Descripción opcional */}
          <div className="formRow">
            <label>Descripción:</label>
            <input
              type="text"
              value={formData.description_activity}
              onChange={(e) => handleChange("description_activity", e.target.value)}
              className="formInput"
            />
          </div>

          {/* Proceso obligatorio */}
          <div className="formRow">
            <label>Proceso asociado:</label>
            <select
              value={formData.id_process}
              disabled
              className="formInput bg-gray-100 cursor-not-allowed text-gray-600"
            >
              <option value="">Selecciona un proceso</option>
              {processes.map((p) => (
                <option key={p.id_process} value={p.id_process}>
                  {p.name_process}
                </option>
              ))}
            </select>
             {/* Valor oculto para que SÍ se envíe al backend */}
            <input
              type="hidden"
              name="id_process"
              value={formData.id_process}
            />
          </div>

          {/* Ronda padre (NO editable) */}
          <div className="formRow">
            <label>Ronda padre:</label>
            <select
              value={formData.parent_round_id}
              disabled
              className="formInput bg-gray-100 cursor-not-allowed text-gray-600"
            >
              <option value="">Sin ronda padre</option>
              {rounds.map((r) => (
                <option key={r.id_activity} value={r.id_activity}>
                  {r.name_activity}
                </option>
              ))}
            </select>

            {/* Hidden para que SÍ se envíe */}
            <input
              type="hidden"
              name="parent_round_id"
              value={formData.parent_round_id}
            />
          </div>

          {/* Práctica */}
          <div className="formRow">
            <label>Práctica:</label>
            <select
              value={formData.id_practice}
              onChange={(e) => handleChange("id_practice", e.target.value)}
              className="formInput"
            >
              <option value="">Selecciona una práctica</option>
              {practices.map((pr) => (
                <option key={pr.id_practice} value={pr.id_practice}>
                  {pr.name_practice}
                </option>
              ))}
            </select>
          </div>

          {/* Thinklet */}
          <div className="formRow">
            <label>Thinklet:</label>
            <select
              value={formData.id_thinklet}
              onChange={(e) => handleChange("id_thinklet", e.target.value)}
              className="formInput"
            >
              <option value="">Selecciona un thinklet</option>
              {thinklets.map((th) => (
                <option key={th.id_thinklet} value={th.id_thinklet}>
                  {th.name_thinklet}
                </option>
              ))}
            </select>
          </div>

          {/* Botones */}
          <div className="buttonGroup flex justify-between mt-6">
            <Link href="/activities/list">
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
        </form>
      </main>
    </div>
  )
}
