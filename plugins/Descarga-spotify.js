/**
 * 📂 COMANDO: Uchiha Spotify Downloader
 * 📝 DESCRIPCIÓN: Extractor de audio de Spotify (Búsqueda + Descarga).
 * 👤 CREADOR: Barboza Developer
 * ⚡ CANAL: Barboza Developer x Zona Developers
 * Usen los código porfa para traer más 
 * 🔗 API: https://api.evogb.org/dl/spotify
 */

// editado y reestructurado por 
// https://github.com/deylin-eliac

import fetch from "node-fetch";

const handler = async (m, { conn, text, usedPrefix, command }) => {

  await m.react('⚡️');

  const dev = "𝘽𝙮 𝘽𝙖𝙧𝙗𝙤𝙯𝙖";
  const chn = "𝙕𝙤𝙣𝙖 𝘿𝙚𝙫𝙚𝙡𝙤𝙥𝙚𝙧𝙨";

  if (!text || !text.trim()) {
    return conn.reply(
      m.chat,
      "*Ｏ(≧∇≦)Ｏ🧃*\nDime el nombre o link de Spotify",
      m
    );
  }

  try {

    // Decodificador Base64
    const decode = (txt) =>
      Buffer.from(txt, "base64").toString("utf-8");

    const api = decode("aHR0cHM6Ly9hcGkuZXZvZ2Iub3Jn");
    const key = decode("c2FzdWtl");

    let trackUrl = text;

    // Detectar URL Spotify
    const isUrl = text.match(
      /^(https?:\/\/)?(open\.spotify\.com|spotify\.link)\/.+$/gi
    );

    // Buscar canción
    if (!isUrl) {

      const search = await fetch(
        `${api}/search/spotify?query=${encodeURIComponent(text)}&key=${key}`
      );

      const searchData = await search.json();

      if (
        !searchData.status ||
        !searchData.result ||
        !searchData.result.length
      ) {
        await m.react('❌');
        return m.reply(
          "*(>_<)🧃*\nNo se encontró nada en Spotify..."
        );
      }

      trackUrl = searchData.result[0].link;
    }

    // Descargar canción
    const response = await fetch(
      `${api}/dl/spotify?url=${encodeURIComponent(trackUrl)}&key=${key}`
    );

    const json = await response.json();

    if (!json.status || !json.data) {
      await m.react('❌');
      return m.reply(
        "❌ No se pudo procesar la descarga."
      );
    }

    const info = json.data;

    // Mensaje visual
    const infoMessage = `
╔═════ ∘◦ 🎧 ◦∘ ═════╗
      *Spotify Download*
╚═════ ∘◦ 🎧 ◦∘ ═════╝

> 🎵 *Título:* ${info.name}
> 🎤 *Artista:* ${info.artist}
> 💿 *Álbum:* ${info.album}
> ⏱️ *Duración:* ${info.duration}
> ⚡ *Estado:* Descargado correctamente

╔═════ ∘◦ 👑 ◦∘ ═════╗
> ⚡ ${dev}
> 📡 ${chn}
╚═════ ∘◦ 👑 ◦∘ ═════╝
`;

    // Reacción
    await m.react('🎧');

    // Enviar portada
    await conn.sendMessage(
      m.chat,
      {
        image: {
          url: info.imageHD || info.image
        },
        caption: infoMessage
      },
      { quoted: m }
    );

    // Enviar audio
    await conn.sendMessage(
      m.chat,
      {
        audio: {
          url: info.url
        },
        mimetype: "audio/mpeg",
        fileName: `${info.name}.mp3`,
        ptt: false
      },
      { quoted: m }
    );

    await m.react('🔥');

  } catch (error) {

    console.error("❌ Error:", error);

    await m.react('❌');

    return m.reply(
      `⚠️ Ocurrió un error eléctrico:\n${error.message}`
    );
  }
};

handler.help = [
  "spotify",
  "sp",
  "music",
  "spt"
];

handler.tags = [
  "downloader"
];

handler.command = /^(spotify|sp|music|spt)$/i;

export default handler;
