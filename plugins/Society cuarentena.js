import fs from 'fs'
import path from 'path'

const dir = 'scty'
const file = path.join(dir, 'cuarentena.json')

// crear carpeta
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true })
}

// cargar db
let db = {}

if (fs.existsSync(file)) {
  try {
    db = JSON.parse(fs.readFileSync(file))
  } catch {
    db = {}
  }
}

const saveDB = () => {
  fs.writeFileSync(file, JSON.stringify(db, null, 2))
}

const handler = async (
  m,
  {
    conn,
    command,
    isAdmin,
    isOwner,
    participants
  }
) => {

  // seguridad
  if (!(isAdmin || isOwner)) {
    return conn.reply(
      m.chat,
      '❌ Solo admins pueden usar esto',
      m
    )
  }

  // =========================
  // DELCUARENTENA
  // =========================
  if (command === 'delcuarentena') {

    if (!db[m.chat]) {
      return conn.reply(
        m.chat,
        '⚠️ No hay cuarentena',
        m
      )
    }

    delete db[m.chat]

    saveDB()

    return conn.reply(
      m.chat,
      '✅ Cuarentena eliminada',
      m
    )
  }

  // =========================
  // INTERNADOS
  // =========================
  if (command === 'internados') {

    let users = db[m.chat] || []

    // participantes actuales
    const participantesIds =
      participants.map(p => p.id)

    // limpiar usuarios que salieron
    db[m.chat] = users.filter(
      u => participantesIds.includes(u)
    )

    saveDB()

    users = db[m.chat]

    // validar
    if (!users.length) {

      return conn.reply(
        m.chat,
        '✅ No hay internados',
        m
      )
    }

    let txt = `🏥 *INTERNADOS EN CUARENTENA*\n\n`
    txt += `👥 Total: ${users.length}\n\n`

    users.forEach((u, i) => {
      txt += `${i + 1}. @${u.split('@')[0]}\n`
    })

    return conn.sendMessage(m.chat, {
      text: txt.trim(),
      mentions: users
    }, { quoted: m })
  }

  // =========================
  // CUARENTENA
  // =========================
  if (!m.quoted) {
    return conn.reply(
      m.chat,
      '⚠️ Responde al tagall/lista',
      m
    )
  }

  let users = []

  // =========================
  // SACAR MENCIONES
  // =========================

  // mentionedJid normal
  if (m.quoted.mentionedJid?.length) {
    users.push(...m.quoted.mentionedJid)
  }

  // contextInfo
  const ctx =
    m.quoted?.msg?.contextInfo ||
    m.quoted?.message?.extendedTextMessage?.contextInfo ||
    {}

  if (ctx.mentionedJid?.length) {
    users.push(...ctx.mentionedJid)
  }

  // =========================
  // SI NO DETECTA:
  // usar texto + participants
  // =========================
  if (!users.length) {

    const text =
      m.quoted.text ||
      m.quoted.caption ||
      ''

    for (const p of participants) {

      const number =
        p.id.split('@')[0]

      // detectar número en texto
      if (text.includes(number)) {
        users.push(p.id)
      }

    }
  }

  // =========================
  // LIMPIAR
  // =========================
  users = [...new Set(users)]

  users = users.filter(
    u =>
      u !== m.sender &&
      u !== conn.user.jid
  )

  // =========================
  // VALIDAR
  // =========================
  if (!users.length) {
    return conn.reply(
      m.chat,
      '❌ No encontré usuarios',
      m
    )
  }

  // =========================
  // CREAR GRUPO
  // =========================
  if (!db[m.chat]) {
    db[m.chat] = []
  }

  // =========================
  // GUARDAR
  // =========================
  for (const user of users) {

    if (!db[m.chat].includes(user)) {
      db[m.chat].push(user)
    }

  }

  saveDB()

  // =========================
  // RESPUESTA
  // =========================
  let txt = `🚨 *CUARENTENA ACTIVADA*\n\n`
  txt += `👥 Usuarios registrados:\n\n`

  users.forEach(user => {
    txt += `➤ @${user.split('@')[0]}\n`
  })

  await conn.sendMessage(m.chat, {
    text: txt.trim(),
    mentions: users
  }, { quoted: m })
}

handler.command = [
  'cuarentena',
  'delcuarentena',
  'internados'
]

handler.group = true
handler.admin = true

export default handler
