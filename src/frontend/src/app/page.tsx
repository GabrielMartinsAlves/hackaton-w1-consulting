'use client';
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from 'next/link';
import Image from 'next/image';
import {
  faCircleInfo,
  faLock,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";

export default function HoldingLanding() {
  const [email, setEmail] = useState("");
  const [valorImovel, setValorImovel] = useState("");
  const [obs, setObs] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

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
  ];

  return (
    <div className="max-w-md mx-auto font-sans text-gray-100">
      <header className="bg-[#022028] px-4 py-3 flex items-center gap-2 font-bold text-white text-xl">
        <Link href="/">
          <Image src="/assets/w1_white.png" alt="Logo" width={34} height={17} />
        </Link>
        <div>Consultoria</div>
      </header>

      <section className="bg-[#355054] px-6 py-8">
        <h2 className="font-bold text-lg mb-2">Construa sua holding</h2>
        <p className="mb-4 text-sm leading-relaxed">
          A W1 Consultoria oferece a solução completa para estruturar sua holding
          de forma segura, eficiente e transparente.
        </p>
        <button className="bg-black text-white px-4 py-2 rounded text-sm mb-8 hover:bg-gray-800 transition">
          Acesse
        </button>

        <div className="bg-white text-gray-900 rounded p-4">
          <h3 className="font-semibold mb-3">Benefícios da W1</h3>
          <p className="mb-3 text-sm">
            Conheça alguns dos benefícios que a W1 te garante na criação da sua
            holding.
          </p>
          <ul className="space-y-4 text-sm">
            <li className="flex gap-3 items-start">
              <span className="mt-1 text-[#0c253e]">
                <FontAwesomeIcon icon={faCircleInfo} size="lg" />
              </span>
              <div>
                <b>Processo Simplificado</b>
                <p>
                  Nossa plataforma guia você em cada etapa no processo de
                  construção da sua holding.
                </p>
              </div>
            </li>
            <li className="flex gap-3 items-start">
              <span className="mt-1 text-[#0c253e]">
                <FontAwesomeIcon icon={faLock} size="lg" />
              </span>
              <div>
                <b>Segurança Jurídica</b>
                <p>
                  Documentação completa e alinhada com a legislação vigente,
                  acompanhada por especialistas.
                </p>
              </div>
            </li>
            <li className="flex gap-3 items-start">
              <span className="mt-1 text-[#0c253e]">
                <FontAwesomeIcon icon={faInfoCircle} size="lg" />
              </span>
              <div>
                <b>Acompanhamento</b>
                <p>
                  Consulte o status do seu processo a qualquer momento, onde e
                  quando quiser.
                </p>
              </div>
            </li>
          </ul>
        </div>

        <div className="mt-8 bg-white rounded p-4 text-gray-900">
          <h3 className="font-semibold mb-3">Simule agora</h3>
          <p className="text-sm mb-4">
            Faça uma simulação dos ganhos que você teria com o seu imóvel em uma
            holding.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!termsAccepted) {
                alert("Aceite os termos para continuar.");
                return;
              }
              alert(
                `Simulação enviada com: ${email}, Valor do imóvel: ${valorImovel}, Observação: ${obs}`
              );
            }}
          >
            <label className="block mb-2 text-xs font-medium" htmlFor="email">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              placeholder="Seu E-mail"
              className="w-full mb-4 p-2 border border-gray-300 rounded text-gray-900"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label className="block mb-2 text-xs font-medium" htmlFor="valor">
              Valor do Imóvel
            </label>
            <input
              id="valor"
              type="number"
              placeholder="Insira o valor do imóvel"
              className="w-full mb-4 p-2 border border-gray-300 rounded text-gray-900"
              value={valorImovel}
              onChange={(e) => setValorImovel(e.target.value)}
              required
            />

            <label className="block mb-2 text-xs font-medium" htmlFor="obs">
              Observação
            </label>
            <textarea
              id="obs"
              placeholder="Insira alguma observação sobre"
              className="w-full mb-4 p-2 border border-gray-300 rounded text-gray-900 resize-none"
              rows={3}
              value={obs}
              onChange={(e) => setObs(e.target.value)}
            />

            <div className="flex items-center mb-4">
              <input
                id="terms"
                type="checkbox"
                checked={termsAccepted}
                onChange={() => setTermsAccepted(!termsAccepted)}
                className="mr-2"
                required
              />
              <label htmlFor="terms" className="text-xs">
                Eu aceito os termos{" "}
                <a href="#" className="underline text-[#0c253e]">
                  Termos de compromisso
                </a>
              </label>
            </div>

            <button
              type="submit"
              className="bg-black text-white py-2 px-4 rounded w-full hover:bg-gray-800 transition"
            >
              Simular Agora
            </button>
          </form>
        </div>
      </section>

      <section className="bg-[#355054] px-6 py-6 text-white">
        <h3 className="font-semibold text-lg mb-3">
          Relato de quem já conhece
        </h3>
        <p className="mb-6 text-sm max-w-sm">
          Esses são alguns dos feedbacks de quem confiou no trabalho da W1 e não
          se arrependeu.
        </p>
        <div className="space-y-4">
          {testimonials.map(({ text, name, role, img }, i) => (
            <div
              key={i}
              className="bg-white text-gray-900 rounded p-4 flex gap-3 items-start"
            >
              <img
                src={img}
                alt={name}
                className="w-10 h-10 rounded-full object-cover flex-shrink-0"
              />
              <div>
                <p className="italic mb-2">“{text}”</p>
                <p className="font-semibold">{name}</p>
                <p className="text-xs">{role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="bg-[#355054] text-white p-6 text-center">
        <h3 className="font-semibold mb-2">Venha fazer parte</h3>
        <p className="mb-4">
          Acesse a nossa plataforma e comece o processo para a criação da sua
          holding.
        </p>
        <button className="bg-black px-6 py-2 rounded hover:bg-gray-800 transition">
          Acesse
        </button>
      </footer>
    </div>
  );
}