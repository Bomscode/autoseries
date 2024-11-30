if(window.top != window.self){
  window.addEventListener('message',(e)=>{
    if(e.data.message == "startvideo"){
      window.parent.postMessage({message : "startvideo"},'*');
    }

    if(e.data.message == "pausevideo"){
      window.parent.postMessage({message : "pausevideo", time : e.data.time}, '*')
    }

    if(e.data.message == "havevideo"){
      window.parent.postMessage({message : "havevideo"},'*');
    }

    if(e.data.message == "returntime"){
      if(document.querySelectorAll("video").length > 0){
        document.querySelectorAll("video").forEach((vid)=>{
          if (isFinite(e.data.time) && vid.currentTime <= e.data.time) {
            vid.currentTime = e.data.time;
          }
        })
      }else{
        document.querySelectorAll("iframe").forEach((iframe)=>{
          iframe.contentWindow.postMessage({message : "returntime", time : e.data.time});
        })
      }
      
    }
  })

  window.parent.postMessage({message : "gettime"},'*');

   if(document.querySelectorAll("video").length > 0){
      document.querySelectorAll("video").forEach((vid)=>{
        vid.addEventListener("playing", () => {
          window.parent.postMessage({message : "havevideo"},'*');
        },{once : true});
          vid.addEventListener("pause",(e)=>{ 
            e.stopPropagation();
            window.parent.postMessage({message : "pausevideo", time : vid.currentTime}, '*')
          }) 
      })
    }   
}