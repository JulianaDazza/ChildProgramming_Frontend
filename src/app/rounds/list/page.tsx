"use client"

import "../../global.css"
import { RoundList } from "@/components/round_list"
import { Plus, Search } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function RoundsListPage() {
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <main className="layoutMain">
      {/* 🔹 Panel blanco envolvente */}
      <div className="contentWrapper">
        {/* Encabezado */}
        <div className="processHeader">
          <div className="processTitleRow">
            <div className="catIconCircle small">
              <img src="/roundicon.svg" alt="Icono de rondas" />
            </div>
            <h1 className="heroTitle m-0">Rondas</h1>
          </div>

          <p className="text-gray-600">
            Consulta, busca o crea nuevas rondas colaborativas.
          </p>
        </div>

        {/* Barra de búsqueda y botón */}
        <div className="actionBar">
          <div className="searchContainer">
            <Search className="searchIcon" />
            <input
              type="text"
              placeholder="Buscar rondas..."
              className="searchInput"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Link href="/rounds/new" className="createButton">
            <Plus className="createButtonIcon" />
            Nueva Ronda
          </Link>
        </div>

        {/* Lista de rondas */}
        <RoundList searchTerm={searchTerm} />
      </div>
    </main>
  )
}
