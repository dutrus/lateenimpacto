"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import Image from "next/image"
import Header from "@/components/header"
import { User, Mail, Phone, BookOpen, GraduationCap, Send } from "lucide-react"

export default function Orientacion() {
  const router = useRouter()
  const [isLoaded, setIsLoaded] = useState(false)
  const [formState, setFormState] = useState({
    nombre: "",
    email: "",
    telefono: "",
    nivelEducativo: "",
    areaInteres: "",
    mensaje: "",
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  useEffect(() => {
    // Marcar como cargado después de montar el componente
    setIsLoaded(true)
  }, [])

  const handleBackClick = (e) => {
    e.preventDefault()

    // Cambiar el estado para indicar que se está descargando
    setIsLoaded(false)

    // Navegar después de un pequeño retraso para permitir la animación
    setTimeout(() => {
      router.push("/comunidad/ayuda")
    }, 300)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formState.nombre.trim()) {
      newErrors.nombre = "El nombre es obligatorio"
    }

    if (!formState.email.trim()) {
      newErrors.email = "El email es obligatorio"
    } else if (!/\S+@\S+\.\S+/.test(formState.email)) {
      newErrors.email = "El email no es válido"
    }

    if (!formState.nivelEducativo) {
      newErrors.nivelEducativo = "Por favor selecciona tu nivel educativo"
    }

    if (!formState.areaInteres) {
      newErrors.areaInteres = "Por favor selecciona un área de interés"
    }

    if (!formState.mensaje.trim()) {
      newErrors.mensaje = "Por favor describe tu consulta"
    } else if (formState.mensaje.length < 20) {
      newErrors.mensaje = "Tu mensaje debe tener al menos 20 caracteres"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (validateForm()) {
      setIsSubmitting(true)

      // Simulamos el envío del formulario
      setTimeout(() => {
        setIsSubmitting(false)
        setSubmitSuccess(true)

        // Resetear el formulario
        setFormState({
          nombre: "",
          email: "",
          telefono: "",
          nivelEducativo: "",
          areaInteres: "",
          mensaje: "",
        })

        // Después de 5 segundos, ocultar el mensaje de éxito
        setTimeout(() => {
          setSubmitSuccess(false)
        }, 5000)
      }, 1500)
    }
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Header con menú */}
      <Header />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-16"
      >
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-6">Orientación Personalizada</h1>
        <p className="text-xl text-center text-gray-600 max-w-3xl mx-auto mb-12">
          Completa este formulario y nuestro equipo te contactará para brindarte orientación específica según tus
          necesidades e intereses.
        </p>

        <div className="max-w-2xl mx-auto bg-gray-50 p-8 rounded-lg shadow-md">
          {submitSuccess ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-green-50 border border-green-200 text-green-700 p-6 rounded-lg text-center"
            >
              <h3 className="text-xl font-bold mb-2">¡Formulario enviado con éxito!</h3>
              <p>Gracias por contactarnos. Nuestro equipo revisará tu consulta y te responderá a la brevedad.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nombre */}
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre completo *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formState.nombre}
                    onChange={handleChange}
                    className={`pl-10 w-full p-3 border ${
                      errors.nombre ? "border-red-300 bg-red-50" : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
                    placeholder="Tu nombre completo"
                  />
                </div>
                {errors.nombre && <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formState.email}
                    onChange={handleChange}
                    className={`pl-10 w-full p-3 border ${
                      errors.email ? "border-red-300 bg-red-50" : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
                    placeholder="tu.email@ejemplo.com"
                  />
                </div>
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>

              {/* Teléfono (opcional) */}
              <div>
                <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono (opcional)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    id="telefono"
                    name="telefono"
                    value={formState.telefono}
                    onChange={handleChange}
                    className="pl-10 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="+54 11 1234 5678"
                  />
                </div>
              </div>

              {/* Nivel educativo */}
              <div>
                <label htmlFor="nivelEducativo" className="block text-sm font-medium text-gray-700 mb-1">
                  Nivel educativo actual *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <GraduationCap size={18} className="text-gray-400" />
                  </div>
                  <select
                    id="nivelEducativo"
                    name="nivelEducativo"
                    value={formState.nivelEducativo}
                    onChange={handleChange}
                    className={`pl-10 w-full p-3 border ${
                      errors.nivelEducativo ? "border-red-300 bg-red-50" : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
                  >
                    <option value="">Selecciona tu nivel educativo</option>
                    <option value="Secundario">Secundario</option>
                    <option value="Universitario">Universitario</option>
                    <option value="Posgrado">Posgrado</option>
                    <option value="Profesional">Profesional</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
                {errors.nivelEducativo && <p className="mt-1 text-sm text-red-600">{errors.nivelEducativo}</p>}
              </div>

              {/* Área de interés */}
              <div>
                <label htmlFor="areaInteres" className="block text-sm font-medium text-gray-700 mb-1">
                  Área de interés principal *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <BookOpen size={18} className="text-gray-400" />
                  </div>
                  <select
                    id="areaInteres"
                    name="areaInteres"
                    value={formState.areaInteres}
                    onChange={handleChange}
                    className={`pl-10 w-full p-3 border ${
                      errors.areaInteres ? "border-red-300 bg-red-50" : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
                  >
                    <option value="">Selecciona un área</option>
                    <option value="Becas académicas">Becas académicas</option>
                    <option value="Competencias y olimpiadas">Competencias y olimpiadas</option>
                    <option value="Programas y fellowships">Programas y fellowships</option>
                    <option value="Intercambios">Intercambios</option>
                    <option value="Voluntariado">Voluntariado</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
                {errors.areaInteres && <p className="mt-1 text-sm text-red-600">{errors.areaInteres}</p>}
              </div>

              {/* Mensaje */}
              <div>
                <label htmlFor="mensaje" className="block text-sm font-medium text-gray-700 mb-1">
                  Tu consulta *
                </label>
                <textarea
                  id="mensaje"
                  name="mensaje"
                  value={formState.mensaje}
                  onChange={handleChange}
                  rows={5}
                  className={`w-full p-3 border ${
                    errors.mensaje ? "border-red-300 bg-red-50" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
                  placeholder="Describe tu situación y qué tipo de orientación necesitas..."
                ></textarea>
                {errors.mensaje && <p className="mt-1 text-sm text-red-600">{errors.mensaje}</p>}
              </div>

              <div className="flex justify-center pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-8 rounded-full transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                      <span>Enviando...</span>
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      <span>Enviar consulta</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="flex justify-center mt-12">
          <a
            href="/comunidad/ayuda"
            onClick={handleBackClick}
            className="bg-orange-500 text-white font-medium py-2 px-6 rounded-full hover:bg-orange-600 transition-colors"
          >
            Volver a Ayuda
          </a>
        </div>
      </motion.div>

      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="relative w-[30px] h-[75px] mx-auto mb-4">
            <Image src="/icon.png" alt="Icono" fill style={{ objectFit: "contain" }} />
          </div>
          <p>© {new Date().getFullYear()} Lateen Impacto. Todos los derechos reservados.</p>
        </div>
      </footer>
    </main>
  )
}
