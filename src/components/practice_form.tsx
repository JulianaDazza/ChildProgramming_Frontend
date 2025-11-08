"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { RefreshCcw } from "lucide-react"
import Link from "next/link"
import "../app/global.css"
import { Sidebar } from "./ui/sidebar"
import { useAppToast } from "@/hooks/useAppToast"

export function PracticeForm() {
  const router = useRouter()
  const { toastSuccess, toastError, toastWarning } = useAppToast()
  const [loading, setLoading] = useState(false)

  // Estado de errores
  const [errors, setErrors] = useState({
    name_practice: false,
    type_practice: false,
  })

  const [formData, setFormData] = useState({
    name_practice: "",
    description_practice: "",
    type_practice: "",
  })

  const practiceTypes = ["COGNITIVA", "AGIL", "COLABORATIVA"]

  // 🔹 Maneja los cambios
  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })
    // 🔹 Quita el error visual si el usuario empieza a escribir
    setErrors({ ...errors, [field]: false })
  }

  // 🔹 Enviar formulario
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const newErrors = {
      name_practice: !formData.name_practice.trim(),
      type_practice: !formData.type_practice.trim(),
    }

    // 🔹 Mostrar advertencia si hay errores
    if (newErrors.name_practice || newErrors.type_practice) {
      setErrors(newErrors)
      toastWarning("Completa los campos obligatorios antes de continuar")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("http://localhost:8080/api/practice/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toastSuccess("Práctica creada correctamente")
        router.push("/practices/list")
      } else {
        const errorText = await response.text()
        toastError(`Error al crear la práctica: ${errorText}`)
      }
    } catch (error) {
      console.error("Error creando práctica:", error)
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
            <h1>Crear Nueva Práctica</h1>
          </div>
          <p>Completa la información para registrar una nueva práctica</p>
        </div>

        <form onSubmit={handleSubmit} className="processForm">
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

          {/* Descripción */}
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
                Volver
              </button>
            </Link>
            <button type="submit" className="btnCrear" disabled={loading}>
              {loading ? "Creando..." : "Crear Práctica"}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}