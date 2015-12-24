var request = require('request');
var JefNode = require('json-easy-filter').JefNode;
var mcping = require('mc-ping');
var express = require('express');

var minecrafthost = process.env.minecrafthost 

var url
var bungieSite = `https://www.bungie.net`
var itemNumber
var itemIcon
console.log('minecraft host: ' + process.env.minecrafthost)
console.log('Env email: ' + process.env.email)
console.log('Env password: ' + process.env.password)
console.log('Env destinyAPI: ' + process.env.destinyAPI)

var credentials = {
        email: process.env.email,
    password: process.env.password
}

var token
var destinyAPIkey = process.env.destinyAPI

var destiny = {
        method: 'get',
        headers: {
                        'X-API-KEY': destinyAPIkey
                },
        json: true,
        url: url
}

var sendMessage = (channel, message, mentions, nonce) => {
        //console.log('Sending', message, 'to', channel, 'with mentions', mentions, 'and nonce', nonce)

        var data = {
                content: message,
                mentions: mentions,
                nonce: nonce,
                tts: false
        }

        request({
                method: 'post',
                url: `https://discordapp.com/api/channels/${channel}/messages`,
                headers: {
                        authorization: token
                },
                json: true,
                body: data

        }, (err, response, body) => {
                //console.log(err)
                //console.log(response.statusCode)
        })

}

var options = {
        method: "post",
        body: credentials,
        json: true,
        url: "https://discordapp.com/api/auth/login"
}


//Heroku requires a webserver to bind to a port

var app = express();

app.get('/', function (req, res) {
  res.send('Hello World!')
})

var server = app.listen(80, function () {
  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)
})








