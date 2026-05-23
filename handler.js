import { smsg } from './lib/simple.js'
import { format } from 'util' 
import { fileURLToPath } from 'url'
import path, { join } from 'path'
import { unwatchFile, watchFile } from 'fs'
import chalk from 'chalk'
import fetch from 'node-fetch'
import getMensajeSistema from './lib/msmwarning.js'

const { proto } = (await import('@whiskeysockets/baileys')).default
const isNumber = x => typeof x === 'number' && !isNaN(x)
const delay = ms => isNumber(ms) && new Promise(resolve => setTimeout(function () {
clearTimeout(this)
resolve()
}, ms))

export async function handler(chatUpdate) {
this.msgqueque = this.msgqueque || []
this.uptime = this.uptime || Date.now()
if (!chatUpdate) return
this.pushMessage(chatUpdate.messages).catch(console.error)
let m = chatUpdate.messages[chatUpdate.messages.length - 1]
if (!m) return;
if (global.db.data == null) await global.loadDatabase()       
try {
m = smsg(this, m) || m
if (!m) return
m.exp = 0
m.coin = false
try {
let user = global.db.data.users[m.sender]
if (typeof user !== 'object') global.db.data.users[m.sender] = {}
if (user) {
if (!isNumber(user.exp)) user.exp = 0
if (!isNumber(user.coin)) user.coin = 10
if (!isNumber(user.joincount)) user.joincount = 1
if (!isNumber(user.diamond)) user.diamond = 3
if (!isNumber(user.lastadventure)) user.lastadventure = 0
if (!isNumber(user.lastclaim)) user.lastclaim = 0
if (!isNumber(user.health)) user.health = 100
if (!isNumber(user.crime)) user.crime = 0
if (!isNumber(user.lastcofre)) user.lastcofre = 0
if (!isNumber(user.lastdiamantes)) user.lastdiamantes = 0
if (!isNumber(user.lastpago)) user.lastpago = 0
if (!isNumber(user.lastcode)) user.lastcode = 0
if (!isNumber(user.lastcodereg)) user.lastcodereg = 0
if (!isNumber(user.lastduel)) user.lastduel = 0
if (!isNumber(user.lastmining)) user.lastmining = 0
if (!('muto' in user)) user.muto = false
if (!('premium' in user)) user.premium = false
if (!user.premium) user.premiumTime = 0
if (!('registered' in user)) user.registered = false
if (!('genre' in user)) user.genre = ''
if (!('birth' in user)) user.birth = ''
if (!('marry' in user)) user.marry = ''
if (!('description' in user)) user.description = ''
if (!('packstickers' in user)) user.packstickers = null
if (!user.registered) {
if (!('name' in user)) user.name = m.name
if (!isNumber(user.age)) user.age = -1
if (!isNumber(user.regTime)) user.regTime = -1
}
if (!isNumber(user.afk)) user.afk = -1
if (!('afkReason' in user)) user.afkReason = ''
if (!('role' in user)) user.role = 'Nuv'
if (!('banned' in user)) user.banned = false
if (!('useDocument' in user)) user.useDocument = false
if (!isNumber(user.level)) user.level = 0
if (!isNumber(user.bank)) user.bank = 0
if (!isNumber(user.warn)) user.warn = 0
} else global.db.data.users[m.sender] = {
exp: 0, coin: 10, joincount: 1, diamond: 3, lastadventure: 0, health: 100, lastclaim: 0, lastcofre: 0, lastdiamantes: 0, lastcode: 0, lastduel: 0, lastpago: 0, lastmining: 0, lastcodereg: 0, muto: false, registered: false, genre: '', birth: '', marry: '', description: '', packstickers: null, name: m.name, age: -1, regTime: -1, afk: -1, afkReason: '', banned: false, useDocument: false, bank: 0, level: 0, role: 'Nuv', premium: false, premiumTime: 0, }
let chat = global.db.data.chats[m.chat]
if (typeof chat !== 'object') global.db.data.chats[m.chat] = {}
if (chat) {
if (!('isBanned' in chat)) chat.isBanned = false
if (!('sAutoresponder' in chat)) chat.sAutoresponder = ''
if (!('welcome' in chat)) chat.welcome = false
if (!('autolevelup' in chat)) chat.autolevelup = false
if (!('autoAceptar' in chat)) chat.autoAceptar = false
if (!('autosticker' in chat)) chat.autosticker = false
if (!('autoRechazar' in chat)) chat.autoRechazar = false
if (!('autoresponder' in chat)) chat.autoresponder = false
if (!('detect' in chat)) chat.detect = true
if (!('economy' in chat)) chat.economy = true
if (!('gacha' in chat)) chat.gacha = true
if (!('antiBot' in chat)) chat.antiBot = false
if (!('antiBot2' in chat)) chat.antiBot2 = false
if (!('modoadmin' in chat)) chat.modoadmin = false   
if (!('antiLink' in chat)) chat.antiLink = true
if (!('reaction' in chat)) chat.reaction = false
if (!('nsfw' in chat)) chat.nsfw = false
if (!('antifake' in chat)) chat.antifake = false
if (!('delete' in chat)) chat.delete = false
if (!isNumber(chat.expired)) chat.expired = 0
} else global.db.data.chats[m.chat] = { isBanned: false, sAutoresponder: '', welcome: false, autolevelup: false, autoresponder: false, delete: false, autoAceptar: false, autoRechazar: false, detect: true, economy: true, gacha: true, antiBot: false, antiBot2: false, modoadmin: false, antiLink: true, antifake: false, reaction: false, nsfw: false, expired: 0 }
var settings = global.db.data.settings[this.user.jid]
if (typeof settings !== 'object') global.db.data.settings[this.user.jid] = {}
if (settings) {
if (!('self' in settings)) settings.self = false
if (!('restrict' in settings)) settings.restrict = true
if (!('jadibotmd' in settings)) settings.jadibotmd = true
if (!('antiPrivate' in settings)) settings.antiPrivate = false
if (!('autoread' in settings)) settings.autoread = false
} else global.db.data.settings[this.user.jid] = { self: false, restrict: true, jadibotmd: true, antiPrivate: false, autoread: false, status: 0 }
} catch (e) { console.error(e) }

if (opts['nyimak']) return
if (!m.fromMe && opts['self']) return
if (opts['swonly'] && m.chat !== 'status@broadcast') return
if (typeof m.text !== 'string') m.text = ''
let _user = global.db.data && global.db.data.users && global.db.data.users[m.sender]
const detectwhat = m.sender.includes('@lid') ? '@lid' : '@s.whatsapp.net';
const isROwner = [...global.owner.map(([number]) => number)].map(v => v.replace(/[^0-9]/g, '') + detectwhat).includes(m.sender)
const isOwner = isROwner || m.fromMe
const isMods = isOwner || global.mods.map(v => v.replace(/[^0-9]/g, '') + detectwhat).includes(m.sender)
const isPrems = isROwner || global.db.data.users[m.sender].premiumTime > 0

if (m.isBaileys) return
if (opts['queque'] && m.text && !(isMods || isPrems)) {
let queque = this.msgqueque, time = 1000 * 5
const previousID = queque[queque.length - 1]
queque.push(m.id || m.key.id)
setInterval(async function () {
if (queque.indexOf(previousID) === -1) clearInterval(this)
await delay(time)
}, time)
}
m.exp += Math.ceil(Math.random() * 10)

let usedPrefix
const senderJid = m.sender
const botJid = conn.user.jid
const groupMetadata = m.isGroup ? ((conn.chats[m.chat] || {}).metadata || await this.groupMetadata(m.chat).catch(_ => null)) : {}
const participants = m.isGroup ? (groupMetadata.participants || []) : []
const user = participants.find(p => p.id === senderJid) || {}
const bot = participants.find(p => p.id === botJid) || {}
const isRAdmin = user?.admin === "superadmin"
const isAdmin = isRAdmin || user?.admin === "admin"
const isBotAdmin = !!bot?.admin

const ___dirname = path.join(path.dirname(fileURLToPath(import.meta.url)), './plugins')
for (let name in global.plugins) {
let plugin = global.plugins[name]
if (!plugin || plugin.disabled) continue
const __filename = join(___dirname, name)
if (typeof plugin.all === 'function') {
try { await plugin.all.call(this, m, { chatUpdate, __dirname: ___dirname, __filename }) } catch (e) { console.error(e) }
}
if (!opts['restrict'] && plugin.tags && plugin.tags.includes('admin')) continue

// RESTRICCIÓN DE PREFIJOS: Solo . / !
const match = m.text.match(/^[./!]/)
usedPrefix = match ? match[0] : ''

if (typeof plugin.before === 'function') {
if (await plugin.before.call(this, m, { match: [usedPrefix, usedPrefix], conn: this, participants, groupMetadata, user, bot, isROwner, isOwner, isRAdmin, isAdmin, isBotAdmin, isPrems, chatUpdate, __dirname: ___dirname, __filename })) continue
}
if (typeof plugin !== 'function') continue
if (usedPrefix) {
let noPrefix = m.text.replace(usedPrefix, '')
let [command, ...args] = noPrefix.trim().split` `.filter(v => v)
command = (command || '').toLowerCase()
let fail = plugin.fail || global.dfail
let isAccept = plugin.command instanceof RegExp ? plugin.command.test(command) : Array.isArray(plugin.command) ? plugin.command.some(cmd => cmd instanceof RegExp ? cmd.test(command) : cmd === command) : typeof plugin.command === 'string' ? plugin.command === command : false

if (!isAccept) continue
m.plugin = name
if (m.chat in global.db.data.chats || m.sender in global.db.data.users) {
let chat = global.db.data.chats[m.chat]
let user = global.db.data.users[m.sender]
if (!['grupo-unbanchat.js'].includes(name) && chat && chat.isBanned && !isROwner) return
if (m.text && user.banned && !isROwner) {
m.reply(`《✦》Estas baneado/a, no puedes usar comandos en este bot!\n\n${user.bannedReason ? `✰ *Motivo:* ${user.bannedReason}` : '✰ *Motivo:* Sin Especificar'}`)
return
}
}
let adminMode = global.db.data.chats[m.chat].modoadmin
if (adminMode && !isOwner && !isROwner && m.isGroup && !isAdmin) return   
if (plugin.rowner && plugin.owner && !(isROwner || isOwner)) { fail('owner', m, this); continue }
if (plugin.rowner && !isROwner) { fail('rowner', m, this); continue }
if (plugin.owner && !isOwner) { fail('owner', m, this); continue }
if (plugin.mods && !isMods) { fail('mods', m, this); continue }
if (plugin.premium && !isPrems) { fail('premium', m, this); continue }
if (plugin.group && !m.isGroup) { fail('group', m, this); continue }
if (plugin.botAdmin && !isBotAdmin) { fail('botAdmin', m, this); continue }
if (plugin.admin && !isAdmin) { fail('admin', m, this); continue }
if (plugin.register == true && _user.registered == false) { fail('unreg', m, this); continue }
if (plugin.private && m.isGroup) { fail('private', m, this); continue }

m.isCommand = true
let xp = 'exp' in plugin ? parseInt(plugin.exp) : 17 
m.exp += xp
let extra = { usedPrefix, noPrefix, args, command, text: args.join(' '), conn: this, participants, groupMetadata, user, bot, isROwner, isOwner, isRAdmin, isAdmin, isBotAdmin, isPrems, chatUpdate, __dirname: ___dirname, __filename }
try {
await plugin.call(this, m, extra)
} catch (e) { m.error = e; console.error(e); m.reply(format(e)) }
break
}}
} catch (e) { console.error(e) } finally {
if (opts['queque'] && m.text) {
const quequeIndex = this.msgqueque.indexOf(m.id || m.key.id)
if (quequeIndex !== -1) this.msgqueque.splice(quequeIndex, 1)
}
let user, stats = global.db.data.stats
if (m && m.sender && (user = global.db.data.users[m.sender])) {
user.exp += m.exp
user.coin -= m.coin * 1
}
try { if (!opts['noprint']) await (await import(`./lib/print.js`)).default(m, this) } catch (e) { console.log(m, e) }
let settingsREAD = global.db.data.settings[this.user.jid] || {}  
if (opts['autoread']) await this.readMessages([m.key])
if (db.data.chats[m.chat].reaction && m.text.match(/(Empire|bot|a|s)/gi)) {
let emot = ["🍟", "😃", "🔥", "⚡", "✨", "👑"].getRandom()
if (!m.fromMe) return this.sendMessage(m.chat, { react: { text: emot, key: m.key }})
}
}}

global.dfail = (type, m, conn) => {
  let msg = { rowner: 'Solo el dueño.', owner: 'Solo el dueño.', mods: 'Solo moderadores.', premium: 'Solo usuarios premium.', group: 'Solo en grupos.', private: 'Solo en privado.', admin: 'Solo administradores.', botAdmin: 'Necesito ser administrador.', unreg: 'Registrate con .reg', restrict: 'No permitido' }[type];
  if (msg) return conn.reply(m.chat, msg, m).then(_ => m.react('✖️'))
}

let file = global.__filename(import.meta.url, true)
watchFile(file, async () => { unwatchFile(file); console.log(chalk.magenta("Se actualizo 'handler.js'")) })
