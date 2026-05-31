// ⚡✨ Empire AntiLink Ultra ✨⚡
// 🚫 Sistema de advertencias automáticas

const linkRegex = [
  /chat\.whatsapp\.com\/([0-9A-Za-z]{20,24})/i,
  /whatsapp\.com\/channel\/([0-9A-Za-z]{20,40})/i,
  /instagram\.com/i,
  /facebook\.com/i,
  /fb\.watch/i,
  /youtu\.be/i,
  /youtube\.com/i,
  /tiktok\.com/i,
  /vm\.tiktok\.com/i
]

export async function before(m, { conn, isAdmin, isOwner, isROwner, participants }) {

  if (!m.isGroup) return
  if (!m.text) return

  if (isAdmin || isOwner || isROwner || m.fromMe) return

  const chat = global.db.data.chats[m.chat]
  if (!chat || !chat.antiLink) return

  const user = `@${m.sender.split('@')[0]}`
  const delet = m.key.participant || m.participant
  const bang = m.key.id

  const isLink = linkRegex.some(regex => regex.test(m.text))
  const isFromChannel = !!m.msg?.contextInfo?.forwardedNewsletterMessageInfo

  // Permitir enlace del mismo grupo
  try {
    const code = await conn.groupInviteCode(m.chat)
    const groupLink = `https://chat.whatsapp.com/${code}`

    if (m.text.includes(groupLink)) return
  } catch {}

  if (!isLink && !isFromChannel) return

  // Crear sistema de advertencias
  if (!chat.warns) chat.warns = {}

  if (!chat.warns[m.sender]) {
    chat.warns[m.sender] = 0
  }

  chat.warns[m.sender] += 1

  const warn = chat.warns[m.sender]

  const advertencias = {
    1: `⚠️ *Primera advertencia*\n\n🚫 No envíes enlaces.`,
    2: `⚠️⚠️ *Segunda advertencia*\n\n❌ Sigue enviando links prohibidos.`,
    3: `☠️ *Tercera advertencia*\n\n💢 Últimos avisos antes de expulsión.`,
    4: `💀 *Cuarta advertencia*\n\n🚨 Estás a punto de ser eliminado.`,
    5: `🔥 *Quinta advertencia*\n\n⛔ Expulsión automática activada.`
  }

  // Aviso
  await conn.sendMessage(m.chat, {
    text: `
⚡✨ *「 AntiLink Ultra 」* ✨⚡

👤 Usuario: ${user}

${advertencias[warn] || advertencias[5]}

📊 Advertencias: *${warn}/5*

🚫 Links prohibidos:
• WhatsApp
• Canales
• Instagram
• Facebook
• YouTube
• TikTok
`.trim(),
    mentions: [m.sender]
  }, { quoted: m })

  // Intentar borrar mensaje
  try {
    await conn.sendMessage(m.chat, {
      delete: {
        remoteJid: m.chat,
        fromMe: false,
        id: bang,
        participant: delet
      }
    })
  } catch (e) {
    console.log('No se pudo borrar el mensaje:', e.message)
  }

  // Expulsar al llegar a 5 advertencias
  if (warn >= 5) {
    try {

      await conn.sendMessage(m.chat, {
        text: `
🔥 *Expulsión completada*

👤 Usuario: ${user}

❌ Motivo:
Enviar enlaces prohibidos repetidamente.
`.trim(),
        mentions: [m.sender]
      }, { quoted: m })

      // Misma lógica que tu comando .kick
      await conn.groupParticipantsUpdate(
        m.chat,
        [m.sender],
        'remove'
      )

      delete chat.warns[m.sender]

    } catch (e) {

      console.log('Error AntiLink:', e)

      await conn.sendMessage(m.chat, {
        text: `⚠️ Error al expulsar:\n${e.message}`
      }, { quoted: m })
    }
  }

  return true
}
