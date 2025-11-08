"use client"

import "../../app/global.css"
import { Process_list } from "@/components/process/process_list"
import Link from "next/link"
import { Plus, RefreshCcw } from "lucide-react"
import { useState } from "react"

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <main className="layoutMain">
      {/* 🔹 Panel blanco envolvente */}
      <div className="contentWrapper">
        {/* Encabezado principal */}
        <div className="processHeader">
          <div className="processTitleRow">
            <div className="catIconCircle small">
              <RefreshCcw className="w-5 h-5" stroke="white" strokeWidth={2} />
            </div>
            <h1 className="heroTitle m-0">Procesos Colaborativos</h1>
          </div>

          <p className="text-gray-600">
            Gestiona, busca o crea nuevos procesos colaborativos.
          </p>
        </div>

        {/* 🔍 Barra de búsqueda y botón */}
        <div className="actionBar">
          <div className="searchContainer">
            <input
              type="text"
              placeholder="Buscar procesos..."
              className="searchInput"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Link href="/process/new" className="createButton">
            <Plus className="createButtonIcon" />
            Nuevo Proceso
          </Link>
        </div>

        {/* 📋 Lista de procesos */}
        <Process_list searchTerm={searchTerm} />
      </div>
    </main>
  )
}
