"use client"

import React, { useState } from "react"
import Viewer from "react-viewer"
import "@/styles/react-viewer.css"

interface ImageViewerProps {
  imageUrl: string
  trigger?: React.ReactNode
}

export function ImageViewer({ imageUrl, trigger }: ImageViewerProps) {
  const [visible, setVisible] = useState(false)

  return (
    <>
      <div onClick={() => setVisible(true)} className="cursor-pointer">
        {trigger || (
          <img
            src={imageUrl}
            alt="Vista previa"
            className="w-32 h-32 object-cover rounded-md border hover:opacity-80 transition"
          />
        )}
      </div>

      <Viewer
        visible={visible}
        onClose={() => setVisible(false)}
        images={[{ src: imageUrl, alt: "Vista ampliada" }]}
        zoomSpeed={0.3}
        scalable
        rotatable
        changeable
        downloadable
      />
    </>
  )
}
