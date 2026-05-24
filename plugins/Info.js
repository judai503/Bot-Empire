import os from "os";
import speed from "performance-now";

const wm = `${global.botname} | ${global.owner?.[0]?.[1] || "Owner"}`;

const handler = async (m, { conn, command }) => {

  await m.react('⚡️');

  try {

    // =========================
    // PING / SPEED
    // =========================
    if (["ping", "speed"].includes(command)) {

      const old = speed();
      const neww = speed();

      const latency = (neww - old).toFixed(4);

      const teks = `
╭━━━〔 ⚡ VELOCIDAD 〕━━━⬣

┃ 🚀 Estado del sistema
┃ ➜ Online y estable
┃
┃ ⚡ Velocidad:
┃ ➜ ${latency} ms
┃
┃ 🧠 Plataforma:
┃ ➜ ${os.platform()}
┃
┃ 💻 Servidor:
┃ ➜ ${os.hostname()}
┃

╰━━━❍ ${wm}
`;

      await m.react('🚀');

      return conn.sendMessage(
        m.chat,
        { text: teks },
        { quoted: m }
      );
    }

    // =========================
    // RUNTIME / UPTIME
    // =========================
    if (["runtime", "uptime"].includes(command)) {

      const runtime = process.uptime();

      const days = Math.floor(runtime / 86400);
      const hours = Math.floor(runtime / 3600) % 24;
      const minutes = Math.floor(runtime / 60) % 60;
      const seconds = Math.floor(runtime) % 60;

      const teks = `
╭━━━〔 ⏳ RUNTIME 〕━━━⬣

┃ 🤖 Tiempo activo:
┃ ➜ ${days}d ${hours}h ${minutes}m ${seconds}s
┃
┃ ⚡ Estado:
┃ ➜ Funcionando correctamente
┃

╰━━━❍ ${wm}
`;

      await m.react('⏳');

      return conn.sendMessage(
        m.chat,
        { text: teks },
        { quoted: m }
      );
    }

    // =========================
    // CPU
    // =========================
    if (["cpu"].includes(command)) {

      const cpus = os.cpus();

      const teks = `
╭━━━〔 🧠 CPU INFO 〕━━━⬣

┃ 💻 Modelo:
┃ ➜ ${cpus[0].model}
┃
┃ ⚙️ Núcleos:
┃ ➜ ${cpus.length}
┃
┃ 🚀 Velocidad:
┃ ➜ ${cpus[0].speed} MHz
┃

╰━━━❍ ${wm}
`;

      await m.react('🧠');

      return conn.sendMessage(
        m.chat,
        { text: teks },
        { quoted: m }
      );
    }

    // =========================
    // RAM
    // =========================
    if (["ram"].includes(command)) {

      const total = formatBytes(os.totalmem());
      const free = formatBytes(os.freemem());
      const used = formatBytes(
        os.totalmem() - os.freemem()
      );

      const teks = `
╭━━━〔 💾 RAM INFO 〕━━━⬣

┃ 💾 RAM Total:
┃ ➜ ${total}
┃
┃ 📉 RAM Usada:
┃ ➜ ${used}
┃
┃ 📈 RAM Libre:
┃ ➜ ${free}
┃

╰━━━❍ ${wm}
`;

      await m.react('💾');

      return conn.sendMessage(
        m.chat,
        { text: teks },
        { quoted: m }
      );
    }

    // =========================
    // OWNER
    // =========================
    if (["owner", "creator"].includes(command)) {

      const owner = global.owner?.[0]?.[0] || "";

      const teks = `
╭━━━〔 👑 OWNER 〕━━━⬣

┃ 👑 Propietario:
┃ ➜ ${global.owner?.[0]?.[1]}
┃
┃ 📞 Número:
┃ ➜ wa.me/${owner}
┃

╰━━━❍ ${wm}
`;

      await m.react('👑');

      return conn.sendMessage(
        m.chat,
        {
          text: teks
        },
        { quoted: m }
      );
    }

    // =========================
    // SCRIPT
    // =========================
    if (["script", "sc"].includes(command)) {

      const teks = `
╭━━━〔 📂 SCRIPT 〕━━━⬣

┃ 🔗 Repositorio:
┃ ➜ ${global.md || "No configurado"}
┃

╰━━━❍ ${wm}
`;

      await m.react('📂');

      return conn.sendMessage(
        m.chat,
        { text: teks },
        { quoted: m }
      );
    }

    // =========================
    // STATUS
    // =========================
    if (["status", "estado"].includes(command)) {

      const teks = `
╭━━━〔 📡 ESTADO 〕━━━⬣

┃ 🤖 Bot:
┃ ➜ Online
┃
┃ ⚡ Sistema:
┃ ➜ Estable
┃
┃ 🌐 Plataforma:
┃ ➜ ${os.platform()}
┃

╰━━━❍ ${wm}
`;

      await m.react('📡');

      return conn.sendMessage(
        m.chat,
        { text: teks },
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
  "ping",
  "speed",
  "runtime",
  "uptime",
  "cpu",
  "ram",
  "owner",
  "creator",
  "script",
  "sc",
  "status",
  "estado"
];

handler.tags = [
  "system"
];

export default handler;

function formatBytes(bytes) {

  if (bytes === 0) return "0 Bytes";

  const sizes = [
    "Bytes",
    "KB",
    "MB",
    "GB",
    "TB"
  ];

  const i = parseInt(
    Math.floor(
      Math.log(bytes) / Math.log(1024)
    )
  );

  return (
    Math.round(
      bytes / Math.pow(1024, i),
      2
    ) +
    " " +
    sizes[i]
  );
}
