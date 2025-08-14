"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Menu, ChevronDown, ChevronUp } from "lucide-react"
import { useRouter } from "next/navigation"

// Estructura del menú con submenús
const menuItems = [
  {
    id: 1,
    title: "Oportunidades",
    submenu: [
      {
        title: "Becas",
        path: "/oportunidades/becas",
      },
      {
        title: "Competencias",
        path: "/oportunidades/competencias",
      },
      {
        title: "Programas",
        path: "/oportunidades/programas",
      },
    ],
  },
  {
    id: 2,
    title: "Comunidad",
    submenu: [
      {
        title: "Necesito ayuda",
        path: "/comunidad/ayuda",
      },
      {
        title: "Me gustaría ser voluntario",
        path: "/comunidad/voluntario",
      },
    ],
  },
  {
    id: 3,
    title: "Curaduría de contenido",
    submenu: [
      {
        title: "Consejos",
        path: "/curaduria/consejos",
      },
      {
        title: "Guías paso a paso",
        path: "/curaduria/guias",
      },
      {
        title: "Plantillas y ejemplos",
        path: "/curaduria/plantillas",
      },
    ],
  },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [expandedItem, setExpandedItem] = useState<number | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Cerrar el menú al hacer clic fuera de él
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false)
        setExpandedItem(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Manejar la navegación con animación
  const handleNavigation = (path: string) => {
    // Aplicar una animación de salida
    const content =
      document.getElementById("main-content") ||
      document.getElementById("mission-content") ||
      document.getElementById("pilar-content") ||
      document.getElementById("historia-content") ||
      document.getElementById("faq-content") ||
      document.getElementById("contacto-content") ||
      document.getElementById("construccion-content") ||
      document.getElementById("becas-content")

    if (content) {
      content.style.opacity = "0"
      content.style.transform = "translateY(20px)"
      content.style.transition = "opacity 0.5s ease, transform 0.5s ease"
    }

    // Navegar después de un pequeño retraso para permitir la animación
    setTimeout(() => {
      router.push(path)
      setMenuOpen(false)
      setExpandedItem(null)
    }, 300)
  }

  // Alternar la expansión de un elemento del menú
  const toggleExpand = (id: number) => {
    if (expandedItem === id) {
      setExpandedItem(null)
    } else {
      setExpandedItem(id)
    }
  }

  // Manejar la navegación para los enlaces principales
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault()
    handleNavigation(path)
  }

  return (
    <header className="bg-orange-500 text-white py-4 sticky top-0 z-50">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <div className="relative w-[20px] h-[50px]">
            <Image src="/icon.png" alt="Icono" fill style={{ objectFit: "contain" }} />
          </div>
        </Link>

        <div className="flex items-center space-x-6">
          {/* Enlaces principales con manejo de animación */}
          <a href="/contacto" onClick={(e) => handleLinkClick(e, "/contacto")} className="hover:underline">
            Contacto
          </a>
          <a href="/faq" onClick={(e) => handleLinkClick(e, "/faq")} className="hover:underline">
            FAQ
          </a>
          <div ref={menuRef} className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="focus:outline-none p-2"
              aria-label="Menú principal"
            >
              <Menu size={24} />
            </button>

            {/* Menú desplegable principal */}
            {menuOpen && (
              <div className="absolute top-full right-0 bg-white shadow-md py-2 w-64 mt-2 rounded-md z-50">
                <ul className="divide-y divide-gray-100">
                  {menuItems.map((item) => (
                    <li key={item.id} className="relative">
                      {/* Elemento principal del menú */}
                      <button
                        onClick={() => toggleExpand(item.id)}
                        className="w-full py-3 px-4 text-gray-800 hover:bg-orange-50 flex justify-between items-center"
                      >
                        <span className="text-base font-medium">{item.title}</span>
                        {expandedItem === item.id ? (
                          <ChevronUp size={18} className="text-gray-500" />
                        ) : (
                          <ChevronDown size={18} className="text-gray-500" />
                        )}
                      </button>

                      {/* Submenú desplegable vertical */}
                      {expandedItem === item.id && (
                        <div className="bg-gray-50 overflow-hidden">
                          <ul>
                            {item.submenu.map((subItem, index) => (
                              <li key={index}>
                                <button
                                  onClick={() => handleNavigation(subItem.path)}
                                  className="w-full text-left py-2 px-8 text-gray-700 hover:bg-orange-100 text-sm"
                                >
                                  {subItem.title}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
