import fs from 'fs'
import path from 'path'

// =========================
// CREAR CARPETA SCTY
// =========================
const dir = 'scty'

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true })
}

// =========================
// ARCHIVOS
// =========================
const separadoresFile = path.join(dir, 'separadores.json')
const emojisFile = path.join(dir, 'emojigrupo.json')
const cuarentenaFile = path.join(dir, 'cuarentena.json')
const sansionFile = path.join(dir, 'sansion.json')
const newsFile = path.join(dir, 'new.json')

// =========================
// CREAR SI NO EXISTEN
// =========================
const ensure = (file) => {
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, JSON.stringify({}, null, 2))
  }
}

ensure(separadoresFile)
ensure(emojisFile)
ensure(cuarentenaFile)
ensure(sansionFile)
ensure(newsFile)

// =========================
// LOAD JSON
// =========================
const loadJSON = (file) => {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'))
  } catch {
    return {}
  }
}

const separadores = loadJSON(separadoresFile)
const emojis = loadJSON(emojisFile)

// =========================
// HANDLER
// =========================
const handler = async (m, { conn, command, participants }) => {

  if (!m.isGroup) {
    return conn.reply(m.chat, '⚠️ Solo en grupos.', m)
  }

  const id = command.replace('end', '')

  let separador =
    separadores[m.chat]?.[id] ||
    separadores[id]

  if (!separador) {
    return conn.reply(m.chat, '❌ Separador no encontrado.', m)
  }

  const args = m.text.trim().split(/\s+/).slice(1)
  const emoji = args[0] || emojis[m.chat] || '✨'

  separador = separador.replace(/%emoji%|✨/g, emoji)

  if (!m.quoted) {
    return conn.reply(m.chat, '⚠️ Responde a la lista.', m)
  }

  // =========================
  // USERS
  // =========================
  let users = []

  if (m.quoted.mentionedJid?.length) {
    users.push(...m.quoted.mentionedJid)
  }

  const ctx =
    m.quoted?.msg?.contextInfo ||
    m.quoted?.message?.extendedTextMessage?.contextInfo ||
    {}

  if (ctx.mentionedJid?.length) {
    users.push(...ctx.mentionedJid)
  }

  if (!users.length) {
    const text = m.quoted.text || m.quoted.caption || ''

    for (const p of participants) {
      const number = p.id.split('@')[0]
      if (text.includes(number)) users.push(p.id)
    }
  }

  users = [...new Set(users)]

  const bot = conn.user?.jid || conn.user?.id

  // =========================
  // GRUPO DATA
  // =========================
  const metadata = await conn.groupMetadata(m.chat)

  const admins = metadata.participants
    .filter(p => p.admin)
    .map(p => p.id)

  const miembros = metadata.participants
    .map(p => p.id)
    .filter(id => id !== bot)

  // =========================
  // CARGAR LISTAS
  // =========================
  const cuarentena = loadJSON(cuarentenaFile)
  const sansion = loadJSON(sansionFile)
  const news = loadJSON(newsFile)

  let permisos = cuarentena[m.chat] || []
  let noLink = sansion[m.chat] || []
  let ingresos = news[m.chat] || []

  // limpiar válidos
  permisos = permisos.filter(u => miembros.includes(u))
  noLink = noLink.filter(u => miembros.includes(u))
  ingresos = ingresos.filter(u => miembros.includes(u))

  // quitar admins
  users = users.filter(u => !admins.includes(u))
  permisos = permisos.filter(u => !admins.includes(u))
  noLink = noLink.filter(u => !admins.includes(u))
  ingresos = ingresos.filter(u => !admins.includes(u))

  users = [...new Set(users)]
  permisos = [...new Set(permisos)]
  noLink = [...new Set(noLink)]
  ingresos = [...new Set(ingresos)]

  // =========================
  // CLASIFICACIÓN
  // =========================
  const permisosAlDia = permisos.filter(u => users.includes(u))
  const permisosNormal = permisos.filter(u => !users.includes(u))

  users = users.filter(u => !permisos.includes(u))

  const pendientes = miembros.filter(
    u =>
      !users.includes(u) &&
      !admins.includes(u) &&
      !permisos.includes(u) &&
      !noLink.includes(u) &&
      !ingresos.includes(u)
  )

  // =========================
  // TEXTO
  // =========================
  let txt = ''

  txt += `${separador}\n\n`

  txt += `💯 𝐀𝐋 𝐃𝐈́𝐀 💯\n`
  txt += users.length
    ? users.map(u => `${emoji}┃@${u.split('@')[0]}`).join('\n')
    : `_Vacío_`

  txt += `\n\n${separador}\n\n`

  txt += `🧾 𝐏𝐄𝐍𝐃𝐈𝐄𝐍𝐓𝐄𝐒 𝐃𝐄 𝐄𝐍𝐓𝐑𝐄𝐆𝐀 𝐄𝐕𝐈𝐃𝐄𝐍𝐂𝐈𝐀𝐒 🧾\n`
  txt += pendientes.length
    ? pendientes.map(u => `${emoji}┃@${u.split('@')[0]}`).join('\n')
    : `_Vacío_`

  txt += `\n\n${separador}\n\n`

  txt += `❌ 𝐍𝐎 𝐒𝐔𝐁𝐄𝐍 𝐋𝐈𝐍𝐊 ❌\n`
  txt += noLink.length
    ? noLink.map(u => `${emoji}┃@${u.split('@')[0]}`).join('\n')
    : `_Vacío_`

  txt += `\n\n${separador}\n\n`

  txt += `🪪 𝐏𝐄𝐑𝐌𝐈𝐒𝐎𝐒 🪪\n`

  const permisosTexto = [
    ...permisosAlDia.map(u => `${emoji}┃@${u.split('@')[0]} (al día pero va a permisos)`),
    ...permisosNormal.map(u => `${emoji}┃@${u.split('@')[0]}`)
  ]

  txt += permisosTexto.length ? permisosTexto.join('\n') : `_Vacío_`

  txt += `\n\n${separador}\n\n`

  txt += `♻️ 𝐈𝐍𝐆𝐑𝐄𝐒𝐎 𝐄 𝐑𝐄𝐈𝐍𝐆𝐑𝐄𝐒𝐎 ♻️\n`
  txt += ingresos.length
    ? ingresos.map(u => `${emoji}┃@${u.split('@')[0]}`).join('\n')
    : `_Vacío_`

  txt += `\n\nUsa .dnew para reiniciar los ingresos y reingresos`

  txt += `\n\n${separador}\n\n`

  // =========================
  // 👑 ADMINISTRACIÓN 👑
  // =========================

  const adminsList = admins.length
    ? admins.map(a => `👑┃@${a.split('@')[0]}`).join('\n')
    : `_Vacío_`

  txt += `👑 𝐀𝐃𝐌𝐈𝐍𝐈𝐒𝐓𝐑𝐀𝐂𝐈𝐎́𝐍 👑\n`
  txt += adminsList

  txt += `\n\n${separador}`

  return conn.sendMessage(m.chat, {
    text: txt.trim(),
    mentions: [
      ...users,
      ...pendientes,
      ...permisos,
      ...noLink,
      ...ingresos,
      ...admins
    ]
  }, { quoted: m })
}

// =========================
// COMANDOS
// =========================
handler.command = Array.from({ length: 300 }, (_, i) => `end${i + 1}`)
handler.group = true
handler.admin = true

export default handler
