'use client'

import { useState } from 'react'

interface ResultadosSimulacao {
  valorImovel: number
  rendaMensal: number
  tempoPosse: number
  impostoItbi: number
  impostoRenda: number
  inventario: number
  economiaTotal: number
  percentualEconomia: number
  totalSemHolding: number
  totalComHolding: number
}

export default function SimulacaoPage() {
  const [valorImovel, setValorImovel] = useState('')
  const [rendaMensal, setRendaMensal] = useState('')
  const [tempoPosse, setTempoPosse] = useState('5')
  const [resultados, setResultados] = useState<ResultadosSimulacao | null>(null)

  function formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  function calcularSimulacao() {
    const valor = Number(valorImovel.replace(/\D/g, '')) / 100
    const renda = Number(rendaMensal.replace(/\D/g, '')) / 100
    const anos = Number(tempoPosse)

    if (!valor || valor < 1) {
      alert('Informe um valor válido para o imóvel')
      return
    }

    const itbiPercentual = 0.03
    const itbiHolding = 0

    const irpfAluguel = 0.275
    const irpjHolding = 0.15

    const inventarioPercentual = 0.06
    const inventarioHolding = 0

    const impostoItbiSemHolding = valor * itbiPercentual
    const impostoItbiComHolding = itbiHolding

    const impostoRendaSemHolding = renda * 12 * anos * irpfAluguel
    const impostoRendaComHolding = renda * 12 * anos * irpjHolding

    const inventarioSemHolding = valor * inventarioPercentual
    const inventarioComHolding = inventarioHolding

    const totalSemHolding = impostoItbiSemHolding + impostoRendaSemHolding + inventarioSemHolding
    const totalComHolding = impostoItbiComHolding + impostoRendaComHolding + inventarioComHolding
    const economiaTotal = totalSemHolding - totalComHolding
    const percentualEconomia = (economiaTotal / totalSemHolding) * 100

    setResultados({
      valorImovel: valor,
      rendaMensal: renda,
      tempoPosse: anos,
      impostoItbi: impostoItbiSemHolding,
      impostoRenda: impostoRendaSemHolding - impostoRendaComHolding,
      inventario: inventarioSemHolding,
      economiaTotal,
      percentualEconomia,
      totalSemHolding,
      totalComHolding,
    })
  }

  function handleValorChange(e: React.ChangeEvent<HTMLInputElement>) {
    let value = e.target.value.replace(/\D/g, '')
    if (value) {
      value = (Number(value) / 100).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      })
    }
    setValorImovel(value)
  }

  function handleRendaChange(e: React.ChangeEvent<HTMLInputElement>) {
    let value = e.target.value.replace(/\D/g, '')
    if (value) {
      value = (Number(value) / 100).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      })
    }
    setRendaMensal(value)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#022028] to-[#355054] bg-fixed">
      <header className="top-0 left-0 right-0 z-50 bg-transparent backdrop-blur-sm bg-opacity-40 px-6 py-3 flex items-center gap-3 font-bold text-white text-xl transition-colors duration-500">
        <img src="/assets/w1_white.png" alt="Logo W1" className="w-8 h-4 flex-shrink-0" />
        <div className="whitespace-nowrap text-lg leading-none select-none">
          Consultoria
        </div>
      </header>

      <main className="p-6 max-w-3xl mx-auto pt-20">
        <div className="text-center mb-8 mt-12 text-white px-4">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-[#5CE1E6] bg-clip-text text-transparent">
            Simule sua Economia Fiscal
          </h1>
          <p className="text-lg opacity-90 max-w-xl mx-auto leading-relaxed">
            Descubra quanto você pode economizar em impostos e custos ao estruturar seus imóveis em uma holding.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-10 mb-10 max-w-2xl mx-auto">
          <h2 className="text-3xl font-semibold text-[#022028] mb-8 text-center">Insira seus dados</h2>

          <div className="space-y-8">
            <div>
              <label htmlFor="valorImovel" className="block text-sm font-medium mb-3 text-gray-700">
                Valor total dos imóveis
              </label>
              <input
                id="valorImovel"
                type="text"
                placeholder="R$ 0,00"
                className="w-full p-5 border-2 border-gray-300 rounded-2xl text-gray-900 text-xl focus:border-[#5CE1E6] focus:outline-none transition-colors"
                value={valorImovel}
                onChange={handleValorChange}
                inputMode="numeric"
              />
            </div>

            <div>
              <label htmlFor="rendaMensal" className="block text-sm font-medium mb-3 text-gray-700">
                Renda mensal dos imóveis (aluguel)
              </label>
              <input
                id="rendaMensal"
                type="text"
                placeholder="R$ 0,00"
                className="w-full p-5 border-2 border-gray-300 rounded-2xl text-gray-900 text-xl focus:border-[#5CE1E6] focus:outline-none transition-colors"
                value={rendaMensal}
                onChange={handleRendaChange}
                inputMode="numeric"
              />
            </div>

            <div>
              <label htmlFor="tempoPosse" className="block text-sm font-medium mb-3 text-gray-700">
                Tempo de posse estimado (anos)
              </label>
              <select
                id="tempoPosse"
                className="w-full p-5 border-2 border-gray-300 rounded-2xl text-gray-900 text-xl focus:border-[#5CE1E6] focus:outline-none transition-colors"
                value={tempoPosse}
                onChange={(e) => setTempoPosse(e.target.value)}
              >
                {[5, 10, 15, 20, 25].map((ano) => (
                  <option key={ano} value={ano}>
                    {ano} anos
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={calcularSimulacao}
            className="mt-10 w-full bg-gradient-to-r from-[#022028] to-[#355054] text-white py-5 rounded-3xl font-bold text-xl hover:shadow-xl transform hover:scale-[1.03] transition-all duration-300"
          >
            Calcular Economia
          </button>
        </div>

        {resultados && (
          <section className="bg-white rounded-3xl shadow-2xl p-10 max-w-2xl mx-auto mb-16 animate-fadeIn">
            <h2 className="text-3xl font-bold text-[#022028] mb-8 text-center">Resultado da Simulação</h2>

            <div className="bg-gradient-to-r from-[#5CE1E6] to-[#4ecdc4] rounded-3xl p-8 mb-10 text-center text-[#022028] font-extrabold text-2xl">
              Economia Total Estimada: {formatCurrency(resultados.economiaTotal)}
              <div className="text-xl font-semibold mt-2 text-green-600">
                {resultados.percentualEconomia.toFixed(1)}% de economia
              </div>
            </div>

            <div className="grid gap-8 md:grid-cols-2 mb-10">
              <div className="bg-red-50 rounded-2xl p-6 border-l-8 border-red-400">
                <h3 className="text-2xl font-bold text-red-700 mb-3">Sem Holding</h3>
                <p className="text-red-700 text-xl font-semibold">
                  {formatCurrency(resultados.totalSemHolding)}
                </p>
                <p className="text-red-600 mt-2 text-sm">Total em impostos e custos</p>
              </div>

              <div className="bg-green-50 rounded-2xl p-6 border-l-8 border-green-400">
                <h3 className="text-2xl font-bold text-green-700 mb-3">Com Holding</h3>
                <p className="text-green-700 text-xl font-semibold">
                  {formatCurrency(resultados.totalComHolding)}
                </p>
                <p className="text-green-600 mt-2 text-sm">Total em impostos e custos</p>
              </div>
            </div>

            <div className="space-y-6 border-t border-gray-300 pt-6 p-6 bg-gradient-to-r from-[#5CE1E6] to-[#4ecdc4] rounded-2xl">
              <h3 className="text-2xl font-semibold text-gray-800">Detalhamento da Economia</h3>
              <div className="flex justify-between border-b border-black pb-3 text-black">
                <span>Economia em ITBI (venda futura)</span>
                <span className="font-semibold text-green-700">{formatCurrency(resultados.impostoItbi)}</span>
              </div>
              <div className="flex justify-between border-b border-black pb-3 text-black">
                <span>Economia em IR sobre aluguéis</span>
                <span className="font-semibold text-green-700">{formatCurrency(resultados.impostoRenda)}</span>
              </div>
              <div className="flex justify-between border-b border-black pb-3 text-black">
                <span>Economia em inventário</span>
                <span className="font-semibold text-green-700">{formatCurrency(resultados.inventario)}</span>
              </div>
            </div>

            <div className="mt-12 bg-[#022028] rounded-3xl p-8 text-white text-center">
              <h3 className="text-3xl font-bold mb-4">Pronto para estruturar sua holding?</h3>
              <p className="mb-6 opacity-90 max-w-lg mx-auto">
                A W1 Consultoria te acompanha em todo o processo para garantir a melhor estrutura para seu patrimônio.
              </p>
              <a href="https://www.w1.com.br/atendimento" className="bg-[#5CE1E6] text-[#022028] font-extrabold px-10 py-4 rounded-3xl hover:bg-white transition-colors text-xl inline-block">
                Falar com Especialista
              </a>
            </div>
          </section>
        )}

        <div className="max-w-2xl mx-auto px-6 text-white text-sm opacity-80 mb-12">
          * Esta simulação é uma estimativa com base em cenários típicos. Valores reais podem variar conforme a legislação, região e situação específica de cada caso. Consulte um especialista para análise detalhada.
        </div>
      </main>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.7s ease forwards;
        }

        header {
          /* para evitar texto ficar em cima da imagem */
          padding-left: 1rem;
          padding-right: 1rem;
        }

        @media (max-width: 768px) {
          main {
            padding: 2rem 1rem;
          }
          h1 {
            font-size: 2rem !important;
          }
          h2 {
            font-size: 1.5rem !important;
          }
          button {
            font-size: 1rem !important;
            padding: 1rem !important;
          }
        }

        @media (min-width: 769px) {
          main {
            max-width: 720px;
            margin-left: auto;
            margin-right: auto;
          }
        }
      `}</style>
    </div>
  )
}
