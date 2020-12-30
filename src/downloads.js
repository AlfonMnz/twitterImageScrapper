const fs = require('fs');
const imgDownload = require('image-downloader');
let arrayAccounts = [];
function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

(async () => {
    for (let account of arrayAccounts) {
        console.log('DOWNLOADING ACCOUNT: [' + account + ']');
        let imgs = JSON.parse(fs.readFileSync(`./imgs_${account}.json`, 'utf-8'));
        for (let img of imgs) {
            let parsedUrl = img.replace('name=small', 'name=large').replace('name=360x360', 'name=large').replace('name=medium', 'name=large');
            await imgDownload.image({ url: parsedUrl, dest: `../download/${makeid(5)}.png` })
        }
        console.log('DONE ACCOUNT: [' + account + ']');
    }
})()