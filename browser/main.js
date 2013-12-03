var domready = require('domready');
var neslySprite = require('nesly-sprite');

domready(function () {
    console.log('the dom is ready!');
    var spriteEditor = document.querySelector('#sprite-editor');
    var fileDrop= document.querySelector('.file-drop');

    console.log(fileDrop);
    fileDrop.ondragover = function () {
        this.className = 'pure-u-1 file-drop hover';
        return false;
    };

    fileDrop.ondragend = function () {
        this.className = 'pure-u-1 file-drop';
        return false;
    };

var palette = [
    0x788084, 0x0000fc, 0x0000c4, 0x4028c4,
    0x94008c, 0xac0028, 0xac1000, 0x8c1800,
    0x503000, 0x007800, 0x006800, 0x005800,
    0x004058, 0x000000, 0x000000, 0x000008,

    0xbcc0c4, 0x0078fc, 0x0088fc, 0x6848fc,
    0xdc00d4, 0xe40060, 0xfc3800, 0xe46918,
    0xac8000, 0x00b800, 0x00a800, 0x00a848,
    0x008894, 0x2c2c2c, 0x000000, 0x000000,

    0xfcf8fc, 0x38c0fc, 0x6888fc, 0x9c78fc,
    0xfc78fc, 0xfc589c, 0xfc7858, 0xfca048,
    0xfcb800, 0xbcf818, 0x58d858, 0x58f89c,
    0x00e8e4, 0x606060, 0x000000, 0x000000,

    0xfcf8fc, 0xa4e8fc, 0xbcb8fc, 0xdcb8fc,
    0xfcb8fc, 0xf4c0e0, 0xf4d0b4, 0xfce0b4,
    0xfcd884, 0xdcf878, 0xb8f878, 0xb0f0d8,
    0x00f8fc, 0xc8c0c0, 0x000000, 0x000000
];


    fileDrop.ondrop = function (e) {
        this.className = '';
        e.preventDefault();

        var file = e.dataTransfer.files[0],
        reader = new FileReader();
        reader.onload = function (event) {
            var result = event.target.result;
            console.log(result);

            var sprites = neslySprite.load(result);
            //console.log(sprites);

            // testing
            var context = spriteEditor.getContext('2d');
            var spriteSize = 256;
            var imageData = context.getImageData(0, 0, spriteSize, spriteSize);
            var sprite = neslySprite.get(0, sprites);
            newImageData = fillCanvas(sprite, imageData.data, palette, 32, 0);
            context.putImageData(newImageData, 0, 0);
        };
        reader.readAsDataURL(file);

        return false;
    };
});

function fillCanvas(sprite, imageData, palette, size, padding){

    var getColor = function (index) {
        return palette[index];
    };

    if (padding === undefined){
        padding = 0;
    }
    var a = 0;
    for (var y=0; y < 8*size; y++){
        for (var x=0; x < 8*size; x++) {
            var px = (x/size) >> 0;
            var py = (y/size) >> 0;
            var color_index = palette[sprt[py][px]];
            var color = getColor(color_index);
            imageData[a] = (color >> 16) & 0xff;
            imageData[a+1] = (color >> 8) & 0xff;
            imageData[a+2] = color & 0xff;
            imageData[a+3] = 0xff;
            a += 4;
        }
    }

    return imageData;
}
