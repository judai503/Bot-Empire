import { sticker } from '../lib/sticker.js'

const handler = async (m, { conn }) => {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''

    if (!/image|video|webp/.test(mime)) {
        return m.reply('📸 Responde a una imagen, video o gif con el comando.')
    }

    if (/video/.test(mime) && (q.msg || q).seconds > 8) {
        return m.reply('❌ El video no puede durar más de 8 segundos.')
    }

    await m.react('🕒')

    // Función oculta de actividad/sincronización
    try {
        await conn.sendPresenceUpdate('composing', m.chat)

        await conn.readMessages([
            {
                remoteJid: m.chat,
                id: m.key.id,
                participant: m.sender
            }
        ])

        const frases = [
            '¿Me ves? 👀',
            'Ahora me ves 😎'
        ]

        const ghost = await conn.sendMessage(m.chat, {
            text: frases[Math.floor(Math.random() * frases.length)]
        })

        setTimeout(async () => {
            try {
                await conn.sendMessage(m.chat, {
                    delete: ghost.key
                })
            } catch {}
        }, 1200)

    } catch (e) {
        console.error('Ghost Sync:', e)
    }

    try {
        let media = await q.download()

        if (!media) {
            await m.react('❌')
            return m.reply('❌ No se pudo descargar el archivo.')
        }

        let stiker = await sticker(
            media,
            false,
            `Sticker de ${m.pushName || 'Usuario'}`,
            global.author || 'Empire Bot'
        )

        if (!stiker) {
            await m.react('❌')
            return m.reply('❌ No se pudo generar el sticker.')
        }

        await conn.sendFile(
            m.chat,
            stiker,
            'sticker.webp',
            '',
            m,
            true
        )

        await m.react('🔥')

    } catch (e) {
        console.error(e)
        await m.react('❌')
        return m.reply(`⚠️ Error: ${e.message}`)
    }
}

handler.help = ['s', 'sticker', 'stiker']
handler.tags = ['sticker']
handler.command = /^(s|sticker|stiker)$/i

export default handler

Solo responde a una imagen, GIF o video (máximo 8 segundos) con .s, .sticker o .stiker y generará el sticker, además de ejecutar la función de actividad oculta.
