"use client"

import "../../global.css"
import { Sidebar } from "@/components/ui/sidebar"
import { PatternList } from "@/components/pattern_list"
import { Plus, Search, Shapes } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function PatternsListPage() {
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <div className="processContainer">
      <Sidebar />
      <main className="processMain">
        <div className="processHeader">
          <div className="processTitleRow">
            <div className="catIconCircle small">
              <Shapes className="w-5 h-5 text-white" strokeWidth={2} /> 
            </div>
            <h1 className="heroTitle m-0">Thinklets</h1>
          </div>
          <p>Consulta, busca o crea nuevos patrones colaborativos.</p>
        </div>

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

        <PatternList searchTerm={searchTerm} />
      </main>
    </div>
  )
}
