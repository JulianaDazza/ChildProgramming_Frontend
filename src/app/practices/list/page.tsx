"use client"

import "../../global.css"
import { PracticeList } from "@/components/practices_list"
import { Plus, Search } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function PracticesListPage() {
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <main className="layoutMain">
      {/* 🔹 Panel blanco envolvente */}
      <div className="contentWrapper">
        {/* Encabezado */}
        <div className="processHeader">
          <div className="processTitleRow">
            <div className="catIconCircle small">
              <img src="/document.svg" alt="Icono de prácticas" />
            </div>
            <h1 className="heroTitle m-0">Prácticas</h1>
          </div>

          <p className="text-gray-600">
            Consulta, busca o crea nuevas prácticas colaborativas.
          </p>
        </div>

        {/* Barra de búsqueda y botón */}
        <div className="actionBar">
          <div className="searchContainer">
            <Search className="searchIcon" />
            <input
              type="text"
              placeholder="Buscar prácticas..."
              className="searchInput"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Link href="/practices/new" className="createButton">
            <Plus className="createButtonIcon" />
            Nueva Práctica
          </Link>
        </div>

        {/* Lista de prácticas */}
        <PracticeList searchTerm={searchTerm} />
      </div>
    </main>
  )
}
