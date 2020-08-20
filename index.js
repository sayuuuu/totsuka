const { create, decryptMedia } = require('@open-wa/wa-automate')
const moment = require('moment')
const color = require('./lib/color')
const malScraper = require('mal-scraper')
const jikanjs = require('jikanjs')
const axios = require('axios')
const akaneko = require('akaneko')

var culture_code // IGNORE THESE LINES THESE LINES ARE ONLY FOR MY FELLO MEN OF CULTURE DEVs
var quote_Array = ['“You know you’re in love when you can’t fall asleep because reality is finally better than your dreams.”– Dr. Suess', '“I’m selfish, impatient and a little insecure. I make mistakes, I am out of control and at times hard to handle. But if you can’t handle me at my worst, then you sure as hell don’t deserve me at my best.”– Marilyn Monroe', '“Get busy living or get busy dying.”– Stephen King', '"Time moves in one direction, memory in another." \n~ William Gibson', '"The sky above the port was the color of television, tuned to a dead station." \n~ William Gibson', '"Before you diagnose yourself with depression or low self-esteem, first make sure that you are not, in fact, just surrounded by assholes." \n~ William Gibson', '"When you want to know how things really work, study them when they\'re coming apart." \n~ William Gibson', '"Anything that can be done to a rat can be done to a human being. And we can do most anything to rats. This is a hard thing to think about, but it\'s the truth. It won\'t go away because we cover our eyes. THAT is cyberpunk." \n~ Bruce Sterling', '"Japan is a wonderful country, a strange mixture of ancient mystique and cyberpunk saturation. It\'s a monolith of society\'s achievements, yet maintains a foothold in the past, creating an amazing backdrop for tourings and natives alive. Japan captures the imagination like no other. You never feel quite so far from home as you do in Japan, yet there are no other people on the planet that make you feel as comfortable." \n~ Corey Taylor', '“Twenty years from now you will be more disappointed by the things that you didn’t do than by the ones you did do.” \n– Mark Twain', '“When I dare to be powerful – to use my strength in the service of my vision, then it becomes less and less important whether I am afraid.” \n– Audre Lorde', '“Those who dare to fail miserably can achieve greatly.” \n– John F. Kennedy', '“Love yourself first and everything else falls into line. You really have to love yourself to get anything done in this world.” \n– Lucille Ball', '“It is our choices, that show what we truly are, far more than our abilities.”\n– J. K Rowling', '“If you want to be happy, be.” \n– Leo Tolstoy', '“If you want to live a happy life, tie it to a goal, not to people or things.” \n– Albert Einstein', '“I never knew how to worship until I knew how to love.” \n– Henry Ward Beecher', '“Life is trying things to see if they work.” \n– Ray Bradbury', '“If life were predictable it would cease to be life, and be without flavor.” \n– Eleanor Roosevelt', '“Yesterday is history, tomorrow is a mystery, today is a gift of God, which is why we call it the present.” \n– Bil Keane', '“You miss 100 percent of the shots you never take.” \n– Wayne Gretzky', '“Always forgive your enemies; nothing annoys them so much.” \n– Oscar Wilde']

const serverOption = {
  headless: true,
  qrRefreshS: 20,
  qrTimeout: 0,
  authTimeout: 0,
  autoRefresh: true,
  cacheEnabled: false,
  chromiumArgs: [
    '--no-sandbox',
    '--disable-setuid-sandbox'
  ]
}

const opsys = process.platform
if (opsys === 'win32' || opsys === 'win64') {
  serverOption.executablePath = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
} else if (opsys === 'linux') {
  serverOption.browserRevision = '737027'
} else if (opsys === 'darwin') {
  serverOption.executablePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
}

const startServer = async () => {
  create('Imperial', serverOption)
    .then(client => {
      console.log('[DEV] Ban Takahiro')
      console.log('[SERVER] Server Started!')

      // Force it to keep the current session
      client.onStateChanged(state => {
        console.log('[Client State]', state)
        if (state === 'CONFLICT') client.forceRefocus()
      })

      client.onMessage((message) => {
        msgHandler(client, message)
      })
    })
}

