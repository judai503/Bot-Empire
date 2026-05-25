import { WAMessageStubType } from '@whiskeysockets/baileys'

// Anti duplicados
const processed = new Set()

export async function before(m, { conn, participants = [], groupMetadata }) {

  if (!m.isGroup) return
  if (!m.messageStubType) return

  const chat = global.db?.data?.chats?.[m.chat]
  if (!chat?.welcome) return

  // evitar mensajes dobles
  const id = m.key?.id
  if (processed.has(id)) return
  processed.add(id)

  setTimeout(() => processed.delete(id), 5000)

  const who = m.messageStubParameters?.[0]
  if (!who) return

  const taguser = `@${who.split('@')[0]}`
  const totalMembers = participants.length || 0

  const date = new Date().toLocaleString('es-ES', {
    timeZone: 'America/Mexico_City'
  })

  const groupName = groupMetadata?.subject || 'Grupo'
  const desc = groupMetadata?.desc || 'Sin descripción'

  // FOTO PERFIL
  let ppUser
  try {
    ppUser = await conn.profilePictureUrl(who, 'image')
  } catch {
    ppUser = 'https://telegra.ph/file/1f5c3f7d8c9a1b2c3d4e5.jpg'
  }

  // FRASES RANDOM
  const bienvenidaRnd = [
    '¡Bienvenido al grupo!',
    'Disfruta tu estancia',
    'Que empiece la diversión',
    'Nuevo integrante detectado'
  ][Math.floor(Math.random() * 4)]

  const despedidaRnd = [
    'Hasta luego',
    'Un miembro se fue',
    'Suerte en tu camino',
    'Te extrañaremos'
  ][Math.floor(Math.random() * 4)]

  // =========================
  // BIENVENIDA
  // =========================
  if (m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_ADD) {

    return conn.sendMessage(m.chat, {
      image: { url: ppUser },
      caption: `
╭━━━〔 👋 BIENVENIDO/A 〕━━━⬣

┃ 👤 Usuario: ${taguser}
┃ 💬 Grupo: ${groupName}
┃ 📌 Desc: ${desc}
┃ 👥 Miembros: ${totalMembers}
┃ 📅 Fecha: ${date}

┃ ⚡ ${bienvenidaRnd}

╰━━━❍ Sistema
`.trim(),
      mentions: [who]
    })
  }

  // =========================
  // DESPEDIDA
  // =========================
  if (
    m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_LEAVE
  ) {

    return conn.sendMessage(m.chat, {
      image: { url: ppUser },
      caption: `
╭━━━〔 👋 DESPEDIDA 〕━━━⬣

┃ 👤 Usuario: ${taguser}
┃ 💬 Grupo: ${groupName}
┃ 👥 Miembros: ${totalMembers}
┃ 📅 Fecha: ${date}

┃ ⚡ ${despedidaRnd}

╰━━━❍ Sistema
`.trim(),
      mentions: [who]
    })
  }
}

// =========================
// COMANDO welcome / bv
// =========================

let handler = async (m, { args }) => {

  let chat = global.db.data.chats[m.chat]

  if (!args[0]) {
    return m.reply(`
╭━━━〔 CONFIG 〕━━━⬣

┃ welcome on
┃ welcome off

┃ bv on
┃ bv off

╰━━━❍
`.trim())
  }

  const enable = args[0].toLowerCase() === 'on'

  chat.welcome = enable

  m.reply(
    enable
      ? '✅ Bienvenidas activadas'
      : '❌ Bienvenidas desactivadas'
  )
}

handler.command = ['welcome', 'bv']
handler.group = true
handler.admin = true

export default handler
