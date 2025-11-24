"use client"

import React, { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { RefreshCcw } from "lucide-react"
import Link from "next/link"
import "../../../global.css"
import { useAppToast } from "@/hooks/useAppToast"

export default function RoundEditPage() {
  const router = useRouter()
  const { id } = useParams()
  const { toastSuccess, toastError, toastWarning } = useAppToast()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    name_activity: "",
    description_activity: "",
    id_process: "",
    round_status: "",
    iterative: true
  })

  const roundStatusList = [
    "PLANEAR_ESTRATEGIA",
    "APLICAR_ESTRATEGIA",
    "REVISAR_ESTRATEGIA",
    "ANALIZAR_ESTRATEGIA"
  ]

  // Datos del proceso para mostrar su nombre
  const [processName, setProcessName] = useState("")

  useEffect(() => {
    const fetchRound = async () => {
      try {
        const roundRes = await fetch(`http://localhost:8080/api/round/${id}`)
        if (!roundRes.ok) throw new Error("Error al obtener la ronda")
        const data = await roundRes.json()

        setFormData({
          name_activity: data.name_activity || "",
          description_activity: data.description_activity || "",
          id_process: data.id_process?.toString() || "",
          round_status: data.round_status || "",
          iterative: true
        })

        setProcessName(data.name_process)
      } catch (error) {
        console.error(error)
        toastError("No se pudo cargar la información de la ronda.")
      }
    }

    if (id) fetchRound()
  }, [id])

  const handleChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value })
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
          id_practice: null,     // Siempre null → no se edita
          id_thinklet: null,     // Siempre null → no se edita
          iterative: true
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

  return (
    <div className="processContainer">

      <main className="processMain">
        <div className="processHeader">
          <div className="processTitle">
            <RefreshCcw className="refreshIcon" />
            <h1>Editar Ronda</h1>
          </div>
          <p>Modifica los datos de la ronda seleccionada</p>
        </div>

        <form onSubmit={handleSubmit} className="processForm space-y-5">

          {/* Nombre */}
          <div className="formRow">
            <label>Nombre de la ronda: *</label>
            <input
              type="text"
              value={formData.name_activity}
              onChange={(e) => handleChange("name_activity", e.target.value)}
              className="formInput"
            />
          </div>

          {/* Descripción */}
          <div className="formRow">
            <label>Descripción:</label>
            <input
              type="text"
              value={formData.description_activity}
              onChange={(e) => handleChange("description_activity", e.target.value)}
              className="formInput"
            />
          </div>

          {/* Estado de la ronda */}
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

          {/* Iterativa (disabled) */}
          <div className="formRow flex items-center">
            <label className="text-gray-800 font-medium mr-3">Iterativa:</label>

            <label className="toggleSwitch">
              <input
                type="checkbox"
                checked={formData.iterative}
                disabled
              />
              <span className="slider">
                <span className="toggleText">
                  {formData.iterative ? "YES" : "NO"}
                </span>
              </span>
            </label>
          </div>

          {/* Proceso (solo lectura) */}
          <div className="formRow">
            <label>Proceso asociado:</label>
            <input
              type="text"
              value={processName}
              disabled
              className="formInput bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* Botones */}
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
        </form>
      </main>
    </div>
  )
}