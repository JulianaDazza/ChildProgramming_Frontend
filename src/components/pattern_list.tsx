"use client"

import { useEffect, useState } from "react"
import { Eye, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { ConfirmModal } from "./ui/confirmModal"
interface Pattern {
  id_pattern: number
  name_pattern: string
  description_pattern: string
}

export function PatternList({ searchTerm }: { searchTerm?: string }) {
  const [patterns, setPatterns] = useState<Pattern[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<number | null>(null)

  useEffect(() => { fetchPatterns() }, [])

  const fetchPatterns = async () => {
    try {
      const res = await fetch("/api/patterns/list")
      const data = await res.json()
      setPatterns(data)
    } catch { setError("Error al cargar los patrones") }
    finally { setLoading(false) }
  }

  const handleDeleteClick = (id: number) => { setSelectedId(id); setConfirmOpen(true) }
  const confirmDelete = async () => {
    if (!selectedId) return
    await fetch(`http://localhost:8080/api/pattern/delete/${selectedId}`, { method: "DELETE" })
    setConfirmOpen(false)
    setSelectedId(null)
    fetchPatterns()
  }

  const normalize = (t?: string) => (t || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
  const filtered = patterns.filter(p =>
    normalize(p.name_pattern).includes(normalize(searchTerm)) ||
    normalize(p.description_pattern).includes(normalize(searchTerm))
  )

  if (loading) return <p className="text-center py-10 text-blue-600">Cargando patrones...</p>
  if (error) return <p className="text-center py-10 text-red-500">{error}</p>
  if (patterns.length === 0) return <p className="text-center py-10 text-gray-500">No existen patrones todavía.</p>

  return (
    <>
      <div className="grid gap-6 mt-6">
        {filtered.map(pattern => (
          <div key={pattern.id_pattern} className="processCardContainer">
            <div className="flex flex-col items-center p-6">
              <h2 className="text-lg font-semibold mb-2">{pattern.name_pattern}</h2>
              <p className="text-gray-600 mb-4">{pattern.description_pattern}</p>
              <div className="processButtonGroup">
                <Link href={`/patterns/${pattern.id_pattern}`}><button className="processButton view"><Eye className="h-4 w-4" />Ver</button></Link>
                <Link href={`/patterns/edit/${pattern.id_pattern}`}><button className="processButton edit"><Edit className="h-4 w-4" />Editar</button></Link>
                <button className="processButton delete" onClick={() => handleDeleteClick(pattern.id_pattern)}><Trash2 className="h-4 w-4" />Eliminar</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {confirmOpen && (
        <ConfirmModal
          title="Eliminar patrón"
          message="¿Seguro que deseas eliminar este patrón?"
          onConfirm={confirmDelete}
          onCancel={() => setConfirmOpen(false)}
        />
      )}
    </>
  )
}
