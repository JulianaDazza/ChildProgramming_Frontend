"use client"

import { useEffect, useState, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, FileText } from "lucide-react"
import "../../global.css"
import { generateProcessPDF } from "@/lib/pdf_generator"
import { useAppToast } from "@/hooks/useAppToast"

// Tipos recomendados (ajusta según tu /lib/types.ts)
interface Pattern {
  id_pattern: number
  name_pattern: string
  description_pattern: string
}

interface Thinklet {
  id_thinklet: number
  name_thinklet: string
  description_thinklet: string
  pattern?: Pattern | null
}

interface Practice {
  id_practice: number
  name_practice: string
  description_practice: string
  type_practice: string
}

interface Role {
  id_role: number
  name_role: string
  description_role: string
  skills_role: string
}

interface Activity {
  id_activity: number
  name_activity: string
  description_activity: string
  iterative: boolean
  practice?: Practice | null
  thinklet?: Thinklet | null
  assignedRoles?: Role[] | null
}

interface Round {
  id_activity: number
  name_activity: string
  description_activity: string
  iterative: boolean
  round_status: string
}

interface ProcessFull {
  id_process: number
  name_process: string
  description_process: string
  version_process: string
  image: string
  rounds: Round[]
  activities: Activity[]
}

function formatRoundStatus(status: string): string {
  return status
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function ProcessDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [process, setProcess] = useState<ProcessFull | null>(null)
  const [loading, setLoading] = useState(true)
  const { toastError, toastInfo } = useAppToast()

  // ⭐ ref para capturar la vista completa
  const pdfRef = useRef<HTMLDivElement>(null)

  // Consumir el endpoint
  useEffect(() => {
    const fetchProcess = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/colaborative_process/full/${id}`)
        if (!res.ok) throw new Error("Error al obtener el proceso")
        const data = await res.json()
        setProcess(data)
      } catch (err) {
        console.error(err)
        toastError("No se pudo cargar el proceso")
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchProcess()
  }, [id])

  const handleDownload = async () => {
    if (!pdfRef.current || !process) return

    try {
      await generateProcessPDF(
        pdfRef.current, 
        `proceso-${process.name_process.replace(/\s+/g, "-")}`
      )
      toastInfo("📄 PDF generado correctamente")
    } catch (err) {
      console.error("Error al generar PDF:", err)
      toastError("Error al generar el PDF")
    }
  }

  if (loading) {
    return (
      <div className="loadingScreen">
        <div className="loadingSpinner" />
        <p className="loadingText">Cargando proceso...</p>
      </div>
    )
  }

  if (!process) {
    return (
      <div className="text-center text-red-500 mt-10">
        <p>No se encontró el proceso.</p>
        <button
          onClick={() => router.push("/")}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Volver a Procesos
        </button>
      </div>
    )
  }

  return (
    <div className="processContainer">

      <main className="processMain">

        {/* ⭐️ Contenedor completo para capturar en PDF */}
        <div ref={pdfRef} className="contentWrapper detailCard">

          {/* Header */}
          <div className="processHeader">
            <div className="processTitleRow">
              <div className="catIconCircle small">
                <img src="/caticon.svg" alt="Icono proceso" />
              </div>
              <h1 className="heroTitle m-0">{process.name_process}</h1>
            </div>
            <p className="text-gray-600">Información completa del proceso colaborativo.</p>
          </div>

          <div className="processDetailContent">
            
            {/* Información general */}
            <div className="processInfoCard">
              <h2>Detalles generales</h2>
              <table className="processTable">
                <tbody>
                  <tr>
                    <th>Nombre:</th>
                    <td>{process.name_process}</td>
                  </tr>
                  <tr>
                    <th>Descripción:</th>
                    <td>{process.description_process}</td>
                  </tr>
                  <tr>
                    <th>Versión:</th>
                    <td>{process.version_process}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Rondas */}
            <div className="processInfoCard">
              <h2>Rondas</h2>

              {process.rounds.length === 0 ? (
                <p>No hay rondas registradas.</p>
              ) : (
                <div className="flex flex-col gap-4">
                  {process.rounds.map((r) => (
                    <div key={r.id_activity} className="p-4 bg-blue-50 rounded-lg border border-blue-200">

                      <table className="min-w-full text-left">
                        <tbody>

                          <tr>
                            <th className="pr-4 font-semibold text-gray-700">Nombre:</th>
                            <td className="text-gray-900">{r.name_activity}</td>
                          </tr>

                          <tr>
                            <th className="pr-4 font-semibold text-gray-700">Descripción:</th>
                            <td className="text-gray-900">{r.description_activity}</td>
                          </tr>

                          <tr>
                            <th className="pr-4 font-semibold text-gray-700">Estado:</th>
                            <td className="text-gray-900">{formatRoundStatus(r.round_status)}</td>
                          </tr>

                          <tr>
                            <th className="pr-4 font-semibold text-gray-700">Es iterativa:</th>
                            <td className="text-gray-900">{r.iterative ? "Sí" : "No"}</td>
                          </tr>

                        </tbody>
                      </table>

                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actividades */}
            <div className="processInfoCard">
              <h2>Actividades</h2>

              {process.activities.length === 0 ? (
                <p>No hay actividades registradas.</p>
              ) : (
                <div className="flex flex-col gap-6">

                  {process.activities.map((a, index) => (
                    <div key={a.id_activity} className="p-4 bg-gray-100 rounded-lg border">

                      {/* ⭐ Subtítulo dinámico */}
                      <h3 className="text-xl font-bold text-blue-800 mb-3">
                        Actividad {index + 1}
                      </h3>

                      {/* Tabla base de la actividad */}
                      <table className="min-w-full text-left">
                        <tbody>
                          <tr>
                            <th className="pr-4 font-semibold text-gray-700">Nombre:</th>
                            <td className="text-gray-900">{a.name_activity}</td>
                          </tr>

                          <tr>
                            <th className="pr-4 font-semibold text-gray-700">Descripción:</th>
                            <td className="text-gray-900">{a.description_activity}</td>
                          </tr>

                          <tr>
                            <th className="pr-4 font-semibold text-gray-700">Es iterativa:</th>
                            <td className="text-gray-900">{a.iterative ? "Sí" : "No"}</td>
                          </tr>
                        </tbody>
                      </table>

                      {/* ======= PRÁCTICA ======= */}
                      {a.practice && (
                        <div className="mt-4 p-4 bg-white rounded-lg border border-blue-300">
                          <h3 className="text-center text-blue-700 font-bold text-lg mb-3">
                            Práctica
                          </h3>

                          <table className="min-w-full text-left">
                            <tbody>
                              <tr>
                                <th className="pr-4 font-semibold">Nombre:</th>
                                <td>{a.practice.name_practice}</td>
                              </tr>

                              <tr>
                                <th className="pr-4 font-semibold">Tipo:</th>
                                <td>{a.practice.type_practice}</td>
                              </tr>

                              <tr>
                                <th className="pr-4 font-semibold">Descripción:</th>
                                <td>{a.practice.description_practice}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      )}

                      {/* ======= THINKLET ======= */}
                      {a.thinklet && (
                        <div className="mt-4 p-4 bg-white rounded-lg border border-green-300">
                          <h3 className="text-center text-green-700 font-bold text-lg mb-3">
                            Thinklet
                          </h3>

                          <table className="min-w-full text-left">
                            <tbody>
                              <tr>
                                <th className="pr-4 font-semibold">Nombre:</th>
                                <td>{a.thinklet.name_thinklet}</td>
                              </tr>

                              <tr>
                                <th className="pr-4 font-semibold">Descripción:</th>
                                <td>{a.thinklet.description_thinklet}</td>
                              </tr>
                            </tbody>
                          </table>

                          {a.thinklet.pattern && (
                            <div className="mt-4 p-3 bg-green-50 rounded border border-green-300">
                              <h4 className="text-center font-bold text-green-800 mb-2">
                                Patrón
                              </h4>

                              <table className="min-w-full text-left">
                                <tbody>
                                  <tr>
                                    <th className="pr-4 font-semibold">Nombre:</th>
                                    <td>{a.thinklet.pattern.name_pattern}</td>
                                  </tr>

                                  <tr>
                                    <th className="pr-4 font-semibold">Descripción:</th>
                                    <td>{a.thinklet.pattern.description_pattern}</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      )}

                      {/* ======= ROLES ======= */}
                      {a.assignedRoles && a.assignedRoles.length > 0 && (
                        <div className="mt-4 p-4 bg-white rounded-lg border border-purple-300">
                          <h3 className="text-center text-purple-700 font-bold text-lg mb-3">
                            Roles asignados
                          </h3>

                          {a.assignedRoles.map((r, idx) => (
                            <div key={`${r.id_role}-${idx}`} className="mb-3">
                              <p><strong>Nombre:</strong> {r.name_role}</p>
                              <p><strong>Descripción:</strong> {r.description_role}</p>
                              <p><strong>Habilidades:</strong> {r.skills_role}</p>
                            </div>
                          ))}
                        </div>
                      )}

                    </div>
                  ))}

                </div>
              )}
            </div>
            
          </div>
        </div>

        {/* Botones (estos NO se incluyen en el PDF) */}
        <div className="processButtonRow">
          <button onClick={() => router.back()} className="btnBack">
            <ArrowLeft className="w-4 h-4" /> Volver
          </button>

          <button onClick={handleDownload} className="btnDownload">
            <FileText className="w-4 h-4" /> Descargar PDF
          </button>
        </div>

      </main>
    </div>
  )
}