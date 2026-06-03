import fs from 'fs'

const handler = async (m, { conn, command, text, usedPrefix }) => {
    let datos
    try {
        datos = JSON.parse(fs.readFileSync('./scty/dlist.json', 'utf-8'))
    } catch (e) {
        return conn.reply(m.chat, '❌ Error: No se encontró el archivo en Scty/dlist.json', m)
    }

    // Lógica para detectar el número tanto en .lines1 como en .lines 1
    // Extrae el número del comando o del texto
    const rawCommand = command.replace('lines', '') // Si escribes .lines1, esto extrae '1'
    const page = parseInt(rawCommand || text) || 1
    
    const itemsPerPage = 10
    const totalPages = Math.ceil(datos.length / itemsPerPage)

    if (page < 1 || page > totalPages) {
        return conn.reply(m.chat, `⚠️ Solo existen páginas del 1 al ${totalPages}.`, m)
    }

    const start = (page - 1) * itemsPerPage
    const end = Math.min(start + itemsPerPage, datos.length)

    let txt = `📋 *LISTA DE DISEÑOS (Pág ${page}/${totalPages})*\n\n`
    
    for (let i = start; i < end; i++) {
        let item = datos[i]
        txt += `*ID ${item.id}:*\n`
        txt += item.lines.join('\n') + '\n\n'
    }

    conn.reply(m.chat, txt, m)
}

// Permitimos que el bot responda a .lines y también a .lines1, .lines2... hasta .lines10
handler.command = ['lines', ...Array.from({ length: 10 }, (_, i) => `lines${i + 1}`)]
handler.group = true
handler.admin = true

export default handler
