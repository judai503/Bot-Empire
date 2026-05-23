import { watchFile, unwatchFile } from 'fs' 
import chalk from 'chalk'
import { fileURLToPath } from 'url'
import fs from 'fs'

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*
// Empire-Bot | Creado por Tío Judai
//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

// ⚙️ PROPIETARIO Y STAFF
global.owner = [
  ['50360438371', 'Tío Judai 🔰', true]
];

global.mods = ['50360438371'];
global.suittag = ['50360438371'];
global.prems = ['50360438371'];

// 📚 INFORMACIÓN GENERAL
global.libreria = 'Baileys';
global.baileys = '@whiskeysockets/baileys';
global.nameqr = 'Empire-Bot';
global.namebot = 'Empire-Bot';
global.sessions = 'Sessions';
global.jadi = 'JadiBots';
global.pikaJadibts = true;

// ✨ DATOS DE ESTILO Y METADATOS
global.packname = '🧃 Empire-Bot MD';
global.botname = '⚡ Empire-Bot ⚡';
global.wm = 'Empire-MD';
global.dev = '© Desarrollado por Tío Judai';
global.textbot = 'Empire-Bot • Potenciado por Tío Judai';
global.etiqueta = 'Team Empire ⚡';

// 💰 MONEDA
global.moneda = 'empires';

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.catalogo = fs.readFileSync('./src/catalogo.jpg');
global.photoSity = [global.catalogo];

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.gp1 = 'https://chat.whatsapp.com/F8KwM3rVqkS9HhR5msoRqQ'; 
global.channel2 = 'https://whatsapp.com/channel/0029VayQwPsFnSzESZJ9Us3z'; 
global.md = 'https://github.com/tu-usuario/Empire-Bot'; 
global.correo = 'tu-email@gmail.com';
global.cn = 'https://whatsapp.com/channel/0029VayQwPsFnSzESZJ9Us3z';

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.estilo = { 
  key: { fromMe: false, participant: `0@s.whatsapp.net` }, 
  message: { 
    orderMessage: { 
      itemCount: 999999, 
      status: 1, 
      surface: 1, 
      message: global.packname, 
      orderTitle: 'Empire-Bot', 
      thumbnail: global.catalogo, 
      sellerJid: '0@s.whatsapp.net' 
    } 
  } 
};

global.ch = {
  ch1: '120363365444927738@newsletter',
};

// 🌐 APIS
global.MyApiRestBaseUrl = 'https://api.cafirexos.com';
global.MyApiRestApikey = 'BrunoSobrino';
global.keysZens = ['LuOlangNgentot', 'c2459db922', '37CC845916', '6fb0eff124'];
global.keysxteammm = ['29d4b59a4aa687ca', '5LTV57azwaid7dXfz5fzJu'];
global.lolkeysapi = ['kurumi'];

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.redBright("Se actualizó 'config.js'"))
  import(`${file}?update=${Date.now()}`)
})
