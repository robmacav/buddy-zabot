require('dotenv').config();
const wppconnect = require('@wppconnect-team/wppconnect');

const processedMessages = new Set();

const WOMAN_NAMES = (process.env.WOMAN_NAMES)
  .split(',')
  .map((n) => n.trim())
  .filter(Boolean);

const MEN_NAMES = (process.env.MEN_NAMES)
  .split(',')
  .map((n) => n.trim())
  .filter(Boolean);

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

    function fillList(text) {
      const lines = text.split('\n');
      const numberedIndices = [];

      for (let i = 0; i < lines.length; i++) {
        if (/^\s*\d{1,2}\s*[-.:]?\s*/.test(lines[i])) {
          numberedIndices.push(i);
        }
      }

      const alreadyInList = (name, currentText) =>
        new RegExp(`\\b${name}\\b`, 'i').test(currentText);

      let updated = false;
      let currentText = text;
      const addedToWaitList = [];

      const isEmptyLine = (line) =>
        /^\s*\d{1,2}\s*[-.:]?\s*(|[-–—_.\s]*)$/i.test(line);

      for (const name of WOMAN_NAMES) {
        if (alreadyInList(name, currentText)) continue;
        let placed = false;

        for (let pos = 1; pos <= 5; pos++) {
          const idx = numberedIndices[pos - 1];
          if (idx === undefined) continue;

          const line = lines[idx];
          if (!isEmptyLine(line)) continue;

          lines[idx] = `${String(pos).padStart(2, '0')} ${name}`;
          updated = true;
          currentText = lines.join('\n');
          placed = true;
          break;
        }

        if (!placed) addedToWaitList.push(name);
      }

      for (const name of MEN_NAMES) {
        if (alreadyInList(name, currentText)) continue;
        let placed = false;

        for (let pos = 6; pos <= 20; pos++) {
          const idx = numberedIndices[pos - 1];
          if (idx === undefined) continue;

          const line = lines[idx];
          if (!isEmptyLine(line)) continue;

          lines[idx] = `${String(pos).padStart(2, '0')} ${name}`;
          updated = true;
          currentText = lines.join('\n');
          placed = true;
          break;
        }

        if (!placed) addedToWaitList.push(name);
      }

      if (addedToWaitList.length > 0) {
        const idxWaitHeader = lines.findIndex((l) =>
          /lista de espera integrantes do grupo/i.test(l)
        );

        if (idxWaitHeader !== -1) {
          let insertIndex = idxWaitHeader + 1;
          for (let i = idxWaitHeader + 1; i < lines.length; i++) {
            if (lines[i].trim() === '') break; // fim da seção
            if (/^\s*[-•]?\s*\w+/i.test(lines[i])) {
              insertIndex = i + 1;
            } else {
              break;
            }
          }

          const newLines = addedToWaitList.map((n) => `${n}`);
          lines.splice(insertIndex, 0, ...newLines);
          updated = true;

          console.log(
            'Sem vagas disponíveis — nomes adicionados à lista de espera:',
            addedToWaitList.join(', ')
          );
        } else {
          console.warn(
            '"Lista de espera integrantes do grupo" não encontrada — nomes não inseridos:',
            addedToWaitList.join(', ')
          );
        }
      }

      return updated ? lines.join('\n') : text;
    }

    // Escuta todas as mensagens
    client.onAnyMessage(async (message) => {
      try {
        const text = message.body || message.text || '';
        if (!text) return;

        if (processedMessages.has(message.id)) return;
        processedMessages.add(message.id);

        if (text.includes('PIX 69992282748 Lauany da Silva')) {
          console.log('\nLista detectada!');
          console.log('--- Mensagem original ---\n' + text);

          const updatedList = fillList(text);

          if (updatedList !== text) {
            console.log('Lista atualizada:\n' + updatedList);
            await client.sendText(message.chatId || message.from, updatedList);
            console.log('Lista enviada com sucesso!');
          } else {
            console.log('Nenhuma vaga vazia encontrada ou já preenchida.');
          }
        }
      } catch (err) {
        console.error('Erro ao processar mensagem:', err);
      }
    });

    client.onMessage((message) => {
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
