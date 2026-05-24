
const wm = `${global.botname} | ${global.ownername}`;

const handler = async (m, { conn, command, text }) => {

  await m.react('⚡️');

  try {

    // Verificar grupo
    if (!m.isGroup) {
      return m.reply(
        "⚠️ Este comando solo funciona en grupos."
      );
    }

    // Metadata grupo
    const group = await conn.groupMetadata(m.chat);

    // =========================
    // SETPP
    // =========================
    if (["setpp"].includes(command)) {

      const q = m.quoted || m;
      const mime = q.mimetype || "";

      if (!/image/.test(mime)) {
        return m.reply(
          "⚠️ Responde a una imagen."
        );
      }

      const media = await q.download();

      await conn.updateProfilePicture(
        m.chat,
        media
      );

      await m.react('🖼️');

      return conn.sendMessage(
        m.chat,
        {
          text: `
╭──〔 🖼️ Foto Actualizada 〕──╮

> La foto del grupo fue cambiada correctamente.

╰─❍ ${wm}
`
        },
        { quoted: m }
      );
    }

    // =========================
    // SETNAME
    // =========================
    if (["setname"].includes(command)) {

      if (!text) {
        return m.reply(
          "⚠️ Ingresa el nuevo nombre."
        );
      }

      await conn.groupUpdateSubject(
        m.chat,
        text
      );

      await m.react('✏️');

      return conn.sendMessage(
        m.chat,
        {
          text: `
╭──〔 ✏️ Nombre Actualizado 〕──╮

> ${text}

╰─❍ ${wm}
`
        },
        { quoted: m }
      );
    }

    // =========================
    // LINK
    // =========================
    if (["link", "l"].includes(command)) {

      const code = await conn.groupInviteCode(m.chat);

      await m.react('🔗');

      return conn.sendMessage(
        m.chat,
        {
          text: `
╭──〔 🔗 Link del Grupo 〕──╮

> https://chat.whatsapp.com/${code}

╰─❍ ${wm}
`
        },
        { quoted: m }
      );
    }

    // =========================
    // NEWLINK
    // =========================
    if (["newlink", "setlink", "nl"].includes(command)) {

      await conn.groupRevokeInvite(m.chat);

      const code = await conn.groupInviteCode(m.chat);

      await m.react('♻️');

      return conn.sendMessage(
        m.chat,
        {
          text: `
╭──〔 ♻️ Link Restablecido 〕──╮

> https://chat.whatsapp.com/${code}

╰─❍ ${wm}
`
        },
        { quoted: m }
      );
    }

    // =========================
    // SETDESCRIPTION
    // =========================
    if (["setdescription"].includes(command)) {

      if (!text) {
        return m.reply(
          "⚠️ Ingresa la nueva descripción."
        );
      }

      await conn.groupUpdateDescription(
        m.chat,
        text
      );

      await m.react('📄');

      return conn.sendMessage(
        m.chat,
        {
          text: `
╭──〔 📄 Descripción Actualizada 〕──╮

> ${text}

╰─❍ ${wm}
`
        },
        { quoted: m }
      );
    }

    // =========================
    // DESCRIPTION
    // =========================
    if (["description"].includes(command)) {

      const desc =
        group.desc || "Este grupo no tiene descripción.";

      await m.react('📄');

      return conn.sendMessage(
        m.chat,
        {
          text: `
╭──〔 📄 Descripción del Grupo 〕──╮

> ${desc}

╰─❍ ${wm}
`
        },
        { quoted: m }
      );
    }

    // =========================
    // ADMINS
    // =========================
    if (["admis", "admins"].includes(command)) {

      const admins = group.participants
        .filter(p => p.admin);

      let teks = `
╭──〔 👑 Lista de Admins 〕──╮

`;

      for (const adm of admins) {

        teks += `> 👑 @${adm.id.split("@")[0]}\n`;

      }

      teks += `
╰─❍ ${wm}
`;

      await m.react('👑');

      return conn.sendMessage(
        m.chat,
        {
          text: teks,
          mentions: admins.map(a => a.id)
        },
        { quoted: m }
      );
    }

    // =========================
    // DEL
    // =========================
    if (["del", "deleted", "d"].includes(command)) {

      if (!m.quoted) {
        return m.reply(
          "⚠️ Responde al mensaje."
        );
      }

      await conn.sendMessage(
        m.chat,
        {
          delete: {
            remoteJid: m.chat,
            fromMe: false,
            id: m.quoted.id,
            participant: m.quoted.sender
          }
        }
      );

      await m.react('🗑️');

      return conn.sendMessage(
        m.chat,
        {
          text: `
╭──〔 🗑️ Mensaje Eliminado 〕──╮

> El mensaje fue eliminado correctamente.

╰─❍ ${wm}
`
        },
        { quoted: m }
      );
    }

    // =========================
    // DEL ALL
    // =========================
    if (
      ["dall", "deletedall", "delall"].includes(
        command.replace(/\s+/g, "")
      )
    ) {

      if (!m.quoted) {
        return m.reply(
          "⚠️ Responde a un mensaje."
        );
      }

      await m.react('🧹');

      for (let i = 0; i < 10; i++) {

        try {

          await conn.sendMessage(
            m.chat,
            {
              delete: {
                remoteJid: m.chat,
                fromMe: false,
                id: m.quoted.id,
                participant: m.quoted.sender
              }
            }
          );

        } catch {}
      }

      return conn.sendMessage(
        m.chat,
        {
          text: `
╭──〔 🧹 Limpieza Realizada 〕──╮

> Se intentaron eliminar mensajes del usuario.

╰─❍ ${wm}
`
        },
        { quoted: m }
      );
    }

    // =========================
    // CLEAN
    // =========================
    if (["clean"].includes(command)) {

      await m.react('🧹');

      return conn.sendMessage(
        m.chat,
        {
          text: `
╭──〔 🧹 Limpieza del Chat 〕──╮

> WhatsApp no permite eliminar mensajes antiguos automáticamente.
> Solo pueden borrarse mensajes específicos respondidos.

╰─❍ ${wm}
`
        },
        { quoted: m }
      );
    }

  } catch (error) {

    console.error(error);

    await m.react('❌');

    return m.reply(
      `⚠️ Ocurrió un error:\n${error.message}`
    );
  }
};

handler.command = handler.help = [
  "setpp",
  "setname",
  "link",
  "l",
  "newlink",
  "setlink",
  "nl",
  "setdescription",
  "description",
  "admis",
  "admins",
  "del",
  "deleted",
  "d",
  "dall",
  "deletedall",
  "delall",
  "clean"
];

handler.tags = ["grupo"];

handler.admin = true;

export default handler;
