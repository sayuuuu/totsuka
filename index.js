require('dotenv').config()
const { create, decryptMedia } = require('@open-wa/wa-automate')
const malScraper = require('mal-scraper')
const Jikan = require('jikan-node')
const mal = new Jikan()
const axios = require('axios')
const akaneko = require('akaneko')
const moment = require('moment-timezone')
moment.tz.setDefault('Asia/Jakarta').locale('id')
const { downloader, cekResi, removebg, urlShortener, meme, translate, getLocationData } = require('./lib')
const { msgFilter, color, processTime, isUrl } = require('./utils')
const mentionList = require('./utils/mention')
const { uploadImages } = require('./utils/fetcher')

var quote_Array = ['“You know you’re in love when you can’t fall asleep because reality is finally better than your dreams.”– Dr. Suess', '“I’m selfish, impatient and a little insecure. I make mistakes, I am out of control and at times hard to handle. But if you can’t handle me at my worst, then you sure as hell don’t deserve me at my best.”– Marilyn Monroe', '“Get busy living or get busy dying.”– Stephen King', '"Time moves in one direction, memory in another." \n~ William Gibson', '"The sky above the port was the color of television, tuned to a dead station." \n~ William Gibson', '"Before you diagnose yourself with depression or low self-esteem, first make sure that you are not, in fact, just surrounded by assholes." \n~ William Gibson', '"When you want to know how things really work, study them when they\'re coming apart." \n~ William Gibson', '"Anything that can be done to a rat can be done to a human being. And we can do most anything to rats. This is a hard thing to think about, but it\'s the truth. It won\'t go away because we cover our eyes. THAT is cyberpunk." \n~ Bruce Sterling', '"Japan is a wonderful country, a strange mixture of ancient mystique and cyberpunk saturation. It\'s a monolith of society\'s achievements, yet maintains a foothold in the past, creating an amazing backdrop for tourings and natives alive. Japan captures the imagination like no other. You never feel quite so far from home as you do in Japan, yet there are no other people on the planet that make you feel as comfortable." \n~ Corey Taylor', '“Twenty years from now you will be more disappointed by the things that you didn’t do than by the ones you did do.” \n– Mark Twain', '“When I dare to be powerful – to use my strength in the service of my vision, then it becomes less and less important whether I am afraid.” \n– Audre Lorde', '“Those who dare to fail miserably can achieve greatly.” \n– John F. Kennedy', '“Love yourself first and everything else falls into line. You really have to love yourself to get anything done in this world.” \n– Lucille Ball', '“It is our choices, that show what we truly are, far more than our abilities.”\n– J. K Rowling', '“If you want to be happy, be.” \n– Leo Tolstoy', '“If you want to live a happy life, tie it to a goal, not to people or things.” \n– Albert Einstein', '“I never knew how to worship until I knew how to love.” \n– Henry Ward Beecher', '“Life is trying things to see if they work.” \n– Ray Bradbury', '“If life were predictable it would cease to be life, and be without flavor.” \n– Eleanor Roosevelt', '“Yesterday is history, tomorrow is a mystery, today is a gift of God, which is why we call it the present.” \n– Bil Keane', '“You miss 100 percent of the shots you never take.” \n– Wayne Gretzky', '“Always forgive your enemies; nothing annoys them so much.” \n– Oscar Wilde']

const serverOption = {
  sessionId: 'Imperial',
  headless: true,
  qrRefreshS: 20,
  qrTimeout: 0,
  authTimeout: 0,
  autoRefresh: true,
  cacheEnabled: false,
  chromiumArgs: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--aggressive-cache-discard',
    '--disable-cache',
    '--disable-application-cache',
    '--disable-offline-load-stale-cache',
    '--disk-cache-size=0'
  ]
}

const opsys = process.platform
if (opsys === 'win32' || opsys === 'win64') {
  serverOption.executablePath = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
} else if (opsys === 'linux') {
  //serverOption.browserRevision = '737027'
  serverOption.browserRevision = '800071'
} else if (opsys === 'darwin') {
  serverOption.executablePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
}

