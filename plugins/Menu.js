const wm = `${global.botname} | ${global.owner?.[0]?.[1] || "Owner"}`;

const handler = async (m, { conn }) => {

  await m.react('⚡️');

  try {

    const menu = `
╭━━━〔 ⚙️ ADMIN MENU 〕━━━⬣

┃ 🖼️ CONFIGURACIÓN
┃
┃ 「 .setpp 」
┃ ➜ Cambia la foto del grupo
┃    respondiendo a una imagen.
┃
┃ 「 .setname 」
┃ ➜ Permite cambiar el nombre actual
┃    del grupo por el texto que escribas.
┃
┃ 📌 Ejemplo:
┃ .setname Empire Community
┃
┃ 「 .setdescription 」
┃ ➜ Cambia la descripción
┃    actual del grupo.
┃
┃ 「 .description 」
┃ ➜ Muestra la descripción
┃    configurada del grupo.
┃

┃ 🔗 ENLACES
┃
┃ 「 .link / .l 」
┃ ➜ Obtiene el enlace actual
┃    de invitación del grupo.
┃
┃ 「 .newlink / .setlink / .nl 」
┃ ➜ Restablece y genera
┃    un nuevo enlace del grupo.
┃

┃ 🔓 CONTROL DEL GRUPO
┃
┃ 「 .grupo abrir 」
┃ 「 .abrirgrupo 」
┃ 「 .open / .abrir 」
┃ ➜ Abre el grupo para que
┃    todos puedan enviar mensajes.
┃
┃ 「 .grupo cerrar 」
┃ 「 .cerrargrupo 」
┃ 「 .close / .cerrar 」
┃ ➜ Cierra el grupo y solo
┃    los admins podrán escribir.
┃
┃ ➜ El comando mostrará quién
┃    abrió o cerró el grupo.
┃

┃ 👑 ADMINISTRADORES
┃
┃ 「 .promote 」
┃ 「 .daradmin 」
┃ 「 .darpoder 」
┃ ➜ Convierte al usuario
┃    mencionado en admin.
┃
┃ 「 .demote 」
┃ 「 .quitaradmin 」
┃ 「 .quitarpoder 」
┃ ➜ Quita los permisos
┃    de administrador.
┃

┃ 👑 MODERACIÓN
┃
┃ 「 .admins / .admis 」
┃ ➜ Etiqueta a todos los
┃    administradores del grupo.
┃
┃ 「 .del / .deleted / .d 」
┃ ➜ Elimina el mensaje
┃    respondido por el admin.
┃
┃ 「 .delall / .dall 」
┃ ➜ Elimina varios mensajes
┃    recientes del usuario respondido.
┃
┃ 「 .clean 」
┃ ➜ Limpia mensajes recientes
┃    enviados por el bot en el chat.
┃

┃ ⚡ INFORMACIÓN DEL BOT
┃
┃ 「 .ping 」
┃ ➜ Muestra la velocidad
┃    de respuesta del bot.
┃
┃ 「 .speed 」
┃ ➜ Enseña el tiempo de
┃    ejecución y rendimiento.
┃
┃ 「 .runtime 」
┃ ➜ Muestra cuánto tiempo
┃    lleva activo el bot.
┃
┃ 「 .uptime 」
┃ ➜ Indica el tiempo total
┃    encendido sin apagarse.
┃
┃ 「 .owner 」
┃ ➜ Envía el contacto
┃    del creador del bot.
┃
┃ 「 .menu / .men 」
┃ ➜ Muestra este panel
┃    completo de comandos.
┃

╰━━━❍ ${wm}
`;

    await m.react('📜');

    return conn.sendMessage(
      m.chat,
      {
        text: menu
      },
      { quoted: m }
    );

  } catch (error) {

    console.error("❌ Error:", error);

    await m.react('❌');

    return m.reply(
      `⚠️ Ocurrió un error:\n${error.message}`
    );
  }
};

handler.command = handler.help = [
  "menu",
  "men"
];

handler.tags = [
  "main"
];

export default handler;
