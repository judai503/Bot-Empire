import fs from 'fs'
import path from 'path'

const dir = 'scty'
const file = path.join(dir, 'new.json')

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

const handler = async (m, { conn, command, isAdmin, isOwner, participants }) => {

  // seguridad
  if (!(isAdmin || isOwner)) {
    return conn.reply(m.chat, '❌ Solo admins pueden usar esto', m)
  }

  // =========================
  // .dnew (limpiar)
  // =========================
  if (command === 'dnew') {

    if (!db[m.chat]?.length) {
      return conn.reply(m.chat, '⚠️ No hay registros nuevos', m)
    }

    let targets = []

    if (m.mentionedJid?.length) {
      targets.push(...m.mentionedJid)
    }

    targets = [...new Set(targets)]

    // borrar todo si no hay menciones
    if (!targets.length) {
      delete db[m.chat]
      saveDB()

      return conn.reply(m.chat, '🧹 Lista NEW vaciada correctamente', m)
    }

    db[m.chat] = db[m.chat].filter(u => !targets.includes(u))

    if (!db[m.chat].length) delete db[m.chat]

    saveDB()

    let txt = `🧹 *USUARIOS ELIMINADOS DE NEW*\n\n`

    targets.forEach((u, i) => {
      txt += `${i + 1}. @${u.split('@')[0]}\n`
    })

    return conn.sendMessage(
      m.chat,
      { text: txt.trim(), mentions: targets },
      { quoted: m }
    )
  }

  // =========================
  // .new
  // =========================
  let users = []

  // menciones directas
  if (m.mentionedJid?.length) {
    users.push(...m.mentionedJid)
  }

  // responder listas / tagall
  if (m.quoted) {

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

    // respaldo por texto
    if (!users.length) {

      const text =
        m.quoted.text ||
        m.quoted.caption ||
        ''

      for (const p of participants) {
        const number = p.id.split('@')[0]
        if (text.includes(number)) users.push(p.id)
      }

    }
  }

  users = [...new Set(users)]

  users = users.filter(
    u => u !== m.sender && u !== conn.user.jid
  )

  if (!users.length) {
    return conn.reply(
      m.chat,
      '⚠️ Menciona usuarios o responde una lista/tagall\n\nEjemplo:\n.new @user',
      m
    )
  }

  if (!db[m.chat]) db[m.chat] = []

  let nuevos = []
  let repetidos = []

  for (const u of users) {
    if (!db[m.chat].includes(u)) {
      db[m.chat].push(u)
      nuevos.push(u)
    } else {
      repetidos.push(u)
    }
  }

  saveDB()

  let txt = `🆕 *REGISTRO NEW*\n\n`

  if (nuevos.length) {
    txt += `✅ Nuevos ingresos:\n`
    nuevos.forEach((u, i) => {
      txt += `${i + 1}. @${u.split('@')[0]}\n`
    })
  }

  if (repetidos.length) {
    txt += `\n♻️ Reingresos detectados:\n`
    repetidos.forEach((u, i) => {
      txt += `${i + 1}. @${u.split('@')[0]}\n`
    })
  }

  txt += `\n📌 Agregado para revisión`

  return conn.sendMessage(
    m.chat,
    {
      text: txt.trim(),
      mentions: users
    },
    { quoted: m }
  )
}

handler.command = ['new', 'dnew']
handler.group = true
handler.admin = true

export default handler
