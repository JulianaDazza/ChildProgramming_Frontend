"use client"
import React from "react"

interface ConfirmModalProps {
  title?: string
  message: string
  onConfirm: () => void
  onCancel: () => void
  confirmText?: string   // 👈 Nuevo
  cancelText?: string    // 👈 Nuevo
}

export function ConfirmModal({
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Aceptar",   //Texto por defecto
  cancelText = "Cancelar",   //Texto por defecto
}: ConfirmModalProps) {
  return (
    <div className="modalOverlay">
      <div className="modalBox">
        {title && <h3 className="modalTitle">{title}</h3>}
        <p className="modalMessage">{message}</p>

        <div className="modalActions">
          <button onClick={onCancel} className="modalButton cancel">
            {cancelText}
          </button>
          <button onClick={onConfirm} className="modalButton confirm">
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

