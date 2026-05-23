let handler = async (m, { conn, usedPrefix }) => {
    let info = `
⚡ *EMPIRE-BOT MD* ⚡

*Creador:* Tío Judai
*Canal:* ${global.channel2}
*Prefijo:* ${usedPrefix}
*Libreria:* ${global.libreria}

¡Hola! Soy un bot desarrollado por el Tío Judai. 
Si tienes dudas o quieres reportar un error, contacta al propietario.
`.trim()

    conn.sendMessage(m.chat, { 
        text: info, 
        contextInfo: { 
            externalAdReply: { 
                title: "⚡ Empire-Bot ⚡", 
                body: "Creado por Tío Judai", 
                thumbnail: global.catalogo, 
                sourceUrl: global.md 
            } 
        } 
    }, { quoted: m })
}

handler.command = ['bot', 'info', 'infobot']
handler.help = ['bot']
handler.tags = ['info']

export default handler
