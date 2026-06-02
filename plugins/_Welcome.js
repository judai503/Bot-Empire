import { WAMessageStubType } from '@whiskeysockets/baileys'

const processedEvents = new Set()

export async function before(m, { conn, participants, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return

  const key = m.key?.id || m.id
  if (!key) return

  if (processedEvents.has(key)) return
  processedEvents.add(key)
  setTimeout(() => processedEvents.delete(key), 60000)

  const chat = global.db?.data?.chats?.[m.chat] || {}
  if (!chat.welcome) return

  const who = m.messageStubParameters?.[0]
  if (!who) return

  const taguser = `@${who.split('@')[0]}`
  const totalMembers = participants?.length || 0

  const date = new Date().toLocaleString('es-ES', {
    timeZone: 'America/Mexico_City'
  })

  const descripcion = groupMetadata.desc || 'Sin descripción'

  // BIENVENIDA
  if (m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_ADD) {

    const bienvenida = `
╭━━━〔 BIENVENIDO/A 〕━━━╮
👤 Usuario: ${taguser}
💬 Grupo: ${groupMetadata.subject}
📅 Fecha: ${date}
📌 Descripción: ${descripcion}
👥 Miembros: ${totalMembers + 1}
╰━━━━━━━━━━━━━━━━━━━━━━╯
`.trim()

    await conn.sendMessage(m.chat, {
      text: bienvenida,
      mentions: [who]
    })
  }

  // DESPEDIDA
  if (
    m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_LEAVE ||
    m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_REMOVE
  ) {

    const despedida = `
╭━━━〔 DESPEDIDA 〕━━━╮
👤 Usuario: ${taguser}
📅 Fecha: ${date}
╰━━━━━━━━━━━━━━━━━━━━╯
`.trim()

    await conn.sendMessage(m.chat, {
      text: despedida,
      mentions: [who]
    })
  }
}
