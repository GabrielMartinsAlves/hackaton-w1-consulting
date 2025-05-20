import HeaderMobile from '@/components/HeaderMobile';

export default function DocumentosPage() {
  return (
    <div className="min-h-screen bg-white">
      <HeaderMobile />
      <main className="p-4 mt-4">
        <h1 className="text-xl font-bold text-gray-800">Documentos</h1>
        <p className="text-gray-600">Conteúdo da página de documentos.</p>
      </main>
    </div>
  );
}
