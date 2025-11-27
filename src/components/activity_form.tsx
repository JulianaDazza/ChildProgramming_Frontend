"use client"

import React, { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Sidebar } from "./ui/sidebar"
import { useAppToast } from "@/hooks/useAppToast" // 👈 para notificaciones

export function ActivityForm() {
  const router = useRouter()
  const { toastSuccess, toastError, toastWarning } = useAppToast()

  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({
    name_activity: false,
    id_process: false,
  })

  const [formData, setFormData] = useState({
    name_activity: "",
    description_activity: "",
    id_process: "",
    id_practice: "",
    id_thinklet: "",
  })

  const [processes, setProcesses] = useState<any[]>([])
  const [practices, setPractices] = useState<any[]>([])
  const [thinklets, setThinklets] = useState<any[]>([])
  const [roundName, setRoundName] = useState("");
  const [roundId, setRoundId] = useState("");
  const [rounds, setRounds] = useState<any[]>([])
  const [filteredRounds, setFilteredRounds] = useState<any[]>([])



  ////////////////////////////////////////////////
  const params = useSearchParams()
  const id_process_param = params.get("id_process")
  const round_id = params.get("round_id");

  useEffect(() => {
    const fetchRound = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/round/${round_id}`);
        const data = await res.json();

        setRoundId(round_id!);
        setRoundName(data.name_activity);

        // asignar el proceso que pertenece a esa ronda
        setFormData((prev) => ({
          ...prev,
          id_process: String(data.id_process),
        }));
      } catch {
        toastError("No se pudo obtener la información de la ronda");
      }
    };

    if (round_id) {
      fetchRound();
      return;
    }

    if (id_process_param) {
      setFormData((prev) => ({
        ...prev,
        id_process: id_process_param,
      }));
    }
  }, [round_id, id_process_param]);

  //cargar rondas
  useEffect(() => {
    const fetchRounds = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/round/list")
        const data = await res.json()
        setRounds(data)
      } catch {
        toastError("Error al cargar rondas")
      }
    }

    fetchRounds()
  }, [])

  //filtrar rondas según el proceso
  useEffect(() => {
    if (!formData.id_process) {
      setFilteredRounds([])
      return
    }

    // mostrar solo rondas del proceso seleccionado
    setFilteredRounds(
      rounds.filter(r => r.id_process == formData.id_process)
    )
  }, [formData.id_process, rounds])

  ////////////////////////////////////////////////

  // Cargar datos del backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [procRes, pracRes, thinkRes] = await Promise.all([
          fetch("http://localhost:8080/api/colaborative_process/list"),
          fetch("http://localhost:8080/api/practice/list"),
          fetch("http://localhost:8080/api/thinklet/list"),
        ])

        setProcesses(await procRes.json())
        setPractices(await pracRes.json())
        setThinklets(await thinkRes.json())
      } catch (error) {
        toastError("Error al cargar datos del formulario")
      }
    }
    fetchData()
  }, [])

  const handleChange = (field: string, value: string | boolean) => {
    setFormData({ ...formData, [field]: value })
    setErrors({ ...errors, [field]: false })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // 🧩 Validaciones
    const newErrors = {
      name_activity: !formData.name_activity.trim(),
      id_process: !formData.id_process,
    }

    if (newErrors.name_activity || newErrors.id_process) {
      setErrors(newErrors)
      toastWarning("Completa los campos obligatorios antes de continuar")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("http://localhost:8080/api/child_activity/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          parent_round_id: roundId ? Number(roundId) : null,
          id_process: Number(formData.id_process),
          id_practice: formData.id_practice ? Number(formData.id_practice) : null,
          id_thinklet: formData.id_thinklet ? Number(formData.id_thinklet) : null,
        }),
      })

      if (response.ok) {
        toastSuccess("Actividad creada correctamente")
        router.push("/activities/list")
      } else {
        const errorText = await response.text()
        toastError(`Error al crear la actividad: ${errorText}`)
      }
    } catch {
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
            <h1>Crear Nueva Actividad</h1>
          </div>
          <p>Completa la información para registrar una nueva actividad infantil</p>
        </div>
        
        <form onSubmit={handleSubmit} className="processForm">
          {/* Nombre obligatorio */}
          <div className="formRow">
            <label>Nombre de la actividad: *</label>
            <input
              type="text"
              className={`formInput ${errors.name_activity ? "inputError" : ""}`}
              value={formData.name_activity}
              onChange={(e) => handleChange("name_activity", e.target.value)}
            />
          </div>

          {/* Descripción */}
          <div className="formRow">
            <label>Descripción:</label>
            <input
              type="text"
              className="formInput"
              value={formData.description_activity}
              onChange={(e) => handleChange("description_activity", e.target.value)}
            />
          </div>
          {/* Ronda */}
          {roundId && (
            <div className="formRow">
              <label>Ronda seleccionada:</label>
              <input className="formInput" value={roundName} disabled />
            </div>
          )}

          {/* Proceso obligatorio */}
          <div className="formRow">
            <label>Proceso: *</label>
            <select
              className={`formInput ${errors.id_process ? "inputError" : ""}`}
              value={formData.id_process}
              disabled={!!roundId}   // bloquear si viene por ronda
              onChange={(e) => setFormData({ ...formData, id_process: e.target.value })}
            >
              <option value="">Selecciona una proceso</option>
              {processes.map((pr) => (
                <option key={pr.id_process} value={pr.id_process}>
                  {pr.name_process}
                </option>
              ))}
            </select>
          </div>
          
          {/* Selección manual de ronda padre (solo si no vino por parámetro) */}
          {!roundId && (
            <div className="formRow">
              <label>Ronda padre:</label>
              <select
                className="formInput"
                value={roundId}
                onChange={(e) => {
                  const selectedId = e.target.value;
                  setRoundId(selectedId);

                  const selectedRound = filteredRounds.find(r => r.id_activity == selectedId);
                  setRoundName(selectedRound ? selectedRound.name_activity : "");
                }}
                disabled={!formData.id_process} // Deshabilitado si no ha seleccionado proceso
              >
                <option value="">Selecciona una ronda (opcional)</option>
                {filteredRounds.map((r) => (
                  <option key={r.id_activity} value={r.id_activity}>
                    {r.name_activity}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Práctica */}
          <div className="formRow">
            <label>Práctica:</label>
            <select
              className="formInput"
              value={formData.id_practice}
              onChange={(e) => handleChange("id_practice", e.target.value)}
            >
              <option value="">Selecciona una práctica</option>
              {practices.map((pr) => (
                <option key={pr.id_practice} value={pr.id_practice}>
                  {pr.name_practice}
                </option>
              ))}
            </select>
          </div>

          {/* Thinklet */}
          <div className="formRow">
            <label>Thinklet:</label>
            <select
              className="formInput"
              value={formData.id_thinklet}
              onChange={(e) => handleChange("id_thinklet", e.target.value)}
            >
              <option value="">Selecciona un thinklet</option>
              {thinklets.map((th) => (
                <option key={th.id_thinklet} value={th.id_thinklet}>
                  {th.name_thinklet}
                </option>
              ))}
            </select>
          </div>

          {/* Botones */}
          <div className="buttonGroup">
            <Link href="/activities/list">
              <button type="button" className="btnVolver">
                Volver
              </button>
            </Link>
            <button type="submit" className="btnCrear" disabled={loading}>
              {loading ? "Creando..." : "Crear Actividad"}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}