import { generateWAMessageFromContent } from '@whiskeysockets/baileys'

let handler = async (m, { conn, text, participants }) => {

  let users = participants.map(u => conn.decodeJid(u.id))

  const userId = m.mentionedJid?.[0] || m.sender

  let tagText = text?.trim()
    ? text
    : (m.quoted?.text?.trim()
      ? m.quoted.text
      : "*¡Mensaje de notificación!* 📢")

  let finalText = `${tagText}\n\n> mensaje de: @${userId.split('@')[0]}`

  // 🔥 SI NO HAY QUOTED, ENVIAR NORMAL (EVITA BLANCO)
  if (!m.quoted) {
    return conn.sendMessage(m.chat, {
      text: finalText,
      mentions: users
    }, { quoted: m })
  }

  try {

    let q = m.quoted
    let c = await m.getQuotedObj()

    let msg = conn.cMod(
      m.chat,
      generateWAMessageFromContent(
        m.chat,
        {
          [q.mtype]: c.message[q.mtype]
        },
        { userJid: conn.user.id }
      ),
      finalText,
      conn.user.jid,
      { mentions: users }
    )

    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })

  } catch {

    await conn.sendMessage(m.chat, {
      text: finalText,
      mentions: users
    }, { quoted: m })
  }
}

handler.help = ['hidetag']
handler.tags = ['grupo']
handler.command = ['hidetag', 'tag', 'notify', 'n']
handler.group = true
handler.admin = true

export default handler
