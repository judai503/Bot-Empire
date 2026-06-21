const handler = m => m

handler.before = async function (m, { conn }) {
  try {
    if (!m.isGroup) return

    const chat = global.db.data.chats[m.chat]
    if (!chat?.modoadmin) return

    const body =
      m.text ||
      m.message?.conversation ||
      m.message?.extendedTextMessage?.text ||
      ''

    // Ignorar mensajes sin prefijo
    const prefixes = ['.', '#', '!', '/', '$']
    const isCommand = prefixes.some(p => body.startsWith(p))

    if (!isCommand) return

    const group = await conn.groupMetadata(m.chat)

    const isAdmin = group.participants
      .filter(p => p.admin)
      .map(p => p.id)
      .includes(m.sender)

    const isOwner = global.owner
      ?.map(v => v[0] + '@s.whatsapp.net')
      .includes(m.sender)

    // Permitir admins y owners
    if (isAdmin || isOwner) return

    await m.react('⛔')

    await conn.sendMessage(
      m.chat,
      {
        text: `
╭━━━〔 👑 MODO ADMIN 〕━━━⬣

┃ ⚠️ El modo administrador
┃ está activado en este grupo.
┃
┃ ✅ Solo administradores
┃ pueden usar comandos.
┃
┃ 👤 Usuario:
┃ ➜ @${m.sender.split('@')[0]}

╰━━━❍ Sistema del bot
`,
        mentions: [m.sender]
      },
      { quoted: m }
    )

    return true

  } catch (e) {
    console.error('❌ Error ModoAdmin:', e)
  }
}

export default handler
