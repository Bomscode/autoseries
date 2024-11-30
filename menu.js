document.getElementById("currentdropdown").style.display = "none";
document.getElementById("historydropdown").style.display = "none";
document.getElementById("sitesdropdown").style.display = "none";
document.getElementById("historydate").style.display = "none";
const episodes = [
  /episode\s+\d+/i,              
  /episodio\s+\d+/i,            
  /épisode\s+\d+/i,           
  /folge\s+\d+/i,              
  /episódio\s+\d+/i,            
  /episod\s+\d+/i,               
  /эпизод\s+\d+/i,           
  /episód\s+\d+/i,               
  /épisode\s+\d+/i,            
  /aflevering\s+\d+/i,       
  /capítulo\s+\d+/i,           
  /エピソード\s*\d+/i,       
  /편\s*\d+/i,               
  /قسم\s*\d+/i,                
  /ตอน\s+\d+/i,                
  /ตอนที่\s+\d+/i,           
  /第\d+\集/i,                 
  /การ์ตูนตอน\s*\d+/i,         
  /사건\s*\d+/i,          
  /ซี่ซั่น\s*\d+/i,             
  /sezon\s+\d+/i,           
  /kapittel\s+\d+/i,         
  /часть\s+\d+/i,           
  /pēdejo\s+\d+/i,            
  /episodul\s+\d+/i,          
  /drama\s+\d+/i,              
  /част\s+\d+/i          
];

import global from "./global.js";

for(let x in global){
  document.documentElement.style.setProperty(`--${x}`, global[x]);
}

document.addEventListener("keydown",(e)=>{
  chrome.storage.local.get(["ongoing"]).then((result) => {
    console.log(result.ongoing)
  })
})
let rightclickedelement;
function refreshsites(){
  Array.from(document.getElementById("sitesdropdown").children).forEach((e)=>{
    if(e.id != "addsites"){
      e.remove();
    }
  })
  chrome.storage.local.get(["url"]).then((result) => {
    if(result.url){
      let array = result.url;
    for(let i = 0;i < array.length; i++){
      let e = document.createElement('button');
      e.classList.add("button");
      e.style.whiteSpace = "nowrap";
      e.style.fontSize = "10px";
      e.innerText = array[i];
      e.onclick = ()=>{
        chrome.tabs.create({ url: "https://" + array[i] })
      }
      document.getElementById("sitesdropdown").appendChild(e);   
    }
  }
})
}

function getDate(datearray){
  datearray = new Date(datearray).toString().split(" ");
  delete datearray[datearray.length-1]
  delete datearray[datearray.length-2]
  delete datearray[datearray.length-3]
  datearray = datearray.join(" ")
  return datearray;
}

function refreshep(){
  Array.from(document.getElementById("currentdropdown").children).forEach((e)=>{
    e.remove();
  })
  chrome.storage.local.get(["ongoing"]).then((result) => {
    if(result.ongoing){
      let ongoing = result.ongoing
      if(Object.keys(ongoing).length > 0){
        Object.values(ongoing).forEach((el)=>{
            let e = document.createElement('button');
            e.classList.add("button");
            e.innerText = el.title;
            e.style.whiteSpace = "nowrap";
            e.style.fontSize = "10px";
            e.onclick = ()=>{chrome.tabs.create({ url: el.link });}
            e.onmouseover = (e)=>{
              e.stopPropagation();
              document.getElementById("currentinfo").style.display = "flex";
              document.getElementById("currentinfo").style.top = (e.target.offsetTop - 50) + "px";
              document.getElementById("currentinfo").style.left = (e.target.getBoundingClientRect().left - 100) + "px";
              document.getElementById("currentinfo").innerText = el.title;
            }
            e.onmouseout = (e)=>{
              document.getElementById("currentinfo").style.display = "none";
            }
            document.getElementById("currentdropdown").appendChild(e);   
        })
      }else{
        let e = document.createElement('button');
        e.classList.add("button");
        e.style.whiteSpace = "nowrap";
        e.style.fontSize = "10px";
        e.innerText = "no ongoing series currently";
        document.getElementById("currentdropdown").appendChild(e);   
      }
  }else{
    let e = document.createElement('button');
        e.classList.add("button");
        e.style.whiteSpace = "nowrap";
        e.style.fontSize = "10px";
        e.innerText = "no ongoing series currently";
        document.getElementById("currentdropdown").appendChild(e);  
  }
})
}

