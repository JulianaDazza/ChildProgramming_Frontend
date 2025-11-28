"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { ArrowLeft, CheckCircle, UserPlus } from "lucide-react"
import { useAppToast } from "@/hooks/useAppToast"
import { ConfirmModal } from "@/components/ui/confirmModal"
import Link from "next/link"

interface Role {
  id_role: number
  name_role: string
  description_role: string
  skills_role: string
}

interface AssignedRole {
  id_role: number
}

export default function AssignRolePage() {
  const { id } = useParams()
  const { toastSuccess, toastError } = useAppToast()

  const [roles, setRoles] = useState<Role[]>([])
  const [assigned, setAssigned] = useState<AssignedRole[]>([])
  const [loading, setLoading] = useState(true)

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [roleToUnassign, setRoleToUnassign] = useState<number | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const [rolesRes, activityRes] = await Promise.all([
          fetch("http://localhost:8080/api/role/list"),
          fetch(`http://localhost:8080/api/child_activity/${id}/roles`)
        ])

        setRoles(await rolesRes.json())
        const act = await activityRes.json()
        setAssigned(act.assignedRoles || [])
      } catch {
        toastError("Error cargando roles")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  const assignRole = async (id_role: number) => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/${id_role}/assign/${id}`,
        { method: "POST" }
      )

      if (!res.ok) throw new Error()

      setAssigned([...assigned, { id_role }])
      toastSuccess("Rol asignado exitosamente")
    } catch {
      toastError("Error asignando rol")
    }
  }

  const unassignRole = async (id_role: number) => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/${id_role}/unassign/${id}`,
        { method: "DELETE" }
      )

      if (!res.ok) throw new Error()

      setAssigned(assigned.filter((r) => r.id_role !== id_role))
      toastSuccess("Rol desasignado correctamente")
    } catch {
      toastError("Error al desasignar rol")
    }
  }

  const askUnassign = (id_role: number) => {
    setRoleToUnassign(id_role)
    setConfirmOpen(true)
  }

  const confirmUnassign = () => {
    if (roleToUnassign !== null) {
      unassignRole(roleToUnassign)
    }
    setConfirmOpen(false)
    setRoleToUnassign(null)
  }

  if (loading) return <p className="p-6">Cargando...</p>

  const isAssigned = (id_role: number) =>
    assigned.some((r) => r.id_role === id_role)

  return (
    <div className="processContainer">

      <main className="processMain">

        <div className="contentWrapper">
          <div className="flex items-center gap-3 mb-6">
            <Link href="/activities/list" className="text-blue-600 hover:text-blue-800">
              <ArrowLeft className="inline w-5 h-5 mr-1" />
              Volver
            </Link>
          </div>

          <div className="processHeader">
            <div className="processTitleRow">
              <h1 className="heroTitle m-0">Asignar Roles</h1>
            </div>
            <p className="text-gray-600">
              Selecciona los roles que quieres asignar a esta actividad
            </p>
          </div>
        </div>

        <div className="processForm bg-white p-6 rounded-lg shadow">
          <div className="flex flex-col gap-6">
            {roles.map((role) => (
              <div
                key={role.id_role}
                className="border p-4 rounded-lg bg-gray-50 flex justify-between items-start"
              >
                <div>
                  <h3 className="font-semibold">{role.name_role}</h3>
                  <p className="text-sm text-gray-600">{role.description_role}</p>
                  <p className="text-xs text-gray-500 italic">
                    Habilidades: {role.skills_role}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  {isAssigned(role.id_role) ? (
                    <>
                      <span className="text-green-600 font-semibold flex items-center gap-1">
                        <CheckCircle size={18} /> Asignado
                      </span>

                      <button
                        onClick={() => askUnassign(role.id_role)}
                        className="processButton delete"
                      >
                        Desasignar
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => assignRole(role.id_role)}
                      className="processButton pdf"
                    >
                      <UserPlus size={16} /> Asignar
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {confirmOpen && (
          <ConfirmModal
            title="Desasignar rol"
            message="¿Seguro que deseas desasignar este rol de la actividad?"
            onConfirm={confirmUnassign}
            onCancel={() => setConfirmOpen(false)}
            confirmText="Desasignar"
            cancelText="Cancelar"
          />
        )}

      </main>
    </div>
  )
}
