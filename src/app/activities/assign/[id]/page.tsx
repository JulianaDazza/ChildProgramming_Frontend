"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, CheckCircle, UserPlus } from "lucide-react"
import { useAppToast } from "@/hooks/useAppToast"
import { Sidebar } from "@/components/ui/sidebar"

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
  const { id } = useParams()  // 👈 ahora es "id"
  const router = useRouter()
  const { toastSuccess, toastError } = useAppToast()

  const [roles, setRoles] = useState<Role[]>([])
  const [assigned, setAssigned] = useState<AssignedRole[]>([])
  const [loading, setLoading] = useState(true)

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
      } catch (error) {
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

  if (loading) return <p className="p-6">Cargando...</p>

  const isAssigned = (id_role: number) =>
    assigned.some((r) => r.id_role === id_role)

  return (
    <div className="processContainer">
      <Sidebar />

      <main className="processMain">

        <div className="processHeader">
          <div className="processTitle">
            <h1>Asignar Roles</h1>
          </div>
          <p>Selecciona los roles que quieres asignar a esta actividad</p>
        </div>

        <div className="processForm bg-white p-6 rounded-lg shadow">
          <div className="flex flex-col gap-4">
            {roles.map((role) => (
              <div
                key={role.id_role}
                className="border p-4 rounded-lg bg-gray-50 flex justify-between items-center"
              >
                <div>
                  <h3 className="font-semibold">{role.name_role}</h3>
                  <p className="text-sm text-gray-600">{role.description_role}</p>
                  <p className="text-xs text-gray-500 italic">
                    Habilidades: {role.skills_role}
                  </p>
                </div>

                {isAssigned(role.id_role) ? (
                  <span className="text-green-600 font-semibold flex items-center gap-1">
                    <CheckCircle size={18} /> Asignado
                  </span>
                ) : (
                  <button
                    onClick={() => assignRole(role.id_role)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-1"
                  >
                    <UserPlus size={16} /> Asignar
                  </button>
                )}
              </div>
            ))}
          </div>

          <button onClick={() => router.back()} className="btnBack mt-6">
            <ArrowLeft size={16} /> Volver
          </button>
        </div>
      </main>
    </div>
  )
}