function refreshhis(){
  Array.from(document.getElementById("historydropdown").children).forEach((e)=>{
    e.remove();
  })
  chrome.storage.local.get(["history"]).then((result) => {
    if(result.history){
      let history = result.history;   
      if(Object.keys(history).length > 0){
        let p = [{"start":0}];
          Object.values(history).forEach((e)=>{
            for(let i = 0;i < p.length; i++){
                if(e.start > p[i].start){
                    p.splice(i,0,e)
                    break
                  }
              }
          })
          p.pop()
        p.forEach((el)=>{
        let e = document.createElement('button');
        e.classList.add("button");
        e.innerText = el.title;
        e.style.whiteSpace = "nowrap";
        e.style.fontSize = "10px";
        e.onclick = ()=>{
          chrome.tabs.create({ url: el.link })
        }
        e.onmouseover  = (e)=>{
          document.getElementById("historydate").style.display = "flex";
          document.getElementById("historydate").style.top = (e.target.getBoundingClientRect().top - 100) + "px";
          document.getElementById("historydate").style.left = (e.target.offsetLeft - 180) + "px";
          document.getElementById("historydate").innerText = "\nStart : " + getDate(el.start);
        }
        e.onmouseout = (e)=>{
          document.getElementById("historydate").style.display = "none";
        }
        document.getElementById("historydropdown").appendChild(e);   
      })
    }else{
      let e = document.createElement('button');
      e.classList.add("button");
      e.style.whiteSpace = "nowrap";
      e.style.fontSize = "10px";
      e.innerText = "your history is empty";
      document.getElementById("historydropdown").appendChild(e);  
    }
  }else{
    let e = document.createElement('button');
      e.classList.add("button");
      e.style.fontSize = "10px";
      e.style.whiteSpace = "nowrap";
      e.innerText = "your history is empty";
      document.getElementById("historydropdown").appendChild(e); 
  }
})
}

document.addEventListener("DOMContentLoaded",()=>{
  refreshsites();
  refreshep();
  refreshhis();
})

document.addEventListener('visibilitychange', ()=> {
  document.getElementById("contextmenu").style.display = "none";
  Array.from(document.getElementById('contextmenu').children).forEach((e,i)=>{
    e.style.display = "none";
  })
})
document.getElementById("remove").addEventListener("click",()=>{
  if(rightclickedelement.parentElement.id == "sitesdropdown"){
    chrome.storage.local.get(["url"]).then((result) => {
      let array = result.url;
        array.forEach((e,i)=>{
          if(e == rightclickedelement.innerText){
            array[i] = array[array.length-1];
            array.pop();
            chrome.storage.local.set({ url: array }, () => {
              alert("url removed");
              refreshsites();
            });
          }
        })
      });
  }
  if(rightclickedelement.parentElement.id == "currentdropdown"){
    chrome.storage.local.get(["ongoing"]).then((result) => {
      let ongoing = result.ongoing;
      let text = rightclickedelement.innerText
      for(let i = 0;i < episodes.length; i++){
        text = text.replace(episodes[i],"");
      }
      delete ongoing[text];
      chrome.storage.local.set({ ongoing : ongoing }, () => {
        alert("series removed");
        refreshep();
      });
    });
  }
})
document.addEventListener("click",()=>{
  document.getElementById("contextmenu").style.display = "none";
    Array.from(document.getElementById('contextmenu').children).forEach((e,i)=>{
      e.style.display = "none";
    })
}) 
document.getElementById("sites").addEventListener("click",()=>{
  refreshsites();
  if(document.getElementById("sitesdropdown").style.display == "none"){
    document.getElementById("sitesdropdown").style.display = "block";
  }else{
    document.getElementById("sitesdropdown").style.display = "none";
  }
})

document.addEventListener('contextmenu', (event) => {
  rightclickedelement = event.target
  document.getElementById("contextmenu").style.display = "flex";
  document.getElementById("contextmenu").style.top = (event.clientY + 10) + "px";
  document.getElementById("contextmenu").style.left = (event.clientX + 10) + "px";
  Array.from(document.getElementById('contextmenu').children).forEach((e,i)=>{
    e.style.display = "none";
  })
  if (event.target.parentElement.id == "currentdropdown" || event.target.parentElement.id == "sitesdropdown" && event.target.id != "addsites") {
    event.preventDefault();  
    document.getElementById("remove").style.display = "flex";
  }
});
document.getElementById('addsites').addEventListener("click",()=>{
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    chrome.storage.local.get(["url"]).then((result) => {
    if(result.url){
      if(result.url.includes(new URL(tabs[0].url).hostname)){
        alert("url already added");
      }else{
        let array = result.url;
        array.push(new URL(tabs[0].url).hostname);
        chrome.storage.local.set({ url: array }, () => {
          alert("url added")
          refreshsites();
        });
    }
  }else{
    let array = []
    array.push(new URL(tabs[0].url).hostname);
    chrome.storage.local.set({ url: array }, () => {
      alert("url added")
      refreshsites();
    });
  }
    })
  })
})

document.getElementById("current").addEventListener("click",()=>{
  refreshep();
  if(document.getElementById("currentdropdown").style.display == "none"){
    document.getElementById("currentdropdown").style.display = "block";
  }else{
    document.getElementById("currentdropdown").style.display = "none";
  }
})

document.getElementById("history").addEventListener("click",()=>{
  refreshhis();
  if(document.getElementById("historydropdown").style.display == "none"){
    document.getElementById("historydropdown").style.display = "block";
  }else{
    document.getElementById("historydropdown").style.display = "none";
  }
})

document.querySelectorAll("img").forEach((e)=>{
  e.addEventListener("click",()=>{
    window.location.href = e.src.replace(".png",".html")
  })
})

