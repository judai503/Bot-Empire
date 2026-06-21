const handler = async (m, { conn, command }) => {
  await m.react('⚡️')

  try {

    if (!m.isGroup) {
      return m.reply('⚠️ Este comando solo funciona en grupos.')
    }

    // ABRIR GRUPO
    if ([
      'grupoabrir',
      'abrirgrupo',
      'open',
      'abrir'
    ].includes(command)) {

      await conn.groupSettingUpdate(
        m.chat,
        'not_announcement'
      )

      return await m.react('🟢')
    }

    // CERRAR GRUPO
    if ([
      'grupocerrar',
      'cerrargrupo',
      'closer',
      'cerrar'
    ].includes(command)) {

      await conn.groupSettingUpdate(
        m.chat,
        'announcement'
      )

      return await m.react('🔒')
    }

  } catch (error) {

    console.error('❌ Error:', error)

    await m.react('❌')

    return m.reply(
      `⚠️ Ocurrió un error:\n${error.message}`
    )
  }
}

handler.command = handler.help = [
  'grupoabrir',
  'abrirgrupo',
  'open',
  'abrir',
  'grupocerrar',
  'cerrargrupo',
  'closer',
  'cerrar'
]

handler.tags = ['grupo']

handler.admin = true
handler.group = true

export default handler
