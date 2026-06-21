const handler = async (m, { conn }) => {
  if (!m.quoted) {
    return m.reply('⚠️ Responde al mensaje que deseas eliminar.')
  }

  try {
    // Borra el mensaje respondido
    await conn.sendMessage(m.chat, {
      delete: {
        remoteJid: m.chat,
        fromMe: m.quoted.fromMe,
        id: m.quoted.id,
        participant: m.quoted.sender
      }
    })

    // Borra el comando .del
    await conn.sendMessage(m.chat, {
      delete: m.key
    })

  } catch (e) {
    console.error(e)
    await m.react('❌')
  }
}

handler.command = ['delete', 'del', 'd']
handler.tags = ['grupo']
handler.admin = true
handler.group = true

export default handler
