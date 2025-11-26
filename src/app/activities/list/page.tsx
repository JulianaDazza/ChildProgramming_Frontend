"use client"

import "../../global.css"
import { ActivityList } from "@/components/activity/activity_list"
import { Plus, Search } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

export default function ActivitiesListPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [processFilter, setProcessFilter] = useState("")
  const [roundFilter, setRoundFilter] = useState("")

  const [processes, setProcesses] = useState<any[]>([])
  const [rounds, setRounds] = useState<any[]>([])

  useEffect(() => {
    fetchProcesses()
    fetchRounds()
  }, [])

  const fetchProcesses = async () => {
    const res = await fetch("http://localhost:8080/api/colaborative_process/list")
    const data = await res.json()
    setProcesses(data)
  }

  const fetchRounds = async () => {
    const res = await fetch("http://localhost:8080/api/round/list")
    const data = await res.json()
    setRounds(data)
  }

  return (
    <div className="processContainer">
      <main className="processMain">
        <div className="contentWrapper">

          {/* Encabezado */}
          <div className="processHeader">
            <div className="processTitleRow">
              <div className="catIconCircle small">
                <img src="/whitetask.svg" alt="Icono de actividades" />
              </div>
              <h1 className="heroTitle m-0">Actividades</h1>
            </div>
            <p className="text-gray-600">
              Consulta, busca o crea nuevas actividades colaborativas.
            </p>
          </div>

          {/* Barra de búsqueda + filtros + botón */}
          <div className="actionBar flex flex-col gap-4">

            {/* Búsqueda */}
            <div className="searchContainer">
              <Search className="searchIcon" />
              <input
                type="text"
                placeholder="Buscar actividades..."
                className="searchInput"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Botón crear actividad */}
            <Link href="/activities/new" className="createButton">
              <Plus className="createButtonIcon" />
              Nueva Actividad
            </Link>
            {/* Filtros */}
            <div className="flex gap-4">
              {/* Filtro por proceso */}
              <select
                className="searchInput"
                value={processFilter}
                onChange={(e) => setProcessFilter(e.target.value)}
              >
                <option value="">Filtrar por proceso</option>
                {processes.map((p) => (
                  <option key={p.id_process} value={p.id_process}>
                    {p.name_process}
                  </option>
                ))}
              </select>

              {/* Filtro por ronda */}
              <select
                className="searchInput"
                value={roundFilter}
                onChange={(e) => setRoundFilter(e.target.value)}
              >
                <option value="">Filtrar por ronda</option>
                {rounds.map((r) => (
                  <option key={r.id_activity} value={r.id_activity}>
                    {r.name_activity}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Lista de actividades filtrada */}
          <ActivityList
            searchTerm={searchTerm}
            processFilter={processFilter}
            roundFilter={roundFilter}
          />

        </div>
      </main>
    </div>
  )
}
