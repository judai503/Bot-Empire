const handler = async (m, { conn, usedPrefix, command, args }) => {

  const chat = global.db.data.chats[m.chat];

  await m.react('⚡️');

  try {

    // =========================
    // SOLO GRUPOS
    // =========================
    if (!m.isGroup) {
      return m.reply("⚠️ Este comando solo funciona en grupos.");
    }

    // =========================
    // 🔥 BYPASS ADMIN REAL (ESTILO TU OTRO COMANDO)
    // =========================
    const group = await conn.groupMetadata(m.chat);

    const isAdmin = group.participants
      .filter(p => p.admin)
      .map(p => p.id)
      .includes(m.sender);

    if (!isAdmin) {
      return m.reply("⚠️ Solo administradores pueden usar esto.");
    }

    let type = command.toLowerCase();
    let isEnable;

    // =========================
    // ON / OFF SYSTEM
    // =========================
    if (args[0] === "on" || args[0] === "enable") {
      isEnable = true;
    } else if (args[0] === "off" || args[0] === "disable") {
      isEnable = false;
    } else {

      const estado = chat[type] ? "🟢 ACTIVADO" : "🔴 DESACTIVADO";

      return conn.reply(m.chat, `
╭━━━〔 ⚙️ CONFIGURADOR 〕━━━⬣

┃ 🧩 Función: ${type}
┃ 🎛 Estado actual: ${estado}

┃ ⚙️ Uso:
┃ • ${usedPrefix}${command} on
┃ • ${usedPrefix}${command} off

╰━━━❍ Sistema del bot
`, m);
    }

    // =========================
    // SWITCH CENTRAL
    // =========================
    const actions = {

      welcome: () => chat.welcome = isEnable,
      bv: () => chat.welcome = isEnable,
      bienvenida: () => chat.welcome = isEnable,

      antisubbots: () => chat.antiBot2 = isEnable,
      antisub: () => chat.antiBot2 = isEnable,
      antisubot: () => chat.antiBot2 = isEnable,
      antibot2: () => chat.antiBot2 = isEnable,

      modoadmin: () => chat.modoadmin = isEnable,
      soloadmin: () => chat.modoadmin = isEnable,

      reaction: () => chat.reaction = isEnable,
      reaccion: () => chat.reaction = isEnable,
      emojis: () => chat.reaction = isEnable,

      nsfw: () => chat.nsfw = isEnable,
      nsfwhot: () => chat.nsfw = isEnable,
      nsfwhorny: () => chat.nsfw = isEnable,

      detect: () => chat.detect = isEnable,
      avisos: () => chat.detect = isEnable,

      detect2: () => chat.detect2 = isEnable,
      eventos: () => chat.detect2 = isEnable,

      antilink: () => chat.antiLink = isEnable,
      antilink2: () => chat.antiLink2 = isEnable
    };

    // =========================
    // VALIDACIÓN
    // =========================
    if (!actions[type]) {
      return m.reply("⚠️ Función no soportada.");
    }

    // =========================
    // EJECUTAR CAMBIO
    // =========================
    actions[type]();

    await m.react(isEnable ? "🟢" : "🔴");

    return conn.sendMessage(m.chat, {
      text: `
╭━━━〔 ⚙️ CONFIGURACIÓN 〕━━━⬣

┃ 🧩 Función: ${type}
┃ 🎛 Estado: ${isEnable ? "🟢 ACTIVADO" : "🔴 DESACTIVADO"}
┃ 👤 Usuario: @${m.sender.split("@")[0]}

╰━━━❍ Sistema del bot
`,
      mentions: [m.sender]
    }, { quoted: m });

  } catch (error) {

    console.error("❌ Error config:", error);

    await m.react('❌');

    return m.reply(`⚠️ Ocurrió un error:\n${error.message}`);
  }
};

handler.command = [
  "welcome","bv","bienvenida",
  "antisubbots","antisub","antisubot","antibot2",
  "modoadmin","soloadmin",
  "reaction","reaccion","emojis",
  "nsfw","nsfwhot","nsfwhorny",
  "detect","avisos","detect2","eventos",
  "antilink","antilink2"
];

handler.tags = ["group", "settings"];

export default handler;