async function msgHandler (client, message) {
  try {
    const { type, body, from, t, sender, isGroupMsg, chat, caption, isMedia, mimetype, quotedMsg, chatId, Contact, author } = message
    const { pushname } = sender
    const { formattedTitle } = chat
    const time = moment(t * 1000).format('DD/MM HH:mm:ss')
    const commands = ['#menu', '#help', '#sticker', '#quotes', '#stiker', '#hello', '#info', '#commands', '#god', 'thank you', 'i love you', '#musim', '#anime', '#anime', '#do you love me', '#tsundere', 'ara ara', 'yo', 'freedom', 'i love rem', 'I Love Rem', 'el Psy Congroo', 'tuturu', 'indeed','#neko', '#wallpaper', '#source', 'bikin kopi', '#pokemon', '#pokewall', '#wiki', '#emilia', '#rem', '#rem', '#tiktok', '#ig', '#instagram', '#twt', '#twitter', '#fb', '#facebook', '#groupinfo', '#meme', '#covid', '#sr', '#test', '#manga', '#user', '#TestGif', '#kick', '#leave', '#add', '#Faq', '#profile', '#koin', '#dadu', '#animeneko','chat.whatsapp.com']
    const cmds = commands.map(x => x + '\\b').join('|')
    const cmd = type === 'chat' ? body.match(new RegExp(cmds, 'gi')) : type === 'image' && caption ? caption.match(new RegExp(cmds, 'gi')) : ''

    if (cmd) {
      !isGroupMsg ? console.log(color('[EXEC]'), color(time, 'yellow'), color(cmd[0]), 'from', color(pushname)) : console.log(color('[EXEC]'), color(time, 'yellow'), color(cmd[0]), 'from', color(pushname), 'in', color(formattedTitle))
      const args = body.trim().split(' ')
      const isUrl = new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi)

      switch (cmd[0].toLowerCase()) {
        case '#menu':
        case '#help':
          client.sendText(from, `👋️Yahallo *${pushname}*, Aku Yui-chan:)\n\n*Aku harus ngapain nich??*✨\n\n*_#stiker_*\n*Buat ngubah gambar ke stiker*\n\n*_#anime <judul anime>_*\n*Menampilkan deskripsi anime*\n\n*_#koin_*\n*Buat lempar koin*\n\n*_#dadu_*\n*Buat lempar dadu*\n\n*_#neko_*\n*Yo yang mau kucheng*\n\n*_#meme_*\n*Random meme dari r\/wholesomeanimememes*\n\n*_#waifu_*\n*Fitur ini lagi dinonaktifin sama papa:(*\n\n*_#covid <nama negara>_*\n*Info statistik langsung dari negara yang diminta*\n\n*_#quotes_*\n*Untuk sementara, quotesnya bahasa inggris ya:(*\n\n*_#pokemon_*\n*Ngasih gambar pokemon secara manasuka (random)*\n\n*_#wallpaper [Beta]_*\n*Fitur ini lagi dinonaktifin sama papa:(*\n\n*_#Top anime musim ini_* [Beta]\n*List anime musim ini*\n\n*_#info_*\n*Buat kenalan siapa sih Yui-chan?*\n\nBanyak kata kunci tersembunyi, btw ;)\n\n`)
          break
        case '#hello':
          await client.simulateTyping(from, true)
          client.sendText(from, 'Hello there, How can I help?')
          await client.simulateTyping(from, false)
          break
        case '#grouplink':
          if (isGroupMsg) {
            const inviteLink = await client.getGroupInviteLink(chat.id)
            client.sendLinkWithAutoPreview(from, inviteLink)
          }
          break
        case '#groupinfo':
          const groupchat = await client.getChatById(chatId)
          const { desc } = groupchat.groupMetadata
          client.sendText(from, '*' + formattedTitle + '*\n🌠️\n✨️ Description:\n ' + `${desc}`)
          break
        case '#leave':
          if (isGroupMsg) {
            if (`${ContactId}` === '919744375687@c.us') {
              client.sendText(from, 'Sayonara')
              client.leaveGroup(from)
            }
          }
          break
        case 'bikin kopi':
          client.reply(from, 'Idih bikin aja sendiri ckckck')
          break
        case 'i love you':
          client.reply(from, 'I love you too ;)')
          break
        case '#animeneko':
          client.sendFileFromUrl(from, akaneko.neko(), 'neko.jpg', 'Neko *Nyaa*~')
          break
        case '#dadu':
          const dice = Math.floor(Math.random() * 6) + 1
          await client.sendStickerfromUrl(from, 'https://www.random.org/dice/dice' + dice + '.png', { method: 'get' })
          break
        case '#koin':
          const side = Math.floor(Math.random() * 2) + 1
          if (side == 1) {
            client.sendStickerfromUrl(from, 'https://i.ibb.co/YTWZrZV/2003-indonesia-500-rupiah-copy.png', { method: 'get' })
          } else {
            client.sendStickerfromUrl(from, 'https://i.ibb.co/bLsRM2P/2003-indonesia-500-rupiah-copy-1.png', { method: 'get' })
          }
          break
        case '#add':
          await client.addParticipant('919744375687-1596199727@g.us', `${ContactId}`)
          break
        case 'chat.whatsapp.com':
          if (args[1] == client.getGroupInviteLink(chat.id)) {
          break
          }
          else await client.removeParticipant(from, author)
          break
        case '#do you love me?':
          client.sendText(from, 'Apasigaje:P')
          break
        case '#test':
          client.sendImageAsStickerGif(from, 'https://i.imgur.com/31zUM5g.gif')
          break
        case '#testGif' :
          client.sendStickerfromUrl(from, 'https://media.tenor.com/images/62c4b269d97c2412c4f364945f62afae/tenor.gif', { method: 'get' })
          break
        /*case '#user':
          const username = 'BanTakahiro01'
          const after = 25
          const type = 'anime' // can be either `anime` or `manga`

          // Get you an object containing all the entries with status, score... from this user's watch list
          malScraper.getWatchListFromUser(username, after, type)
            .then((data) => console.log(data))
            .catch((err) => console.log(err))
          break*/
        case '#anime':
          if (args.length >= 5) {
            const { title, picture, score, synopsis, episodes, aired, rating, status, genres } = await malScraper.getInfoFromName(args[1] + '-' + args[2] + '-' + args[3] + '-' + args[4])

            await client.sendFileFromUrl(from, `${picture}`, 'Anime.png', '⛩️Title:' + `${title}` + '\n\n🎼️Score:' + `${score}` + '\n\n📙️Status:' + `${status}` + '\n\n🖼️Episodes:' + `${episodes}` + '\n\n✨️Rating:' + `${rating}` + '\n\n🌠️Synopsis:' + `${synopsis}` + '\n\n📆️Aired:' + `${aired}` + '.' + `\n${genres}`)
          } else if (args.length >= 4) {
            const { title, picture, score, synopsis, episodes, aired, rating, status, genres } = await malScraper.getInfoFromName(args[1] + '-' + args[2] + '-' + args[3])

            await client.sendFileFromUrl(from, `${picture}`, 'Anime.png', '⛩️Title:' + `${title}` + '\n\n🎼️Score:' + `${score}` + '\n\n📙️Status:' + `${status}` + '\n\n🖼️Episodes:' + `${episodes}` + '\n\n✨️Rating:' + `${rating}` + '\n\n🌠️Synopsis:' + `${synopsis}` + '\n\n📆️Aired:' + `${aired}` + '.'+ `\n${genres}`)
          } else if (args.length >= 3) {
            const { title, picture, score, synopsis, episodes, aired, rating, status, genres } = await malScraper.getInfoFromName(args[1] + '-' + args[2])

            await client.sendFileFromUrl(from, `${picture}`, 'Anime.png', '⛩️Title:' + `${title}` + '\n\n🎼️Score:' + `${score}` + '\n\n📙️Status:' + `${status}` + '\n\n🖼️Episodes:' + `${episodes}` + '\n\n✨️Rating:' + `${rating}` + '\n\n🌠️Synopsis:' + `${synopsis}` + '\n\n📆️Aired:' + `${aired}` + '.'+ `\n${genres}`)
          } else {
            malScraper.getInfoFromName(args[1])
              .then((data) => console.log(data))
              .catch((err) => console.log(err))

            const { title, picture, score, synopsis, episodes, aired, rating, status, genres } = await malScraper.getInfoFromName(args[1])

            await client.sendFileFromUrl(from, `${picture}`, 'Anime.png', '⛩️Title:' + `${title}` + '\n\n🎼️Score:' + `${score}` + '\n\n📙️Status:' + `${status}` + '\n\n🖼️Episodes:' + `${episodes}` + '\n\n✨️Rating:' + `${rating}` + '\n\n🌠️Synopsis:' + `${synopsis}` + '\n\n📆️Aired:' + `${aired}` + '.'+ `\n${genres}`)
          }
          break

        case '#manga':

          if (args.length >= 2) {
            const name = args[1]
            malScraper.getInfoFromName(name)
              .then((data) => console.log(data))
              .catch((err) => console.log(err))
          }

          break

        case '#wiki':
          if (args.length >= 2) {
            const query = args[1]
            wiki()
              .page(query)
              .then(page => page.info())
              .then(console.log)
          }
          break
        case '#faq' :
          client.sendText(from, '👋️Hello ' + `${pushname}` + '\n\nSupport Group; https:\/\/bit.ly\/2CaPFyk\nGithub: https:\/\/bit.ly\/39Ld2L8\n\nThese are some of the frequently asked questions\n\nQ: Why was this bot created?\nA: We the developers wanted to increase our knowledge in JavaScript at the same time giving bac to the community\n\nQ: Will the bot ban you if you use unlisted commands?\nA: No, we\'ll not ban you if you use unlisted commands because every person isn\'t perfect, a person will make a typo or two, so we do not punish you\n\nQ: Will the bot ban you if you call the bot?\nA: No, But the bot can\'t pickup the call. Humans make mistake. we are not gonna punish you for that. Our bot is able to ban as well as block people but we won\'t do that. \n\nQ: How to make a bot like \"Emilia\"?\nA: You need to know JavaScript and Node.js If you want to, you can use our code for creating your bot. It\'d be great if you credit us if you do so, it is not necessary though.\n\nQ: Does the bot go offline?\nA: Yes, The bot services will go down for 6 or so hours because our servers are limited. The bot will be able to run for 24\/7 soon.\n \nQ: How to use the bot?\nA: Send \"#help\" to see the usable commands.\n\nQ: Who are \"Link\" and \"Zelda\"?\nA: Link and Zelda are the main charterers from The Legend of Zelda Video Game series. \n\n✨️Hope you have fun using our bot! Have a great day\n\n')
          break
        case '#pokewall' :
          q9 = Math.floor(Math.random() * 199) + 1
          client.sendFileFromUrl(from, 'http://localhost:8082/Pokemon/wallpapersanimesv.blogspot.com-(' + q9 + ').jpg', 'Pokemon.jpg', 'Here is your Pokemon Wallpaper')
          break
        case '#emilia' :
          q11 = Math.floor(Math.random() * 21) + 10
          client.sendFileFromUrl(from, 'http://0.0.0.0:8082/Emilia/' + q11 + '.png', 'Emilia.png', 'Emilia ✨️')
          break
        case '#rem' :
          q12 = Math.floor(Math.random() * 9) + 1
          client.sendFileFromUrl(from, 'http://0.0.0.0:8082/Rem/' + q12 + '.png', 'Rem.png', 'Rem ✨️')
          break
        case '#meme':
          const response = await axios.get('https://meme-api.herokuapp.com/gimme/wholesomeanimemes')
          const { title, url } = response.data
          await client.sendFileFromUrl(from, `${url}`, 'meme.jpg', `${title}`)
          break
        /*case '#sr':

           if (args.length >=4) {
           const sr = args[1]
           const rs = args[2]                 
           const tr = args[3]
           const response = await axios.get('https://meme-api.herokuapp.com/gimme/'+sr+'_'+rs+'_'+tr+'/');
           const { postLink, title, subreddit, url, nsfw, spoiler } = response.data
           if (`${nsfw}` == 'true'){
               if (isGroupMsg) {
                 if (`${chatId}` == '919744375687-1596550546@g.us'){
                          await client.sendFileFromUrl(from, `${url}`, 'Reddit.jpg', `${title}`+'\n\nPostlink:'+`${postLink}`)
                  } else client.sendText(from, 'NSFW contents can\'t be displayed on groups')
                } else await client.sendFileFromUrl(from, `${url}`, 'Reddit.jpg', `${title}`+'\n\nPostlink:'+`${postLink}`)
              } else await client.sendFileFromUrl(from, `${url}`, 'Reddit.jpg', `${title}`+'\n\nPostlink:'+`${postLink}`)
         } else if (args.length >=3) {
           const sr = args[1]
           const rs = args[2]
           const response = await axios.get('https://meme-api.herokuapp.com/gimme/'+sr+'_'+rs+'/');
           const { postLink, title, subreddit, url, nsfw, spoiler } = response.data
           if (`${nsfw}` == 'true'){
               if (isGroupMsg) {
                 if (`${chatId}` == '919744375687-1596550546@g.us'){
                          await client.sendFileFromUrl(from, `${url}`, 'Reddit.jpg', `${title}`+'\n\nPostlink:'+`${postLink}`)
                  } else client.sendText(from, 'NSFW contents can\'t be displayed on groups')
                } else await client.sendFileFromUrl(from, `${url}`, 'Reddit.jpg', `${title}`+'\n\nPostlink:'+`${postLink}`)
              } else await client.sendFileFromUrl(from, `${url}`, 'Reddit.jpg', `${title}`+'\n\nPostlink:'+`${postLink}`)
          } else if (args.length >=2) {
            const sr = args[1]
            const response = await axios.get('https://meme-api.herokuapp.com/gimme/'+sr+'/');
            const { postLink, title, subreddit, url, nsfw, spoiler } = response.data
                if (`${nsfw}` == 'true'){
                   if (isGroupMsg) {
                     if (`${chatId}` == '919744375687-1596550546@g.us'){
                     await client.sendFileFromUrl(from, `${url}`, 'Reddit.jpg', `${title}`+'\n\nPostlink:'+`${postLink}`)
                  } else client.sendText(from, 'NSFW contents can\'t be displayed on groups')
                } else await client.sendFileFromUrl(from, `${url}`, 'Reddit.jpg', `${title}`+'\n\nPostlink:'+`${postLink}`)
              } else await client.sendFileFromUrl(from, `${url}`, 'Reddit.jpg', `${title}`+'\n\nPostlink:'+`${postLink}`)
                    }
                break;*/
        case '#covid':
          if (args.length >= 2) {
            const response = await axios.get('https://coronavirus-19-api.herokuapp.com/countries/' + args[1] + '/')
            const { cases, todayCases, deaths, todayDeaths, active } = response.data
            await client.sendText(from, '🌎️Covid Info -' + args[1] + ' 🌍️\n\n✨️Total Cases: ' + `${cases}` + '\n📆️Today\'s Cases: ' + `${todayCases}` + '\n☣️Total Deaths: ' + `${deaths}` + '\n☢️Today\'s Deaths: ' + `${todayDeaths}` + '\n⛩️Active Cases: ' + `${active}` + '.')
          }
          break
        case 'el Psy Congroo':
          client.sendFileFromUrl(from, 'https://i.ibb.co/s9Rw8hN/index.jpg', 'Steins;Gate.jpg', 'El Psy Congroo')
          break
        case 'i love rem' :
          client.sendText(from, 'Who is Rem?')
          break
        case 'yo':
          client.sendText(from, 'Hiya *High-fives*')
          break
        /*case '#waifu':
          q8 = q2 = Math.floor(Math.random() * 98) + 10
          client.sendFileFromUrl(from, 'http://randomwaifu.altervista.org/images/00' + q8 + '.png', 'Waifu.png', 'How is she?') // UwU)/ Working Fine
          break*/
        case '#neko':
          q2 = Math.floor(Math.random() * 900) + 300
          q3 = Math.floor(Math.random() * 900) + 300
          client.sendFileFromUrl(from, 'http://placekitten.com/' + q3 + '/' + q2, 'neko.png', 'Neko ')
          break
        case '#pokemon':
          q7 = Math.floor(Math.random() * 890) + 1
          client.sendFileFromUrl(from, 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/' + q7 + '.png', 'Pokemon.png')
          break
        /*case '#wallpaper' :
        { const response1 = await axios.get('https://meme-api.herokuapp.com/gimme/Animewallpaper')
          const { title, url } = response1.data
          await client.sendFileFromUrl(from, `${url}`, 'meme.jpg', `${title}`)
          break
        }*/
        case '#tsundere' :
          client.sendText(from, 'Yui-chan nggak tsundere, baka!')
          break
        case 'ara ara' :
          client.sendStickerfromUrl(from, 'https://ih1.redbubble.net/image.930182194.9969/st,small,507x507-pad,600x600,f8f8f8.jpg', { method: 'get' })
          break
        case '#musim':
          if (args.length == 3) {
              const season = args[1]
              const year = args[2]
              malScraper.getSeason(year, season)
                .then((data) => console.log(data))
                .catch((err) => console.log(err))
          } else {
            console.log("Contoh penulisan: #musim summer 2020")
          }
          //client.sendText(from, 'Summer 2020 \n Re:Zero kara Hajimeru Isekai Seikatsu 2nd Season \n Yahari Ore no Seishun Love Comedy wa Machigatteiru. Kan \n The God of High School \n Sword Art Online: Alicization - War of Underworld 2nd Season \n Enen no Shouboutai: Ni no Shou \n Maou Gakuin no Futekigousha: Shijou Saikyou no Maou no Shiso, Tensei shite Shison-tachi no Gakkou e \n Kanojo, Okarishimasu \n Deca-Dence \n Uzaki-chan wa Asobitai! \n Monster Musume no Oishasan')
          break
        case '#thank you':
          client.sendText(from, 'Kochira koso *smiles*')
          break
        case '#info':
          client.sendText(from, `👋️Yahallo *${pushname}*, Aku Yui-chan:) tapi, papaku bukan Kirito:( Papa sama Mamaku itu Papa Ryan dan :(!\n`)
          break
        case '#quotes':
          a2 = Math.floor(Math.random() * 22)
          client.sendText(from, quote_Array[a2])
          break
          // MAKE SURE TO USE ; at the end of statement :)
        case '#r':
          client.sendText(from, 'Emilia')
          break
        case '#sticker':
        case '#stiker':
          if (isMedia) {
            const mediaData = await decryptMedia(message)
            const imageBase64 = `data:${mimetype};base64,${mediaData.toString('base64')}`
            await client.sendImageAsSticker(from, imageBase64)
          } else if (quotedMsg && quotedMsg.type == 'image') {
            const mediaData = await decryptMedia(quotedMsg)
            const imageBase64 = `data:${quotedMsg.mimetype};base64,${mediaData.toString('base64')}`
            await client.sendImageAsSticker(from, imageBase64)
          } else if (args.length == 2) {
            const url = args[1]

            url.match(isUrl) ? await client.sendStickerfromUrl(from, url, { method: 'get' })
              .then(r => { if (!r) client.sendText(from, 'The URL is not valid') })
              .catch(err => console.log('Caught exception: ', err)) : client.sendText(from, 'Sorry The URL is not valid')
          } else {
            client.sendText(from, 'Baru bngun tidur ya, Kak? Kalo mau buat stiker, upload gambar dengan takarir (caption) : #sticker')
          }
          break
      }
    } else {
      !isGroupMsg ? console.log('[RECV]', color(time, 'yellow'), 'Message from', color(pushname)) : console.log('[RECV]', color(time, 'yellow'), 'Message from', color(pushname), 'in', color(formattedTitle), color(chatId), color(author))
    }
  } catch (err) {
    console.log(color('[ERROR]', 'red'), err)
  }
}

process.on('Something went wrong', function (err) {
  console.log('Caught exception: ', err)
})

startServer()
