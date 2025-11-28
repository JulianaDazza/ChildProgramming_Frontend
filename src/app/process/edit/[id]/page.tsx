"use client"

import React, { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { RefreshCcw, Upload, Image, Trash2 } from "lucide-react"
import Link from "next/link"
import "../../../global.css"
import { useAppToast } from "@/hooks/useAppToast"
import { ConfirmModal } from "@/components/ui/confirmModal"
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

  const [rounds, setRounds] = useState<any[]>([])   // ⬅️ RONDAS DEL PROCESO

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [errors, setErrors] = useState({ name_process: false })
  const [modalOpen, setModalOpen] = useState(false)

  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null)

  //Funcion para eliminar una Ronda
  const deleteRound = async (roundId: number) => {
    try {
      const res = await fetch(`http://localhost:8080/api/round/delete/${roundId}`, {
        method: "DELETE",
      })

      if (!res.ok) throw new Error("Error eliminando la ronda")

      toastSuccess("Ronda eliminada correctamente")

      // Recargar rondas
      setRounds((prev) => prev.filter((r) => r.id_activity !== roundId))
    } catch (err) {
      console.error(err)
      toastError("No se pudo eliminar la ronda")
    }
  }

  // --------------------------------------------------------
  // Cargar datos del proceso
  // --------------------------------------------------------
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

    const fetchRounds = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/round/byProcess/${id}`)
        if (!res.ok) return
        setRounds(await res.json())
      } catch (err) {
        console.error("Error obteniendo rondas:", err)
      }
    }

    if (id) {
      fetchProcess()
      fetchRounds()
    }
  }, [id])

  // Evitar desplazamiento al abrir imagen
  useEffect(() => {
    document.body.style.overflow = modalOpen ? "hidden" : "auto"
  }, [modalOpen])

  // Manejar cambios
  const handleChange = (field: string, value: string) => {
    setProcessData({ ...processData, [field]: value })
    setErrors({ ...errors, [field]: false })
  }

  // Manejar cambio de archivo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setImageFile(file)
    if (file) {
      toastWarning("Se reemplazará la imagen actual por el nuevo archivo al guardar.")
    }
  }

  // Guardar cambios
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
        toastError("Error al actualizar el proceso.")
      }
    } catch (error) {
      console.error(error)
      toastError("Error al conectar con el servidor.")
    } finally {
      setLoading(false)
    }
  }

  const getImageUrl = () => {
    if (!processData.image) return null
    if (processData.image.startsWith("http")) return processData.image
    return `http://localhost:8080/processImages/${processData.image}`
  }

  return (
    <div className="processContainer">

      <main className="processMain">
        <div className="processHeader">
          <div className="processTitle">
            <RefreshCcw className="refreshIcon" />
            <h1>Editar Proceso</h1>
          </div>
          <p>Modifica la información del proceso colaborativo.</p>
        </div>

        <form onSubmit={handleSubmit} className="processForm space-y-5">

          {/* ------------------- CAMPOS BÁSICOS ------------------- */}
          <div className="formRow">
            <label>Nombre del proceso: *</label>
            <input
              type="text"
              value={processData.name_process}
              onChange={(e) => handleChange("name_process", e.target.value)}
              className={`formInput ${errors.name_process ? "inputError" : ""}`}
            />
          </div>

          <div className="formRow">
            <label>Descripción:</label>
            <input
              type="text"
              value={processData.description_process}
              onChange={(e) => handleChange("description_process", e.target.value)}
              className="formInput"
            />
          </div>

          <div className="formRow">
            <label>Versión:</label>
            <input
              type="text"
              value={processData.version_process}
              onChange={(e) => handleChange("version_process", e.target.value)}
              className="formInput"
            />
          </div>

          {/* ------------------- IMAGEN ------------------- */}
          <div className="formRow">
            <label>Imagen actual:</label>

            {getImageUrl() ? (
              <ImageViewer
                imageUrl={getImageUrl()!}
                trigger={
                  <div className="w-40 h-40 flex flex-col items-center justify-center bg-blue-50 border-2 border-blue-200 rounded-lg cursor-pointer hover:bg-blue-100 transition">
                    <Image size={48} strokeWidth={1.5} className="text-blue-600 mb-2 opacity-80" />
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

          <div className="formRow">
            <label>Cambiar imagen:</label>
            <div className="fileUploadWrapper">

              <label className="fileUpload">
                <Upload className="fileUploadIcon" />
                Seleccionar archivo
                <input type="file" accept="image/*" onChange={handleFileChange} />
              </label>

              <input
                type="text"
                placeholder="O pega una URL de imagen"
                value={processData.image}
                onChange={(e) => {
                  setImageFile(null);
                  handleChange("image", e.target.value);
                }}
                className="formInput flex-1"
              />
            </div>

          </div>

          {/* ------------------- RONDAS ASOCIADAS ------------------- */}
          <div className="formRow mt-8">
            <label className="font-semibold text-lg text-gray-800">
              Rondas del proceso
            </label>

            <div className="bg-gray-50 border rounded-lg p-4 mt-2">

              {/* LISTA DE RONDAS EXISTENTES */}
              {rounds.length > 0 ? (
              <ul className="mt-4 space-y-2 list-none pl-0 !list-none">
                {rounds.map((r) => (
                  <li
                    key={r.id_activity}
                    className="list-none !list-none p-3 bg-white border rounded-md flex justify-between items-center"
                    style={{ listStyle: "none" }} //MATA CUALQUIER estilo global
                  >
                    <span className="font-medium text-gray-800">
                      {r.name_activity}
                    </span>

                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(r.id_activity)}
                      className="btnDeleteRound"
                    >
                      <Trash2 className="h-4 w-4" />
                      Eliminar
                    </button>

                  </li>
                ))}
              </ul>
              ) : (
                <p className="mt-3 text-sm text-gray-500">
                  Este proceso aún no tiene rondas creadas.
                </p>
              )}
              {/* Botón crear */}
              <Link href={`/rounds/new?id_process=${id}`}>
                <button
                  type="button"
                  className="btnCrear bg-blue-600 text-white font-semibold px-6 py-2 rounded-2xl hover:bg-blue-700 transition"
                >
                  Agregar nueva ronda
                </button>
              </Link>
            </div>
          </div>

          {/* ------------------- BOTONES FINALES ------------------- */}
          <div className="buttonGroup flex justify-between mt-6">
            <Link href="/">
              <button
                type="button"
                className="btnVolver border-2 border-blue-600 text-blue-600 font-semibold px-6 py-2 rounded-2xl hover:bg-blue-50 transition"
              >
                Cancelar
              </button>
            </Link>

            <button
              type="submit"
              className="btnCrear bg-blue-600 text-white font-semibold px-6 py-2 rounded-2xl hover:bg-blue-700 transition"
              disabled={loading}
            >
              {loading ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
          {/* Confirmacion para eliminar una ronda*/}
          {confirmDeleteId !== null && (
            <ConfirmModal
              title="Eliminar ronda"
              message="¿Estás seguro de eliminar esta ronda? Esta acción no se puede deshacer."
              onConfirm={() => {
                deleteRound(confirmDeleteId!)
                setConfirmDeleteId(null)
              }}
              onCancel={() => setConfirmDeleteId(null)}
            />
          )}
        </form>
      </main>
    </div>
  )
}
