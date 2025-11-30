"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { RefreshCcw } from "lucide-react"
import Link from "next/link"
import "../app/global.css"
import { Sidebar } from "./ui/sidebar"
import { useAppToast } from "@/hooks/useAppToast"

export function CollaborativePatternForm() {
  const router = useRouter()
  const { toastSuccess, toastError, toastWarning } = useAppToast()
  const [loading, setLoading] = useState(false)

  // Datos del formulario
  const [formData, setFormData] = useState({
    name_pattern: "",
    description_pattern: "",
  })

  // Estado de errores
  const [errors, setErrors] = useState({
    name_pattern: false,
  })

  // 🔹 Manejador de cambios
  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })
    setErrors({ ...errors, [field]: false })
  }

  // 🔹 Enviar formulario
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Validación manual
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
      const response = await fetch("http://localhost:8080/api/pattern/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toastSuccess("Patrón creado correctamente")
        router.push("/patterns/list")
      } else {
        const errorText = await response.text()
        toastError(`Error al crear el patrón: ${errorText}`)
      }
    } catch (error) {
      console.error("Error creando patrón:", error)
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
            <h1>Crear Nuevo Patrón Colaborativo</h1>
          </div>
          <p>Completa la información para registrar un nuevo patrón colaborativo</p>
        </div>

        <form onSubmit={handleSubmit} className="processForm">
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

          {/* Descripción opcional */}
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
              <button type="button" className="btnVolver">
                Volver
              </button>
            </Link>

            <button type="submit" className="btnCrear" disabled={loading}>
              {loading ? "Creando..." : "Crear Patrón"}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
