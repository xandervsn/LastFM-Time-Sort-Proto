//every great program has a long list of global variables, right?
let stopAsked = false;
let error = false;
let listing = {};
let playList = [];
let sorted = []
let failLog = [""];
let failCount = 0;
let total = 0;
let pre = 0;
let post = 0;
let num = 0;
let indice = 0
let deezerOn = false;

async function get(user){
    const method = 'method=user.gettoptracks&'
    let pages = 1
    for (let i = 0; i < pages; i++) {
        let page = `page=${i + 1}&`
        const url = api + user + page + period + method + limit + apiKey
        //await sleep(1000)
        const res = await fetch(url)
        const data = await res.json()
        pages = data.toptracks["@attr"].totalPages
        let tracks = data.toptracks.track.length
        for (let j = 0; j < tracks; j++) {
            const playcount = data.toptracks.track[j].playcount
            const artistRaw = data.toptracks.track[j].artist.name
            const trackRaw = data.toptracks.track[j].name
            const regex = /\(| \[| ft| FT| Ft| FEAT| feat| Feat/
            const artist = artistRaw.split(regex)[0]
            const track = trackRaw.split(regex)[0]
            //const artist = encodeURIComponent(artistRaw = artistRaw.split('(')[0])
            //const track = encodeURIComponent(trackRaw = trackRaw.split('(')[0])
            let duration = data.toptracks.track[j].duration
            if(duration == 0 && deezerOn){
                try{
                    const deezerRes = await fetch('https://deezerdevs-deezer.p.rapidapi.com/search?q=' + artist + " " + track, options)
                    const deezerData = await deezerRes.json()
                    duration = deezerData.data[0].duration
                }catch{
                    failLog.push(artist + " - " + track)
                    failCount += parseInt(playcount);
                    error = true;
                }
            }
            if(!error){
                console.log(`[${pages}][${tracks}] | [${i}][${j}] ${url}`)
                const durationTotal = duration*playcount
                listing[durationTotal] = `${artist} - ${track}`
                total += durationTotal
                post = Date.now()
                num++
                document.getElementById('timeListened').textContent = anal(total)
                document.getElementById('trackNumber').textContent = num
                document.getElementById('errors').textContent = failCount
                document.getElementById('runtime').textContent = (post-pre)/1000 + " seconds"
                //console.log(`${artist} - ${track}: ${duration} sec, ${playcount} plays, ${durationTotal} total`)
                //console.log("Time Listened: " + format(total))
                //console.log("Runtime: " + ((post-pre)/1000) + " sec")
                //console.log("Track Num: " + num + ", " + data.toptracks.track[j].name)
            }else{
                indice++
                document.getElementById('errorList').textContent += `${failLog[indice]}\n`
                error = false;
            }
            if(stopAsked){
                i = pages - 1
                j = tracks - 1
            }-
        }
    }
    end()
}

function end(){
    for(var key in listing){
        playList.push(key)
    }
    for (let i = playList.length - 1; i >= 0; i--) {
        //console.log((`${i}: ${listing[playList[i]]} - ${playList[i]} seconds`))
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
    return `${analog}`
}

document.getElementById('button').onclick = function onClick(){
    reset()
    const user = 'user=' + document.getElementById('textField').value + '&'
    pre = Date.now()

    if(document.getElementById('deezerBtn').checked){
        deezerOn = true
    }
    get(user);
}

document.getElementById('button1').onclick = function onClick(){
    stopAsked = true;
}

function reset(){
    stopAsked = false;
    error = false;
    listing = {};
    playList = [];
    sorted = []
    failLog = [""];
    failCount = 0;
    total = 0;
    pre = 0;
    post = 0;
    num = 0;
    indice = 0
    deezerOn = false;
}
