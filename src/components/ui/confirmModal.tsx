"use client"
import React from "react"

interface ConfirmModalProps {
  title?: string
  message: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmModal({ title, message, onConfirm, onCancel }: ConfirmModalProps) {
  return (
    <div className="modalOverlay">
      <div className="modalBox">
        {title && <h3 className="modalTitle">{title}</h3>}
        <p className="modalMessage">{message}</p>

        <div className="modalActions">
          <button onClick={onCancel} className="modalButton cancel">
            Cancelar
          </button>
          <button onClick={onConfirm} className="modalButton confirm">
            Aceptar
          </button>
        </div>
      </div>
    </div>
  )
}
