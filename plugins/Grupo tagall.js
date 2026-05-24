import fs from 'fs'
import path from 'path'

const dir = 'scty'
const file = path.join(dir, 'emojigrupo.json')

// 📁 crear carpeta si no existe
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })

// 📂 cargar DB segura
let dbEmoji = {}
if (fs.existsSync(file)) {
  try {
    dbEmoji = JSON.parse(fs.readFileSync(file))
  } catch {
    dbEmoji = {}
  }
}

const handler = async (m, { isOwner, isAdmin, conn, args, participants, command }) => {

  const cmd = command

  // 🔒 seguridad básica
  if (!(isAdmin || isOwner)) {
    return conn.reply(m.chat, '❌ Solo admins pueden usar esto', m)
  }

  // 🌸 EMOTAG / SETEMOJI
  if (cmd === 'emotag' || cmd === 'setemoji') {
    const emoji = args.join(' ').trim()

    if (!emoji) {
      return conn.reply(m.chat, '🌸 Usa: *.emotag 🔥* o *.setemoji 😺*', m)
    }

    dbEmoji[m.chat] = emoji
    fs.writeFileSync(file, JSON.stringify(dbEmoji, null, 2))

    return conn.reply(m.chat, `✨ Emoji guardado: ${emoji}`, m)
  }

  // 🚀 TAGALL
  const mensaje = args.join(' ')

  const emoji = dbEmoji[m.chat] || '🧃'

  let texto = `
╭══ 📢 LLAMADO A TODOS ══⬣
│ 👥 Total: ${participants.length}
│ 👑 Owner: ${global.ownername || 'Owner'}
│ 🤖 Bot: ${global.botname || 'Bot'}
╰═══⬣

${mensaje ? `✉️ ${mensaje}` : '⚠️ Invocación general'}

🚀 *PARTICIPANTES:*
`

  const mentions = [m.sender]

  for (const p of participants) {
    const number = p.id.split('@')[0]
    mentions.push(p.id)
    texto += `┃ ${emoji} @${number}\n`
  }

  await conn.sendMessage(m.chat, {
    text: texto.trim(),
    mentions
  }, { quoted: m })
}

handler.command = ['tagall', 'todos', 'invocar', 'emotag', 'setemoji']
handler.group = true
handler.admin = true

export default handler
