window.onload = timeout;
function timeout() {
    window.setTimeout("redirect()", 3000)
}

function redirect() {
    window.location = "map.html"
    return
}
