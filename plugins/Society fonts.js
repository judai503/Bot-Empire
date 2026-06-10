import fs from 'fs';
const fontData = JSON.parse(fs.readFileSync('./scty/tipos de letra.json', 'utf-8'));

// Función reutilizable de conversión
const convertirTexto = (texto, estilo) => {
    const alfabeto = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789ÁÉÍÓÚÑÜáéíóúñü,.?!";
    return texto.split('').map(char => {
        const index = alfabeto.indexOf(char);
        return (index !== -1 && estilo.chars[index]) ? estilo.chars[index] : char;
    }).join('');
};

let handler = async (m, { conn, text, command }) => {
    // Detectamos si es .fonts (menú) o .font1, .font2... (conversión)
    const esMenu = command.toLowerCase() === 'fonts';
    
    if (esMenu) {
        let lista = "✨ *CATÁLOGO DE FUENTES* ✨\n\n";
        lista += "Ejemplo: `.font1 Hola124 ¿?`\n\n";
        
        for (let i = 1; i <= 20; i++) {
            const estilo = fontData.estilos_totales[i.toString()];
            if (estilo) {
                // Generamos el ejemplo con el estilo actual
                const ejemplo = convertirTexto("Hola124 ¿?", estilo);
                lista += `*${i}.* ${estilo.nombre}: ${ejemplo}\n`;
            }
        }
        return conn.reply(m.chat, lista, m);
    }

    // Lógica de conversión (cuando usas .font1, .font2...)
    const idEstilo = command.replace(/\D/g, '') || text.match(/\d+/)?.[0];
    const estilo = fontData.estilos_totales[idEstilo];
    if (!estilo) return conn.reply(m.chat, "❌ Estilo no encontrado. Usa `.fonts` para ver la lista.", m);

    let txt = m.quoted ? (m.quoted.text || m.quoted.caption || '') : text.replace(/\d+/g, '').trim();
    if (!txt) return conn.reply(m.chat, '⚠️ Escribe un texto o responde a uno.', m);

    return conn.sendMessage(m.chat, { 
        text: convertirTexto(txt, estilo), 
        mentions: m.quoted ? (m.quoted.mentionedJid || []) : [] 
    }, { quoted: m });
};

// Ahora acepta .fonts para el menú y .font1, .font2, etc. para convertir
handler.command = /^(fonts|font\d+)$/i;
handler.group = true;
handler.admin = true;
export default handler;
