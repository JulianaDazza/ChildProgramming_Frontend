"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ListTodo, RefreshCcw } from "lucide-react"
import Link from "next/link"
import "../app/global.css"
import { Sidebar } from "./ui/sidebar"

export function ActivityForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  // ✅ Estructura igual al DTO del backend
  const [formData, setFormData] = useState({
    name_activity: "",
    description_activity: "",
    iterative: false,
    id_process: "",
    id_practice: "",
    id_thinklet: "",
  })

  // Listas de opciones
  const [processes, setProcesses] = useState<any[]>([])
  const [practices, setPractices] = useState<any[]>([])
  const [thinklets, setThinklets] = useState<any[]>([])

  // Cargar datos desde el backend
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
        console.error("Error cargando datos:", error)
      }
    }
    fetchData()
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("http://localhost:8080/api/child_activity/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name_activity: formData.name_activity,
          description_activity: formData.description_activity,
          iterative: formData.iterative,
          id_process: Number(formData.id_process),
          id_practice: formData.id_practice ? Number(formData.id_practice) : null,
          id_thinklet: formData.id_thinklet ? Number(formData.id_thinklet) : null,
        }),
      })

      if (response.ok) {
        router.push("/activities/list")
      } else {
        const errorText = await response.text()
        alert("Error al crear la actividad: " + errorText)
      }
    } catch (error) {
      console.error("Error creando actividad:", error)
      alert("No se pudo conectar con el servidor.")
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
          {/* Nombre */}
          <div className="formRow">
            <label>Nombre de la actividad: *</label>
            <input
              type="text"
              required
              value={formData.name_activity}
              onChange={(e) => setFormData({ ...formData, name_activity: e.target.value })}
            />
          </div>

          {/* Descripción */}
          <div className="formRow">
            <label>Descripción:</label>
            <input
              type="text"
              value={formData.description_activity}
              onChange={(e) => setFormData({ ...formData, description_activity: e.target.value })}
            />
          </div>

          {/* Iterativa */}
          <div className="formRow flex items-center">
            <label className="text-gray-800 font-medium mr-3">Iterativa:</label>
            <input
              type="checkbox"
              checked={formData.iterative}
              onChange={(e) => setFormData({ ...formData, iterative: e.target.checked })}
              className="w-10 h-10 accent-blue-800 cursor-pointer"
            />
          </div>

          {/* Proceso */}
          <div className="formRow">
            <label>Proceso:</label>
            <select
              value={formData.id_process}
              onChange={(e) => setFormData({ ...formData, id_process: e.target.value })}
            >
              <option value="">Selecciona un proceso</option>
              {processes.map((pr) => (
                <option key={pr.id_process} value={pr.id_process}>
                  {pr.name_process}
                </option>
              ))}
            </select>
          </div>

          {/* Práctica */}
          <div className="formRow">
            <label>Práctica:</label>
            <select
              value={formData.id_practice}
              onChange={(e) => setFormData({ ...formData, id_practice: e.target.value })}
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
              value={formData.id_thinklet}
              onChange={(e) => setFormData({ ...formData, id_thinklet: e.target.value })}
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
