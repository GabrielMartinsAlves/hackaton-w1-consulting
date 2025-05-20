'use client';
import React from 'react';
import Image from 'next/image';

const LoginPage = () => {
  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage: "url('/assets/background.png')",
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
      }}
    >
      <div className="bg-white rounded-2xl shadow-xl p-6 w-[90%] max-w-sm flex flex-col items-center">
        <Image src="/assets/w1.png" alt="W1 Logo" width={96} height={96} className="w-24 mb-4" />

        <p className="text-center text-sm text-gray-800 mb-6">
          Sua parceira na construção de <br /> holdings
        </p>

        <form className="w-full flex flex-col gap-4">
          <div>
            <label className="text-sm text-gray-700 mb-1 block">Email</label>
            <input
              type="email"
              placeholder="Insira seu e-mail"
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#002529]"
            />
          </div>

          <div>
            <label className="text-sm text-gray-700 mb-1 block">Senha</label>
            <input
              type="password"
              placeholder="Insira sua senha"
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#002529]"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#002529] text-white rounded-md py-2 text-sm font-semibold hover:opacity-90 transition"
          >
            Entrar
          </button>
        </form>

        <a href="#" className="mt-4 text-sm text-[#002529] underline hover:text-[#001f1f]">
          Esqueceu a senha?
        </a>
      </div>
    </div>
  );
};

export default LoginPage;
