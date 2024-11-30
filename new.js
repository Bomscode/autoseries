if(window.top != window.self){
  window.addEventListener('message',(event)=>{
    if(event.data.message == "startvideo"){
      window.parent.postMessage({message : "startvideo"},'*');
    }

    if(event.data.message == "havevideo"){
      window.parent.postMessage({message : "havevideo"},'*');
    }

    if(event.data.message == "pausevideo"){
      window.parent.postMessage({message : "pausevideo", time : event.data.time}, '*')
    }

  })
  if(document.querySelectorAll("video").length > 0){
    document.querySelectorAll("video").forEach((vid)=>{
      vid.addEventListener("playing", () => {
        window.parent.postMessage({message : "havevideo"},'*');
      });
        vid.addEventListener("play",(e)=>{
          e.stopPropagation()
          window.parent.postMessage({message : "startvideo"},'*');
          vid.addEventListener("pause",(e)=>{ 
            e.stopPropagation()
            window.parent.postMessage({message : "pausevideo", time : vid.currentTime}, '*')
        }) 
      }, { once: true }) 
    })
  }
}
