"use client"

import React, { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { RefreshCcw } from "lucide-react"
import Link from "next/link"
import "../../../global.css"
import { Sidebar } from "@/components/ui/sidebar"
import { useAppToast } from "@/hooks/useAppToast"

export default function RoleEditPage() {
  const router = useRouter()
  const { id } = useParams()
  const { toastSuccess, toastError, toastWarning } = useAppToast()
  const [loading, setLoading] = useState(false)

  // Estado de datos del formulario
  const [formData, setFormData] = useState({
    name_role: "",
    description_role: "",
    skills_role: "",
  })

  // Estado de errores visuales
  const [errors, setErrors] = useState({
    name_role: false,
    skills_role: false,
  })

  // 🔹 Cargar los datos del rol al iniciar
  useEffect(() => {
    const fetchRole = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/role/${id}`)
        if (!res.ok) throw new Error("Error al obtener el rol")
        const data = await res.json()
        setFormData({
          name_role: data.name_role || "",
          description_role: data.description_role || "",
          skills_role: data.skills_role || "",
        })
      } catch (error) {
        console.error("Error cargando rol:", error)
        toastError("No se pudo cargar la información del rol.")
      }
    }
    if (id) fetchRole()
  }, [id])

  // 🔹 Manejador de cambios
  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })
    setErrors({ ...errors, [field]: false })
  }

  // 🔹 Guardar cambios
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Validación manual
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
      const res = await fetch(`http://localhost:8080/api/role/update/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        toastSuccess("Rol actualizado correctamente")
        router.push("/roles/list")
      } else {
        const errorText = await res.text()
        toastError(`Error al actualizar el rol: ${errorText}`)
      }
    } catch (error) {
      console.error("Error actualizando rol:", error)
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
            <RefreshCcw className="refreshIcon" />
            <h1>Editar Rol</h1>
          </div>
          <p>Modifica la información del rol seleccionado</p>
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

          {/* Descripción */}
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
              value={formData.skills_role}
              onChange={(e) => handleChange("skills_role", e.target.value)}
              placeholder="Ejemplo: Comunicación, liderazgo, planificación..."
              className={`formInput ${errors.skills_role ? "inputError" : ""}`}
            />
          </div>

          {/* Botones */}
          <div className="buttonGroup flex justify-between mt-6">
            <Link href="/roles/list">
              <button type="button" className="btnVolver">
                Cancelar
              </button>
            </Link>

            <button type="submit" className="btnCrear" disabled={loading}>
              {loading ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
