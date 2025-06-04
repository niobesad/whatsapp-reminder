// whatsappServices.js

import baileys from 'baileys';
import qrcode from 'qrcode-terminal';
import path from 'path';
import { fileURLToPath } from 'url';
import { handleIncomingMessage } from './listenerServices.js';
const { makeWASocket, useMultiFileAuthState, DisconnectReason } = baileys;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const authFolder = path.join(__dirname, './auth_info');

let sock;
let readyResolve;

export const waitForWhatsAppReady = new Promise((resolve) => {
    readyResolve = resolve;
});


export async function startWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState(authFolder);

    sock = makeWASocket({
        auth: state,
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', ({ connection, lastDisconnect, qr }) => {
        if (qr) {
            qrcode.generate(qr, { small: true });
        }

        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut;
            if (shouldReconnect) {
                startWhatsApp();
            } else {
                console.log('❌ WhatsApp logged out.');
            }
        } else if (connection === 'open') {
            console.log('✅ WhatsApp connection ready');
            readyResolve();
        }
    });

    // Add this to listen for incoming messages and pass to your handler
    sock.ev.on('messages.upsert', async ({ messages, type }) => {
        if (type !== 'notify') return;

        for (const message of messages) {
            if (!message.message || message.key.fromMe) continue;

            // Call your message handler
            await handleIncomingMessage(message, sock);
        }
    });
}

export async function sendWhatsAppMessage(phoneNumber, message) {
    if (!sock) {
        console.error('WhatsApp socket not initialized');
        return;
    }

    const jid = `${phoneNumber}@s.whatsapp.net`;
    await sock.sendMessage(jid, { text: message });
    // console.log('Sent for number :', phoneNumber);
}
