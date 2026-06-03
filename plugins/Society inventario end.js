import fs from 'fs'

const handler = async (m, { conn, command }) => {
    // Carga tus separadores
    let separadores
    try {
        separadores = JSON.parse(fs.readFileSync('./scty/separadores.json', 'utf-8'))
    } catch (e) {
        return conn.reply(m.chat, '❌ No encontré el archivo en Scty/separadores.json', m)
    }

    // Identifica qué página pidió el usuario (ej: endlist2 -> 2)
    const page = parseInt(command.replace('endlist', '')) || 1
    const itemsPerPage = 60
    const keys = Object.keys(separadores)
    const totalPages = Math.ceil(keys.length / itemsPerPage)

    if (page < 1 || page > totalPages) return conn.reply(m.chat, `⚠️ Solo tengo ${totalPages} páginas.`, m)

    // Calcula el rango de 60
    const start = (page - 1) * itemsPerPage
    const end = Math.min(start + itemsPerPage, keys.length)

    // Arma el mensaje
    let txt = `✨ *SEPARADORES (Pág ${page}/${totalPages})*\n\n`
    for (let i = start; i < end; i++) {
        let key = keys[i]
        txt += `*${key}* ➔ ${separadores[key]}\n`
    }

    // Envía
    conn.reply(m.chat, txt, m)
}

// Define los comandos automáticamente del 1 al 6
handler.command = Array.from({ length: 6 }, (_, i) => `endlist${i + 1}`)
handler.group = true
handler.admin = true

export default handler
