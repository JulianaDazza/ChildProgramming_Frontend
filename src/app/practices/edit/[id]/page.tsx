"use client"

import React, { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Pencil, RefreshCcw } from "lucide-react"
import Link from "next/link"
import "../../../global.css"
import { Sidebar } from "@/components/ui/sidebar"
import { useAppToast } from "@/hooks/useAppToast"

export default function PracticeEditPage() {
  const router = useRouter()
  const { id } = useParams()
  const { toastSuccess, toastError, toastWarning } = useAppToast()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    name_practice: "",
    description_practice: "",
    type_practice: "",
  })

  const [errors, setErrors] = useState({
    name_practice: false,
    type_practice: false,
  })

  // Enum del backend (tipos de práctica)
  const practiceTypes = ["COGNITIVA", "AGIL", "COLABORATIVA"]

  // 🧩 Cargar práctica por ID
  useEffect(() => {
    const fetchPractice = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/practice/${id}`)
        if (!res.ok) throw new Error("Error al obtener la práctica")

        const data = await res.json()
        setFormData({
          name_practice: data.name_practice || "",
          description_practice: data.description_practice || "",
          type_practice: data.type_practice || "",
        })
      } catch (error) {
        console.error("Error cargando práctica:", error)
        toastError("No se pudo cargar la información de la práctica.")
      }
    }

    if (id) fetchPractice()
  }, [id])

  // 🧩 Manejo de cambios
  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })
    setErrors({ ...errors, [field]: false })
  }

  // 🧩 Guardar cambios
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const newErrors = {
      name_practice: !formData.name_practice.trim(),
      type_practice: !formData.type_practice.trim(),
    }

    if (newErrors.name_practice || newErrors.type_practice) {
      setErrors(newErrors)
      toastWarning("Completa los campos obligatorios antes de continuar")
      return
    }

    setLoading(true)

    try {
      const res = await fetch(`http://localhost:8080/api/practice/update/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        toastSuccess("Práctica actualizada correctamente")
        router.push("/practices/list")
      } else {
        const errorText = await res.text()
        toastError(`Error al actualizar la práctica: ${errorText}`)
      }
    } catch (error) {
      console.error("Error actualizando práctica:", error)
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
            <h1>Editar Práctica</h1>
          </div>
          <p>Modifica los datos de la práctica seleccionada</p>
        </div>

        <form onSubmit={handleSubmit} className="processForm space-y-5">
          {/* Nombre obligatorio */}
          <div className="formRow">
            <label>Nombre de la práctica: *</label>
            <input
              type="text"
              value={formData.name_practice}
              onChange={(e) => handleChange("name_practice", e.target.value)}
              className={`formInput ${errors.name_practice ? "inputError" : ""}`}
            />
          </div>

          {/* Descripción opcional */}
          <div className="formRow">
            <label>Descripción:</label>
            <input
              type="text"
              value={formData.description_practice}
              onChange={(e) => handleChange("description_practice", e.target.value)}
              className="formInput"
            />
          </div>

          {/* Tipo obligatorio */}
          <div className="formRow">
            <label>Tipo de práctica: *</label>
            <select
              value={formData.type_practice}
              onChange={(e) => handleChange("type_practice", e.target.value)}
              className={`formInput ${errors.type_practice ? "inputError" : ""}`}
            >
              <option value="">Selecciona un tipo</option>
              {practiceTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Botones */}
          <div className="buttonGroup flex justify-between mt-6">
            <Link href="/practices/list">
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
