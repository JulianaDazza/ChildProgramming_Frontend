"use client"

import { useEffect, useState, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, FileText } from "lucide-react"
import "../../global.css"
import { generateProcessPDF } from "@/lib/pdf_generator"
import { useAppToast } from "@/hooks/useAppToast"

// Tipos recomendados
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
  parent_round_id?: number | null
  practice?: Practice | null
  thinklet?: Thinklet | null
  assignedRoles?: Role[] | null
}

interface Round {
  id_activity: number
  name_activity: string
  description_activity: string
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

  // ============================
  // AGRUPAR ACTIVIDADES POR RONDA
  // ============================
  const actividadesSinRonda = process.activities.filter(a => !a.parent_round_id)
  const actividadesPorRonda = process.rounds.map(round => ({
    ...round,
    actividades: process.activities.filter(a => a.parent_round_id === round.id_activity)
  }))

  // ============================
  //     RENDER COMPLETO
  // ============================

  return (
    <div className="processContainer">
      <main className="processMain">

        {/* CONTENIDO COMPLETO PARA PDF */}
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

            {/* ============================= */}
            {/*      BLOQUE 1: DETALLES       */}
            {/* ============================= */}
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

            {/* ======================================================== */}
            {/* BLOQUE 2..N : UNA RONDA → SUS ACTIVIDADES ASOCIADAS     */}
            {/* ======================================================== */}
            {actividadesPorRonda.map((roundGroup, idx) => (
              <div key={roundGroup.id_activity} className="processInfoCard">

                {/* --- TITULO DE RONDA --- */}
                <h2>
                  Ronda {idx + 1}: {roundGroup.name_activity}
                </h2>

                {/* Info de la ronda */}
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 mb-4">
                  <table className="min-w-full text-left">
                    <tbody>
                      <tr>
                        <th className="pr-4 font-semibold">Descripción:</th>
                        <td>{roundGroup.description_activity}</td>
                      </tr>
                      <tr>
                        <th className="pr-4 font-semibold">Estado:</th>
                        <td>{formatRoundStatus(roundGroup.round_status)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* === ACTIVIDADES DE LA RONDA === */}
                {roundGroup.actividades.length === 0 ? (
                  <p className="italic text-gray-600">No hay actividades asociadas a esta ronda.</p>
                ) : (
                  roundGroup.actividades.map((a, index) => (
                    <div key={a.id_activity} className="p-4 bg-gray-100 rounded-lg border mb-6">

                      <h3 className="text-xl font-bold text-blue-800 mb-3">
                        Actividad {index + 1}: {a.name_activity}
                      </h3>

                      {/* Tabla base */}
                      <table className="min-w-full text-left">
                        <tbody>
                          <tr>
                            <th className="pr-4 font-semibold">Descripción:</th>
                            <td>{a.description_activity}</td>
                          </tr>
                        </tbody>
                      </table>

                      {/* PRÁCTICA */}
                      {a.practice && (
                        <div className="mt-4 p-4 bg-white rounded-lg border border-blue-300">
                          <h3 className="text-center text-blue-700 font-bold text-lg mb-3">Práctica</h3>

                          <table className="min-w-full text-left">
                            <tbody>
                              <tr>
                                <th className="pr-4">Nombre:</th>
                                <td>{a.practice.name_practice}</td>
                              </tr>
                              <tr>
                                <th className="pr-4">Tipo:</th>
                                <td>{a.practice.type_practice}</td>
                              </tr>
                              <tr>
                                <th className="pr-4">Descripción:</th>
                                <td>{a.practice.description_practice}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      )}

                      {/* THINKLET */}
                      {a.thinklet && (
                        <div className="mt-4 p-4 bg-white rounded-lg border border-green-300">
                          <h3 className="text-center text-green-700 font-bold text-lg mb-3">Thinklet</h3>

                          <table className="min-w-full text-left">
                            <tbody>
                              <tr>
                                <th className="pr-4">Nombre:</th>
                                <td>{a.thinklet.name_thinklet}</td>
                              </tr>
                              <tr>
                                <th className="pr-4">Descripción:</th>
                                <td>{a.thinklet.description_thinklet}</td>
                              </tr>
                            </tbody>
                          </table>

                          {/* PATRÓN */}
                          {a.thinklet.pattern && (
                            <div className="mt-3 p-3 bg-green-50 rounded border border-green-300">
                              <h4 className="text-center font-bold text-green-800 mb-2">
                                Patrón
                              </h4>

                              <table className="min-w-full text-left">
                                <tbody>
                                  <tr>
                                    <th className="pr-4">Nombre:</th>
                                    <td>{a.thinklet.pattern.name_pattern}</td>
                                  </tr>
                                  <tr>
                                    <th className="pr-4">Descripción:</th>
                                    <td>{a.thinklet.pattern.description_pattern}</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      )}

                      {/* ROLES */}
                      {a.assignedRoles && a.assignedRoles.length > 0 && (
                        <div className="mt-4 p-4 bg-white rounded-lg border border-purple-300">
                          <h3 className="text-center text-purple-700 font-bold text-lg mb-3">
                            Roles asignados
                          </h3>

                          {a.assignedRoles.map((r, idxR) => (
                            <div key={idxR} className="mb-2">
                              <p><strong>Nombre:</strong> {r.name_role}</p>
                              <p><strong>Descripción:</strong> {r.description_role}</p>
                              <p><strong>Habilidades:</strong> {r.skills_role}</p>
                            </div>
                          ))}
                        </div>
                      )}

                    </div>
                  ))
                )}

              </div>
            ))}

            {/* =========================================== */}
            {/*   BLOQUE FINAL: ACTIVIDADES SIN RONDA        */}
            {/* =========================================== */}
            {actividadesSinRonda.length > 0 && (
              <div className="processInfoCard">

                <h2>Actividades sin ronda</h2>

                {actividadesSinRonda.map((a, index) => (
                  <div key={a.id_activity} className="p-4 bg-gray-100 rounded-lg border mb-6">

                    <h3 className="text-xl font-bold text-blue-800 mb-3">
                      Actividad {index + 1}: {a.name_activity}
                    </h3>

                    {/* Base */}
                    <table className="min-w-full text-left">
                      <tbody>
                        <tr>
                          <th className="pr-4">Descripción:</th>
                          <td>{a.description_activity}</td>
                        </tr>
                      </tbody>
                    </table>

                    {/* PRÁCTICA */}
                    {a.practice && (
                      <div className="mt-4 p-4 bg-white rounded-lg border border-blue-300">
                        <h3 className="text-center text-blue-700 font-bold text-lg mb-3">Práctica</h3>

                        <table className="min-w-full text-left">
                          <tbody>
                            <tr>
                              <th className="pr-4">Nombre:</th>
                              <td>{a.practice.name_practice}</td>
                            </tr>
                            <tr>
                              <th className="pr-4">Tipo:</th>
                              <td>{a.practice.type_practice}</td>
                            </tr>
                            <tr>
                              <th className="pr-4">Descripción:</th>
                              <td>{a.practice.description_practice}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* THINKLET */}
                    {a.thinklet && (
                      <div className="mt-4 p-4 bg-white rounded-lg border border-green-300">
                        <h3 className="text-center text-green-700 font-bold text-lg mb-3">Thinklet</h3>

                        <table className="min-w-full text-left">
                          <tbody>
                            <tr>
                              <th className="pr-4">Nombre:</th>
                              <td>{a.thinklet.name_thinklet}</td>
                            </tr>
                            <tr>
                              <th className="pr-4">Descripción:</th>
                              <td>{a.thinklet.description_thinklet}</td>
                            </tr>
                          </tbody>
                        </table>

                        {/* Patrón */}
                        {a.thinklet.pattern && (
                          <div className="mt-3 p-3 bg-green-50 rounded border border-green-300">
                            <h4 className="text-center font-bold text-green-800 mb-2">
                              Patrón
                            </h4>

                            <table className="min-w-full text-left">
                              <tbody>
                                <tr>
                                  <th className="pr-4">Nombre:</th>
                                  <td>{a.thinklet.pattern.name_pattern}</td>
                                </tr>
                                <tr>
                                  <th className="pr-4">Descripción:</th>
                                  <td>{a.thinklet.pattern.description_pattern}</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    )}

                    {/* ROLES */}
                    {a.assignedRoles && a.assignedRoles.length > 0 && (
                      <div className="mt-4 p-4 bg-white rounded-lg border border-purple-300">
                        <h3 className="text-center text-purple-700 font-bold text-lg mb-3">
                          Roles asignados
                        </h3>

                        {a.assignedRoles.map((r, idxR) => (
                          <div key={idxR} className="mb-2">
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

        {/* Botones NO incluidos en PDF */}
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
