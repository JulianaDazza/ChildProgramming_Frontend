"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { useAppToast } from "@/hooks/useAppToast"
import { ConfirmModal } from "@/components/ui/confirmModal"

export function RoundForm() {
  const router = useRouter()
  const params = useSearchParams()
  const { toastSuccess, toastError } = useAppToast()

  const id_process = params.get("id_process")

  const [formData, setFormData] = useState({
    name_activity: "",
    description_activity: "",
    round_status: "PLANEAR_ESTRATEGIA",
  })

  // Estado del modal reutilizando el estilo de ConfirmModal
  const [confirmOpen, setConfirmOpen] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!id_process) {
      toastError("No se recibió el proceso.")
      return
    }

    const payload = {
      name_activity: formData.name_activity,
      description_activity: formData.description_activity,
      id_process: Number(id_process),
      id_practice: null,
      id_thinklet: null,
      round_status: "PLANEAR_ESTRATEGIA",
    }

    try {
      const response = await fetch("http://localhost:8080/api/round/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        toastError("Error al crear la ronda")
        return
      }

      toastSuccess("Ronda creada correctamente")

      // Mostrar confirmación usando ConfirmModal
      setConfirmOpen(true)

    } catch (err) {
      toastError("No se pudo conectar con el servidor")
    }
  }

  // Acción Confirmar → Crear otra ronda
  const handleCreateAnother = () => {
    setConfirmOpen(false)

    // Resetear campos del formulario
    setFormData({
      name_activity: "",
      description_activity: "",
      round_status: "PLANEAR_ESTRATEGIA",
    })
  }


  // Acción Cancelar → Finalizar → Ir al listado
  const handleFinish = () => {
    setConfirmOpen(false)
    router.push(`/rounds/list`)
  }

  return (
    <div className="processContainer">
      <main className="processMain">
        <div className="processHeader">
          <h1>Crear Ronda</h1>
          <p>Completa la información de la ronda</p>
        </div>

        <form onSubmit={handleSubmit} className="processForm">
          {/* Nombre */}
          <div className="formRow">
            <label>Nombre de la ronda:</label>
            <input
              type="text"
              className="formInput"
              value={formData.name_activity}
              onChange={(e) =>
                setFormData({ ...formData, name_activity: e.target.value })
              }
            />
          </div>

          {/* Descripción */}
          <div className="formRow">
            <label>Descripción:</label>
            <input
              type="text"
              className="formInput"
              value={formData.description_activity}
              onChange={(e) =>
                setFormData({ ...formData, description_activity: e.target.value })
              }
            />
          </div>

          {/* Estado solo lectura */}
          <div className="formRow">
            <label>Estado inicial de la ronda:</label>
            <input
              type="text"
              className="formInput bg-gray-100 cursor-not-allowed"
              value="PLANEAR_ESTRATEGIA"
              disabled
              readOnly
            />
          </div>

          {/* Botones */}
          <div className="buttonGroup">
            <Link href="/">
              <button type="button" className="btnVolver">
                Volver
              </button>
            </Link>

            <button type="submit" className="btnCrear">
              Crear Ronda
            </button>
          </div>
        </form>

        {/* Modal reutilizando ConfirmModal */}
        {confirmOpen && (
          <ConfirmModal
            title="Ronda creada"
            message="¿Deseas crear otra ronda para este proceso?"
            onConfirm={handleCreateAnother}
            onCancel={handleFinish}
            confirmText="Crear otra"
            cancelText="Finalizar"
          />
        )}
      </main>
    </div>
  )
}
