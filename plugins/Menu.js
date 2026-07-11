let handler = async (m, { conn }) => {

let txt = `
╔═══━━━〔 ✦ 𝐌𝐄𝐍𝐔́ 𝐃𝐄 𝐂𝐎𝐌𝐀𝐍𝐃𝐎𝐒 ✦ 〕━━━═══╗

╭─❖ 『 👥 𝐆𝐄𝐒𝐓𝐈𝐎́𝐍 𝐃𝐄 𝐆𝐑𝐔𝐏𝐎𝐒 』
│
│ ✦ 𝐀𝐧𝐭𝐢𝐥𝐢𝐧𝐤
│ ↳ Elimina automáticamente cualquier enlace enviado al grupo.
│
│ ✦ 𝐖𝐞𝐥𝐜𝐨𝐦𝐞 ┆ 𝐁𝐯
│ ↳ Envía la descripción del grupo como mensaje de bienvenida.
│
│ ✦ 𝐌𝐨𝐝𝐨𝐚𝐝𝐦𝐢𝐧
│ ↳ Solo los administradores pueden usar el bot.
│
╰─────────────────────❖

╭─❖ 『 🛠️ 𝐀𝐃𝐌𝐈𝐍𝐈𝐒𝐓𝐑𝐀𝐂𝐈𝐎́𝐍 』
│
│ ✦ 𝐓𝐨𝐝𝐨𝐬 ┆ 𝐓𝐚𝐠𝐚𝐥𝐥 ┆ 𝐈𝐧𝐯𝐨𝐜𝐚𝐫
│ ↳ Etiqueta a todos los integrantes del grupo.
│
│ ✦ 𝐄𝐦𝐨𝐭𝐚𝐠
│ ↳ Cambia el emoji usado por .todos, .tagall e .invocar.
│
│ ✦ 𝐇𝐢𝐝𝐞𝐭𝐚𝐠 ┆ 𝐍 ┆ 𝐍𝐨𝐭𝐢𝐟𝐲 ┆ 𝐓𝐚𝐠
│ ↳ Notifica a todos los miembros con un mensaje oculto.
│
│ ✦ 𝐊𝐢𝐜𝐤 ┆ 𝐀𝐥𝐯 ┆ 𝐁𝐚𝐧
│ ↳ Expulsa usuarios respondiendo o mencionándolos.
│
│ ✦ 𝐏𝐫𝐨𝐦𝐨𝐭𝐞 ┆ 𝐃𝐚𝐫𝐚𝐝𝐦𝐢𝐧 ┆ 𝐃𝐚𝐫𝐩𝐨𝐝𝐞𝐫
│ ↳ Concede privilegios de administrador.
│
│ ✦ 𝐃𝐞𝐦𝐨𝐭𝐞 ┆ 𝐐𝐮𝐢𝐭𝐚𝐫𝐚𝐝𝐦𝐢𝐧
│ ↳ Revoca privilegios de administrador.
│
│ ✦ 𝐀𝐛𝐫𝐢𝐫 ┆ 𝐆𝐫𝐮𝐩𝐨𝐚𝐛𝐫𝐢𝐫
│ ↳ Permite que todos puedan enviar mensajes.
│
│ ✦ 𝐂𝐞𝐫𝐫𝐚𝐫 ┆ 𝐆𝐫𝐮𝐩𝐨𝐜𝐞𝐫𝐫𝐚𝐫
│ ↳ Solo los administradores podrán escribir.
│
│ ✦ 𝐃𝐞𝐥𝐞𝐭𝐞 ┆ 𝐃𝐞𝐥 ┆ 𝐃
│ ↳ Borra mensajes respondiéndolos.
│
╰─────────────────────❖

╭─❖ 『 🧰 𝐇𝐄𝐑𝐑𝐀𝐌𝐈𝐄𝐍𝐓𝐀𝐒 』
│
│ ✦ 𝐁𝐫𝐚𝐭 ┆ 𝐁𝐫𝐚𝐭𝐯
│ ↳ Crea stickers con texto animado o estático.
│
│ ✦ 𝐒 ┆ 𝐒𝐭𝐢𝐜𝐤𝐞𝐫
│ ↳ Convierte imágenes y videos en stickers.
│
│ ✦ 𝐕𝐞𝐫
│ ↳ Reenvía mensajes de una sola visualización.
│
╰─────────────────────❖

╭─❖ 『 🏥 𝐒𝐎𝐂𝐈𝐄𝐃𝐀𝐃 』
│
│ ✦ 𝐄𝐧𝐝 + número + emoji
│ ↳ Completa listas de revisión.
│ ↳ Ejemplo: .end1 🌎
│
│ ✦ 𝐂𝐮𝐚𝐫𝐞𝐧𝐭𝐞𝐧𝐚
│ ↳ Asigna permisos especiales respondiendo una lista
│   o mencionando usuarios.
│
│ ✦ 𝐃𝐞𝐥𝐜𝐮𝐚𝐫𝐞𝐧𝐭𝐞𝐧𝐚
│ ↳ Elimina permisos de cuarentena.
│
│ ✦ 𝐈𝐧𝐭𝐞𝐫𝐧𝐚𝐝𝐨𝐬
│ ↳ Muestra los usuarios registrados.
│
│ ✦ 𝐃𝐥𝐢𝐬𝐭 + número + emoji
│ ↳ Genera listas diarias.
│ ↳ Ejemplo: .dlist66 🎁
│
│ ✦ 𝐄𝐧𝐮𝐦
│ ↳ Enumera listas automáticamente.
│
╰─────────────────────❖

╚═══━━━〔 ✦ 𝐄𝐌𝐏𝐈𝐑𝐄 𝐁𝐎𝐓 ✦ 〕━━━═══╝
`

await conn.reply(m.chat, txt, m)

}

handler.help = ['menu']
handler.tags = ['main']

handler.command = /^(menu|allmenu|help)$/i

export default handler
