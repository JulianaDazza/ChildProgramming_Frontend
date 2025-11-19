"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { useAppToast } from "@/hooks/useAppToast"

export function RoundForm() {
  const router = useRouter()
  const params = useSearchParams()

  const { toastSuccess, toastError } = useAppToast()

  const id_process = params.get("id_process")
  console.log("ID PROCESS RECIBIDO ===>", id_process)


  const [formData, setFormData] = useState({
    name_activity: "",
    description_activity: "",
    round_status: "PLANEAR_ESTRATEGIA", // ✔️ Valor por defecto válido
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!id_process) {
      toastError("No se recibió el ID del proceso.")
      return
    }

    const payload = {
      name_activity: formData.name_activity,
      description_activity: formData.description_activity,
      iterative: true, 
      id_process: Number(id_process),
      id_practice: null,
      id_thinklet: null,
      round_status: formData.round_status, // ✔️ Envía el enum
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

      router.push(`/activities/new?id_process=${id_process}`)

    } catch (err) {
      toastError("No se pudo conectar con el servidor")
    }
  }

  return (
    <div className="processContainer">
      <main className="processMain">
        <div className="processHeader">
          <h1>Crear Ronda</h1>
          <p>Completa la información de la ronda</p>
        </div>

        <form onSubmit={handleSubmit} className="processForm">

          <div className="formRow">
            <label>Nombre de la ronda:</label>
            <input
              type="text"
              className="formInput"
              value={formData.name_activity}
              onChange={(e) => setFormData({ ...formData, name_activity: e.target.value })}
            />
          </div>

          <div className="formRow">
            <label>Descripción:</label>
            <input
              type="text"
              className="formInput"
              value={formData.description_activity}
              onChange={(e) => setFormData({ ...formData, description_activity: e.target.value })}
            />
          </div>

          <div className="formRow">
            <label>Estado de la ronda:</label>
            <select
              className="formInput"
              value={formData.round_status}
              onChange={(e) => setFormData({ ...formData, round_status: e.target.value })}
            >
              <option value="PLANEAR_ESTRATEGIA">Planear estrategia</option>
              <option value="APLICAR_ESTRATEGIA">Aplicar estrategia</option>
              <option value="REVISAR_ESTRATEGIA">Revisar estrategia</option>
              <option value="ANALIZAR_ESTRATEGIA">Analizar estrategia</option>
            </select>
          </div>

          <div className="buttonGroup">
            <Link href="/">
              <button type="button" className="btnVolver">Volver</button>
            </Link>

            <button type="submit" className="btnCrear">
              Crear Ronda
            </button>
          </div>

        </form>
      </main>
    </div>
  )
}
