const puppeteer = require('puppeteer')

let cTab
let link = 'https://www.youtube.com/playlist?list=PLW-S5oymMexXTgRyT3BWVt_y608nt85Uj'

async function call(){
    try{
        let broswerOpen = puppeteer.launch({
            headless: false,
            defaultViewport:null,
            args:['start-maximised']
        })
        let broswerInstance = await broswerOpen
        let allTabsArr = await broswerInstance.pages()
        cTab = allTabsArr[0]
        await cTab.goto(link)
        await cTab.waitForSelector('.style-scope.yt-dynamic-sizing-formatted-string.yt-sans-28')
        let name = await cTab.evaluate(function(select){return document.querySelector(select).innerText},'.style-scope.yt-dynamic-sizing-formatted-string.yt-sans-28')
        let allData = await cTab.evaluate(getData,'.byline-item.style-scope.ytd-playlist-byline-renderer')
        console.log(name,allData.noOfVideos,allData.noOfViews)
    }catch(error){

    }
}

function getData(selector){
    let allElements = document.querySelectorAll(selector)
    let noOfVideos = allElements[0].innerText
    let noOfViews = allElements[1].innerText
    return {
        noOfVideos,
        noOfViews
    }
}
call()