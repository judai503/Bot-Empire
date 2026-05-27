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
// JSONS
// =========================
const separadores = JSON.parse(
  fs.readFileSync('./scty/separadores.json')
)

const emojis = JSON.parse(
  fs.readFileSync('./scty/emojigrupo.json')
)

// =========================
// ARCHIVOS
// =========================
const cuarentenaFile =
  path.join(dir, 'cuarentena.json')

// =========================
// CREAR CUARENTENA
// =========================
if (!fs.existsSync(cuarentenaFile)) {

  fs.writeFileSync(
    cuarentenaFile,
    JSON.stringify({}, null, 2)
  )

}

// =========================
// CARGAR CUARENTENA
// =========================
const loadCuarentena = () => {

  try {

    return JSON.parse(
      fs.readFileSync(cuarentenaFile)
    )

  } catch {

    return {}

  }
}

// =========================
// HANDLER
// =========================
const handler = async (
  m,
  {
    conn,
    command,
    participants
  }
) => {

  // =========================
  // VALIDAR GRUPO
  // =========================
  if (!m.isGroup) {

    return conn.reply(
      m.chat,
      '⚠️ Solo en grupos.',
      m
    )

  }

  // =========================
  // OBTENER ID
  // =========================
  const id =
    command.replace('end', '')

  // =========================
  // SEPARADOR
  // =========================
  let separador =

    separadores[m.chat]?.[id] ||
    separadores[id]

  if (!separador) {

    return conn.reply(
      m.chat,
      '❌ Separador no encontrado.',
      m
    )

  }

  // =========================
  // EMOJI
  // =========================
  const args =
    m.text
      .trim()
      .split(/\s+/)
      .slice(1)

  const emojiGuardado =
    emojis[m.chat] || '✨'

  const emoji =
    args[0] || emojiGuardado

  separador = separador.replace(
    /%emoji%|✨/g,
    emoji
  )

  // =========================
  // VALIDAR RESPUESTA
  // =========================
  if (!m.quoted) {

    return conn.reply(
      m.chat,
      '⚠️ Responde a la lista.',
      m
    )

  }

  // =========================
  // EXTRAER MENCIONES
  // =========================
  let users = []

  // mentionedJid
  if (m.quoted.mentionedJid?.length) {

    users.push(
      ...m.quoted.mentionedJid
    )

  }

  // contextInfo
  const ctx =

    m.quoted?.msg?.contextInfo ||

    m.quoted?.message
      ?.extendedTextMessage
      ?.contextInfo ||

    {}

  if (ctx.mentionedJid?.length) {

    users.push(
      ...ctx.mentionedJid
    )

  }

  // fallback texto
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

  // =========================
  // LIMPIAR USERS
  // =========================
  users = [...new Set(users)]

  users = users.filter(
    u =>
      u !== (
        conn.user.jid ||
        conn.user.id
      )
  )

  // =========================
  // METADATA
  // =========================
  const metadata =
    await conn.groupMetadata(
      m.chat
    )

  const bot =
    conn.user.jid ||
    conn.user.id

  const admins =

    metadata.participants
      .filter(p => p.admin)
      .map(p => p.id)

  const miembros =

    metadata.participants
      .map(p => p.id)
      .filter(id => id !== bot)

  // =========================
  // CUARENTENA
  // =========================
  const cuarentena =
    loadCuarentena()

  let permisos =
    cuarentena[m.chat] || []

  // limpiar permisos inválidos
  permisos = permisos.filter(
    u => miembros.includes(u)
  )

  // =========================
  // LIMPIAR DUPLICADOS
  // =========================

  // quitar admins
  users = users.filter(
    u => !admins.includes(u)
  )

  permisos = permisos.filter(
    u => !admins.includes(u)
  )

  // quitar duplicados internos
  users = [...new Set(users)]
  permisos = [...new Set(permisos)]

  // =========================
  // PERMISOS
  // =========================

  // respondieron lista
  // y tienen permiso
  const permisosAlDia = permisos.filter(
    u => users.includes(u)
  )

  // tienen permiso
  // pero NO respondieron
  const permisosNormal = permisos.filter(
    u => !users.includes(u)
  )

  // =========================
  // AL DÍA
  // =========================

  // sacar de al día
  // los que tienen permiso
  users = users.filter(
    u => !permisos.includes(u)
  )

  // =========================
  // PENDIENTES
  // =========================

  const pendientes = miembros.filter(
    u =>
      !users.includes(u) &&
      !admins.includes(u) &&
      !permisos.includes(u)
  )

  // =========================
  // TEXTO
  // =========================
  let txt = ''

  // =========================
  // AL DÍA
  // =========================
  txt += `${separador}\n\n`

  txt += `✅ 𝐀𝐋 𝐃𝐈́𝐀\n`

  if (users.length) {

    txt += users
      .map(
        u =>
          `${emoji}┃@${
            u.split('@')[0]
          }`
      )
      .join('\n')

  } else {

    txt += `_Vacío_`

  }

  // =========================
  // PENDIENTES
  // =========================
  txt += `\n\n${separador}\n\n`

  txt += `⏳ 𝐏𝐄𝐍𝐃𝐈𝐄𝐍𝐓𝐄𝐒\n`

  if (pendientes.length) {

    txt += pendientes
      .map(
        u =>
          `${emoji}┃@${
            u.split('@')[0]
          }`
      )
      .join('\n')

  } else {

    txt += `*¡Todos al día!*`

  }

  // =========================
  // PERMISOS
  // =========================
  txt += `\n\n${separador}\n\n`

  txt += `🪪 𝐏𝐄𝐑𝐌𝐈𝐒𝐎𝐒\n`

  const permisosTexto = [

    // respondieron lista
    ...permisosAlDia.map(
      u =>
        `${emoji}┃@${
          u.split('@')[0]
        } (al día pero va a permisos)`
    ),

    // permisos normales
    ...permisosNormal.map(
      u =>
        `${emoji}┃@${
          u.split('@')[0]
        }`
    )

  ]

  if (permisosTexto.length) {

    txt += permisosTexto.join('\n')

  } else {

    txt += `_Vacío_`

  }

  // =========================
  // ADMINISTRACIÓN
  // =========================
  txt += `\n\n${separador}\n\n`

  txt += `👑 𝐀𝐃𝐌𝐈𝐍𝐈𝐒𝐓𝐑𝐀𝐂𝐈𝐎́𝐍\n`

  txt += admins
    .map(
      u =>
        `${emoji}┃@${
          u.split('@')[0]
        }`
    )
    .join('\n')

  txt += `\n\n${separador}`

  // =========================
  // ENVIAR
  // =========================
  return conn.sendMessage(

    m.chat,

    {
      text: txt.trim(),

      mentions: [

        ...users,
        ...pendientes,
        ...permisos,
        ...admins

      ]
    },

    { quoted: m }

  )
}

// =========================
// COMANDOS
// =========================
handler.command = Array.from(
  { length: 300 },
  (_, i) => `end${i + 1}`
)

handler.group = true
handler.admin = true

export default handler
