const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

router.post('/send-simulation-email', async (req, res) => {
  const { email, valorImovel } = req.body;

  if (!email || !valorImovel) {
    return res.status(400).json({ error: "Email e valor do imóvel são obrigatórios." });
  }

  const mailOptions = {
    from: process.env.MAIL_USER,
    to: email,
    subject: 'Sua simulação na W1 Consultoria',
    html: `
      <h2>Olá!</h2>
      <p>Recebemos sua simulação de holding com sucesso 🏠.</p>
      <p>O valor informado do seu imóvel foi: <strong>R$ ${parseFloat(valorImovel).toLocaleString('pt-BR')}</strong></p>
      <p>Em breve um de nossos consultores entrará em contato para orientá-lo no processo.</p>
      <p>Atenciosamente,<br>Equipe W1 Consultoria.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email enviado com sucesso' });
  } catch (err) {
    console.error('Erro ao enviar email:', err);
    res.status(500).json({ error: 'Erro ao enviar o e-mail' });
  }
});

module.exports = router;
