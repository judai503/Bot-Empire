/**
 * 📂 COMANDO: Uchiha YouTube Downloader (Play)
 * 📝 DESCRIPCIÓN: Extractor de audio de YouTube (MP3).
 * 👤 CREADOR: Barboza Developer
 * ⚡ CANAL: Barboza Developer x Zona Developers
 * 🔗 API: https://api.delirius.store/home
 */

import fetch from "node-fetch";
import yts from "yt-search";

const handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        return conn.reply(
            m.chat, 
            `*Ｏ(≧∇≦)Ｏ🧃* @${m.sender.split('@')[0]}\nEscribe el nombre de la canción que quieres buscar en YouTube.`, 
            m, { mentions: [m.sender] }
        );
    }

    await m.react('🕒');

    try {
        let search = await yts(text);
        if (!search || !search.videos || search.videos.length === 0) {
            await m.react('❌');
            return m.reply('*No se encontraron resultados para tu búsqueda.*');
        }

        let video = search.videos[0];
        const b = (s) => Buffer.from(s, 'base64').toString('utf-8');
        const endpoint = b("aHR0cHM6Ly9hcGkuZGVsaXJpdXMuc3RvcmUvZG93bmxvYWQv");
        
        let res = await fetch(`${endpoint}ytmp3?url=${encodeURIComponent(video.url)}`);
        let json = await res.json();

        if (!json.status || !json.data) {
            await m.react('❌');
            return m.reply('*Error al procesar la descarga con el servidor central.*');
        }

        const yt = json.data;
        const infoMessage = `
━━━━━━━━━━━━━━━
  🎶 *Y O U T U B E*
━━━━━━━━━━━━━━━
> 🎵 *Canción:* ${yt.title}
> 👤 *Autor:* ${yt.author}
> ⏳ *Duración:* ${video.timestamp}
━━━━━━━━━━━━━━━
⚡ Api por 𝘽𝙮 𝘽𝙖𝙧𝙗𝙤𝙯𝙖 / 𝙕𝙤𝙣𝙖 𝘿𝙚𝙫𝙚𝙡𝙤𝙥𝙚𝙧𝙨
`.trim();

        await m.react('🎧');

        await conn.sendMessage(m.chat, { 
            image: { url: yt.image }, 
            caption: infoMessage,
            mentions: [m.sender]
        }, { quoted: m });

        await conn.sendMessage(m.chat, { 
            audio: { url: yt.download }, 
            mimetype: 'audio/mpeg',
            fileName: `${yt.title}.mp3`,
            ptt: false
        }, { quoted: m });

        await m.react('🔥');

    } catch (e) {
        console.error("❌ Error en Play:", e);
        await m.react('❌');
        return m.reply(`⚠️ *Error en el sistema:* ${e.message}`);
    }
};

handler.help = ['play <nombre>'];
handler.tags = ['downloader'];
handler.command = /^(play)$/i;

export default handler;
