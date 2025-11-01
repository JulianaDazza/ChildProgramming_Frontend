"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Menu,
  Workflow,
  ListTodo,
  Users,
  Repeat,
  FlaskRound,
  Lightbulb,
  Shapes,
  RefreshCcw
} from "lucide-react"
import React, { useState } from "react"
import "../../app/global.css"

interface NavLink {
  name: string
  href: string
  icon: React.ReactNode
}

export function Sidebar(): JSX.Element {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  const links: NavLink[] = [
    { name: "Procesos", href: "/", icon: <RefreshCcw size={20} /> },
    { name: "Actividades", href: "/activities/list", icon: <ListTodo size={20} /> },
    { name: "Roles", href: "/roles/list", icon: <Users size={20} /> },
    { name: "Rondas", href: "/rounds/list", icon: <Repeat size={20} /> },
    { name: "Prácticas", href: "/practices/list", icon: <FlaskRound size={20} /> },
    { name: "Thinklets", href: "/thinklets/list", icon: <Lightbulb size={20} /> },
    { name: "Patrones", href: "/patterns/list", icon: <Shapes size={20} /> },
  ]

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebarHeader">
        <button
          className="collapseButton"
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? "Expandir menú" : "Contraer menú"}
        >
          <Menu size={22} />
        </button>
        {!collapsed && <h2>Elementos del Proceso</h2>}
      </div>

      <nav className="sidebarNav">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`navLink ${
              pathname === link.href || pathname.startsWith(link.href + "/")
                ? "active"
                : ""
            }`}
          >
            <div className="navIcon">{link.icon}</div>
            {!collapsed && <span className="navText">{link.name}</span>}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
