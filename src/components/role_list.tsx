"use client"

import { useEffect, useState } from "react"
import { Eye, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { ConfirmModal } from "./ui/confirmModal"
import { useAppToast } from "@/hooks/useAppToast"
import Loading from "@/app/loading"

interface Role {
  id_role: number
  name_role: string
  description_role: string
  skills_role: string
}

export function RoleList({ searchTerm }: { searchTerm?: string }) {
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<number | null>(null)

  // 👇 usamos el hook personalizado
  const { toastSuccess, toastError, toastInfo } = useAppToast()

  useEffect(() => {
    fetchRoles()
  }, [])

  const fetchRoles = async () => {
    try {
      const response = await fetch("/api/roles/list", { cache: "no-store" })
      if (!response.ok) throw new Error("Error al obtener los roles")
      const data = await response.json()
      setRoles(data)
      setError(null)
    } catch (error) {
      console.error("Error fetching roles:", error)
      setError("Error al cargar los roles")
      toastError("No se pudieron cargar los roles")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClick = (id: number) => {
    setSelectedId(id)
    setConfirmOpen(true)
  }

  const confirmDelete = async () => {
    if (!selectedId) return
    try {
      const response = await fetch(`http://localhost:8080/api/role/delete/${selectedId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toastSuccess("Rol eliminado correctamente")
        fetchRoles()
      } else {
        toastError("Error al eliminar el rol")
      }
    } catch (error) {
      console.error(error)
      toastError("No se pudo conectar con el servidor")
    } finally {
      setConfirmOpen(false)
      setSelectedId(null)
    }
  }

  const normalize = (text?: string) =>
    (text || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()

  const filtered = roles.filter((role) => {
    const query = normalize(searchTerm)
    return (
      normalize(role.name_role).includes(query) ||
      normalize(role.description_role).includes(query)
    )
  })

  if (loading)
      return <Loading/>

  if (error)
    return (
      <div className="text-center py-10 text-red-500 text-lg">
        {error}
        <button className="processButton view ml-4" onClick={fetchRoles}>
          Reintentar
        </button>
      </div>
    )

  if (roles.length === 0)
    return <div className="text-center py-10 text-gray-500">No existen roles todavía.</div>

  return (
    <>
      <div className="grid gap-6 mt-6">
        {filtered.map((role) => (
          <div key={role.id_role} className="processCardContainer">
            <div className="flex flex-col items-center justify-center p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">{role.name_role}</h2>
              <p className="text-gray-600 mb-3">{role.description_role}</p>
              <p className="text-gray-600 mb-3">{role.skills_role}</p>

              <div className="processButtonGroup">

                <Link href={`/roles/edit/${role.id_role}`}>
                  <button className="processButton edit">
                    <Edit className="h-4 w-4" /> Editar
                  </button>
                </Link>

                <button
                  className="processButton delete"
                  onClick={() => handleDeleteClick(role.id_role)}
                >
                  <Trash2 className="h-4 w-4" /> Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {confirmOpen && (
        <ConfirmModal
          title="Eliminar rol"
          message="¿Seguro que deseas eliminar este rol?"
          onConfirm={confirmDelete}
          onCancel={() => setConfirmOpen(false)}
        />
      )}
    </>
  )
}