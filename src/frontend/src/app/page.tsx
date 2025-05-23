'use client'
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Link from "next/link"
import Image from "next/image"
import {
  faCircleInfo,
  faLock,
  faInfoCircle,
  faArrowDown,
} from "@fortawesome/free-solid-svg-icons"

export default function HoldingLanding() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [valorImovel, setValorImovel] = useState("")
  const [obs, setObs] = useState("")
  const [termsAccepted, setTermsAccepted] = useState(false)

  const testimonials = [
    {
      text: "A W1 me ajudou a consolidar todos meus imóveis em uma só holding.",
      name: "Roberta Santos",
      role: "Cliente W1",
      img: "assets/avatar.png",
    },
    {
      text: "A W1 me ajudou a consolidar todos meus imóveis em uma só holding.",
      name: "Roberta Santos",
      role: "Cliente W1",
      img: "assets/avatar.png",
    },
    {
      text: "A W1 me ajudou a consolidar todos meus imóveis em uma só holding.",
      name: "Roberta Santos",
      role: "Cliente W1",
      img: "assets/avatar.png",
    },
  ]

function formatCurrency(value) {
  const onlyNumbers = value.replace(/\D/g, "")
  if (!onlyNumbers) return ""
  const number = parseInt(onlyNumbers) / 100
  return number.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  })
}

function extractNumericValue(formattedValue) {
  if (!formattedValue) return ""
  return formattedValue
    .replace(/R\$\s?/g, "")
    .replace(/\./g, "")
    .replace(",", ".")
}

