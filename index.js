const api = 'https://ws.audioscrobbler.com/2.0/?format=json&';
const apiKey = 'api_key=8c26f6d976a330378d34462eb67918b2';
const method = 'method=track.getInfo&'

function findDuration(artist, track){
    url = api + artist + track + method + apiKey
    fetch(url)
        .then(res => res.json())
        .then(data => {
            millisecs = data.track.duration
            secs = millisecs/1000
            seconds = secs%60
            if (seconds.toString().length == 1){seconds = '0' + seconds}
            minutes = (secs-seconds)/60
            document.getElementById('output').innerHTML = minutes + ":" + seconds
        })
}

document.getElementById('button').onclick = function onClick(){
    let input = document.getElementById('textField').value
    let artist = 'artist=' + input.split(' - ')[0] + '&'
    let track = 'track=' + input.split(' - ')[1] + '&'
    findDuration(artist, track);
}