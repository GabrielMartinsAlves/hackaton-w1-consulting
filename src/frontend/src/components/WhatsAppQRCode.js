'use client';
import { useEffect, useState } from 'react';

export default function WhatsAppQRCode() {
  const [qr, setQr] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchQrCode = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/whatsapp-qr`);
      if (res.status === 200) {
        const data = await res.json();
        setQr(data.qr);
      } else {
        setQr(null);
      }
    } catch (err) {
      console.error('Erro ao buscar QR Code:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQrCode();
    const interval = setInterval(fetchQrCode, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: 40, textAlign: 'center' }}>
      {loading ? (
        <p>Carregando QR Code...</p>
      ) : qr ? (
        <img
          src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qr)}`}
          alt="QR Code do WhatsApp"
          style={{ marginTop: 20 }}
        />
      ) : (
        <p>Nenhum QR Code disponível no momento.</p>
      )}
    </div>
  );
}
