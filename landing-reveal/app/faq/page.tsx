"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import Header from "@/components/header"

// Verificar que el componente esté exportado correctamente
export default function FAQ() {
  const router = useRouter()
  const [isLoaded, setIsLoaded] = useState(false)

  const faqs = [
    {
      id: 1,
      question: "¿Qué es Lateen Impacto?",
      answer:
        "Lateen Impacto es un proyecto creado para conectar a jóvenes argentinos con oportunidades educativas que pueden cambiar el rumbo de sus vidas. Ofrecemos información sobre becas, concursos, olimpiadas, intercambios y muchas más oportunidades para que puedas aprovecharlas al máximo. Nuestro objetivo es que ningún joven se quede sin la posibilidad de crecer y desarrollarse por falta de información.",
    },
    {
      id: 2,
      question: "¿Quiénes pueden acceder a las oportunidades ofrecidas por Lateen Impacto?",
      answer:
        "Las oportunidades están dirigidas principalmente a jóvenes argentinos, sin importar el nivel educativo. Si estás en la escuela, la universidad, o incluso si ya terminaste, podés encontrar oportunidades que se adapten a tu situación. También compartimos recursos para adultos interesados en continuar su educación o mejorar su perfil profesional.",
    },
    {
      id: 3,
      question: "¿Es gratuito participar en Lateen Impacto?",
      answer:
        "Sí, absolutamente. Todas las oportunidades, recursos y actividades que compartimos son completamente gratuitas. Lateen Impacto está comprometido con la equidad educativa, por lo que todas las personas, sin importar su situación económica, pueden acceder a la información que ofrecemos.",
    },
    {
      id: 4,
      question: "¿Cómo puedo encontrar oportunidades educativas a través de Lateen Impacto?",
      answer:
        'En nuestro sitio web y redes sociales, publicamos constantemente nuevas oportunidades. También organizamos eventos, webinars y talleres para orientar a los jóvenes. Además, ofrecemos una sección de "Oportunidades Destacadas", donde podrás encontrar becas, concursos y más, fácilmente. Si necesitas ayuda personalizada, podés completar un formulario y te guiaremos en tu búsqueda.',
    },
    {
      id: 5,
      question: "¿Necesito ser voluntario/a para acceder a las oportunidades?",
      answer:
        "No, no es necesario ser voluntario para acceder a las oportunidades. Todos los jóvenes que forman parte de nuestra comunidad pueden acceder a las becas, concursos y recursos que compartimos. Si estás interesado/a en ser voluntario/a, eso es completamente opcional y te permitirá colaborar con otros jóvenes para mejorar el acceso a estas oportunidades.",
    },
    {
      id: 6,
      question: "¿Puedo postularme a las oportunidades si soy mayor de edad?",
      answer:
        "Sí, ¡por supuesto! Muchas de las oportunidades que compartimos son abiertas a jóvenes y adultos. Las becas, los intercambios y otros recursos educativos no tienen una edad límite y son accesibles para quienes desean seguir creciendo académicamente. Si eres mayor de edad y estás buscando opciones para continuar tu educación, también encontrarás contenido relevante en nuestra plataforma.",
    },
    {
      id: 7,
      question: "¿Cómo puedo hacer preguntas o recibir ayuda personalizada?",
      answer:
        "Si tienes dudas o necesitas ayuda para encontrar una oportunidad, puedes contactarnos a través de nuestras redes sociales o enviarnos un correo electrónico. También ofrecemos asistencia personalizada a través de un formulario donde puedes contarnos tus necesidades específicas, y nos aseguraremos de responderte lo antes posible con orientación.",
    },
    {
      id: 8,
      question: "¿Qué debo hacer si quiero ser voluntario/a de Lateen Impacto?",
      answer:
        "Si deseas ser voluntario/a y sumarte a nuestra misión, simplemente completa el formulario de inscripción en nuestra página de voluntariado. Luego, uno de nuestros coordinadores se pondrá en contacto contigo para explicarte cómo puedes empezar a colaborar y qué actividades puedes realizar según tus intereses y habilidades.",
    },
    {
      id: 9,
      question: "¿Qué tipo de actividades realizan los voluntarios/as de Lateen Impacto?",
      answer: (
        <>
          Los voluntarios/as de Lateen Impacto realizan diversas actividades, tales como:
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Investigación y difusión de oportunidades educativas.</li>
            <li>Creación de contenido para redes sociales.</li>
            <li>Organización de eventos, talleres y webinars.</li>
            <li>Asesoramiento y orientación a jóvenes que buscan becas o intercambios.</li>
            <li>Ayuda administrativa en la gestión del proyecto.</li>
          </ul>
          <p className="mt-2">
            Te asignamos tareas que se alinean con tus intereses y habilidades, por lo que puedes elegir cómo quieres
            aportar.
          </p>
        </>
      ),
    },
    {
      id: 10,
      question: "¿Cómo puedo dejar de ser voluntario/a si ya no quiero participar?",
      answer:
        "Entendemos que pueden surgir cambios en tus horarios o compromisos, por lo que puedes dejar de ser voluntario/a en cualquier momento. Solo te pedimos que nos avises con tiempo para poder hacer la transición de manera ordenada. Tu participación será siempre valorada, ¡y nos gustaría seguir contando contigo en el futuro!",
    },
    {
      id: 11,
      question: "¿Hay algún tipo de reconocimiento o certificado por ser voluntario/a?",
      answer:
        "Sí, los voluntarios/as que colaboran activamente en el proyecto reciben un reconocimiento formal al final de su participación, que puede incluir un certificado de voluntariado. Además, si estás interesado/a, podemos proporcionarte una carta de recomendación basada en tu contribución.",
    },
    {
      id: 12,
      question: "¿Puedo colaborar con recursos o donaciones?",
      answer:
        "Aunque nuestro proyecto es completamente gratuito, siempre estamos abiertos a la colaboración de quienes deseen apoyar la causa. Si deseas hacer una donación o colaborar con recursos (como libros, materiales educativos, etc.), puedes contactarnos para saber más sobre cómo hacerlo.",
    },
    {
      id: 13,
      question: "¿Las oportunidades que comparten tienen algún costo?",
      answer:
        "Nos enfocamos principalmente en compartir oportunidades gratuitas o con becas completas. Cuando compartimos información sobre programas con costo, siempre lo especificamos claramente y procuramos que existan opciones de financiamiento o becas parciales.",
    },
    {
      id: 14,
      question: "¿Cómo verifican la calidad de las oportunidades que comparten?",
      answer:
        "Tenemos un proceso de curaduría donde verificamos la legitimidad de las instituciones que ofrecen las oportunidades, revisamos las experiencias previas de participantes, y evaluamos el valor real que aportan a los jóvenes. Solo compartimos aquellas que cumplen con nuestros estándares de calidad.",
    },
    {
      id: 15,
      question: "¿Puedo sugerir oportunidades para que las compartan?",
      answer:
        "¡Absolutamente! Valoramos las sugerencias de nuestra comunidad. Puedes enviarnos información sobre oportunidades que conozcas y nuestro equipo las evaluará para posiblemente incluirlas en nuestras publicaciones.",
    },
    {
      id: 16,
      question: "¿Con qué frecuencia publican nuevas oportunidades?",
      answer:
        "Actualizamos nuestro contenido semanalmente, pero cuando hay convocatorias con fechas límite cercanas o oportunidades especialmente relevantes, las compartimos de inmediato para dar tiempo suficiente a nuestra comunidad para aplicar.",
    },
    {
      id: 17,
      question: "¿Ofrecen asesorías personalizadas para aplicar a becas u oportunidades?",
      answer:
        "Actualmente ofrecemos asesorías grupales gratuitas para temas generales y, en algunos casos, podemos conectarte con mentores voluntarios que te brinden orientación más personalizada según tu área de interés.",
    },
  ]

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
      router.push("/")
    }, 300)
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
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-6">Preguntas Frecuentes</h1>

        <div className="max-w-3xl mx-auto mb-12">
          <p className="text-lg text-center text-gray-600">
            En Lateen Impacto queremos asegurarnos de que tengas toda la información que necesitas para aprovechar las
            oportunidades educativas y sumarte al proyecto de la mejor manera posible. Aquí respondemos algunas de las
            preguntas más comunes que recibimos, pero si tienes más dudas, no dudes en contactarnos.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="space-y-8">
            {faqs.map((faq) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: faq.id * 0.05 }}
                className="bg-gray-50 rounded-lg shadow-sm p-6 border border-gray-200"
              >
                <h2 className="text-xl font-bold text-orange-600 mb-4">{faq.question}</h2>
                <div className="text-gray-700">{faq.answer}</div>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-center mt-12">
            <a
              href="/"
              onClick={handleBackClick}
              className="bg-orange-500 text-white font-medium py-2 px-6 rounded-full hover:bg-orange-600 transition-colors"
            >
              Volver al inicio
            </a>
          </div>
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
