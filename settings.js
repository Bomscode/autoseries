import global from "./global.js";
let global2 = global;
let checkarray = [];
document.querySelector("img").addEventListener("click",()=>{
    window.location.href = "menu.html"
})

document.getElementById("customise").style.borderBottom = "none";
document.querySelectorAll("button[data='trigger']").forEach((e)=>{
    e.addEventListener("click",()=>{
        document.querySelectorAll("button[data='trigger']").forEach((e2)=>{
            e2.style.borderBottom = "1px solid var(--sub)";
        })
        e.style.borderBottom = "none";
        Array.from(document.getElementsByClassName("page")).forEach((p)=>{
            if(p.id.includes(e.id)){
                p.style.display = "flex";
            }else{
                p.style.display = "none";
            }
        })
    })
})

for(let x in global){
    document.querySelector(`input[name='${x}']`).value = global[x];
    document.documentElement.style.setProperty(`--${x}`, global[x]);
    document.querySelector(`input[name='${x}']`).addEventListener("input",()=>{
        document.documentElement.style.setProperty(`--${x}`, document.querySelector(`input[name='${x}']`).value);
        global2[`${x}`] = document.querySelector(`input[name='${x}']`).value;
    })
}

document.getElementById("savecolor").addEventListener("click",()=>{
    document.querySelectorAll("input[type='color']").forEach((e)=>{
        global2[e.getAttribute("name")] = e.value;
    })
    chrome.storage.local.set({global : global2}, () => {
    });
})

document.getElementById("reset").addEventListener("click",()=>{
    chrome.storage.local.remove(["global"]);
    window.location.reload();
})

document.querySelectorAll("input[type='checkbox']").forEach((e)=>{
    e.addEventListener("input",()=>{
        if(e.checked){
            checkarray.push(e.value);
        }else{
            for(let i = 0;i < checkarray.length;i++){
                if(checkarray.value == e.value){
                    checkarray.splice(i,1);
                }
            }
        }
    })
})
document.getElementById("exportbut").addEventListener("click",()=>{
    chrome.storage.local.get(checkarray).then((result)=>{
        let url = URL.createObjectURL(new Blob([JSON.stringify(result,null,2)], { type: 'application/json' }));
        chrome.downloads.download({
            url: url,
            filename: "autoleaf_data.json",
            saveAs: true 
        }, (downloadId) => {
            if (chrome.runtime.lastError) {
                console.error('Download failed:', chrome.runtime.lastError);
            } else {
                console.log('Download started:', downloadId);
            }
            URL.revokeObjectURL(url);
        });
    })
})

document.getElementById("importbut").addEventListener("change", function(event) {
    const ongoing = {
        start : null,
        title : null,
        link : null,
        now : null
    }
    const history = {
        link : null,
        start : null,
        title : null
    }
    const file = event.target.files[0];
    
    if (!file) {
        console.log("No file selected");
        return;
    }
    
    const reader = new FileReader();

    reader.onload = function(e) {
        try {
            const jsonData = JSON.parse(e.target.result);
            for(const type in jsonData){
                for(const series in jsonData[type]){
                    console.log(type)
                    if(type == "ongoing"){
                        for(const valid in ongoing){
                            if(!jsonData[type][series].hasOwnProperty(valid)){
                                console.log(series)
                                throw new Error("invalid format (wrong ongoing format)");
                            }
                        }
                    }else if(type == "history"){
                        for(const valid in history){
                            if(!jsonData[type][series].hasOwnProperty(valid)){
                                console.log(series)
                                throw new Error("invalid format (wrong history format)");
                            }
                        }
                    }else if(type == "url"){
                    }else{
                        throw new Error("invalid format (extra object)");
                    }
                }
            }
            
            chrome.storage.local.set({ongoing : jsonData["ongoing"], url : jsonData["url"], history : jsonData["history"]},()=>{
                alert("import successful");
            })
        } catch (error) {
            alert(error);
        }
    };
    
    reader.readAsText(file);
});