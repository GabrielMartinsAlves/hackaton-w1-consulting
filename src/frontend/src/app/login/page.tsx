import React from 'react';
import Image from 'next/image';

const LoginPage = () => {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <div
        className="lg:hidden bg-cover bg-center flex-1 flex items-center justify-center"
        style={{
          backgroundImage: "url('/assets/background.png')",
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
        }}
      >
        <div className="bg-white rounded-2xl shadow-xl p-6 w-[90%] max-w-sm flex flex-col items-center">
          <Image src="/assets/w1.png" alt="W1 Logo" width={160} height={160} className="w-40 mb-4" />
          <p className="text-center text-sm text-gray-800 mb-6">
            Sua parceira na construção de <br /> holdings
          </p>
          <LoginForm />
        </div>
      </div>

      <div className="hidden lg:flex w-full min-h-screen">
        <div className="w-1/2">
          <Image
            src="/assets/background.png"
            alt="W1 Background"
            width={800}
            height={800}
            className="object-cover w-full h-full"
          />
        </div>
        <div className="w-1/2 flex flex-col items-center justify-center bg-white">
          <Image src="/assets/w1.png" alt="W1 Logo" width={160} height={160} className="w-40 mb-4" />
          <p className="text-center text-sm text-gray-800 mb-6 lg:whitespace-nowrap">
            Sua parceira na construção de holdings
          </p>
          <div className="w-[70%] max-w-[600px] lg:border lg:border-gray-200 lg:rounded-xl lg:p-6">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
};

const LoginForm = () => (
  <form className="w-full flex flex-col gap-6">
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
    <a
      href="#"
      className="mt-2 text-sm text-[#002529] underline hover:text-[#001f1f] self-start"
    >
      Esqueceu a senha?
    </a>
  </form>
);

export default LoginPage;
