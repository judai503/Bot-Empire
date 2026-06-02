const handler = async (m, { conn, participants }) => {
  if (!m.quoted) return conn.reply(m.chat, '⚠️ Responde a la lista.', m);

  let txt = m.quoted.text || m.quoted.caption || '';
  const lineas = txt.split('\n');
  
  // 1. Extraer todos los JIDs presentes en la lista citada para mantener las menciones
  let mentions = [];
  for (const p of participants) {
    const num = p.id.split('@')[0];
    if (txt.includes(num)) {
      mentions.push(p.id);
    }
  }

  // 2. Enumerar líneas manteniendo los usuarios
  let nuevoTexto = [];
  let contador = 1;

  for (let linea of lineas) {
    // Si la línea contiene un '@' y parece ser un usuario (no es un título de sección)
    // Usamos tu misma lógica: si contiene '@' y no es uno de tus encabezados fijos
    const esEncabezado = /✅|⏳|🪪|👑|AL DÍA|PENDIENTES|PERMISOS|ADMINISTRACIÓN/i.test(linea);
    
    if (linea.includes('@') && !esEncabezado) {
      nuevoTexto.push(`${contador}. ${linea.trim()}`);
      contador++;
    } else {
      nuevoTexto.push(linea);
    }
  }

  // 3. Enviar con las menciones extraídas correctamente
  return conn.sendMessage(
    m.chat,
    {
      text: nuevoTexto.join('\n').trim(),
      mentions: [...new Set(mentions)] // Pasamos el array limpio de JIDs
    },
    { quoted: m }
  );
};

handler.command = /^(enum)$/i;
handler.group = true;
handler.admin = true;

export default handler;
