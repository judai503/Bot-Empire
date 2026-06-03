/**
 * 📂 COMANDO: Uchiha Brat Generator (Sylphy API)
 * 📝 DESCRIPCIÓN: Crea stickers Brat estáticos o animados.
 * 👤 CREADOR: Barboza Developer
 * ⚡ ADAPTACIÓN: Empire Bot
 *
 * .brat texto  → Estático
 * .bratv texto → Animado
 */

import fetch from "node-fetch";
import { sticker } from "../lib/sticker.js";

const handler = async (m, { conn, text, command }) => {
    const contenidoTexto = text || (m.quoted?.text || '');

    if (!contenidoTexto) {
        return conn.reply(
            m.chat,
            `*Ｏ(≧∇≦)Ｏ🧃* @${m.sender.split('@')[0]}\nEscribe el texto que deseas convertir en sticker Brat.`,
            m,
            { mentions: [m.sender] }
        );
    }

    await m.react('🕒');

    try {
        const b = (s) => Buffer.from(s, 'base64').toString('utf-8');

        const apiBrat = b('aHR0cHM6Ly9zeWxwaHl5Lnh5ei90b29scy9icmF0');
        const apiKey = b('c3lscGh5LTZmMTUwZA==');

        // .brat = Static | .bratv = Anim
        const tipo = /^bratv$/i.test(command)
            ? 'Anim'
            : 'Static';

        const url = `${apiBrat}?text=${encodeURIComponent(contenidoTexto)}&color=Blanco&fondo=Negro&type=${tipo}&api_key=${apiKey}`;

        const res = await fetch(url);

        if (!res.ok) {
            await m.react('❌');
            return m.reply('*Error al procesar la solicitud con el servidor central.*');
        }

        const buffer = Buffer.from(await res.arrayBuffer());

        const stiker = await sticker(
            buffer,
            false,
            `Brat de ${m.pushName || 'Usuario'}`,
            global.author || 'Empire Bot'
        );

        if (!stiker) {
            await m.react('❌');
            return m.reply('*No se pudo generar el sticker.*');
        }

        const infoMessage = `
━━━━━━━━━━━━━━━
   🎭 *B R A T*
━━━━━━━━━━━━━━━
> 📝 *Texto:* ${contenidoTexto}
> 👤 *Usuario:* ${m.pushName || 'Usuario'}
> ⚙️ *Tipo:* ${tipo === 'Anim' ? 'Animado' : 'Estático'}
━━━━━━━━━━━━━━━
⚡ Api por 𝘽𝙮 𝘽𝙖𝙧𝙗𝙤𝙯𝙖 / 𝙕𝙤𝙣𝙖 𝘿𝙚𝙫𝙚𝙡𝙤𝙥𝙚𝙧𝙨
`.trim();

        await m.react('🎨');

        await conn.reply(
            m.chat,
            infoMessage,
            m,
            { mentions: [m.sender] }
        );

        await conn.sendFile(
            m.chat,
            stiker,
            'brat.webp',
            '',
            m,
            true
        );

        await m.react('🔥');

    } catch (e) {
        console.error("❌ Error en Brat:", e);
        await m.react('❌');
        return m.reply(`⚠️ *Error en el sistema:* ${e.message}`);
    }
};

handler.help = ['brat <texto>', 'bratv <texto>'];
handler.tags = ['sticker'];
handler.command = /^(brat|bratv)$/i;

export default handler;
