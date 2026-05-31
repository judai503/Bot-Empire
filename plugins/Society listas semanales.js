import fs from 'fs'
import path from 'path'

const dir = 'scty'
const semanalesFile = path.join(dir, 'semanales.json')

if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })

const readJSON = (file) => {
  if (!fs.existsSync(file)) return {}
  try {
    return JSON.parse(fs.readFileSync(file, 'utf-8'))
  } catch {
    return {}
  }
}

const db = readJSON(semanalesFile)

const handler = async (m, { conn, args, command, participants, isAdmin, isOwner }) => {

  if (!m.isGroup) return conn.reply(m.chat, '❌ Solo grupos', m)
  if (!(isAdmin || isOwner)) return conn.reply(m.chat, '❌ Solo admins', m)

  // Extrae el número del comando (ej: "slist1" -> "1")
  const theme = command.replace('slist', '') || "1"
  const emoji = args[0] || "⭐"

  const data = db.themes?.[theme]
  if (!data) return conn.reply(m.chat, `❌ El tema ${theme} no existe`, m)

  const groupName = (await conn.groupMetadata(m.chat)).subject

  // HEADER SIMPLE
  const header = `${emoji}🌸🐾 ${groupName} 🐾🌸${emoji}`

  const legend = db.headers?.[theme] || []
  const separator = db.separadores?.[theme] || "━━━━━━━━━━━━"

  const topRow =
`┆ L.   ┆   M ┆   M ┆ J.   ┆ V ┆
┆ ${data.icons.join(' ┆ ')} ┆`

  let texto = `
${header}

${legend.join('\n')}

${topRow}

${separator}

`

  // FILTRAMOS: Solo dejamos a los miembros que NO son administradores
  const normales = participants.filter(p => !p.admin)

  for (let i = 0; i < normales.length; i++) {
    const p = normales[i].id.split('@')[0]

    texto += `${i + 1}. ${emoji} @${p}
┆ ${data.icons.join(' ┆ ')} ┆\n\n`
  }

  texto += `
${separator}

👑 ADMINISTRADORES
${participants
  .filter(p => p.admin)
  .map(a => `${emoji} @${a.id.split('@')[0]}`)
  .join('\n')}
`

  const mentions = participants.map(p => p.id)

  await conn.sendMessage(m.chat, {
    text: texto.trim(),
    mentions
  }, { quoted: m })
}

handler.command = /^slist([1-9]|[1-4][0-9]|50)?$/i
handler.group = true
handler.admin = true

export default handler
