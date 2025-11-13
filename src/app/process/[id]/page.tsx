"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, FileText } from "lucide-react"
import "../../global.css"
import { Sidebar } from "@/components/ui/sidebar"
import type { Process } from "@/lib/types"
import { generateProcessPDF } from "@/lib/pdf_generator"
import { useAppToast } from "@/hooks/useAppToast"

export default function ProcessDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [process, setProcess] = useState<Process | null>(null)
  const [loading, setLoading] = useState(true)
  const { toastError, toastInfo } = useAppToast()

  useEffect(() => {
    const fetchProcess = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/colaborative_process/${id}`)
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
    if (process) {
      try {
        await generateProcessPDF(process)
        toastInfo("📄 PDF generado correctamente")
      } catch (err) {
        console.error("Error al generar PDF:", err)
        toastError("Error al generar el PDF")
      }
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
      <Sidebar />

      <main className="processMain">
        <div className="contentWrapper detailCard">
          {/* 🔹 Encabezado */}
          <div className="processHeader">
            <div className="processTitleRow">
              <div className="catIconCircle small">
                <img src="/caticon.svg" alt="Icono proceso" />
              </div>
              <h1 className="heroTitle m-0">{process.name_process}</h1>
            </div>

            <p className="text-gray-600">
              Información completa del proceso colaborativo.
            </p>
          </div>

          {/* 🔹 Contenido */}
          <div className="processDetailContent">
            <div className="processInfoCard">
              <h2>Detalles generales</h2>

              <table className="processTable">
                <tbody>
                  <tr>
                    <th>ID del proceso:</th>
                    <td>{process.id_process}</td>
                  </tr>
                  <tr>
                    <th>Nombre:</th>
                    <td>{process.name_process}</td>
                  </tr>
                  <tr>
                    <th>Descripción:</th>
                    <td>{process.description_process}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 🔹 Botones de acción */}
            <div className="processButtonRow">
              <button onClick={() => router.back()} className="btnBack">
                <ArrowLeft className="w-4 h-4" />
                Volver
              </button>

              <button onClick={handleDownload} className="btnDownload">
                <FileText className="w-4 h-4" />
                Descargar PDF
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
