import axios from 'axios'
import * as cheerio from 'cheerio'

const handler = async (m, { conn, args }) => {
  if (!args[0]) {
    return m.reply(
      `❌ Escribe un usuario de TikTok.\n\n` +
      `Ejemplo:\n.tktkfoto @tmjudai`
    )
  }

  let username = args[0]
    .replace(/^@/, '')
    .trim()

  if (!/^[a-zA-Z0-9._]+$/.test(username)) {
    return m.reply('❌ El usuario de TikTok no es válido.')
  }

  await m.react('🔎')

  try {
    const profileUrl = `https://www.tiktok.com/@${username}`

    const { data: html } = await axios.get(profileUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 Chrome/131.0.0.0 Mobile Safari/537.36',
        'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8'
      },
      timeout: 15000
    })

    const $ = cheerio.load(html)

    let avatar = null

    // Buscar imagen Open Graph
    avatar = $('meta[property="og:image"]').attr('content')

    // Buscar datos JSON internos de TikTok
    if (!avatar) {
      $('script').each((i, el) => {
        const text = $(el).html() || ''

        const matches = [
          /"avatarLarger":"([^"]+)"/,
          /"avatarMedium":"([^"]+)"/,
          /"avatarThumb":"([^"]+)"/
        ]

        for (const regex of matches) {
          const match = text.match(regex)

          if (match?.[1] && !avatar) {
            avatar = match[1]
              .replace(/\\u002F/g, '/')
              .replace(/\\\//g, '/')
              .replace(/\\u0026/g, '&')

            break
          }
        }
      })
    }

    if (!avatar) {
      await m.react('❌')

      return m.reply(
        `❌ No pude encontrar la foto de perfil de @${username}.\n\n` +
        `Puede que la cuenta no exista, sea privada o TikTok haya cambiado su página.`
      )
    }

    await conn.sendMessage(
      m.chat,
      {
        image: { url: avatar },
        caption:
          `🎭 *Foto de perfil de TikTok*\n\n` +
          `👤 @${username}`
      },
      { quoted: m }
    )

    await m.react('✅')

  } catch (error) {
    console.error('TKTKFOTO:', error)

    await m.react('❌')

    return m.reply(
      `❌ No pude obtener el perfil de *@${username}*.\n\n` +
      `Intenta nuevamente en unos segundos.`
    )
  }
}

handler.help = ['tktkfoto <usuario>']
handler.tags = ['descargas']
handler.command = ['tktkfoto', 'tiktokfoto', 'tktkpfp']

export default handler
