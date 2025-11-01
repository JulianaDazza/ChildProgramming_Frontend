"use client"

import { Sidebar } from "@/components/ui/sidebar"
import { ActivityList } from "@/components/activity/activity_list"
import { Plus, Search } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import "../../global.css" 

export default function ActivitiesListPage() {
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <div className="processContainer">
      <Sidebar />

      <main className="processMain">
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


        <div className="actionBar">
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

          <Link href="/activities/new" className="createButton">
            <Plus className="createButtonIcon" />
            Nueva Actividad
          </Link>
        </div>

        <ActivityList searchTerm={searchTerm} />
      </main>
    </div>
  )
}
