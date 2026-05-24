import { WAMessageStubType } from '@whiskeysockets/baileys'

export async function before(m, { conn, participants = [], groupMetadata }) {

  if (!m.isGroup) return;
  if (!m.messageStubType) return;

  const chat = global.db?.data?.chats?.[m.chat];
  if (!chat?.welcome) return;

  const who = m.messageStubParameters?.[0];
  if (!who) return;

  const taguser = `@${who.split("@")[0]}`;
  const totalMembers = participants.length || 0;

  const date = new Date().toLocaleString("es-ES", {
    timeZone: "America/Mexico_City"
  });

  const groupName = groupMetadata?.subject || "Grupo";
  const desc = groupMetadata?.desc || "Sin descripción disponible";

  // =========================
  // 🔥 FOTO DE PERFIL FIX REAL
  // =========================
  let ppUser;
  try {
    ppUser = await conn.profilePictureUrl(who, "image");
    if (!ppUser) throw new Error("no pp");
  } catch {
    // fallback REAL que nunca falla
    ppUser = "https://telegra.ph/file/1f5c3f7d8c9a1b2c3d4e5.jpg";
  }

  const bienvenidaRnd = [
    "¡Bienvenido al grupo!",
    "Un nuevo miembro ha llegado",
    "Disfruta tu estancia",
    "Que empiece la charla"
  ][Math.floor(Math.random() * 4)];

  const despedidaRnd = [
    "El usuario ha salido del grupo",
    "Hasta luego",
    "Un miembro se fue",
    "Suerte en tu camino"
  ][Math.floor(Math.random() * 4)];

  // =========================
  // 👋 ENTRADA
  // =========================
  if (m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_ADD) {

    return conn.sendMessage(m.chat, {
      image: { url: ppUser },
      caption: `
╭━━━〔 👋 BIENVENIDO/A 〕━━━⬣

┃ 👤 Usuario: ${taguser}
┃ 💬 Grupo: ${groupName}
┃ 📌 Descripción: ${desc}
┃ 👥 Miembros: ${totalMembers}
┃ 📅 Fecha: ${date}

┃ ⚡ Mensaje: ${bienvenidaRnd}

╰━━━❍ Sistema
`.trim(),
      mentions: [who]
    });
  }

  // =========================
  // 👋 SALIDA
  // =========================
  if (
    m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_LEAVE ||
    m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_REMOVE
  ) {

    return conn.sendMessage(m.chat, {
      image: { url: ppUser },
      caption: `
╭━━━〔 👋 DESPEDIDA 〕━━━⬣

┃ 👤 Usuario: ${taguser}
┃ 💬 Grupo: ${groupName}
┃ 👥 Miembros: ${totalMembers - 1}
┃ 📅 Fecha: ${date}

┃ ⚡ Mensaje: ${despedidaRnd}

╰━━━❍ Sistema
`.trim(),
      mentions: [who]
    });
  }
}