request(options, function(err, res, body){ //Beginning of General Request
        //error , response, body
        token = body.token;
        console.log(token);

        var auth = {
                method: "get",
                url: "https://discordapp.com/api/gateway",
                headers: {
                'Authorization': token
                }
        }


        request(auth, function(err, res, body){   //Beginning of Auth Request to get URL for Websocket
                console.log(body);
                var url = JSON.parse(body).url
                console.log (url)
                var WebSocket = require('ws');
                var ws = new WebSocket(url);
                var heartbeatInterval

                var startHeartbeat = (interval) => {
                        var heartbeat = { op: 1, d: Date.now() }

                setInterval(() => {
                        console.log("Sending Heartbeat")
                        ws.send(JSON.stringify(heartbeat))
                        }, interval)
                }


                var something = {   //Message on Login to Discord API
                        "op": 2,
                        "d": {
                "token": token,
                "v": 3,
                "properties": {
                        "$os": "Windows",
                        "$browser": "Chrome",
                        "$device": "",
                        "$referrer":" https://discordapp.com/@me",
                        "$referring_domain":"discordapp.com"
                },
                "large_threshold":100,
                "compress":true
                        }
                }

                ws.on('open', function open() {  //ws.on Open is for first login
                        console.log('Connected');
                ws.send(JSON.stringify(something));            //ws.send is sending something
                })


                ws.on('message', (packet, flags) => {
                        packet = JSON.parse(packet)

                        switch (packet.t) {
                                case 'READY':   //This is where Discord sends us the heartbeat
                                        var heartbeatInterval = packet.d.heartbeat_interval
                                        console.log("Heartbeat interval set to", heartbeatInterval)
                                        startHeartbeat(heartbeatInterval)
                                        break

                                case 'TYPING_START':
                                console.log(packet.d.user_id + ' is typing')
                                        break

                                case 'PRESENCE_UPDATE':
                                        break

                                case 'MESSAGE_CREATE':
                                        var channel = packet.d.channel_id
                                        var message = packet.d.content

                                function describeItem (itemNumber) {
                                        destiny.url = `https://www.bungie.net/platform/Destiny/Manifest/InventoryItem/`+itemNumber+`/`
                                        console.log(destiny.url)
                                        request(destiny, function(err, res, body){
                                                itemIcon = bungieSite + body.Response.data.inventoryItem.icon
                                                console.log(body.Response.data.inventoryItem.itemDescription)
                                                console.log(body.Response.data.inventoryItem.icon)
                                                var reply = body.Response.data.inventoryItem.itemName + ': ' + body.Response.data.inventoryItem.itemDescription + ' ' + itemIcon
                                                sendMessage(channel, reply, packet.d.mentions, packet.d.nonce)
                                                })
                                        }


                                        if(message.indexOf("describe") === 0 || message.indexOf("Describe") === 0) {
                                                console.log(packet.d.author.username, packet.d.timestamp, packet.d.content)
                                                console.log('Describe')

                                                //Grabbing everything in the message after "describe " which is 9 characters
                                                var exotic = message.substring(9, message.length) //9 is describe plus space
                                                exotic = exotic.toLowerCase()

                                                switch (exotic) {

                                                        //Gjallahorn
                                                        case "gjallarhorn":
                                                                itemNumber = '1274330687'
                                                                describeItem(itemNumber)
                                                        break

                                                        //Thunderlord
                                                        case "thunderlord":
                                                                itemNumber = '57660787'
                                                                describeItem(itemNumber)
                                                        break

                                                        //Truth
                                                        case "truth":
                                                                itemNumber = '2808364178'
                                                                describeItem(itemNumber)
                                                        break

                                                        //Bolt-Caster
                                                        case "bolt-caster":
                                                                itemNumber = '4100639362'
                                                                describeItem(itemNumber)
                                                        break

                                                        //Dark-Drinker
                                                        case "dark-drinker":
                                                                itemNumber = '4100639364'
                                                                describeItem(itemNumber)
                                                        break

                                                        //Raze-Lighter
                                                        case "raze-lighter":
                                                                itemNumber = '4100639365'
                                                                describeItem(itemNumber)
                                                        break

                                                        //Sleeper Simulant
                                                        case "sleeper simulant":
                                                                itemNumber = '3012398149'
                                                                describeItem(itemNumber)
                                                        break

                                                        //Super Good Advice
                                                        case "super good advice":
                                                                itemNumber = '3191797830'
                                                                describeItem(itemNumber)
                                                        break

                                                        //Dragon's Breath
                                                        case "dragon's breath":
                                                                itemNumber = '3705198528'
                                                                describeItem(itemNumber)
                                                        break

                                                        //Monte Carlo
                                                        case "montle carlo":
                                                                itemNumber = '2055601062'
                                                                describeItem(itemNumber)
                                                        break

                                                        //Fabian Strategy
                                                        case "fabian strategy":
                                                                itemNumber = '2748609458'
                                                                describeItem(itemNumber)
                                                        break

                                                        //SUROS Regime
                                                        case "suros regime":
                                                                itemNumber = '2055601061'
                                                                describeItem(itemNumber)
                                                        break

                                                        //Zhalo Supercell
                                                        case "zhalo supercell":
                                                                itemNumber = '255654879'
                                                                describeItem(itemNumber)
                                                        break

                                                        //Ace of Spades
                                                        case "ace of spades":
                                                                itemNumber = '552354419'
                                                                describeItem(itemNumber)
                                                        break

                                                        //Hawkmoon
                                                        case "hawkmoon":
                                                                itemNumber = '2447423792'
                                                                describeItem(itemNumber)
                                                        break

                                                        //The Last Word
                                                        case "the last word":
                                                                itemNumber = '2447423793'
                                                                describeItem(itemNumber)
                                                        break

                                                        //Bad Juju
                                                        case "bad juju":
                                                                itemNumber = '1177550374'
                                                                describeItem(itemNumber)
                                                        break

                                                        //Red Death
                                                        case "red death":
                                                                itemNumber = '1177550375'
                                                                describeItem(itemNumber)
                                                        break

                                                        //The Jade Rabbit
                                                        case "the jade rabbit":
                                                                itemNumber = '3688594190'
                                                                describeItem(itemNumber)
                                                        break

                                                        //Tlaloc
                                                        case "tlaloc":
                                                                itemNumber = '803312564'
                                                                describeItem(itemNumber)
                                                        break

                                                        //The First Curse
                                                        case "the first curse":
                                                                itemNumber = '987423912'
                                                                describeItem(itemNumber)
                                                        break

                                                        //No Time to Explain
                                                        case "no time to explain":
                                                                itemNumber = '4097026463'
                                                                describeItem(itemNumber)
                                                        break

                                                        //Boolean Gemini
                                                        case "boolean gemini":
                                                                itemNumber = '3688594188'
                                                                describeItem(itemNumber)
                                                        break

                                                        //Necrochasm
                                                        case "necrochasm":
                                                                itemNumber = '2809229973'
                                                                describeItem(itemNumber)
                                                        break

                                                        //Touch of Malice
                                                        case "touch of malice":
                                                                itemNumber = '3688594189'
                                                                describeItem(itemNumber)
                                                        break

                                                        //Hard Light
                                                        case "hard light":
                                                                itemNumber = '119482464'
                                                                describeItem(itemNumber)
                                                        break

                                                        //Vex Mythoclast
                                                        case "vex mythoclast":
                                                                itemNumber = '346443849'
                                                                describeItem(itemNumber)
                                                        break

                                                        //Thorn
                                                        case "thorn":
                                                                itemNumber = '3164616404'
                                                                describeItem(itemNumber)
                                                        break

                                                        //Fate of All Fools
                                                        case "fate of all fools":
                                                                itemNumber = '3490486524'
                                                                describeItem(itemNumber)
                                                        break

                                                        //MIDA Multi-Tool
                                                        case "mida multi-tool":
                                                                itemNumber = '3490486525'
                                                                describeItem(itemNumber)
                                                        break

                                                        //Universal Remote
                                                        case "universal remote":
                                                                itemNumber = '1389842217'
                                                                describeItem(itemNumber)
                                                        break

                                                        //No Land Beyond
                                                        case "no land beyond":
                                                                itemNumber = '2681212685'
                                                                describeItem(itemNumber)
                                                        break

                                                        //Telesto
                                                        case "telesto":
                                                                itemNumber = '3012398148'
                                                                describeItem(itemNumber)
                                                        break

                                                        //Invective
                                                        case "invective":
                                                                itemNumber = '99462852'
                                                                describeItem(itemNumber)
                                                        break

                                                        //The 4th Horseman
                                                        case "the 4th horseman":
                                                                itemNumber = '99462854'
                                                                describeItem(itemNumber)
                                                        break

                                                        //Hereafter
                                                        case "hereafter":
                                                                itemNumber = '3227022823'
                                                                describeItem(itemNumber)
                                                        break

                                                        //The Chaperone
                                                        case "the chaperone":
                                                                itemNumber = '3675783241'
                                                                describeItem(itemNumber)
                                                        break

                                                        //Black Spindle
                                                        case "black spindle":
                                                                itemNumber = '3227022822'
                                                                describeItem(itemNumber)
                                                        break

                                                        //Plan C
                                                        case "plan c":
                                                                itemNumber = '346443851'
                                                                describeItem(itemNumber)
                                                        break

                                                        //Pocket Infinity
                                                        case "pocket infinity":
                                                                itemNumber = '346443850'
                                                                describeItem(itemNumber)
                                                        break

                                                        //Queenbreakers' Bow
                                                        case "queenbreakers' bow":
                                                                itemNumber = '2612834019'
                                                                describeItem(itemNumber)
                                                        break

                                                        //Lord of Wolves
                                                        case "lord of wolves":
                                                                itemNumber = '2344494719'
                                                                describeItem(itemNumber)
                                                        break

                                                        //Dreg's Promise
                                                        case "dreg's promise":
                                                                itemNumber = '1557422751'
                                                                describeItem(itemNumber)
                                                        break

                                                        //Ice Breaker
                                                        case "ice breaker":
                                                                itemNumber = '3118679308'
                                                                describeItem(itemNumber)
                                                        break

                                                        //Patience and Time
                                                        case "patience and time":
                                                                itemNumber = '3118679309'
                                                                describeItem(itemNumber)
                                                        break

                                                        //ATS/8 Tarantella
                                                        case "ats/8 tarantella":
                                                                itemNumber = '105485105'
                                                                describeItem(itemNumber)
                                                        break

                                                        //Khepri's Sting
                                                        case "khepri's sting":
                                                                itemNumber = '1619609940'
                                                                describeItem(itemNumber)
                                                        break

                                                        //Don't Touch Me
                                                        case "don't touch me":
                                                                itemNumber = '1458254033'
                                                                describeItem(itemNumber)
                                                        break

                                                        //Sealed Ahamkara Grasps
                                                        case "sealed ahamkara grasps":
                                                                itemNumber = '2217280775'
                                                                describeItem(itemNumber)
                                                        break

                                                        //Crest of Alpha Lupi - Titan and Hunter
                                                        case "crest of alpha lupi":
                                                                itemNumber = '2661471738' //Titan
                                                                describeItem(itemNumber)

                                                                itemNumber = '2882684152' //Hunter
                                                                describeItem(itemNumber)
                                                        break

                                                        //Lucky Raspberry
                                                        case "lucky raspberry":
                                                                itemNumber = '2882684153'
                                                                describeItem(itemNumber)
                                                        break

                                                        //Shinobu's Vow
                                                        case "shinobu's vow":
                                                                itemNumber = '2217280774'
                                                                describeItem(itemNumber)
                                                        break

                                                        //Achlyophage Symbiote
                                                        case "achlyophage symbiote":
                                                                itemNumber = '1520434776'
                                                                describeItem(itemNumber)
                                                        break

                                                        //ATS/8 ARACHNID
                                                        case "ats/8 arachnid":
                                                                itemNumber = '2217280774'
                                                                describeItem(itemNumber)
                                                        break

                                                        //Celestial Nighthawk
                                                        case "celestial nighthawk":
                                                                itemNumber = '1520434781'
                                                                describeItem(itemNumber)
                                                        break

                                                        //Graviton Forfeit
                                                        case "graviton forfeit":
                                                                itemNumber = '1054763959'
                                                                describeItem(itemNumber)
                                                        break

                                                        //Mask of the Third Man
                                                        case "mask of the third man":
                                                                itemNumber = '1520434779'
                                                                describeItem(itemNumber)
                                                        break

                                                        //Bones of Eao
                                                        case "bones of eao":
                                                                itemNumber = '1775312683'
                                                                describeItem(itemNumber)
                                                        break

                                                        //Fr0st-EE5
                                                        case "fr0st-ee5":
                                                                itemNumber = '1394543945'
                                                                describeItem(itemNumber)
                                                        break

                                                        //Radiant Dance Machines
                                                        case "radiant dance machines":
                                                                itemNumber = '1775312682'
                                                                describeItem(itemNumber)
                                                        break

                                                        //Chaos Cloak
                                                        case "chaos cloak":
                                                                itemNumber = '2300914894'
                                                                describeItem(itemNumber)
                                                        break

                                                        //Cloak of Oblivion
                                                        case "cloak of oblivion":
                                                                itemNumber = '2300914893'
                                                                describeItem(itemNumber)
                                                        break

                                                        //Cloak of the Rising
                                                        case "cloak of the rising":
                                                                itemNumber = '2300914895'
                                                                describeItem(itemNumber)
                                                        break

                                                        //Nightstalker Cloak
                                                        case "nightstalker cloak":
                                                                itemNumber = '2300914892'
                                                                describeItem(itemNumber)
                                                        break

                                                        //Alchemist's Raiment
                                                        case "alchemist's raiment":
                                                                itemNumber = '2898542650'
                                                                describeItem(itemNumber)
                                                        break

                                                        //Heart of the Praxic Fire
                                                        case "heart of the praxic fire":
                                                                itemNumber = '3574778423'
                                                                describeItem(itemNumber)
                                                        break

                                                        //Purifier Robes
                                                        case "purifier robes":
                                                                itemNumber = '3574778420'
                                                                describeItem(itemNumber)
                                                        break

                                                        //Starfire Protocol
                                                        case "starfire protocol":
                                                                itemNumber = '3574778421'
                                                                describeItem(itemNumber)
                                                        break

                                                        //Voidfang Vestments
                                                        case "voidfang vestments":
                                                                itemNumber = '3574778422'
                                                                describeItem(itemNumber)
                                                        break

                                                        //Ophidian Aspect
                                                        case "ophidian aspect":
                                                                itemNumber = '1062853751'
                                                                describeItem(itemNumber)
                                                        break

                                                        //Nothing Manacles
                                                        case "nothing manacles":
                                                                itemNumber = '1275480035'
                                                                describeItem(itemNumber)
                                                        break

                                                        //Sunbreakers
                                                        case "sunbreakers":
                                                                itemNumber = '1275480033'
                                                                describeItem(itemNumber)
                                                        break

                                                        //The Impossible Machines
                                                        case "the impossible machines":
                                                                itemNumber = '1062853750'
                                                                describeItem(itemNumber)
                                                        break

                                                        //Apotheosis Veil
                                                        case "apotheosis veil":
                                                                itemNumber = '1519376145'
                                                                describeItem(itemNumber)
                                                        break

                                                        //Astrocyte Verse
                                                        case "astrocyte verse":
                                                                itemNumber = '2778128366'
                                                                describeItem(itemNumber)
                                                        break

                                                        //Light Beyond Nemesis
                                                        case "light beyond nemesis":
                                                                itemNumber = '1519376146'
                                                                describeItem(itemNumber)
                                                        break

                                                        //Skull of Dire Ahamkara
                                                        case "skull of dire ahamkara":
                                                                itemNumber = '1519376144'
                                                                describeItem(itemNumber)
                                                        break

                                                        //Obsidian Mind
                                                        case "obsidian mind":
                                                                itemNumber = '1519376147'
                                                                describeItem(itemNumber)
                                                        break

                                                        //The Ram
                                                        case "the ram":
                                                                itemNumber = '1519376148'
                                                                describeItem(itemNumber)
                                                        break

                                                        //THE STAG
                                                        case "the stag":
                                                                itemNumber = '2778128367'
                                                                describeItem(itemNumber)
                                                        break

                                                        //Transversive Steps
                                                        case "transversive steps":
                                                                itemNumber = '2275132880'
                                                                describeItem(itemNumber)
                                                        break

                                                        //"Circle of War"
                                                        case "circle of war":
                                                                itemNumber = '2122538505'
                                                                describeItem(itemNumber)
                                                        break

                                                        //"Light Beyond"
                                                        case "light beyond":
                                                                itemNumber = '2122538506'
                                                                describeItem(itemNumber)
                                                        break

                                                        //"The Age to Come"
                                                        case "the age to come":
                                                                itemNumber = '2122538504'
                                                                describeItem(itemNumber)
                                                        break

                                                        //Stormcaller Bond
                                                        case "stormcaller bond":
                                                                itemNumber = '2122538507'
                                                                describeItem(itemNumber)
                                                        break

                                                        //The Armamentarium
                                                        case "the armamentarium":
                                                                itemNumber = '2661471739'
                                                                describeItem(itemNumber)
                                                        break

                                                        //Twilight Garrison
                                                        case "twilight garrison":
                                                                itemNumber = '3921595523'
                                                                describeItem(itemNumber)
                                                        break

                                                        //ACD/0 Feedback Fence
                                                        case "acd/0 feedback fence":
                                                                itemNumber = '3055446324'
                                                                describeItem(itemNumber)
                                                        break

                                                        //Immolation Fists
                                                        case "immolation fists":
                                                                itemNumber = '155374077'
                                                                describeItem(itemNumber)
                                                        break

                                                        //No Backup Plans
                                                        case "no backup plans":
                                                                itemNumber = '3055446326'
                                                                describeItem(itemNumber)
                                                        break

                                                        //Ruin Wings
                                                        case "ruin wings":
                                                                itemNumber = '3055446327'
                                                                describeItem(itemNumber)
                                                        break

                                                        //Thagomizers
                                                        case "thagomizers":
                                                                itemNumber = '155374076'
                                                                describeItem(itemNumber)
                                                        break

                                                        //An Insurmountable Skullfort
                                                        case "an insurmountable skullfort":
                                                                itemNumber = '941890989'
                                                                describeItem(itemNumber)
                                                        break

                                                        //Empyrean Bellicose
                                                        case "empyrean bellicose":
                                                                itemNumber = '591060260'
                                                                describeItem(itemNumber)
                                                        break

                                                        //Eternal Warrior
                                                        case "eternal warrior":
                                                                itemNumber = '941890987'
                                                                describeItem(itemNumber)
                                                        break

                                                        //Helm of Inmost Light
                                                        case "helm of inmost light":
                                                                itemNumber = '941890990'
                                                                describeItem(itemNumber)
                                                        break

                                                        //Helm of Saint-14
                                                        case "helm of saint-14":
                                                                itemNumber = '941890991'
                                                                describeItem(itemNumber)
                                                        break

                                                        //The Glasshouse
                                                        case "the glasshouse":
                                                                itemNumber = '941890988'
                                                                describeItem(itemNumber)
                                                        break

                                                        //The Taikonaut
                                                        case "the taikonaut":
                                                                itemNumber = '591060261'
                                                                describeItem(itemNumber)
                                                        break

                                                        //Dunemarchers
                                                        case "dunemarchers":
                                                                itemNumber = '2479526175'
                                                                describeItem(itemNumber)
                                                        break

                                                        //Mk. 44 Stand Asides
                                                        case "mk. 44 stand asides":
                                                                itemNumber = '4267828624'
                                                                describeItem(itemNumber)
                                                        break

                                                        //Peregrine Greaves
                                                        case "peregrine greaves":
                                                                itemNumber = '4267828625'
                                                                describeItem(itemNumber)
                                                        break

                                                        //Mark of Oblivion
                                                        case "mark of oblivion":
                                                                itemNumber = '2820418555'
                                                                describeItem(itemNumber)
                                                        break

                                                        //Mark of the Executor
                                                        case "mark of the executor":
                                                                itemNumber = '2820418553'
                                                                describeItem(itemNumber)
                                                        break

                                                        //Mark of Oblivion
                                                        case "mark of oblivion":
                                                                itemNumber = '2820418555'
                                                                describeItem(itemNumber)
                                                        break

                                                        //Mark of the Sunforged
                                                        case "mark of the sunforged":
                                                                itemNumber = '2820418554'
                                                                describeItem(itemNumber)
                                                        break

                                                        //default
                                                        default:      //Else Statement, essentially
                                                                console.log('default choice ran')
                                                        break
                                                }

                                        }//end of Exotic Descriptions


                                        //Give Me a Reason
                                        if(message.indexOf("give me a reason") > -1 || message.indexOf("Give me a reason") > -1 || message.indexOf("Give Me A Reason") > -1) {
                                                console.log(packet.d.author.username, packet.d.timestamp, packet.d.content)
                                                var reply = 'Tristan fucked my goat'
                                                sendMessage(channel, reply, packet.d.mentions, packet.d.nonce)

                                        }
											

                                        //Minecraft Server Check
                                        if(message.indexOf("minecraft down") > -1 || message.indexOf("Is the minecraft server down?") > -1 || message.indexOf("minecraft down?") > -1) {
                                                console.log(packet.d.author.username, packet.d.timestamp, packet.d.content)
												var host = minecrafthost
												mcping(host, 25565, function(error, res) {
												if (error){
													console.log(res)
													console.log (host + ": " + error.toString ())
													var reply = "The server is offline!"
													sendMessage(channel, reply, packet.d.mentions, packet.d.nonce)			
													}
												else{
													console.log(res)
													console.log (host + ": Alive");
													var reply = "The server is online with " + res.num_players + "/" + res.max_players + " currently playing."
													sendMessage(channel, reply, packet.d.mentions, packet.d.nonce)		
													}
													
												}, 3000);
                                        }
										
										
										
										
										

                                        //Is Xur here?
                                        if(message.indexOf("Is Xur here?") > -1 || message.indexOf("Is Xur Here?") > -1 || message.indexOf("is xur here?") > -1) {
                                                console.log(packet.d.author.username, packet.d.timestamp, packet.d.content)
                                                        destiny.url = `https://www.bungie.net/platform/destiny/advisors/xur/?definitions=true`  //Xur
                                                        request(destiny, function(err, res, body){
															//console.log(body.Response.definitions.items)
																if(body.ErrorStatus  === 'DestinyVendorNotFound') {
																	var reply = 'Xur is not here until Friday 1am PST.'
																}
																else {
																	var items = body.Response.definitions.items
																	var filterItems = new JefNode(items).filter(function(node) { //Json Easy Filter
																		if (node.has('itemName')) {
																			return node.value.itemName
																		}
																	})
																	console.log(filterItems)
																	
																	var reply = 'Xur is here and has: ' + filterItems.join(" || ")
																}
                                                                
                                                                sendMessage(channel, reply, packet.d.mentions, packet.d.nonce)

                                                        })

                                        }


                                        break

                                default:      //Else Statement, essentially
                                        break


                        }

                })


        })  //End of Auth Request to get URL for Websocket


})  //Ending of General Request


