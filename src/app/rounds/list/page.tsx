"use client"

import "../../global.css"
import { RoundList } from "@/components/round_list"
import { Plus, Search, Repeat, Filter  } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

export default function RoundsListPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [processFilter, setProcessFilter] = useState("")

  const [processes, setProcesses] = useState<any[]>([])

  useEffect(() => {
    fetchProcesses()
  }, [])

  const fetchProcesses = async () => {
    const res = await fetch("http://localhost:8080/api/colaborative_process/list")
    const data = await res.json()
    setProcesses(data)
  }

  return (
    <main className="layoutMain">
      <div className="contentWrapper">

        {/* ENCABEZADO */}
        <div className="processHeader">
          <div className="processTitleRow">
            <div className="catIconCircle small flex items-center justify-center">
              <Repeat className="w-5 h-5" stroke="white" />
            </div>
            <h1 className="heroTitle m-0">Rondas</h1>
          </div>
          <p className="text-gray-600">
            Consulta, busca o crea nuevas rondas colaborativas.
          </p>
        </div>

        {/* Búsqueda + Filtro en una sola fila */}
        <div className="flex items-center gap-4">

          {/* BUSCADOR */}
          <div className="searchContainer flex-grow max-w-[600px] w-auto">
            <Search className="searchIcon" />
            <input
              type="text"
              placeholder="Buscar rondas..."
              className="searchInput"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* BOTÓN DE FILTRO */}
          <label className="filterButton flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-md cursor-pointer text-sm font-medium">
            <Filter className="w-4 h-4" />
            Filtro

            <select
              className="filterSelect absolute opacity-0 pointer-events-none"
              value={processFilter}
              onChange={(e) => setProcessFilter(e.target.value)}
            >
              <option value="">Todos</option>
              {processes.map((p) => (
                <option key={p.id_process} value={p.id_process}>
                  {p.name_process}
                </option>
              ))}
            </select>
          </label>

        </div>



        {/* LISTA DE RONDAS */}
        <RoundList 
          searchTerm={searchTerm}
          processFilter={processFilter}
        />

      </div>
    </main>
  )
}