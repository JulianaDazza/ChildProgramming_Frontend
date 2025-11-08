"use client"

import "../../global.css"
import { RoleList } from "@/components/role_list"
import { Plus, Search } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function RolesListPage() {
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <main className="layoutMain">
      {/* 🔹 Panel blanco envolvente */}
      <div className="contentWrapper">
        {/* Encabezado */}
        <div className="processHeader">
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

        {/* Barra de búsqueda y botón */}
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

        {/* Lista de roles */}
        <RoleList searchTerm={searchTerm} />
      </div>
    </main>
  )
}
