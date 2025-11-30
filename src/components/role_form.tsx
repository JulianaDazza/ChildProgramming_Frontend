"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { RefreshCcw } from "lucide-react"
import Link from "next/link"
import "../app/global.css"
import { Sidebar } from "./ui/sidebar"
import { useAppToast } from "@/hooks/useAppToast"

export function RoleForm() {
  const router = useRouter()
  const { toastSuccess, toastError, toastWarning } = useAppToast()
  const [loading, setLoading] = useState(false)

  // Datos del formulario
  const [formData, setFormData] = useState({
    name_role: "",
    description_role: "",
    skills_role: "",
  })

  // Estado de errores
  const [errors, setErrors] = useState({
    name_role: false,
    skills_role: false,
  })

  // 🔹 Manejo de cambios
  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })
    setErrors({ ...errors, [field]: false }) // limpia error al escribir
  }

  // 🔹 Envío del formulario
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const newErrors = {
      name_role: !formData.name_role.trim(),
      skills_role: !formData.skills_role.trim(),
    }

    if (newErrors.name_role || newErrors.skills_role) {
      setErrors(newErrors)
      toastWarning("Completa los campos obligatorios antes de continuar")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("http://localhost:8080/api/role/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toastSuccess("Rol creado correctamente")
        router.push("/roles/list")
      } else {
        const errorText = await response.text()
        toastError(`Error al crear el rol: ${errorText}`)
      }
    } catch (error) {
      console.error("Error creando rol:", error)
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
            <h1>Crear Nuevo Rol</h1>
          </div>
          <p>Completa la información para registrar un nuevo rol colaborativo</p>
        </div>

        <form onSubmit={handleSubmit} className="processForm">
          {/* Nombre obligatorio */}
          <div className="formRow">
            <label>Nombre del rol: *</label>
            <input
              type="text"
              value={formData.name_role}
              onChange={(e) => handleChange("name_role", e.target.value)}
              className={`formInput ${errors.name_role ? "inputError" : ""}`}
            />
          </div>

          {/* Descripción opcional */}
          <div className="formRow">
            <label>Descripción:</label>
            <input
              type="text"
              value={formData.description_role}
              onChange={(e) => handleChange("description_role", e.target.value)}
              className="formInput"
            />
          </div>

          {/* Habilidades obligatorio */}
          <div className="formRow">
            <label>Habilidades: *</label>
            <input
              type="text"
              placeholder="Ejemplo: Comunicación, liderazgo, planificación..."
              value={formData.skills_role}
              onChange={(e) => handleChange("skills_role", e.target.value)}
              className={`formInput ${errors.skills_role ? "inputError" : ""}`}
            />
          </div>

          {/* Botones */}
          <div className="buttonGroup flex justify-between mt-6">
            <Link href="/roles/list">
              <button type="button" className="btnVolver">
                Volver
              </button>
            </Link>

            <button type="submit" className="btnCrear" disabled={loading}>
              {loading ? "Creando..." : "Crear Rol"}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}