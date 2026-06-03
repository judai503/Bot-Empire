import { sticker } from '../lib/sticker.js'

const handler = async (m, { conn }) => {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || q.mediaType || ''

    if (!/image|video|webp/.test(mime)) {
        return m.reply('📸 Responde a una imagen, GIF o video con *.s*')
    }

    if (/video/.test(mime) && (q.msg || q).seconds > 15) {
        return m.reply('❌ El video no puede durar más de 15 segundos.')
    }

    await m.react('🕒')

    try {
        let media = await q.download()

        if (!media) {
            await m.react('❌')
            return m.reply('❌ No se pudo descargar el archivo.')
        }

        let stiker = await sticker(
            media,
            false,
            global.packsticker || `Sticker de ${m.pushName || 'Usuario'}`,
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

handler.help = ['s']
handler.tags = ['sticker']
handler.command = /^(s|sticker|stiker)$/i

export default handler
