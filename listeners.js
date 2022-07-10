const userInput = document.getElementById("userInput")
const stopBtn = document.getElementById("stopBtn")
const showBtn = document.getElementById('showBtn')
const deezerBtn = document.getElementById('deezerBtn')
const deezerAll = document.getElementById('deezerAll')
const errorList = document.getElementById('errorList')
const form = document.getElementById('form')
const content = document.getElementById('content')

errorList.style.visibility = "hidden"
    errorList.style.display = "none"
stopBtn.style.visibility = "hidden"
    stopBtn.style.display = "none"
showBtn.style.visibility = "hidden"
    showBtn.style.display = "none"
content.style.visibility = "hidden"
    content.style.display = "none"
deezerAll.style.visibility = "hidden"
    deezerAll.style.display = "none"

userInput.onsearch = () => {
    const user = 'user=' + document.getElementById('textField').value + '&'
    onSubmit(user)
}

stopBtn.onclick = () => {
    onStop()
}

showBtn.onclick = function onClick(){
    if(errorList.style.visibility == "visible"){
        errorList.style.visibility = "hidden"
        errorList.style.display = "none"
        showBtn.textContent = "Show"
    }else{
        errorList.style.visibility = "visible"
        errorList.style.display = "block"
        showBtn.textContent = "Hide"
    }
}