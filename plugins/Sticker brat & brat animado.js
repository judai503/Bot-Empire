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

        const tipo = /^bratv$/i.test(command)
            ? 'Anim'
            : 'Static';

        // 🎨 Combinaciones aleatorias
        const estilos = [
            { color: 'Blanco', fondo: 'Negro' },
            { color: 'Negro', fondo: 'Blanco' },

            { color: 'Naranja', fondo: 'Blanco' },
            { color: 'Rosa', fondo: 'Blanco' },
            { color: 'Azul', fondo: 'Blanco' },
            { color: 'Verde', fondo: 'Blanco' },
            { color: 'Rojo', fondo: 'Blanco' },
            { color: 'Morado', fondo: 'Blanco' },
            { color: 'Amarillo', fondo: 'Blanco' },
            { color: 'Cyan', fondo: 'Blanco' },

            { color: 'Blanco', fondo: 'Rojo' },
            { color: 'Blanco', fondo: 'Azul' },
            { color: 'Blanco', fondo: 'Verde' },
            { color: 'Blanco', fondo: 'Morado' },
            { color: 'Blanco', fondo: 'Rosa' },
            { color: 'Blanco', fondo: 'Naranja' },
            { color: 'Blanco', fondo: 'Cyan' },

            { color: 'Negro', fondo: 'Rojo' },
            { color: 'Negro', fondo: 'Azul' },
            { color: 'Negro', fondo: 'Verde' },
            { color: 'Negro', fondo: 'Morado' },
            { color: 'Negro', fondo: 'Rosa' },
            { color: 'Negro', fondo: 'Naranja' },
            { color: 'Negro', fondo: 'Amarillo' },
            { color: 'Negro', fondo: 'Cyan' },

            { color: 'Rojo', fondo: 'Negro' },
            { color: 'Azul', fondo: 'Negro' },
            { color: 'Verde', fondo: 'Negro' },
            { color: 'Morado', fondo: 'Negro' },
            { color: 'Rosa', fondo: 'Negro' },
            { color: 'Amarillo', fondo: 'Negro' },
            { color: 'Cyan', fondo: 'Negro' }
        ];

        const estilo = estilos[Math.floor(Math.random() * estilos.length)];

        const url =
            `${apiBrat}?text=${encodeURIComponent(contenidoTexto)}&color=${encodeURIComponent(estilo.color)}&fondo=${encodeURIComponent(estilo.fondo)}&type=${tipo}&api_key=${apiKey}`;

        const res = await fetch(url);

        if (!res.ok) {
            await m.react('❌');
            return m.reply('*Error al procesar la solicitud con el servidor central.*');
        }

        const buffer = Buffer.from(await res.arrayBuffer());

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
