import "./global.css"
import { Sidebar } from "@/components/ui/sidebar"
import { Providers } from "./providers"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>
        <Providers> {/*Aquí envolvemos todo */}
          <div className="layoutContainer">
            <Sidebar />
            <main className="layoutMain">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  )
}
/*import "./global.css"
import { Sidebar } from "@/components/ui/sidebar"
import "react-toastify/dist/ReactToastify.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>
        <div className="layoutContainer">
          <Sidebar />
          <main className="layoutMain">{children}</main>
        </div>
      </body>
    </html>
  )
}*/
