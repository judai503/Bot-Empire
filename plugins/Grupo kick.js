const wm = `${global.botname} | ${global.owner?.[0]?.[1] || "Owner"}`;

const handler = async (m, { conn, command }) => {
  await m.react('⚡️');

  try {

    if (!m.isGroup) {
      return m.reply("⚠️ Este comando solo funciona en grupos.");
    }

    const user = m.mentionedJid?.[0] || m.quoted?.sender;

    if (!user) {
      return m.reply("⚠️ Debes mencionar o responder a un usuario.");
    }

    const actions = {
      kick: "kick",
      ban: "kick",
      alv: "kick"
    };

    const action = actions[command];
    if (!action) return;

    if (action === "kick") {

      await conn.groupParticipantsUpdate(
        m.chat,
        [user],
        "remove"
      );

      await m.react("🔴");

      return conn.sendMessage(m.chat, {
        text: `
╭━━━〔 🔴 USUARIO EXPULSADO 〕━━━⬣

┃ 👤 Usuario:
┃ ➜ @${user.split("@")[0]}
┃
┃ 💥 Estado:
┃ ➜ Ha sido expulsado del grupo
┃
┃ 👮‍♂️ Ejecutado por:
┃ ➜ @${m.sender.split("@")[0]}

╰━━━❍ ${wm}
`,
        mentions: [user, m.sender]
      }, { quoted: m });
    }

  } catch (error) {
    console.error("❌ Error:", error);
    await m.react("❌");
    return m.reply(`⚠️ Ocurrió un error:\n${error.message}`);
  }
};

handler.command = ["kick", "ban", "alv"];

handler.tags = ["grupo"];
handler.admin = true;
handler.group = true;

export default handler;
