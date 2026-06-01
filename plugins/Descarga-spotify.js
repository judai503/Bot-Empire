/**
 * 📂 COMANDO: Uchiha Spotify Downloader
 * 📝 DESCRIPCIÓN: Extractor de audio de Spotify (Búsqueda + Descarga).
 * 👤 CREADOR: Barboza Developer
 * ⚡ CANAL: Barboza Developer x Zona Developers
 * 🔗 API: https://api.evogb.org/dl/spotify
 */

import fetch from "node-fetch";

const handler = async (m, { conn, text, usedPrefix, command }) => {

  await m.react('⚡️');

  if (!text || !text.trim()) {
    return conn.reply(
      m.chat,
      `*Ｏ(≧∇≦)Ｏ🧃* @${m.sender.split('@')[0]}\nDime el nombre o link de la canción de Spotify.`,
      m, { mentions: [m.sender] }
    );
  }

  try {
    const decode = (txt) => Buffer.from(txt, "base64").toString("utf-8");
    // URL base correcta decodificada
    const api = decode("aHR0cHM6Ly9hcGkuZXZvZ2Iub3Jn");
    const key = decode("c2FzdWtl");

    let trackUrl = text;
    const isUrl = text.match(/^(https?:\/\/)?(open\.spotify\.com|spotify\.link)\/.+$/gi);

    if (!isUrl) {
      const search = await fetch(`${api}/search/spotify?query=${encodeURIComponent(text)}&key=${key}`);
      const searchData = await search.json();

      if (!searchData.status || !searchData.result || !searchData.result.length) {
        await m.react('❌');
        return m.reply("*(>_<)🧃* No se encontró ningún resultado en Spotify.");
      }
      trackUrl = searchData.result[0].link;
    }

    const response = await fetch(`${api}/dl/spotify?url=${encodeURIComponent(trackUrl)}&key=${key}`);
    const json = await response.json();

    if (!json.status || !json.data) {
      await m.react('❌');
      return m.reply("❌ Ocurrió un error al procesar la descarga.");
    }

    const info = json.data;
    const infoMessage = `
━━━━━━━━━━━━━━━
  🎶 *S P O T I F Y*
━━━━━━━━━━━━━━━
> 🎵 *Canción:* ${info.name}
> 🎤 *Artista:* ${info.artist}
> 💿 *Álbum:* ${info.album}
> ⏱️ *Tiempo:* ${info.duration}
━━━━━━━━━━━━━━━
⚡ Api por 𝘽𝙮 𝘽𝙖𝙧𝙗𝙤𝙯𝙖 / 𝙕𝙤𝙣𝙖 𝘿𝙚𝙫𝙚𝙡𝙤𝙥𝙚𝙧𝙨
`.trim();

    await m.react('🎧');

    await conn.sendMessage(m.chat, {
      image: { url: info.imageHD || info.image },
      caption: infoMessage,
      mentions: [m.sender]
    }, { quoted: m });

    await conn.sendMessage(m.chat, {
      audio: { url: info.url },
      mimetype: "audio/mpeg",
      fileName: `${info.name}.mp3`,
      ptt: false
    }, { quoted: m });

    await m.react('🔥');

  } catch (error) {
    console.error("❌ Error en Uchiha Downloader:", error);
    await m.react('❌');
    return m.reply(`⚠️ *Error en el sistema:* ${error.message}`);
  }
};

handler.help = ["spotify <nombre/link>"];
handler.tags = ["downloader"];
handler.command = /^(spotify|sp|music|spt)$/i;

export default handler;
