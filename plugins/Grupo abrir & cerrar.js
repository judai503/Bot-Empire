const wm = `${global.botname} | ${global.owner?.[0]?.[1] || "Owner"}`;

const handler = async (m, { conn, command }) => {

  await m.react('⚡️');

  try {

    // Verificar grupo
    if (!m.isGroup) {
      return m.reply(
        "⚠️ Este comando solo funciona en grupos."
      );
    }

    // Obtener metadata
    const group = await conn.groupMetadata(m.chat);

    // =========================
    // ABRIR GRUPO
    // =========================
    if ([
      "grupoabrir",
      "abrirgrupo",
      "open",
      "abrir"
    ].includes(command)) {

      await conn.groupSettingUpdate(
        m.chat,
        "not_announcement"
      );

      await m.react('🟢');

      return conn.sendMessage(
        m.chat,
        {
          text: `
╭━━━〔 🟢 GRUPO ABIERTO 〕━━━⬣

┃ ➜ Ahora todos los miembros
┃    pueden enviar mensajes.
┃
┃ 👤 Acción realizada por:
┃ ➜ @${m.sender.split("@")[0]}
┃

╰━━━❍ ${wm}
`,
          mentions: [m.sender]
        },
        { quoted: m }
      );
    }

    // =========================
    // CERRAR GRUPO
    // =========================
    if ([
      "grupocerrar",
      "cerrargrupo",
      "closer",
      "cerrar"
    ].includes(command)) {

      await conn.groupSettingUpdate(
        m.chat,
        "announcement"
      );

      await m.react('🔒');

      return conn.sendMessage(
        m.chat,
        {
          text: `
╭━━━〔 🔒 GRUPO CERRADO 〕━━━⬣

┃ ➜ Solo los administradores
┃    pueden enviar mensajes.
┃
┃ 👤 Acción realizada por:
┃ ➜ @${m.sender.split("@")[0]}
┃

╰━━━❍ ${wm}
`,
          mentions: [m.sender]
        },
        { quoted: m }
      );
    }

  } catch (error) {

    console.error("❌ Error:", error);

    await m.react('❌');

    return m.reply(
      `⚠️ Ocurrió un error:\n${error.message}`
    );
  }
};

handler.command = handler.help = [
  "grupoabrir",
  "abrirgrupo",
  "open",
  "abrir",
  "grupocerrar",
  "cerrargrupo",
  "closer",
  "cerrar"
];

handler.tags = [
  "grupo"
];

handler.admin = true;
handler.group = true;

export default handler;
