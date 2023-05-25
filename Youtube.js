const puppeteer = require('puppeteer')

let cTab

(async function(){
    try{
        let broswerOpen = puppeteer.launch({
            headless: false,
            defaultViewport:null,
            args:['start-maximised']
        })
        let broswerInstnce = await broswerOpen
        let allTabsArr = await broswerInstnce.pages()
        cTab = allTabsArr[0]
    }catch(error){

    }
})()