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

┃ ⚙️ CONFIGURACIÓN DEL SISTEMA
┃
┃ 「 .welcome on/off 」
┃ ➜ Activa o desactiva el sistema
┃    de bienvenida en el grupo.
┃
┃ 「 .bv / .bienvenida 」
┃ ➜ Alias de welcome (mismo sistema).
┃
┃ 「 .antilink on/off 」
┃ ➜ Bloquea enlaces dentro del grupo
┃    para evitar spam.
┃
┃ 「 .antilink2 on/off 」
┃ ➜ Sistema anti-links más estricto
┃    (detección avanzada).
┃
┃ 「 .reaction on/off 」
┃ ➜ Activa o desactiva reacciones
┃    automáticas del bot.
┃
┃ 「 .detect on/off 」
┃ ➜ Detecta eventos del grupo
┃    como entradas y salidas.
┃
┃ 「 .detect2 / .eventos 」
┃ ➜ Sistema avanzado de eventos
┃    del grupo.
┃
┃ 「 .nsfw on/off 」
┃ ➜ Activa o desactiva contenido
┃    +18 (NSFW).
┃
┃ 「 .modoadmin on/off 」
┃ ➜ Solo administradores pueden
┃    interactuar con el bot.
┃
┃ 「 .antisubbots on/off 」
┃ ➜ Bloquea sub-bots o bots externos
┃    en el grupo.
┃
┃ 「 .soloadmin 」
┃ ➜ Alias de modo admin.
┃
┃ 「 .config 」
┃ ➜ 📊 Muestra el estado completo del sistema
┃    con todos los módulos activados o desactivados.
┃
┃    • welcome: 🟢 / 🔴
┃    • antilink: 🟢 / 🔴
┃    • nsfw: 🟢 / 🔴
┃    • reaction: 🟢 / 🔴
┃
┃    Sirve como panel general del bot.
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

┃ 🏥 CUARENTENA
┃
┃ 「 .cuarentena 」
┃ ➜ Registra usuarios mencionados
┃    en cuarentena para este grupo.
┃
┃ 「 .internados 」
┃ ➜ Muestra los usuarios
┃    actualmente en cuarentena.
┃
┃ 「 .delcuarentena 」
┃ ➜ Elimina la cuarentena
┃    almacenada del grupo.
┃
┃ 🔒 Solo admins.
┃ 📂 Datos guardados por grupo.
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
      { text: menu },
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
