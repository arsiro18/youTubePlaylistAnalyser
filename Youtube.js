const puppeteer = require('puppeteer')
const pdf =require('pdfkit')
const fs = require('fs')

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

        let totalVideos = allData.noOfVideos.split(" ")[0]
        console.log(totalVideos)

        let currentVideos = await getCvideosLen()
        console.log(currentVideos)

        while(totalVideos-currentVideos>=20){
            await scrollToBottom()
            currentVideos = await getCvideosLen()
        }
        let finalList = await getStats ()
        let pdfDoc = new pdf
        pdfDoc.pipe(fs.createWriteStream('playlist.pdf'))
        pdfDoc.text(JSON.stringify(finalList))
        pdfDoc.end()

    }catch(error){
        console.log(error)
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

async function getCvideosLen(){
    let length = await cTab.evaluate(getLength , '#container>#thumbnail span.style-scope.ytd-thumbnail-overlay-time-status-renderer')
    return length
}

async function scrollToBottom(){
    await cTab.evaluate(goToBottom)
    function goToBottom(){
        window.scrollBy(0,window.innerHeight)
    }
}
async function getStats(){
    let list = cTab.evaluate(getNameAndDuration,'#video-title','#container>#thumbnail span.style-scope.ytd-thumbnail-overlay-time-status-renderer')
    return list
}
function getLength(durationSelect){
    let durationEle = document.querySelectorAll(durationSelect)
    return durationEle.length
}

function getNameAndDuration(videoSelector,durationSelector){
    let videoElem = document.querySelectorAll(videoSelector)
    let durationElem = document.querySelectorAll(durationSelector)

    let currList = []
    for(let i=0;i<durationElem.length;i++){
        let videoTitle = videoElem[i].innerText
        let duration = durationElem[i].innerText
        currList.push({videoTitle,duration})
    }
    return currList;
}
call()