const handler = async (m, { conn, command }) => {
  await m.react('⚡️')

  try {
    const user = m.mentionedJid?.[0] || m.quoted?.sender

    if (!user) {
      return m.reply('⚠️ Menciona o responde a un usuario.')
    }

    const actions = {
      darpoder: 'promote',
      promote: 'promote',
      daradmin: 'promote',

      quitarpoder: 'demote',
      demote: 'demote',
      quitaradmin: 'demote'
    }

    const action = actions[command]
    if (!action) return

    await conn.groupParticipantsUpdate(m.chat, [user], action)

    if (action === 'promote') {
      await m.react('👑')
      return conn.sendMessage(m.chat, {
        text: `⚡ @${user.split('@')[0]} ha ascendido al Olimpo. (ADMIN)`,
        mentions: [user]
      }, { quoted: m })
    }

    await m.react('☠️')
    return conn.sendMessage(m.chat, {
      text: `☠️ @${user.split('@')[0]} ha caído del Olimpo.`,
      mentions: [user]
    }, { quoted: m })

  } catch (e) {
    console.error(e)
    await m.react('❌')
  }
}

handler.command = [
  'darpoder', 'promote', 'daradmin',
  'quitarpoder', 'demote', 'quitaradmin'
]

handler.tags = ['grupo']
handler.admin = true
handler.group = true

export default handler
