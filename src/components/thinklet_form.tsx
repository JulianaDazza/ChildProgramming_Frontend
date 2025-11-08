"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { RefreshCcw } from "lucide-react"
import Link from "next/link"
import "../app/global.css"
import { Sidebar } from "./ui/sidebar"
import { useAppToast } from "@/hooks/useAppToast"

export function ThinkletForm() {
  const router = useRouter()
  const { toastSuccess, toastError, toastWarning } = useAppToast()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    name_thinklet: "",
    description_thinklet: "",
    id_pattern: "",
  })

  const [errors, setErrors] = useState({
    name_thinklet: false,
    id_pattern: false,
  })

  const [patterns, setPatterns] = useState<any[]>([])

  // 🔹 Cargar patrones colaborativos
  useEffect(() => {
    const fetchPatterns = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/pattern/list")
        const data = await response.json()
        setPatterns(data)
      } catch (error) {
        console.error("Error cargando patrones:", error)
        toastError("Error al cargar los patrones")
      }
    }
    fetchPatterns()
  }, [])

  // 🔹 Actualiza valores y limpia errores al escribir
  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })
    setErrors({ ...errors, [field]: false })
  }

  // 🔹 Enviar formulario
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const newErrors = {
      name_thinklet: !formData.name_thinklet.trim(),
      id_pattern: !formData.id_pattern.trim(),
    }

    if (newErrors.name_thinklet || newErrors.id_pattern) {
      setErrors(newErrors)
      toastWarning("Completa los campos obligatorios antes de continuar")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("http://localhost:8080/api/thinklet/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name_thinklet: formData.name_thinklet,
          description_thinklet: formData.description_thinklet,
          id_pattern: Number(formData.id_pattern),
        }),
      })

      if (response.ok) {
        toastSuccess("Thinklet creado correctamente")
        router.push("/thinklets/list")
      } else {
        const errorText = await response.text()
        toastError(`Error al crear el thinklet: ${errorText}`)
      }
    } catch (error) {
      console.error("Error creando thinklet:", error)
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
            <h1>Crear Nuevo Thinklet</h1>
          </div>
          <p>Completa la información para registrar un nuevo thinklet</p>
        </div>

        <form onSubmit={handleSubmit} className="processForm">
          {/* Nombre obligatorio */}
          <div className="formRow">
            <label>Nombre del thinklet: *</label>
            <input
              type="text"
              value={formData.name_thinklet}
              onChange={(e) => handleChange("name_thinklet", e.target.value)}
              className={`formInput ${errors.name_thinklet ? "inputError" : ""}`}
            />
          </div>

          {/* Descripción */}
          <div className="formRow">
            <label>Descripción:</label>
            <input
              type="text"
              value={formData.description_thinklet}
              onChange={(e) => handleChange("description_thinklet", e.target.value)}
              className="formInput"
            />
          </div>

          {/* Patrón colaborativo obligatorio */}
          <div className="formRow">
            <label>Patrón colaborativo asociado: *</label>
            <select
              value={formData.id_pattern}
              onChange={(e) => handleChange("id_pattern", e.target.value)}
              className={`formInput ${errors.id_pattern ? "inputError" : ""}`}
            >
              <option value="">Selecciona un patrón</option>
              {patterns.map((p) => (
                <option key={p.id_pattern} value={p.id_pattern}>
                  {p.name_pattern}
                </option>
              ))}
            </select>
          </div>

          {/* Botones */}
          <div className="buttonGroup flex justify-between mt-6">
            <Link href="/thinklets/list">
              <button type="button" className="btnVolver">
                Volver
              </button>
            </Link>

            <button type="submit" className="btnCrear" disabled={loading}>
              {loading ? "Creando..." : "Crear Thinklet"}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
