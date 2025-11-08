"use client"

import "../../global.css"
import { PatternList } from "@/components/pattern_list"
import { Plus, Search, Shapes } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function PatternsListPage() {
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <main className="layoutMain">
      {/* 🔹 Panel blanco envolvente */}
      <div className="contentWrapper">
        {/* Encabezado con ícono */}
        <div className="processHeader">
          <div className="processTitleRow">
            <div className="catIconCircle small">
              <Shapes className="w-5 h-5" stroke="white" strokeWidth={2} />
            </div>
            <h1 className="heroTitle m-0">Patrones</h1>
          </div>
          <p className="text-gray-600">
            Consulta, busca o crea nuevos patrones colaborativos.
          </p>
        </div>

        {/* Barra de búsqueda y botón */}
        <div className="actionBar">
          <div className="searchContainer">
            <Search className="searchIcon" />
            <input
              type="text"
              placeholder="Buscar patrones..."
              className="searchInput"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Link href="/patterns/new" className="createButton">
            <Plus className="createButtonIcon" />
            Nuevo Patrón
          </Link>
        </div>

        {/* Lista de patrones */}
        <PatternList searchTerm={searchTerm} />
      </div>
    </main>
  )
}
