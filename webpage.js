
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
function gettime(x){
  x = parseInt(x);
  let i = 0;
  while(x >= 60){
   	x = x - 60;
    i = i + 1;
  }
  if(x == 0){
    return (i + ".00")
  }else{
    return (i + (x / 100))
  }
}

function newep(ongoing,documenttitle,checknew){
  chrome.storage.local.get(["history"]).then((result) => {
    let history = result.history;
    let name = documenttitle
    if(history){
      if(history[documenttitle]){
        name = documenttitle + Date.now()
      }
    }else{
      history = {};
    }
    history[name] = {
      title : ongoing[documenttitle].title,
      link : ongoing[documenttitle].link,
      start : ongoing[documenttitle].start
    }   
    chrome.storage.local.set({ history : history}, () => {
    });
  })
  clearInterval(checknew);
  ongoing[documenttitle].link = window.location.href; 
  ongoing[documenttitle].title = document.title;
  ongoing[documenttitle].start = Date.now();
  ongoing[documenttitle].now = 0.00;         
  chrome.storage.local.set({ongoing : ongoing}, () => {
  }); 
  let checknew2 = setInterval(()=>{
    if(url != window.location.href){
      let epnow = window.location.href.match(/\d+/g);
      let eplast = ongoing[documenttitle].link.match(/\d+/g);
      if(parseInt(epnow[epnow.length-1]) > parseInt(eplast[eplast.length-1])){ 
        newep(ongoing,documenttitle,checknew2);
        findvid(ongoing,documenttitle);
      }
    }
  },1000)
}

function findvid(ongoing,documenttitle){
  if(document.querySelectorAll("video").length > 0){
    document.querySelectorAll("video").forEach((vid)=>{
      vid.addEventListener("playing", () => {
        clearInterval(insert)
      });
      vid.addEventListener("pause",()=>{
          ongoing[documenttitle].now = vid.currentTime;
          chrome.storage.local.set({ongoing : ongoing}, () => {
          });
      }) 
    })
  }else{
        let insert = setInterval(()=>{
          chrome.runtime.sendMessage({message : "exist"})
        },1000)

        window.addEventListener('message',(event)=>{
          if(event.data.message == "havevideo"){
            clearInterval(insert)
          }

          if(event.data.message == "pausevideo"){
              ongoing[documenttitle].now = event.data.time;
              chrome.storage.local.set({ongoing : ongoing}, () => {
              });
          }

          if(event.data.message == "gettime"){
            document.querySelectorAll("iframe").forEach((ei)=>{
              ei.contentWindow.postMessage({message : "returntime", time : ongoing[documenttitle].now},'*')
            })
         }
        })
  }
}
let url = window.location.href;

chrome.storage.local.get(["url"]).then((resultu) => {
        if(resultu.url){
          if(resultu.url.includes(new URL(window.location.href).hostname)){
                chrome.storage.local.get(["ongoing"]).then((result) => {
                  let ongoing
                  let documenttitle = document.title
                  for(i = 0; i < episodes.length; i++){
                    documenttitle = documenttitle.replace(episodes[i],"");
                  }
                  console.log(documenttitle)
                    if(result.ongoing){
                      ongoing = result.ongoing;
                      if(ongoing[documenttitle]){
                        findvid(ongoing,documenttitle);
                        let checknew = setInterval(()=>{
                          if(url != window.location.href){
                            let epnow = window.location.href.match(/\d+/g);
                            let eplast = ongoing[documenttitle].link.match(/\d+/g);
                            if(parseInt(epnow[epnow.length-1]) > parseInt(eplast[eplast.length-1])){ 
                              newep(ongoing,documenttitle,checknew);
                              findvid(ongoing,documenttitle);
                            }
                          }
                        },1000)
                        let epnow = window.location.href.match(/\d+/g);
                        let eplast = ongoing[documenttitle].link.match(/\d+/g);
                        if(parseInt(epnow[epnow.length-1]) > parseInt(eplast[eplast.length-1])){  
                          newep(ongoing,documenttitle,checknew)
                        }else{
                            if(isFinite(ongoing[documenttitle].now)){  
                              alert("last watched until " + gettime(ongoing[documenttitle].now))
                            }else{
                              alert("no time captured")
                            }
                        }
                      }else{
                        if(document.querySelectorAll("video").length > 0){
                            document.querySelectorAll("video").forEach((vid)=>{
                              vid.addEventListener("playing", () => {
                                clearInterval(insert)
                              });
                              document.addEventListener("beforeunload", () => {
                                vid.pause();
                              });
                              vid.addEventListener("play",()=>{
                                  ongoing[documenttitle] = {
                                    title : document.title,
                                    link : window.location.href,
                                    start : Date.now()
                                  };
                                  chrome.storage.local.set({ongoing : ongoing}, () => {
                                  });
                              }) 
                              vid.addEventListener("pause",()=>{
                                  ongoing[documenttitle].now = vid.currentTime;
                                  chrome.storage.local.set({ongoing : ongoing}, () => {
                                  });
                              }) 
                            }) 
                        }else{
                              let insert = setInterval(()=>{
                                chrome.runtime.sendMessage({message : "new"})
                              },1000)
                              window.addEventListener('message',(event)=>{
                                if(event.data.message == "havevideo"){
                                  clearInterval(insert)
                                }
                                if(event.data.message == "startvideo"){
                                    ongoing[documenttitle] = {
                                      title : document.title,
                                      link : window.location.href,
                                      start : Date.now()
                                    };
                                    chrome.storage.local.set({ongoing : ongoing}, () => {
                                    });
                                    newep(ongoing,documenttitle,checknew2);
                                }
                            
                                if(event.data.message == "pausevideo"){
                                    ongoing[documenttitle].now = event.data.time;
                                    chrome.storage.local.set({ongoing : ongoing}, () => {
                                    });
                                }
                              })
                        }
                      };
                    }else{
                      ongoing = {};
                      ongoing[documenttitle] = {
                        title : document.title,
                        link : window.location.href,
                        start : Date.now()
                      };
                      chrome.storage.local.set({ongoing : ongoing}, () => {
                      });
                    }
                })
        } 
    }
    }) 