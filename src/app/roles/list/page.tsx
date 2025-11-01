"use client"

import "../../global.css"
import { Sidebar } from "@/components/ui/sidebar"
import { RoleList } from "@/components/role_list"
import { Plus, Search } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function RolesListPage() {
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <div className="processContainer">
      <Sidebar />

      <main className="processMain">
        <div className="processHeader">
          {/* 🔹 Encabezado con ícono + título */}
          <div className="processTitleRow">
            <div className="catIconCircle small">
              <img src="/iconteam.svg" alt="Icono de roles" />
            </div>
            <h1 className="heroTitle m-0">Roles</h1>
          </div>

          <p className="text-gray-600">
            Consulta, busca o crea nuevos roles colaborativos.
          </p>
        </div>

        <div className="actionBar">
          <div className="searchContainer">
            <Search className="searchIcon" />
            <input
              type="text"
              placeholder="Buscar roles..."
              className="searchInput"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Link href="/roles/new" className="createButton">
            <Plus className="createButtonIcon" />
            Nuevo Rol
          </Link>
        </div>

        <RoleList searchTerm={searchTerm} />
      </main>
    </div>
  )
}
