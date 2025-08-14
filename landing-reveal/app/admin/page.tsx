"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Header from "@/components/header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import BecasForm from "@/components/admin/becas-form"
import CompetenciasForm from "@/components/admin/competencias-form"
import ProgramasForm from "@/components/admin/programas-form"

export default function AdminPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  // Función simple de autenticación (en producción, usar un sistema más seguro)
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Contraseña simple para demostración
    if (password === "lateenimpacto2025") {
      setIsAuthenticated(true)
      setError("")
    } else {
      setError("Contraseña incorrecta")
    }
  }

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">Panel de Administración</CardTitle>
                <CardDescription className="text-center">
                  Ingresa la contraseña para acceder al panel de administración
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium">
                      Contraseña
                    </label>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  <button
                    type="submit"
                    className="w-full bg-orange-500 text-white font-medium py-2 px-4 rounded-md hover:bg-orange-600 transition-colors"
                  >
                    Acceder
                  </button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold text-center mb-8">Panel de Administración</h1>

        <Tabs defaultValue="becas" className="max-w-4xl mx-auto">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="becas">Becas</TabsTrigger>
            <TabsTrigger value="competencias">Competencias</TabsTrigger>
            <TabsTrigger value="programas">Programas</TabsTrigger>
          </TabsList>

          <TabsContent value="becas">
            <Card>
              <CardHeader>
                <CardTitle>Agregar Nueva Beca</CardTitle>
                <CardDescription>
                  Completa el formulario para agregar una nueva beca a la base de datos.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BecasForm />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="competencias">
            <Card>
              <CardHeader>
                <CardTitle>Agregar Nueva Competencia</CardTitle>
                <CardDescription>
                  Completa el formulario para agregar una nueva competencia a la base de datos.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CompetenciasForm />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="programas">
            <Card>
              <CardHeader>
                <CardTitle>Agregar Nuevo Programa</CardTitle>
                <CardDescription>
                  Completa el formulario para agregar un nuevo programa a la base de datos.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProgramasForm />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <footer className="bg-gray-900 text-white py-12 mt-16">
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
