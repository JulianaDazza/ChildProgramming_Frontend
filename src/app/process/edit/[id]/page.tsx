"use client"

import React, { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { RefreshCcw, Upload } from "lucide-react"
import Link from "next/link"
import "../../../global.css"
import { Sidebar } from "@/components/ui/sidebar"
import { useAppToast } from "@/hooks/useAppToast"
import { ImageViewer } from "@/components/ui/imageViewer"

export default function ProcessEditPage() {
  const router = useRouter()
  const { id } = useParams()
  const { toastSuccess, toastError, toastWarning } = useAppToast()

  const [loading, setLoading] = useState(false)
  const [processData, setProcessData] = useState({
    name_process: "",
    description_process: "",
    version_process: "",
    image: "",
  })

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [errors, setErrors] = useState({ name_process: false })
  const [modalOpen, setModalOpen] = useState(false)

  //Cargar datos del proceso
  useEffect(() => {
    const fetchProcess = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/colaborative_process/${id}`)
        if (!response.ok) throw new Error("Error al obtener el proceso")

        const data = await response.json()
        setProcessData({
          name_process: data.name_process || "",
          description_process: data.description_process || "",
          version_process: data.version_process || "",
          image: data.image || "",
        })
      } catch (error) {
        console.error("Error cargando el proceso:", error)
        toastError("No se pudo cargar la información del proceso.")
      }
    }

    if (id) fetchProcess()
  }, [id])

  //Evita que se desplace el fondo al abrir la imagen
  useEffect(() => {
    if (modalOpen) document.body.style.overflow = "hidden"
    else document.body.style.overflow = "auto"
  }, [modalOpen])

  // 🧩 Manejar cambios
  const handleChange = (field: string, value: string) => {
    setProcessData({ ...processData, [field]: value })
    setErrors({ ...errors, [field]: false })
  }

  // 🖼️ Manejar cambio de archivo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setImageFile(file)
    if (file) {
      toastWarning("Se reemplazará la imagen actual por el nuevo archivo al guardar.")
    }
  }

  // 🧩 Enviar cambios
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!processData.name_process.trim()) {
      setErrors({ name_process: true })
      toastWarning("Completa los campos obligatorios antes de continuar")
      return
    }

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append("name_process", processData.name_process)
      formData.append("description_process", processData.description_process)
      formData.append("version_process", processData.version_process)

      if (imageFile) {
        formData.append("image", imageFile)
      } else if (processData.image.trim()) {
        formData.append("imageUrl", processData.image)
      }

      const response = await fetch(`http://localhost:8080/api/colaborative_process/update/${id}`, {
        method: "PATCH",
        body: formData,
      })

      if (response.ok) {
        toastSuccess("Proceso actualizado correctamente")
        router.push("/")
      } else {
        const errorText = await response.text()
        toastError(`Error al actualizar el proceso: ${errorText}`)
      }
    } catch (error) {
      console.error("Error actualizando proceso:", error)
      toastError("No se pudo conectar con el servidor.")
    } finally {
      setLoading(false)
    }
  }

  // 🔹 Obtener la URL visible (si es local o externa)
  const getImageUrl = () => {
    if (!processData.image) return null
    if (processData.image.startsWith("http")) {
      return processData.image
    }
    // Ruta local servida desde backend
    return `http://localhost:8080/processImages/${processData.image}`
  }

  return (
    <div className="processContainer">
      <Sidebar />

      <main className="processMain">
        <div className="processHeader">
          <div className="processTitle">
            <RefreshCcw className="refreshIcon" />
            <h1>Editar Proceso</h1>
          </div>
          <p>Modifica la información del proceso colaborativo.</p>
        </div>

        <form onSubmit={handleSubmit} className="processForm space-y-5">
          {/* Nombre */}
          <div className="formRow">
            <label>Nombre del proceso: *</label>
            <input
              type="text"
              value={processData.name_process}
              onChange={(e) => handleChange("name_process", e.target.value)}
              className={`formInput ${errors.name_process ? "inputError" : ""}`}
            />
          </div>

          {/* Descripción */}
          <div className="formRow">
            <label>Descripción:</label>
            <input
              type="text"
              value={processData.description_process}
              onChange={(e) => handleChange("description_process", e.target.value)}
              className="formInput"
            />
          </div>

          {/* Versión */}
          <div className="formRow">
            <label>Versión:</label>
            <input
              type="text"
              value={processData.version_process}
              onChange={(e) => handleChange("version_process", e.target.value)}
              className="formInput"
            />
          </div>

          {/* Imagen actual */}
          <div className="formRow">
            <label>Imagen actual:</label>

         {getImageUrl() ? (
            <ImageViewer
              imageUrl={getImageUrl()!}
              trigger={
                <div className="w-40 h-40 flex flex-col items-center justify-center bg-blue-50 border-2 border-blue-200 rounded-lg 
                                cursor-pointer hover:bg-blue-100 transition">
                  <img
                    src="/logo-preview.png"
                    alt="Ver imagen"
                    className="w-14 h-14 mb-2 opacity-80"
                  />
                  <p className="text-sm text-blue-600 font-medium">Ver imagen</p>
                </div>
              }
            />
          ) : (
            <div className="w-40 h-40 flex flex-col items-center justify-center bg-gray-100 border rounded-lg">
              <Upload size={28} className="text-gray-400 mb-1" />
              <p className="text-xs text-gray-500">Sin imagen disponible</p>
            </div>
          )}

          </div>

          {/* Nueva imagen */}
          <div className="formRow">
            <label>Cambiar imagen:</label>
            <div className="flex gap-2">
              <input type="file" accept="image/*" onChange={handleFileChange} />
              <input
                type="text"
                placeholder="O pega una URL de imagen"
                value={processData.image}
                onChange={(e) => {
                  setImageFile(null)
                  handleChange("image", e.target.value)
                }}
                className="formInput flex-1"
              />
              <Upload size={18} className="text-gray-500" />
            </div>
          </div>

          {/* Botones */}
          <div className="buttonGroup flex justify-between mt-6">
            <Link href="/">
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
