// ⚡✨ Empire AntiLink Ultra ✨⚡
// 🚫 Sistema de advertencias automáticas
// ❌ Bloquea:
// • Grupos de WhatsApp
// • Canales de WhatsApp
// • Instagram
// • Facebook
// • YouTube
// • TikTok (videos, perfiles y lives)

let linkRegex = [
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

export async function before(m, { conn, isAdmin, isBotAdmin, isOwner, isROwner, participants }) {

  if (!m.isGroup) return
  if (!m.text) return

  if (isAdmin || isOwner || isROwner || m.fromMe) return

  let chat = global.db.data.chats[m.chat]
  if (!chat.antiLink) return

  const user = `@${m.sender.split('@')[0]}`
  const delet = m.key.participant || m.participant
  const bang = m.key.id

  const bot = global.db.data.settings[this.user.jid] || {}

  // admins
  const groupAdmins = participants.filter(p => p.admin)
  const listAdmin = groupAdmins.map((v, i) =>
    `*» ${i + 1}. @${v.id.split('@')[0]}*`
  ).join('\n')

  // detectar links
  const isLink = linkRegex.some(regex => regex.test(m.text))

  // detectar canales reenviados
  const isFromChannel = !!m.msg?.contextInfo?.forwardedNewsletterMessageInfo

  // evitar borrar link del mismo grupo
  if (isBotAdmin) {
    const linkThisGroup = `https://chat.whatsapp.com/${await this.groupInviteCode(m.chat)}`
    if (m.text.includes(linkThisGroup)) return !0
  }

  if (isLink || isFromChannel) {

    // sistema de advertencias
    if (!chat.warns) chat.warns = {}
    if (!chat.warns[m.sender]) chat.warns[m.sender] = 0

    chat.warns[m.sender] += 1

    let warn = chat.warns[m.sender]

    const advertencias = {
      1: `⚠️ *Primera advertencia*\n\n🚫 No envíes enlaces.`,
      2: `⚠️⚠️ *Segunda advertencia*\n\n❌ Sigue enviando links prohibidos.`,
      3: `☠️ *Tercera advertencia*\n\n💢 Últimos avisos antes de expulsión.`,
      4: `💀 *Cuarta advertencia*\n\n🚨 Estás a punto de ser eliminado.`,
      5: `🔥 *Quinta advertencia*\n\n⛔ Expulsión automática activada.`
    }

    await conn.sendMessage(m.chat, {
      text: `
⚡✨ *「 AntiLink 」* ✨⚡

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
      `,
      mentions: [m.sender]
    }, { quoted: m })

    // borrar mensaje
    if (isBotAdmin) {
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
        console.log(e)
      }
    }

    // si el bot no es admin
    if (!isBotAdmin) {
      return conn.sendMessage(m.chat, {
        text: `⚠️ *AntiLink activado*, pero necesito ser admin.\n\n👑 *Admins:*\n${listAdmin}`,
        mentions: groupAdmins.map(v => v.id)
      }, { quoted: m })
    }

    // expulsar al llegar a 5
    if (warn >= 5) {
      try {

        await conn.sendMessage(m.chat, {
          text: `
🔥 *Expulsión completada*

👤 Usuario: ${user}

❌ Motivo:
Enviar enlaces prohibidos repetidamente.
          `,
          mentions: [m.sender]
        }, { quoted: m })

        await conn.groupParticipantsUpdate(
          m.chat,
          [m.sender],
          'remove'
        )

        delete chat.warns[m.sender]

      } catch (e) {
        console.log('Error al expulsar:', e)
      }
    } 
  }

  return !0
}
