/**
 * 📂 COMANDO: Uchiha Deezer Downloader
 * 📝 DESCRIPCIÓN: Busca y descarga pistas de música mediante Deezer.
 * 👤 CREADOR: Barboza Developer
 * ⚡ CANAL: Barboza Developer x Zona Developers
 * 🔗 API: https://api.evogb.org
 */

import axios from 'axios';

const handler = async (m, { conn, text, usedPrefix, command }) => {
    let query = text || (m.quoted && m.quoted.text ? m.quoted.text : '');

    if (!query) {
        return conn.reply(
            m.chat, 
            `*Ｏ(≧∇≦)Ｏ🧃* @${m.sender.split('@')[0]}\nDime el nombre de la canción que quieres buscar en Deezer.`, 
            m, { mentions: [m.sender] }
        );
    }

    await m.react('🕒');

    try {
        const searchApi = "https://api.evogb.org/search/deezer";
        const dlApi = "https://api.evogb.org/dl/deezer";

        const searchResponse = await axios.get(`${searchApi}?query=${encodeURIComponent(query)}&limit=1`);
        const searchResult = searchResponse.data;

        if (!searchResult?.status || !searchResult.data || searchResult.data.length === 0) {
            await m.react('❌');
            return conn.reply(m.chat, '❌ No se encontraron resultados.', m);
        }

        const trackData = searchResult.data[0];
        const dlResponse = await axios.get(`${dlApi}?url=${encodeURIComponent(trackData.url)}`);
        const dlResult = dlResponse.data;

        if (!dlResult?.status || !dlResult.data?.dl) {
            await m.react('❌');
            return conn.reply(m.chat, '❌ Error al procesar la descarga.', m);
        }

        const info = dlResult.data;
        const txt = `
━━━━━━━━━━━━━━━
  🎶 *D E E Z E R*
━━━━━━━━━━━━━━━
> 🎵 *Canción:* ${info.title}
> 🎤 *Artista:* ${info.artist}
> 💿 *Álbum:* ${info.album}
> 📅 *Año:* ${info.release_date}
> ⏳ *Duración:* ${info.duration}
━━━━━━━━━━━━━━━
⚡ Api por 𝘽𝙮 𝘽𝙖𝙧𝙗𝙤𝙯𝙖 / 𝙕𝙤𝒏𝙖 𝘿𝙚𝙫𝙚𝙡𝙤𝙥𝙚𝙧𝙨
`.trim();

        await m.react('🎧');

        await conn.sendMessage(m.chat, { 
            image: { url: info.cover }, 
            caption: txt,
            mentions: [m.sender]
        }, { quoted: m });

        await conn.sendMessage(m.chat, { 
            audio: { url: info.dl }, 
            mimetype: 'audio/mpeg', 
            fileName: `${info.title}.mp3` 
        }, { quoted: m });

        await m.react('🔥');

    } catch (e) {
        console.error("❌ Error Deezer:", e);
        await m.react('❌');
        return m.reply(`⚠️ *Error en el sistema:* ${e.message}`);
    }
};

handler.help = ['deezer <nombre>'];
handler.tags = ['tools'];
handler.command = /^(deezer|dz)$/i;

export default handler;
