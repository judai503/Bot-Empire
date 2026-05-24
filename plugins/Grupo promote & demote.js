const wm = `${global.botname} | ${global.owner?.[0]?.[1] || "Owner"}`;

const handler = async (m, { conn, command, participants }) => {
  await m.react('⚡️');

  try {

    if (!m.isGroup) {
      return m.reply("⚠️ Este comando solo funciona en grupos.");
    }

    const group = await conn.groupMetadata(m.chat);

    // usuario objetivo (mencionado o reply)
    const user = m.mentionedJid?.[0] || m.quoted?.sender;

    if (!user) {
      return m.reply("⚠️ Debes mencionar o responder a un usuario.");
    }

    const actions = {
      // DAR ADMIN
      darpoder: "promote",
      promote: "promote",
      daradmin: "promote",

      // QUITAR ADMIN
      quitapoder: "demote",
      demote: "demote",
      quitaradmin: "demote"
    };

    const action = actions[command];
    if (!action) return;

    if (action === "promote") {

      await conn.groupParticipantsUpdate(
        m.chat,
        [user],
        "promote"
      );

      await m.react("🟢");

      return conn.sendMessage(m.chat, {
        text: `
╭━━━〔 🟢 USUARIO PROMOVIDO 〕━━━⬣

┃ 👤 Usuario:
┃ ➜ @${user.split("@")[0]}
┃
┃ ⚡ Estado:
┃ ➜ Ahora es ADMIN del grupo
┃
┃ 👮‍♂️ Ejecutado por:
┃ ➜ @${m.sender.split("@")[0]}

╰━━━❍ ${wm}
`,
        mentions: [user, m.sender]
      }, { quoted: m });
    }

    if (action === "demote") {

      await conn.groupParticipantsUpdate(
        m.chat,
        [user],
        "demote"
      );

      await m.react("🔴");

      return conn.sendMessage(m.chat, {
        text: `
╭━━━〔 🔴 ADMIN REMOVIDO 〕━━━⬣

┃ 👤 Usuario:
┃ ➜ @${user.split("@")[0]}
┃
┃ ⚡ Estado:
┃ ➜ Ya NO es admin
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

handler.command = [
  "darpoder", "promote", "daradmin",
  "quitapoder", "demote", "quitaradmin"
];

handler.tags = ["grupo"];
handler.admin = true;
handler.group = true;

export default handler;
