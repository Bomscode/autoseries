let global = {
    main : "#008f8c",
    sub : "#ffffff",
    bg : "#2c2c2c"
};

await chrome.storage.local.get(["global"]).then(async(result)=>{
    if(result.global){
        console.log("have global")
        global = result.global
        
    }else{
        console.log("no global")
    }
})

export default global;