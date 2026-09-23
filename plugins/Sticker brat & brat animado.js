/**
 * 📂 COMANDO: Uchiha Brat Generator (Skyzxu API)
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
        let buffer;

        if (/^bratv$/i.test(command)) {
            const res = await fetch(
                `https://skyzxu-brat.hf.space/brat-animated?text=${encodeURIComponent(contenidoTexto)}`
            );

            if (!res.ok) {
                await m.react('❌');
                return m.reply('*Error al generar el Brat animado.*');
            }

            buffer = Buffer.from(await res.arrayBuffer());

        } else {

            const res = await fetch(
                `https://skyzxu-brat.hf.space/brat?text=${encodeURIComponent(contenidoTexto)}`
            );

            if (!res.ok) {
                await m.react('❌');
                return m.reply('*Error al generar el Brat.*');
            }

            buffer = Buffer.from(await res.arrayBuffer());
        }

        const stiker = await sticker(
            buffer,
            false,
            'Brat',
            'Api gracias a 𝘽𝙮 𝘽𝙖𝙧𝙗𝙤𝙯𝙖 | Zona Developers'
        );

        if (!stiker) {
            await m.react('❌');
            return m.reply('*No se pudo generar el sticker.*');
        }

        await m.react('🎨');

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
