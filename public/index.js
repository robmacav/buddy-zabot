require('dotenv').config();
const wppconnect = require('@wppconnect-team/wppconnect');

(async () => {
  try {
    const client = await wppconnect.create({
      session: process.env.SESSION_NAME || 'session1',
      puppeteerOptions: { headless: process.env.HEADLESS !== 'false' },
      catchQR: (base64Qr, asciiQR) => {
        console.log('QR gerado (ASCII):');
        console.log(asciiQR);
      },
      statusFind: (statusSession) => {
        console.log('Status da sessão:', statusSession);
      }
    });
    // Escuta todas as mensagens
    client.onAnyMessage(async (message) => {
      try {
        const text = message.body || message.text || '';

      } catch (err) {
        console.error('Erro ao processar mensagem:', err);
      }
    });

    client.onMessage((message) => {
      console.log('----------------- Nova Mensagem -----------------');
      console.log('----------------- Nova Mensagem -----------------');
      console.log('----------------- Nova Mensagem -----------------');
      console.log('----------------- Nova Mensagem -----------------');
      console.log('De:', message.from);
      console.log('Grupo:', message.chat?.name || '(privado)');
      console.log('Mensagem:', message.body || message.text);
      console.log('-------------------------------------------------');
    });
  } catch (err) {
    console.error('Erro ao inicializar WPP Connect:', err);
  }
})();
