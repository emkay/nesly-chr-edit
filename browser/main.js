var domready = require('domready');
var neslySprite = require('nesly-sprite');

domready(function () {
    console.log('the dom is ready!');
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

    fileDrop.ondrop = function (e) {
        this.className = '';
        e.preventDefault();

        var file = e.dataTransfer.files[0],
        reader = new FileReader();
        reader.onload = function (event) {
            console.log(event);
            var result = event.target.result;
            console.log(result);
        };
        reader.readAsDataURL(file);

        return false;
    };
});
