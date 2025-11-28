"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Upload, RefreshCcw, Link as LinkIcon } from "lucide-react"
import Link from "next/link"
import "../../app/global.css"
import { Sidebar } from "../ui/sidebar"
import { useAppToast } from "@/hooks/useAppToast"

export function ProcessForm() {
  const router = useRouter()
  const { toastSuccess, toastError, toastInfo, toastWarning } = useAppToast()

  const [formData, setFormData] = useState({
    name_process: "",
    description_process: "",
    version_process: "1.0",
    imageFile: null as File | null,
    imageUrl: "",
  })

  const [errors, setErrors] = useState({
    name_process: false,
    description_process: false,
  })

  const [loading, setLoading] = useState(false)
  
  //Cambio para redirigir a Round
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Validaciones
    const newErrors = {
      name_process: !formData.name_process.trim(),
      description_process: !formData.description_process.trim(),
    }
    setErrors(newErrors)

    if (Object.values(newErrors).some(Boolean)) {
      toastWarning("Por favor completa los campos obligatorios")
      return
    }

    // Construimos FormData
    const data = new FormData()
    data.append("name_process", formData.name_process)
    data.append("description_process", formData.description_process)
    data.append("version_process", formData.version_process)

    if (formData.imageFile) data.append("image", formData.imageFile)
    else if (formData.imageUrl.trim()) data.append("imageUrl", formData.imageUrl)

    setLoading(true)

    try {
      const response = await fetch("http://localhost:8080/api/colaborative_process/create", {
        method: "POST",
        body: data,
      })

      if (!response.ok) {
        const errorText = await response.text()
        toastError("Error al crear el proceso: " + errorText)
        return
      }

      const created = await response.json() // ⬅️ AQUÍ RECIBIMOS id_process

      toastSuccess("Proceso creado correctamente")

      // 🔵 REDIRECCIÓN AUTOMÁTICA A CREAR UNA RONDA
      router.push(`/rounds/new?id_process=${created.id_process}`)

    } catch (error) {
      console.error("Error creando proceso:", error)
      toastError("No se pudo conectar con el servidor")
    } finally {
      setLoading(false)
    }
  }

  //Enviar datos al backend
  /*const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Validar campos requeridos
    const newErrors = {
      name_process: !formData.name_process.trim(),
      description_process: !formData.description_process.trim(),
    }
    setErrors(newErrors)

    if (Object.values(newErrors).some(Boolean)) {
      toastWarning("Por favor completa los campos obligatorios")
      return
    }

    // Crear el FormData para enviar como multipart/form-data
    const data = new FormData()
    data.append("name_process", formData.name_process)
    data.append("description_process", formData.description_process)
    data.append("version_process", formData.version_process)

    if (formData.imageFile) {
      data.append("image", formData.imageFile) // archivo
    } else if (formData.imageUrl.trim()) {
      data.append("imageUrl", formData.imageUrl) // url
    }

    setLoading(true)
    try {
      const response = await fetch("http://localhost:8080/api/colaborative_process/create", {
        method: "POST",
        body: data, // no headers, FormData se encarga
      })

      if (response.ok) {
        toastSuccess("Proceso creado correctamente")
        router.push("/")
      } else {
        const errorText = await response.text()
        toastError("Error al crear el proceso: " + errorText)
      }
    } catch (error) {
      console.error("Error creando proceso:", error)
      toastError("No se pudo conectar con el servidor")
    } finally {
      setLoading(false)
    }
  }*/

  // 🧩 Manejar cambios de texto
  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })
    setErrors({ ...errors, [field]: false })
  }

  // 🖼 Manejar subida de archivo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFormData({ ...formData, imageFile: file, imageUrl: "" }) // limpiar URL si sube archivo
  }

  return (
    <div className="processContainer">
      <Sidebar />

      <main className="processMain">
        <div className="processHeader">
          <div className="processTitle">
            <RefreshCcw className="refreshIcon" />
            <h1>Crear Nuevo Proceso</h1>
          </div>
          <p>Completa la información para crear un nuevo proceso colaborativo.</p>
        </div>

        <form onSubmit={handleSubmit} className="processForm">
          {/* Nombre */}
          <div className="formRow">
            <label>
              Nombre del proceso: <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name_process}
              onChange={(e) => handleChange("name_process", e.target.value)}
              className={`formInput ${errors.name_process ? "inputError" : ""}`}
            />
          </div>

          {/* Descripción */}
          <div className="formRow">
            <label>
              Descripción del proceso: <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.description_process}
              onChange={(e) => handleChange("description_process", e.target.value)}
              className={`formInput ${errors.description_process ? "inputError" : ""}`}
            />
          </div>

          {/* Versión */}
          <div className="formRow">
            <label>Versión:</label>
            <input
              type="text"
              value={formData.version_process}
              onChange={(e) => handleChange("version_process", e.target.value)}
              className="formInput"
            />
          </div>

          {/* Imagen: subir archivo o usar URL */}
          <div className="formRow">
            <label>Imagen:</label>

            <div className="fileUploadWrapper">

              {/* Botón bonito de archivo */}
              <label className="fileUpload">
                <Upload className="fileUploadIcon" />
                Seleccionar imagen
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>

              {/* Input para URL */}
              <input
                type="text"
                placeholder="O pega una URL de imagen"
                value={formData.imageUrl}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    imageUrl: e.target.value,
                    imageFile: null, // si escribe URL, limpiamos archivo
                  })
                }
                className="formInput flex-1"
              />
            </div>
          </div>


          <div className="buttonGroup">
            <Link href="/">
              <button type="button" className="btnVolver">
                Volver
              </button>
            </Link>
            <button type="submit" className="btnCrear" disabled={loading}>
              {loading ? "Creando..." : "Crear"}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}