async function handleSubmit(e: React.FormEvent) {
  e.preventDefault()
  if (!termsAccepted) {
    alert("Aceite os termos para continuar.")
    return
  }
  const numericValue = extractNumericValue(valorImovel)
  if (!numericValue || Number(numericValue) < 1) {
    alert("O valor do imóvel deve ser um número positivo maior ou igual a 1.")
    return
  }
  const data = {
    email,
    valorImovel: numericValue,
    obs,
  }
  const apiUrl = process.env.REACT_PUBLIC_URL_API
  if (!apiUrl) {
    alert("Erro interno: URL da API não configurada")
    return
  }
  try {
    const res = await fetch(`${apiUrl}/informations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || "Falha na requisição")
    }
    router.push("/simulacao")
  } catch (err: any) {
    alert(`Erro ao enviar informações: ${err.message}`)
  }
}


  function handleAccessClick() {
    router.push("/login")
  }

  function handleValorChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    if (value === "") {
      setValorImovel("")
      return
    }
    const formatted = formatCurrency(value)
    setValorImovel(formatted)
  }

  useEffect(() => {
    const fadeIns = document.querySelectorAll(".fade-in-on-scroll")
    function checkFadeIns() {
      const windowBottom = window.innerHeight
      fadeIns.forEach((el) => {
        const rect = el.getBoundingClientRect()
        if (rect.top < windowBottom - 100) {
          el.classList.add("visible")
        }
      })
    }
    checkFadeIns()
    window.addEventListener("scroll", checkFadeIns)
    return () => window.removeEventListener("scroll", checkFadeIns)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#022028] to-[#355054] bg-fixed">
      <header className="top-0 left-0 right-0 z-50 bg-transparent backdrop-blur-ms px-4 py-3 flex items-center gap-2 font-bold text-white text-xl transition-colors duration-500">
        <Link href="/login">
          <Image
            src="/assets/w1_white.png"
            alt="Logo"
            width={34}
            height={17}
            priority
            className="w-8 h-4 md:w-10 md:h-5 cursor-pointer"
          />
        </Link>
        <div className="text-lg md:text-xl cursor-pointer" onClick={handleAccessClick}>
          Consultoria
        </div>
      </header>

      <section className="pt-20 md:pt-32 px-6 py-8 md:py-16 max-w-7xl mx-auto text-white fade-in-on-scroll opacity-0 translate-y-10 transition-all duration-700 ease-out relative">
        <div className="text-center mb-12 md:mb-20">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-[#5CE1E6] bg-clip-text text-transparent leading-tight">
            Construa sua holding
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl opacity-90 max-w-4xl mx-auto leading-relaxed mb-8">
            A W1 Consultoria oferece a solução completa para estruturar sua
            holding de forma segura, eficiente e transparente.
          </p>
          <button
            onClick={handleAccessClick}
            className="bg-gradient-to-r from-[#5CE1E6] to-[#4ecdc4] text-[#022028] px-8 py-4 md:px-12 md:py-5 rounded-3xl text-lg md:text-xl font-bold hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            Acesse Agora
          </button>
        </div>
        <div className="absolute bottom-[-40px] left-1/2 -translate-x-1/2 cursor-pointer animate-bounce" onClick={() => window.scrollBy({ top: window.innerHeight, behavior: "smooth" })}>
          <FontAwesomeIcon icon={faArrowDown} size="lg" />
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-8 lg:gap-16 mb-16">
        <section className="fade-in-on-scroll opacity-0 translate-y-10 transition-all duration-700 ease-out">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 text-gray-900 h-full">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#022028]">
              Benefícios da W1
            </h2>
            <p className="mb-8 text-lg md:text-xl opacity-80 leading-relaxed">
              Conheça alguns dos benefícios que a W1 te garante na criação da sua
              holding.
            </p>
            <div className="space-y-8">
              <div className="flex gap-6 items-start p-6 bg-gradient-to-r from-[#5CE1E6]/10 to-[#4ecdc4]/10 rounded-2xl border-l-4 border-[#5CE1E6]">
                <span className="text-[#022028] flex-shrink-0 mt-1">
                  <FontAwesomeIcon icon={faCircleInfo} size="2x" />
                </span>
                <div>
                  <h3 className="font-bold text-xl md:text-2xl mb-3 text-[#022028]">
                    Processo Simplificado
                  </h3>
                  <p className="text-lg leading-relaxed">
                    Nossa plataforma guia você em cada etapa no processo de
                    construção da sua holding.
                  </p>
                </div>
              </div>

              <div className="flex gap-6 items-start p-6 bg-gradient-to-r from-[#5CE1E6]/10 to-[#4ecdc4]/10 rounded-2xl border-l-4 border-[#5CE1E6]">
                <span className="text-[#022028] flex-shrink-0 mt-1">
                  <FontAwesomeIcon icon={faLock} size="2x" />
                </span>
                <div>
                  <h3 className="font-bold text-xl md:text-2xl mb-3 text-[#022028]">
                    Segurança Jurídica
                  </h3>
                  <p className="text-lg leading-relaxed">
                    Documentação completa e alinhada com a legislação vigente,
                    acompanhada por especialistas.
                  </p>
                </div>
              </div>

              <div className="flex gap-6 items-start p-6 bg-gradient-to-r from-[#5CE1E6]/10 to-[#4ecdc4]/10 rounded-2xl border-l-4 border-[#5CE1E6]">
                <span className="text-[#022028] flex-shrink-0 mt-1">
                  <FontAwesomeIcon icon={faInfoCircle} size="2x" />
                </span>
                <div>
                  <h3 className="font-bold text-xl md:text-2xl mb-3 text-[#022028]">
                    Acompanhamento
                  </h3>
                  <p className="text-lg leading-relaxed">
                    Consulte o status do seu processo a qualquer momento, onde e
                    quando quiser.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="fade-in-on-scroll opacity-0 translate-y-10 transition-all duration-700 ease-out">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 text-gray-900 h-full">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#022028]">Simule agora</h2>
            <p className="text-lg md:text-xl mb-8 opacity-80 leading-relaxed">
              Faça uma simulação dos ganhos que você teria com o seu imóvel em uma
              holding.
            </p>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  className="block mb-3 text-base font-semibold text-gray-700"
                  htmlFor="email"
                >
                  E-mail
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Seu E-mail"
                  className="w-full p-4 md:p-5 border-2 border-gray-300 rounded-2xl text-gray-900 text-lg focus:border-[#5CE1E6] focus:outline-none transition-colors"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label
                  className="block mb-3 text-base font-semibold text-gray-700"
                  htmlFor="valor"
                >
                  Valor do Imóvel
                </label>
                <input
                  id="valor"
                  type="text"
                  placeholder="R$ 0,00"
                  className="w-full p-4 md:p-5 border-2 border-gray-300 rounded-2xl text-gray-900 text-lg focus:border-[#5CE1E6] focus:outline-none transition-colors"
                  value={valorImovel}
                  onChange={handleValorChange}
                  inputMode="numeric"
                  required
                />
              </div>

              <div>
                <label
                  className="block mb-3 text-base font-semibold text-gray-700"
                  htmlFor="obs"
                >
                  Observação
                </label>
                <textarea
                  id="obs"
                  placeholder="Insira alguma observação sobre"
                  className="w-full p-4 md:p-5 border-2 border-gray-300 rounded-2xl text-gray-900 text-lg resize-none focus:border-[#5CE1E6] focus:outline-none transition-colors"
                  rows={4}
                  value={obs}
                  onChange={(e) => setObs(e.target.value)}
                />
              </div>

              <div className="flex items-start gap-3">
                <input
                  id="terms"
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={() => setTermsAccepted(!termsAccepted)}
                  className="mt-1 w-5 h-5 rounded"
                  required
                />
                <label
                  htmlFor="terms"
                  className="text-base leading-relaxed cursor-pointer"
                  onClick={() => setTermsAccepted(!termsAccepted)}
                >
                  Eu aceito os termos{" "}
                  <a
                    href="https://www.w1.com.br/privacidade"
                    className="underline text-[#022028] hover:text-[#5CE1E6] transition-colors"
                  >
                    Termos de compromisso
                  </a>
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#022028] to-[#355054] text-white py-4 md:py-5 rounded-3xl font-bold text-lg md:text-xl hover:shadow-xl transform hover:scale-[1.03] transition-all duration-300"
              >
                Simular Agora
              </button>
            </form>
          </div>
        </section>
      </div>

      <section className="max-w-7xl mx-auto px-6 py-16 md:py-24 text-white fade-in-on-scroll opacity-0 translate-y-10 transition-all duration-700 ease-out">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-[#5CE1E6] bg-clip-text text-transparent">
            Relato de quem já conhece
          </h2>
          <p className="text-lg md:text-xl opacity-90 max-w-3xl mx-auto leading-relaxed">
            Esses são alguns dos feedbacks de quem confiou no trabalho da W1 e não
            se arrependeu.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map(({ text, name, role, img }, i) => (
            <div
              key={i}
              className="bg-white text-gray-900 rounded-3xl p-8 shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-6">
                <img
                  src={img}
                  alt={name}
                  className="w-16 h-16 rounded-full object-cover border-4 border-[#5CE1E6]"
                />
                <div>
                  <p className="font-bold text-lg text-[#022028]">{name}</p>
                  <p className="text-sm opacity-70">{role}</p>
                </div>
              </div>
              <p className="italic text-lg leading-relaxed">"{text}"</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="bg-[#022028] text-white py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-[#5CE1E6] bg-clip-text text-transparent">
            Venha fazer parte
          </h2>
          <p className="text-lg md:text-xl mb-10 opacity-90 leading-relaxed max-w-2xl mx-auto">
            Acesse a nossa plataforma e comece o processo para a criação da sua
            holding.
          </p>
          <a
            href="/login"
            className="bg-gradient-to-r from-[#5CE1E6] to-[#4ecdc4] text-[#022028] px-12 py-5 rounded-3xl font-bold text-xl hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            Acesse Agora
          </a>
        </div>
      </footer>

      <style jsx>{`
        .fade-in-on-scroll {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .fade-in-on-scroll.visible {
          opacity: 1;
          transform: translateY(0);
        }

        @media (max-width: 768px) {
          h1 {
            font-size: 2.5rem !important;
          }
          h2 {
            font-size: 2rem !important;
          }
        }

        @media (max-width: 480px) {
          h1 {
            font-size: 2rem !important;
          }
          h2 {
            font-size: 1.75rem !important;
          }
        }
      `}</style>
    </div>
  )
}
