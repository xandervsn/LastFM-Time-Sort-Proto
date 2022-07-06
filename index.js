const api = 'https://ws.audioscrobbler.com/2.0/?format=json&';
const apiKey = 'api_key=KEY';
const limit = 'limit=200&'
const period = "period=overall&"
const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': 'KEY',
		'X-RapidAPI-Host': 'deezerdevs-deezer.p.rapidapi.com'
	}
};

//global vars because i cba to call a function with 20 args
let error = false;
let failLog = ""
let failCount = 0;
let total = 0;
let pre = 0;
let post = 0;
let num = 0;

async function get(user){
    const method = 'method=user.getInfo&'
    const url = api + user + method + apiKey;
    const res = await fetch(url);
    const data = await res.json()
    const playcount = data.user.playcount
    const pages = (playcount-(playcount%200))/200 + 1
    loop(user, pages)
}

async function loop(user, pages){
    const method = 'method=user.gettoptracks&'
    for (let i = 0; i < pages; i++) {
        let page = 'page=' + i+1 + '&'
        const url = api + user + page + period + method + limit + apiKey
        await sleep(1000)
        const res = await fetch(url)
        const data = await res.json()
        for (let j = 0; j < data.toptracks.track.length; j++) {
            const playcount = data.toptracks.track[j].playcount
            const artistRaw = data.toptracks.track[j].artist.name
            const trackRaw = data.toptracks.track[j].name
            const regex = /\(|\[|ft|FT|Ft|FEAT|feat|Feat/
            const artist = artistRaw.split(regex)[0]
            const track = trackRaw.split(regex)[0]
            //const artist = encodeURIComponent(artistRaw = artistRaw.split('(')[0])
            //const track = encodeURIComponent(trackRaw = trackRaw.split('(')[0])
            let duration = data.toptracks.track[j].duration
            if(duration == 0){
                try{
                    const deezerRes = await fetch('https://deezerdevs-deezer.p.rapidapi.com/search?q=' + artist + " " + track, options)
                    const deezerData = await deezerRes.json()
                    duration = deezerData.data[0].duration
                }catch{
                    failLog = failLog + artist + " - " + track+ "\n" 
                    failCount += parseInt(playcount);
                    error = true;
                }
            }
            if(!error){
                const durationTotal = duration*playcount
                total += durationTotal
                format(total)
                post = Date.now()
                num++
                document.getElementById('timeListened').textContent = anal(total)
                document.getElementById('trackNumber').textContent = num
                document.getElementById('errors').textContent = failCount
                document.getElementById('errorList').textContent = failLog
                //console.log(`${artist} - ${track}: ${duration} sec, ${playcount} plays, ${durationTotal} total`)
                //console.log("Time Listened: " + format(total))
                //console.log("Runtime: " + ((post-pre)/1000) + " sec")
                //console.log("Track Num: " + num + ", " + data.toptracks.track[j].name)
            }else{
                error = false;
            }
        }
    }
}

function anal(total){
    const parent = new Date(total * 1000).toISOString().substring(5, 19);
    const seconds = parent.split(':')[2]
    const minutes = parent.split(':')[1]
    const hours = parent.substring(6, 8)
    const days = parent.substring(3, 5)
    const months = parseInt(parent.substring(0, 2)) - 1
    let lettered;
    let analog;
    if(months > 0){
        lettered = `${months} months, ${days} days, ${hours} hr, ${minutes} min, ${seconds} sec`
        analog = `${months}:${days}:${hours}:${minutes}:${seconds}`
    }else{
        lettered = `${days} days, ${hours} hr, ${minutes} min, ${seconds} sec`
        analog = `${days}:${hours}:${minutes}:${seconds}`
    }
    return `${lettered}\n${analog}`
}

function format(total){
    let seconds = total%60
    if (seconds.toString().length == 1){
        seconds = '0' + seconds
    }
    let minutes = (total-seconds)/60
    if (minutes.toString().length == 1){
        minutes = '0' + seconds
    }
    return minutes + ":" + seconds
}

document.getElementById('button').onclick = function onClick(){
    const user = 'user=' + document.getElementById('textField').value + '&'
    get(user);
    pre = Date.now()
}
