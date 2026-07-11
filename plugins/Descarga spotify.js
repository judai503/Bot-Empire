import fetch from 'node-fetch'

const handler = async (m, { conn, text, usedPrefix, command }) => {
  const busqueda = text || m.quoted?.text || ''

  if (!busqueda) {
    return m.reply(
      `🎵 Ingresa el nombre de una canción o un enlace de Spotify\n\nEjemplo:\n${usedPrefix + command} Lupita`
    )
  }

  await m.react('🎧')

  try {
    const key = Buffer.from('c2FzdWtl', 'base64').toString('utf8')

    let spotifyUrl = busqueda

    // Buscar canción si no es enlace
    if (!busqueda.includes('spotify.com/track/')) {
      const search = await fetch(
        `https://api.evogb.org/search/spotify?query=${encodeURIComponent(busqueda)}&key=${key}`
      )

      const result = await search.json()

      if (!result.status || !result.result?.length) {
        await m.react('❌')
        return m.reply('❌ No encontré resultados.')
      }

      spotifyUrl = result.result[0].link
    }

    const dl = await fetch(
      `https://api.evogb.org/dl/spotify?url=${encodeURIComponent(spotifyUrl)}&key=${key}`
    )

    const json = await dl.json()

    if (!json.status || !json.data?.url) {
      await m.react('❌')
      return m.reply('❌ No se pudo descargar la canción.')
    }

    const {
      name,
      artist,
      imageHD,
      image,
      url
    } = json.data

    const info = `
╭━━━〔 🎵 SPOTIFY 〕━━━⬣

┃ 🎶 Título:
┃ ➜ ${name || 'Desconocido'}
┃
┃ 👤 Artista:
┃ ➜ ${artist || 'Desconocido'}

╰━━━❍ Api by Barboza | Zona Developers
`.trim()

    await conn.sendMessage(
      m.chat,
      {
        image: { url: imageHD || image },
        caption: info
      },
      { quoted: m }
    )

    await conn.sendMessage(
      m.chat,
      {
        audio: { url },
        mimetype: 'audio/mpeg',
        fileName: `${name || 'spotify'}.mp3`
      },
      { quoted: m }
    )

    await m.react('✅')

  } catch (e) {
    console.error(e)
    await m.react('❌')
    m.reply('❌ Error al descargar la canción.')
  }
}

handler.help = ['spotify <canción>']
handler.tags = ['downloader']
handler.command = ['spotify', 'song', 'sp']

export default handler
