import fs from 'fs'
import path from 'path'

const dir = 'scty'
const file = path.join(dir, 'dlist.json')

let dlistData = []
if (fs.existsSync(file)) {
  try {
    dlistData = JSON.parse(fs.readFileSync(file))
  } catch {
    dlistData = []
  }
}

const handler = async (m, { isOwner, isAdmin, conn, args, participants, command }) => {
  
  const matchNumero = command.match(/\d+/)
  const idBuscado = matchNumero ? parseInt(matchNumero[0]) : 1

  // 👍 Capturar el emoji decorativo principal
  const emojiComando = args[0] || '👍'
  
  // 🔍 Buscar el estilo en el JSON
  const estiloActual = dlistData.find(item => item.id === idBuscado)

  if (!estiloActual) {
    return conn.reply(m.chat, `❌ El ID *${idBuscado}* no existe en tu archivo scty/dlist.json`, m)
  }

  // 🌟 LÓGICA DEL SEPARADOR ARREGLADA:
  // 1. Si el usuario escribió un segundo argumento (ej: .dlist1 🦁 ---), usa ese como separador.
  // 2. Si no, toma el del JSON y reemplaza la 🌟 por el emoji principal.
  const separadorBase = estiloActual.separator || "・・・・🌟・・・・"
  const separadorFinal = args[1] 
    ? args.slice(1).join(' ') 
    : separadorBase.replace(/🌟/g, emojiComando)

  // 📅 Fecha
  const fecha = new Date()
  const opcionesFecha = { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'America/El_Salvador' }
  let fechaFormateada = fecha.toLocaleDateString('es-SV', opcionesFecha)
  fechaFormateada = fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1)

  // 👑 Admins
  const titulosAdmin = ["👑 𝗔𝗗𝗠𝗜𝗡𝗜𝗦𝗧𝗥𝗔𝗖𝗜Ó𝗡 👑", "👑 𝗘𝗡𝗖𝗔𝗥𝗚𝗔𝗗𝗢𝗦 👑", "👑 𝗔𝗗𝗠𝗜𝗡𝗜𝗦𝗧𝗥𝗔𝗗𝗢𝗥𝗘𝗦 👑"]
  const adminTituloRandom = titulosAdmin[Math.floor(Math.random() * titulosAdmin.length)]

  const listAdmins = participants.filter(p => p.admin !== null).map(p => p.id)
  const listUsuarios = participants.filter(p => p.admin === null).map(p => p.id)
  const mentions = [...listUsuarios, ...listAdmins]

  // 📝 Construcción del mensaje
  const e = estiloActual.emojis || ["🐠", "🪸", "🌊", "♻️", "🫧", "🆕"]
  const comboEmojis = e.join('') 

  let texto = `${emojiComando}${emojiComando} ${await conn.getName(m.chat)} ${emojiComando}${emojiComando}\n\n`
  
  texto += `${estiloActual.lines.join('\n')}\n`
  texto += `     ${separadorFinal}\n`

  texto += `${e[0] || '🐠'} 𝗔𝗟 𝗗𝗜́𝗔\n`
  for (const u of listUsuarios) {
    const num = u.split('@')[0]
    texto += `${emojiComando} @${num} ${comboEmojis}\n`
  }
  texto += `${separadorFinal}\n`

  // Sección de categorías
  texto += `${e[1] || '🪸'} 𝗘𝗡𝗧𝗥𝗘𝗚𝗔𝗡 𝗠Á𝗦 𝗧𝗔𝗥𝗗𝗘\n\n${separadorFinal}\n`
  texto += `${e[2] || '🌊'} 𝗡𝗢 𝗘𝗦𝗧Á𝗡 𝗔𝗟 𝗗𝗜́𝗔\n\n${separadorFinal}\n`
  texto += `${e[3] || '♻️'} 𝗩𝗨𝗘𝗟𝗩𝗘𝗡 𝗗𝗘 𝗣𝗘𝗥𝗠𝗜𝗦𝗢\n\n${separadorFinal}\n`
  texto += `${e[4] || '🫧'} 𝗣𝗘𝗥𝗠𝗜𝗦𝗢𝗦\n\n${separadorFinal}\n`
  texto += `${e[5] || '🆕'} 𝗣𝗘𝗥𝗦𝗢𝗡𝗜𝗧𝗔𝗦 𝗡𝗨𝗘𝗩𝗔𝗦\n\n${separadorFinal}\n`

  texto += `${adminTituloRandom}\n\n`
  for (const adm of listAdmins) {
    const numAdm = adm.split('@')[0]
    texto += `👑@${numAdm}👑\n`
  }

  texto += `\n📆 ${fechaFormateada}`

  await conn.sendMessage(m.chat, { text: texto.trim(), mentions }, { quoted: m })
}

handler.customPrefix = /^\.(dlist\d+|revlist\d+)/
handler.command = new RegExp()
handler.group = true

export default handler
