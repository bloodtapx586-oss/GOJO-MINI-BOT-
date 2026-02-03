const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys')
const pino = require('pino')

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info')
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true,
        logger: pino({ level: 'silent' })
    })

    sock.ev.on('creds.update', saveCreds)

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update
        if (connection === 'close') {
            console.log('සම්බන්ධතාවය බිඳ වැටුණා, නැවත උත්සාහ කරනවා...')
            startBot()
        } else if (connection === 'open') {
            console.log('ඔබේ WhatsApp Bot දැන් සක්‍රියයි! ✅')
        }
    })

    sock.ev.on('messages.upsert', async m => {
        const msg = m.messages[0]
        if (!msg.message || msg.key.fromMe) return
        const text = msg.message.conversation || msg.message.extendedTextMessage?.text

        if (text === '.hi') {
            await sock.sendMessage(msg.key.remoteJid, { text: 'Hello! I am GOJO MINI BOT. How can I help you?' })
        }
    })
}

startBot()

