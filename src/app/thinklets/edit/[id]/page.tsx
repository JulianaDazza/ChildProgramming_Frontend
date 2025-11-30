"use client"

import React, { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Pencil, RefreshCcw } from "lucide-react"
import Link from "next/link"
import "../../../global.css"
import { Sidebar } from "@/components/ui/sidebar"
import { useAppToast } from "@/hooks/useAppToast"

export default function ThinkletEditPage() {
  const router = useRouter()
  const { id } = useParams()
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

  // 🧩 Cargar thinklet y patrones
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [patternRes, thinkletRes] = await Promise.all([
          fetch("http://localhost:8080/api/pattern/list"),
          fetch(`http://localhost:8080/api/thinklet/${id}`),
        ])

        const patternData = await patternRes.json()
        setPatterns(patternData)

        if (!thinkletRes.ok) throw new Error("Error al obtener el thinklet")
        const data = await thinkletRes.json()

        setFormData({
          name_thinklet: data.name_thinklet || "",
          description_thinklet: data.description_thinklet || "",
          id_pattern: data.pattern?.id_pattern || "",
        })
      } catch (error) {
        console.error("Error cargando datos:", error)
        toastError("No se pudo cargar la información del thinklet.")
      }
    }

    if (id) fetchAll()
  }, [id])

  // 🧩 Actualizar datos del formulario
  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })
    setErrors({ ...errors, [field]: false }) // limpiar error cuando el usuario corrige
  }

  // 🧩 Enviar actualización
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const newErrors = {
      name_thinklet: !formData.name_thinklet.trim(),
      id_pattern: !formData.id_pattern,
    }

    if (newErrors.name_thinklet || newErrors.id_pattern) {
      setErrors(newErrors)
      toastWarning("Completa los campos obligatorios antes de continuar")
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`http://localhost:8080/api/thinklet/update/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name_thinklet: formData.name_thinklet,
          description_thinklet: formData.description_thinklet,
          id_pattern: Number(formData.id_pattern),
        }),
      })

      if (res.ok) {
        toastSuccess("Thinklet actualizado correctamente")
        router.push("/thinklets/list")
      } else {
        const errorText = await res.text()
        toastError(`Error al actualizar el thinklet: ${errorText}`)
      }
    } catch (error) {
      console.error("Error actualizando thinklet:", error)
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
            <h1>Editar Thinklet</h1>
          </div>
          <p>Modifica los datos del thinklet seleccionado</p>
        </div>

        <form onSubmit={handleSubmit} className="processForm space-y-5">
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

          {/* Descripción opcional */}
          <div className="formRow">
            <label>Descripción:</label>
            <input
              type="text"
              value={formData.description_thinklet}
              onChange={(e) => handleChange("description_thinklet", e.target.value)}
              className="formInput"
            />
          </div>

          {/* Patrón obligatorio */}
          <div className="formRow">
            <label>Patrón asociado: *</label>
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
