import global from "./global.js";

for(let x in global){
    document.documentElement.style.setProperty(`--${x}`, global[x]);
}

document.querySelector("img").addEventListener("click",()=>{
    window.location.href = "menu.html";
})