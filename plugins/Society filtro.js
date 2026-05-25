import fs from 'fs'
import path from 'path'

const dir = './scty'
const file = path.join(dir, 'filtro.json')

// =========================
// CREAR CARPETA
// =========================
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true })
}

// =========================
// CARGAR DB
// =========================
let db = {}

if (fs.existsSync(file)) {
  try {
    db = JSON.parse(fs.readFileSync(file))
  } catch {
    db = {}
  }
}

// =========================
// GUARDAR DB
// =========================
const saveDB = () => {
  fs.writeFileSync(
    file,
    JSON.stringify(db, null, 2)
  )
}

// =========================
// HANDLER
// =========================
const handler = async (
  m,
  {
    conn,
    command,
    text,
    participants,
    isAdmin,
    isOwner
  }
) => {

  // =========================
  // SEGURIDAD
  // =========================
  if (!(isAdmin || isOwner)) {
    return conn.reply(
      m.chat,
      '❌ Solo admins pueden usar esto.',
      m
    )
  }

  // =========================
  // SETDD
  // =========================
  if (command === 'setdd') {

    if (!text) {
      return conn.reply(
        m.chat,
`⚠️ Usa:
.setdd texto`,
        m
      )
    }

    db[m.chat] = text

    saveDB()

    return conn.reply(
      m.chat,
      '✅ Mensaje guardado correctamente.',
      m
    )
  }

  // =========================
  // DELDD
  // =========================
  if (command === 'deldd') {

    if (!db[m.chat]) {
      return conn.reply(
        m.chat,
        '⚠️ No hay mensaje guardado.',
        m
      )
    }

    delete db[m.chat]

    saveDB()

    return conn.reply(
      m.chat,
      '✅ Mensaje eliminado correctamente.',
      m
    )
  }

  // =========================
  // DD
  // =========================
  if (command === 'dd') {

    const metadata =
      await conn.groupMetadata(m.chat)

    const desc =
      metadata.desc || ''

    // =========================
    // EXTRAER LINKS
    // =========================
    const regex =
      /(https?:\/\/[^\s]+)/g

    const links =
      desc.match(regex) || []

    if (!links.length) {
      return conn.reply(
        m.chat,
        '❌ No encontré links en la descripción.',
        m
      )
    }

    // =========================
    // PRIMER MENSAJE
    // =========================
    let txt = ` 𝐋𝐈𝐍𝐊𝐒 𝐃𝐄𝐋 𝐆𝐑𝐔𝐏𝐎\n\n`

    links.forEach((l, i) => {
      txt += `➤ Link ${i + 1}\n${l}\n\n`
    })

    await conn.sendMessage(
      m.chat,
      { text: txt.trim() },
      { quoted: m }
    )

    // =========================
    // SEGUNDO MENSAJE
    // =========================
    const mensaje =
      db[m.chat] ||
`𝐇𝐀𝐂𝐄𝐑 𝐋𝐎𝐒 𝐒𝐄𝐆𝐔𝐈𝐌𝐈𝐄𝐍𝐓𝐎𝐒

📝 Mandar captura de los seguimientos realizados.`

    await conn.sendMessage(
      m.chat,
      {
        text: mensaje
      },
      { quoted: m }
    )

    // =========================
    // TERCER MENSAJE
    // =========================
    const users =
      participants
        .filter(p => !p.admin)
        .map(p => p.id)

    if (!users.length) return

    const menciones =
      users
        .map(
          u => `@${u.split('@')[0]}`
        )
        .join(' ')

    await conn.sendMessage(
      m.chat,
      {
        text: menciones,
        mentions: users
      },
      { quoted: m }
    )
  }
}

// =========================
// COMANDOS
// =========================
handler.command = [
  'setdd',
  'deldd',
  'dd'
]

handler.group = true
handler.admin = true

export default handler
