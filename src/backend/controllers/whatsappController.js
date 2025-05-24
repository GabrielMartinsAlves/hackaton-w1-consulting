const { Boom } = require('@hapi/boom');
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('baileys');
const qrcode = require('qrcode-terminal');

let sock;
let latestQr = null;

// Função para conectar ao WhatsApp
const connectToWhatsApp = async () => {
  const { state, saveCreds } = await useMultiFileAuthState('baileys_auth_info');
  
  sock = makeWASocket({
    auth: state,
  });

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      latestQr = qr; // Salva o QR para uso em rota
      console.log('Novo QR Code gerado:');
      qrcode.generate(qr, { small: true });
    }

    if (connection === 'close') {
      const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log('Conexão fechada. Reconectar?', shouldReconnect);
      if (shouldReconnect) {
        connectToWhatsApp();
      } else {
        console.log('Sessão encerrada. Exclua a pasta "baileys_auth_info" para gerar um novo QR Code.');
      }
    } else if (connection === 'open') {
      console.log('Conexão estabelecida com sucesso!');
    }
  });

  sock.ev.on('creds.update', saveCreds);
};

// Função para enviar mensagem
const sendWhatsAppMessage = async (req, res) => {
  const { to, message } = req.body;

  if (!sock) {
    console.log('Socket não inicializado. Iniciando conexão...');
    await connectToWhatsApp();
  }

  try {
    const sentMessage = await sock.sendMessage(to + '@s.whatsapp.net', { text: message });
    res.status(200).json({ success: true, message: sentMessage.key.id });
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Função para retornar o QR Code atual
const getQrCode = (req, res) => {
  if (latestQr) {
    res.status(200).json({ qr: latestQr });
  } else {
    res.status(204).json({ message: 'QR Code ainda não disponível' });
  }
};

// Iniciar a conexão ao carregar o módulo
connectToWhatsApp().catch((err) => {
  console.error('Erro ao iniciar a conexão com o WhatsApp:', err);
});

module.exports = {
  sendWhatsAppMessage,
  getQrCode
};