const startServer = async () => {
  create(serverOption)
    .then(client => {
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
    const commands = ['#randompic','#chara','#randommeme','#rekomendasi','#news', 'hai','#kodegenre', '#genre','#menu', '#help', '#sticker', '#quotes', '#stiker', '#hello', '#info', '#commands', '#god', 'thank you', 'i love you', '#musim', '#anime', '#anime', '#do you love me', '#tsundere', 'ara ara', 'yo', 'freedom', 'i love rem', 'I Love Rem', 'el Psy Congroo', 'tuturu', 'indeed','#neko', '#wallpaper', '#source', 'bikin kopi', '#pokemon', '#pokewall', '#wiki', '#emilia', '#rem', '#rem', '#tiktok', '#ig', '#instagram', '#twt', '#twitter', '#fb', '#facebook', '#groupinfo', '#meme', '#covid', '#sr', '#test', '#manga', '#user', '#TestGif', '#kick', '#leave', '#add', '#Faq', '#profile', '#koin', '#dadu', '#animeneko','chat.whatsapp.com']
    const cmds = commands.map(x => x + '\\b').join('|')
    const cmd = type === 'chat' ? body.match(new RegExp(cmds, 'gi')) : type === 'image' && caption ? caption.match(new RegExp(cmds, 'gi')) : ''

    if (cmd) {
      !isGroupMsg ? console.log(color('[EXEC]'), color(time, 'yellow'), color(cmd[0]), 'from', color(pushname)) : console.log(color('[EXEC]'), color(time, 'yellow'), color(cmd[0]), 'from', color(pushname), 'in', color(formattedTitle))
      const args = body.trim().split(' ')
      const isUrl = new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi)
      const isQuotedImage = quotedMsg && quotedMsg.type === 'image'
      const uaOverride = process.env.UserAgent

      switch (cmd[0].toLowerCase()) {
        case '#menu':
        case '#help':
          client.sendText(from, `👋️Yahallo *${pushname}*, Aku Yui-chan:)\n\n*Aku harus ngapain nich??*✨\n\n*_#randompic <nama chara>_*\nMenampikan gambar random dari chara yang dicari. Misal: #randompic zeno\n\n*_#meme_* _<teks atas>_ | _<teks bawah>_\nUntuk membuat sticker meme dengan teks atas dan bawah\nPenggunaan: kirim gambar dengan caption _*#meme di atas | di bawah*_, atau juga bisa dengan membalas gambar yang sudah ada.\n\n*_#rekomendasi <judul>_*\nMenampilkan rekomendasi anime yang mirip sama judul. Contoh: #rekomendasi hyouka .Nahh, bakal ngeluarin anime yang mirip sama hyouka.\n\n *_#news <jumlah>_*\nMenampilkan berita terbaru sesuai jumlah yang dikasih. Misal #news 20, akan menampilkan 20 berita terbaru.\n\n*_#stiker_*\nBuat ngubah gambar ke stiker\n\n*_#anime <judul anime>_*\nMenampilkan deskripsi anime\n\n*_#genre_*\nUntuk menampilkan anime berdasarkan genre, contoh: #genre anime 2 1\nKata anime bisa diubah jadi manga, angka 2 merujuk pada kode genre, silakan ketik #kodegenre untuk tau kode setiap genre. Angka satu menunjukkan page/halaman, karena bisa jadi hasilnya banyak banget, so makanya dibikin page\n\n*_#koin_*\nBuat lempar koin\n\n*_#dadu_*\nBuat lempar dadu\n\n*_#neko_*\nYo yang mau kucheng\n\n*_#meme_*\nRandom meme dari r\/wholesomeanimememes\n\n*_#covid <nama negara>_*\nInfo statistik langsung dari negara yang diminta\n\n*_#quotes_*\nUntuk sementara, quotesnya bahasa inggris ya:(\n\n*_#pokemon_*\nNgasih gambar pokemon secara manasuka (random)\n\n*_#musim <season> <tahun> <tipe(optional)>_*\nMenampilkam list anime dari musim yang diminta. Terus tipe itu optional sih bisa ditambahin kata tv, ova, ona, movie, dan special. Contohnya: #musim winter 2019 ova. Bisa juga tanpa tipe misal #musim winter 2019\n\n*_#info_*\nBuat kenalan siapa sih Yui-chan?*\n\n*_#chara <nama chara> (BETA VERSION)_*\n(Masih dalam tahap pengembangan) Menampilkan informasi dari karakter yang dimaksud. Misal: #chara zeno.\n\nBanyak kata kunci tersembunyi, btw ;)\n\n`)
          break
        case '#hello':
          await client.simulateTyping(from, true)
          client.sendText(from, `👋️Yahallo *${pushname}-senpai*, ada yang bisa dibantu?`)
          await client.simulateTyping(from, false)
          break
        case 'hai':
          client.sendText(from, `Hallo ${pushname}`)
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
        case 'chat.whatsapp.com':
          if (args[1] == client.getGroupInviteLink(chat.id)) {
          break
          }
          else await client.removeParticipant(from, author)
          break
        case '#do you love me?':
          client.sendText(from, 'Apasigaje:P')
        case '#kodegenre':
          pesan = "Action: 1\nAdventure: 2\nCars: 3\nComedy: 4\nDementia: 5	\nDemons: 6	\nMystery: 7	\nDrama: 8	\nnFantasy: 10	\nGame: 11	\nHistorical: 13	\nHorror: 14\nKids: 15	\nMagic: 16	\nMartial Arts: 17\nMecha: 18	\nMusic: 19	\nParody: 20	\nSamurai: 21	\nRomance: 22	\nSchool: 23	\nSci Fi: 24	\nShoujo: 25	\nShounen: 27	\nSpace: 29	\nSports: 30	\nSuper Power: 31\nVampire: 32\nHarem: 35\nSlice Of Life: 36\nSupernatural: 37\nMilitary: 38\nPolice: 39\nPsychological: 40\nThriller: 41\nSeinen: 42\nJosei: 43"
          client.sendText(from, pesan)
          break
        case '#genre':
          if (args.length >= 4) {
          const { mal_url, anime } = await mal.findGenre(args[1], parseInt(args[2]), parseInt(args[3]))
            if ((Array.isArray(anime) && args[2]!="12") && (args[2]!="9" && args[2]!="26") && (args[2]!="28" && args[2]!="33") && args[2]!="34") {
              i = 1
              pesan = mal_url.name + "\n"
              for (const ani of anime) {
                genre = ""
                for (const gens of ani.genres) {
                  genre = genre + gens.name + ", "
                }
                pesan = pesan + i + ". *_"+ani.title+"_*\n"+genre+"\nSkor :"+ani.score
                i++
                if(i>29) {
                  break;
                } else {
                  pesan = pesan + "\n\n"
                }
              }
              client.sendText(from, pesan)
            }
          }
          break
        case '#anime':
          if (body.length > 8) {
            kunci = body.substr(7)
            const { id } = await malScraper.getInfoFromName(kunci)      
            const { title, image_url , score, synopsis, episodes, aired, rating, status, genres } = await mal.findAnime(id)
            genre = ""
            for (const gen of genres) {
              genre = genre + gen.name+ ", "
            }
            await client.sendFileFromUrl(from, `${image_url}`, 'Anime.png', '⛩️Title:' + `${title}` + '\n\n🎼️Score:' + `${score}` + '\n\n📙️Status:' + `${status}` + '\n\n🖼️Episodes:' + `${episodes}` + '\n\n✨️Rating:' + `${rating}` + '\n\n📆️Aired:' + `${aired.string}` + '\n\n🎭Genre:' + genre + '\n\n🌠️Synopsis:' + `${synopsis}` )
          
          }
          break
        case '#chara':
        if (body.length > 6) {
          kunci = body.substr(7).toLowerCase()
          kunci = kunci.replace(" ", "+")
          const respons = await axios.get('https://api.jikan.moe/v3/search/character?q='+kunci+'&limit=1')
          const { results } = respons.data
          idnya = results[0].mal_id
          const response = await axios.get('https://api.jikan.moe/v3/character/'+idnya)
          const { name, about, image_url } = response.data
          await client.sendFileFromUrl(from, `${image_url}`, 'Anime.png', `*${name}*`+"\n\n"+`${about}` )
        }
          break
        case "#randompic":
          if (body.length > 10) {
            kunci = body.substr(11).toLowerCase()
            kunci = kunci.replace(" ", "+")
            const respons = await axios.get('https://api.jikan.moe/v3/search/character?q='+kunci+'&limit=1')
            const { results } = respons.data
            idnya = results[0].mal_id
            const response = await axios.get('https://api.jikan.moe/v3/character/'+idnya+"/pictures")
            const { pictures } = response.data
            maks = pictures.length
            rand = Math.floor(Math.random() * maks);
            await client.sendFileFromUrl(from, pictures[rand].large, 'Anime.png')
          }
          break
        case '#rekomendasi':
          if (body.length > 12) {
            kunci = body.substr(13)
            const { id } = await malScraper.getInfoFromName(kunci)      
            const respons = await axios.get('http://api.jikan.moe/v3/anime/'+id+'/recommendations')
            const { recommendations } = respons.data
            most = recommendations[0]
            img = most.image_url
            idmost = most.mal_id
            i = 0
            pesan = ""
            for (const rec of recommendations ) {
              const { title, score, aired, genres } = await mal.findAnime(rec.mal_id)
              genre = ""
              for (const gen of genres) {
                genre = genre + gen.name+ ", "
              }
              if(rec.mal_id === idmost) {
                pesan = pesan + "Anime yang Paling Direkomendasikan :\n_*"+`${title}`+"*_\n"+"Skor :"+`${score}`+"\n"+"Rilis :"+`${aired.string}`+"\n"+"Genre :" + genre + "\n" + "Direkomendasikan oleh "+rec.recommendation_count+ " orang\n"+"\n *_Top 10 Anime Rekomendasi Lainnya:_*\n\n"
              } else {
                i++
                pesan = pesan + i +". _*"+`${title}`+"*_\n"+"Skor :"+`${score}`+"\n"+"Rilis :"+`${aired.string}`+"\n"+"Genre :" + genre + "\n" + "Direkomendasikan oleh "+rec.recommendation_count+ " orang\n\n"
              }
              if(i >= 11) {
                break
              }
            }
            await client.sendFileFromUrl(from, img , 'Anime.png', pesan)
          }
          break  
        case '#randommeme':
          const response = await axios.get('https://meme-api.herokuapp.com/gimme/wholesomeanimemes')
          const { title, url } = response.data
          await client.sendFileFromUrl(from, `${url}`, 'meme.jpg', `${title}`)
          break
        //case '#shorturl': //bitly token: a38eb184b07313e1ce202c247cfdb9a0045a2697
        case '#news':
          const respons = await axios.get('http://newsapi.org/v2/top-headlines?country=id&apiKey=b2d3b1c264c147ae88dba39998c23279')
          const { totalResults, articles } = respons.data
          res = totalResults
          if (args[1] >= totalResults) {
            res = totalResults
          } else {
            res = args[1]
          }
          i = 0
          pesan = '_*Berita Terbaru Hari Ini*_\n\n'
          for (const isi of articles) {
            i++
            pesan = pesan + i + '. ' + '_' + isi.title + '_' + '\n' + isi.publishedAt + '\n' + isi.description + '\n' + isi.url
            if (i<res) {
              pesen = pesan + '\n\n'
            } else if(i > res){
              break
            }
          }
          await client.sendText(from, pesan)
          break
        case '#covid':
          if (args.length >= 2) {
            const response = await axios.get('https://coronavirus-19-api.herokuapp.com/countries/' + args[1] + '/')
            const { cases, todayCases, deaths, todayDeaths, active } = response.data
            await client.sendText(from, '🌎️Covid Info -' + args[1] + ' 🌍️\n\n✨️Total Cases: ' + `${cases}` + '\n📆️Today\'s Cases: ' + `${todayCases}` + '\n☣️Total Deaths: ' + `${deaths}` + '\n☢️Today\'s Deaths: ' + `${todayDeaths}` + '\n⛩️Active Cases: ' + `${active}` + '.')
          }
          break
        case '#neko':
          q2 = Math.floor(Math.random() * 900) + 300
          q3 = Math.floor(Math.random() * 900) + 300
          client.sendFileFromUrl(from, 'http://placekitten.com/' + q3 + '/' + q2, 'neko.png', 'Neko ')
          break
        case '#pokemon':
          q7 = Math.floor(Math.random() * 890) + 1
          client.sendFileFromUrl(from, 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/' + q7 + '.png', 'Pokemon.png')
          break
        case '#tsundere' :
          client.sendText(from, 'Yui-chan nggak tsundere, baka!')
          break
        case 'ara ara' :
          client.sendStickerfromUrl(from, 'https://ih1.redbubble.net/image.930182194.9969/st,small,507x507-pad,600x600,f8f8f8.jpg', { method: 'get' })
          break
        case '#musim':
          if (args.length >= 3) {
              const season = args[1]
              const year = args[2]
              pesan = "Daftar 20 Anime di Musim "+season+" "+year+"\n\n"
              i = 0
              const respons = await axios.get("https://api.jikan.moe/v3/season/"+year+"/"+season)
              const { anime } = respons.data
              for(let data of anime) {
                genre = ""
                for (const gen of data.genres) {
                  genre = genre + gen.name+ ", "
                }
                i++
                pesan = pesan +i+". "+"_"+ data.title +"_" + "\n" + "Tanggal rilis :" + data.airing_start + "\n" + "Genre :" + genre + "\n" + "Score :" + data.score
                if(i>20) {
                  break;
                } else {
                  pesan = pesan + "\n\n"
                }
              }   client.sendText(from, pesan)
              //client.sendText(from, "Data tidak ditemukan")
            }
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
        case '#meme':
            if (isMedia) {
                const arg = caption.trim().substr(caption.indexOf(' ') + 1)
                const top = arg.split('|')[0]
                const bottom = arg.split('|')[1]
                const mediaData = await decryptMedia(message)
                const getUrl = await uploadImages(mediaData, false)
                console.log(top, bottom, arg)
                const ImageBase64 = await meme.custom(getUrl, top, bottom)
                await client.sendImageAsSticker(from, ImageBase64)
                /*client.sendFile(from, ImageBase64, 'image.png', '', null, true)
                    .then((serialized) => console.log(`Sukses Mengirim File!`))
                    .catch((err) => console.error(err))*/
            } else {
                await client.reply(from, 'Tidak ada gambar! Untuk membuka cara penggnaan kirim #menu [Wrong Format]')
            }
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
