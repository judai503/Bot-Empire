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

    if (!db[m.chat]?.length) {
      return conn.reply(
        m.chat,
        '⚠️ No hay cuarentena',
        m
      )
    }

    let targets = []

    if (m.mentionedJid?.length) {
      targets.push(...m.mentionedJid)
    }

    targets = [...new Set(targets)]

    // eliminar toda la cuarentena
    if (!targets.length) {

      delete db[m.chat]

      saveDB()

      return conn.reply(
        m.chat,
        '✅ Cuarentena eliminada',
        m
      )
    }

    db[m.chat] = db[m.chat].filter(
      x => !targets.includes(x)
    )

    if (!db[m.chat].length) {
      delete db[m.chat]
    }

    saveDB()

    let txt = `✅ *USUARIOS RETIRADOS DE CUARENTENA*\n\n`

    targets.forEach((u, i) => {
      txt += `${i + 1}. @${u.split('@')[0]}\n`
    })

    return conn.sendMessage(
      m.chat,
      {
        text: txt.trim(),
        mentions: targets
      },
      { quoted: m }
    )
  }

  // =========================
  // INTERNADOS
  // =========================
  if (command === 'internados') {

    let users = db[m.chat] || []

    const participantesIds =
      participants.map(p => p.id)

    db[m.chat] = users.filter(
      u => participantesIds.includes(u)
    )

    saveDB()

    users = db[m.chat]

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

    return conn.sendMessage(
      m.chat,
      {
        text: txt.trim(),
        mentions: users
      },
      { quoted: m }
    )
  }

  // =========================
  // CUARENTENA
  // =========================
  let users = []

  // menciones directas
  if (m.mentionedJid?.length) {
    users.push(...m.mentionedJid)
  }

  // responder a tagall/lista
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

        const number =
          p.id.split('@')[0]

        if (text.includes(number)) {
          users.push(p.id)
        }

      }

    }

  }

  // limpiar duplicados
  users = [...new Set(users)]

  users = users.filter(
    u =>
      u !== m.sender &&
      u !== conn.user.jid
  )

  if (!users.length) {
    return conn.reply(
      m.chat,
      '⚠️ Responde a un tagall/lista o menciona usuarios.\n\nEjemplos:\n.cuarentena @usuario\n.cuarentena @user1 @user2',
      m
    )
  }

  // crear lista
  if (!db[m.chat]) {
    db[m.chat] = []
  }

  // guardar
  for (const user of users) {

    if (!db[m.chat].includes(user)) {
      db[m.chat].push(user)
    }

  }

  saveDB()

  let txt = `🚨 *CUARENTENA ACTIVADA*\n\n`
  txt += `👥 Usuarios registrados:\n\n`

  users.forEach((user, i) => {
    txt += `${i + 1}. @${user.split('@')[0]}\n`
  })

  await conn.sendMessage(
    m.chat,
    {
      text: txt.trim(),
      mentions: users
    },
    { quoted: m }
  )

}

handler.command = [
  'cuarentena',
  'delcuarentena',
  'internados'
]

handler.group = true
handler.admin = true

export default handler
