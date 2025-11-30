"use client"

import React, { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Pencil, RefreshCcw } from "lucide-react"
import Link from "next/link"
import "../../../global.css"
import { Sidebar } from "@/components/ui/sidebar"
import { useAppToast } from "@/hooks/useAppToast"

export default function PatternEditPage() {
  const router = useRouter()
  const { id } = useParams()
  const { toastSuccess, toastError, toastWarning } = useAppToast()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    name_pattern: "",
    description_pattern: "",
  })

  const [errors, setErrors] = useState({
    name_pattern: false,
  })

  // 🧩 Cargar patrón por ID
  useEffect(() => {
    const fetchPattern = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/pattern/${id}`)
        if (!res.ok) throw new Error("Error al obtener el patrón")

        const data = await res.json()
        setFormData({
          name_pattern: data.name_pattern || "",
          description_pattern: data.description_pattern || "",
        })
      } catch (error) {
        console.error("Error cargando patrón:", error)
        toastError("No se pudo cargar la información del patrón colaborativo.")
      }
    }

    if (id) fetchPattern()
  }, [id])

  // 🧩 Manejo de cambios
  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })
    setErrors({ ...errors, [field]: false }) // limpia error al escribir
  }

  // 🧩 Actualizar patrón
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const newErrors = {
      name_pattern: !formData.name_pattern.trim(),
    }

    if (newErrors.name_pattern) {
      setErrors(newErrors)
      toastWarning("Completa los campos obligatorios antes de continuar")
      return
    }

    setLoading(true)

    try {
      const res = await fetch(`http://localhost:8080/api/pattern/update/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        toastSuccess("Patrón actualizado correctamente")
        router.push("/patterns/list")
      } else {
        const errorText = await res.text()
        toastError(`Error al actualizar el patrón: ${errorText}`)
      }
    } catch (error) {
      console.error("Error actualizando patrón:", error)
      toastError("No se pudo conectar con el servidor.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="processContainer">
      <Sidebar />

      <main className="processMain">
        <div className="processHeader">
          <div className="processTitle">
            <Pencil className="refreshIcon" />
            <h1>Editar Patrón Colaborativo</h1>
          </div>
          <p>Modifica los datos del patrón seleccionado</p>
        </div>

        <form onSubmit={handleSubmit} className="processForm space-y-5">
          {/* Nombre obligatorio */}
          <div className="formRow">
            <label>Nombre del patrón: *</label>
            <input
              type="text"
              value={formData.name_pattern}
              onChange={(e) => handleChange("name_pattern", e.target.value)}
              className={`formInput ${errors.name_pattern ? "inputError" : ""}`}
            />
          </div>

          {/* Descripción */}
          <div className="formRow">
            <label>Descripción:</label>
            <textarea
              rows={4}
              value={formData.description_pattern}
              onChange={(e) => handleChange("description_pattern", e.target.value)}
              className="formInput"
            />
          </div>

          {/* Botones */}
          <div className="buttonGroup flex justify-between mt-6">
            <Link href="/patterns/list">
              <button
                type="button"
                className="btnVolver border-2 border-blue-600 text-blue-600 font-semibold 
                  px-6 py-2 rounded-2xl hover:bg-blue-50 transition"
              >
                Cancelar
              </button>
            </Link>

            <button
              type="submit"
              className="btnCrear bg-blue-600 text-white font-semibold px-6 py-2 rounded-2xl 
                hover:bg-blue-700 transition"
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
