"use client"

import "../../global.css"
import { Sidebar } from "@/components/ui/sidebar"
import { ThinkletList } from "@/components/thinklet_list"
import { Plus, Search, Lightbulb } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function ThinkletsListPage() {
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <div className="processContainer">
      <Sidebar />

      <main className="processMain">
        {/* 🔹 Encabezado con ícono de bombillo */}
        <div className="processHeader">
          <div className="processTitleRow">
            <div className="catIconCircle small">
              <Lightbulb className="w-5 h-5 text-white" strokeWidth={2} /> 
            </div>
            <h1 className="heroTitle m-0">Thinklets</h1>
          </div>

          <p className="text-gray-600">
            Consulta, busca o crea nuevos thinklets colaborativos.
          </p>
        </div>

        {/* 🔍 Barra de búsqueda y botón */}
        <div className="actionBar">
          <div className="searchContainer">
            <Search className="searchIcon" />
            <input
              type="text"
              placeholder="Buscar thinklets..."
              className="searchInput"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Link href="/thinklets/new" className="createButton">
            <Plus className="createButtonIcon" />
            Nuevo Thinklet
          </Link>
        </div>

        {/* 🧩 Lista de thinklets */}
        <ThinkletList searchTerm={searchTerm} />
      </main>
    </div>
  )
}
