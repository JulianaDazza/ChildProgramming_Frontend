"use client"

import { useEffect, useState } from "react"
import { Eye, Edit, Trash2, Download } from "lucide-react"
import Link from "next/link"
import { getProcesses } from "../../lib/api/processes"
import { generateProcessPDF } from "../../lib/pdf_generator"
import type { Process } from "../../lib/types"
import { ConfirmModal } from "../ui/confirmModal"

export function Process_list({ searchTerm }: { searchTerm?: string }) {
  const [processes, setProcesses] = useState<Process[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<number | null>(null)

  useEffect(() => {
    fetchProcesses()
  }, [])

  const fetchProcesses = async () => {
    try {
      const data = await getProcesses()
      setProcesses(data)
      setError(null)
    } catch {
      setError("Error al cargar los procesos")
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
      const res = await fetch(`http://localhost:8080/api/colaborative_process/delete/${selectedId}`, {
        method: "DELETE",
      })
      if (!res.ok) throw new Error("Error al eliminar proceso")
      await fetchProcesses()
    } catch {
      alert("Error al eliminar el proceso")
    } finally {
      setConfirmOpen(false)
      setSelectedId(null)
    }
  }

  const handleDownload = async (process: Process) => {
    try {
      await generateProcessPDF(process)
    } catch {
      alert("Error al generar el PDF")
    }
  }

  const normalizeText = (t: string) =>
    t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
  const filtered = processes.filter((p) => {
    const q = normalizeText(searchTerm || "")
    return normalizeText(p.name_process).includes(q) || normalizeText(p.description_process).includes(q)
  })

  if (loading) return <p className="text-center py-10 text-blue-600 text-lg">Cargando procesos...</p>
  if (error)
    return (
      <div className="text-center py-10 text-red-500 text-lg">
        {error}
        <button className="processButton view ml-4" onClick={fetchProcesses}>
          Reintentar
        </button>
      </div>
    )
  if (processes.length === 0)
    return <p className="text-center py-10 text-gray-500">No hay procesos registrados.</p>

  return (
    <>
      <div className="grid gap-6 mt-6">
        {filtered.map((process) => (
          <div key={process.id_process} className="processCardContainer">
            <div className="flex flex-col items-center p-6">
              <div className="catIconCircle">
                <img src="/caticon.svg" alt="Cat Icon" />
              </div>
              <h2 className="text-lg font-semibold text-gray-800 mb-2">{process.name_process}</h2>
              <p className="text-gray-700 mb-4">{process.description_process}</p>

              <div className="processButtonGroup">
                <Link href={`/procesos/${process.id_process}`}>
                  <button className="processButton view"><Eye className="h-4 w-4" />Ver</button>
                </Link>
                <Link href={`/process/edit/${process.id_process}`}>
                  <button className="processButton edit"><Edit className="h-4 w-4" />Editar</button>
                </Link>
                <button className="processButton pdf" onClick={() => handleDownload(process)}>
                  <Download className="h-4 w-4" />PDF
                </button>
                <button className="processButton delete" onClick={() => handleDeleteClick(process.id_process)}>
                  <Trash2 className="h-4 w-4" />Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {confirmOpen && (
        <ConfirmModal
          title="Eliminar proceso"
          message="¿Seguro que deseas eliminar este proceso?"
          onConfirm={confirmDelete}
          onCancel={() => setConfirmOpen(false)}
        />
      )}
    </>
  )
}
