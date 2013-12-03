;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"domready":3,"nesly-sprite":4}],2:[function(require,module,exports){

// not implemented
// The reason for having an empty file and not throwing is to allow
// untraditional implementation of this module.

},{}],3:[function(require,module,exports){
/*!
  * domready (c) Dustin Diaz 2012 - License MIT
  */
!function (name, definition) {
  if (typeof module != 'undefined') module.exports = definition()
  else if (typeof define == 'function' && typeof define.amd == 'object') define(definition)
  else this[name] = definition()
}('domready', function (ready) {

  var fns = [], fn, f = false
    , doc = document
    , testEl = doc.documentElement
    , hack = testEl.doScroll
    , domContentLoaded = 'DOMContentLoaded'
    , addEventListener = 'addEventListener'
    , onreadystatechange = 'onreadystatechange'
    , readyState = 'readyState'
    , loadedRgx = hack ? /^loaded|^c/ : /^loaded|c/
    , loaded = loadedRgx.test(doc[readyState])

  function flush(f) {
    loaded = 1
    while (f = fns.shift()) f()
  }

  doc[addEventListener] && doc[addEventListener](domContentLoaded, fn = function () {
    doc.removeEventListener(domContentLoaded, fn, f)
    flush()
  }, f)


  hack && doc.attachEvent(onreadystatechange, fn = function () {
    if (/^c/.test(doc[readyState])) {
      doc.detachEvent(onreadystatechange, fn)
      flush()
    }
  })

  return (ready = hack ?
    function (fn) {
      self != top ?
        loaded ? fn() : fns.push(fn) :
        function () {
          try {
            testEl.doScroll('left')
          } catch (e) {
            return setTimeout(function() { ready(fn) }, 50)
          }
          fn()
        }()
    } :
    function (fn) {
      loaded ? fn() : fns.push(fn)
    })
})

},{}],4:[function(require,module,exports){
function read(file) {
    var fs = require('fs');
    var chr = fs.readFileSync(file, 'binary');

    return load(chr);
}

function load(chr) {
    var chrSize = chr.length;
    var sprites = [];

    for (var i =0; i < chrSize; i++) {
        sprites.push(chr.charCodeAt(i) && 0xFF);
    }

    return sprites;
}

function decode(channelA, channelB) {
    var sprite = [];
    var a, b, line, bit, pixel, y;

    for (y=0; y <8; y++) {
        a = channelA[y];
        b = channelB[y];
        line = [];
        for (var x=0; x <8; x++) {
            bit = Math.pow(2,7-x);
            pixel = -1;
            if (!(a & bit) && !(b & bit)) {
                pixel = 0;
            } else if ((a & bit) && !(b & bit)) {
                pixel = 1;
            } else if (!(a & bit) && (b & bit)) {
                pixel = 2;
            } else if ((a & bit) && (b & bit)) {
                pixel = 3;
            }
            line.push(pixel);
        }
        sprite.push(line);
    }
    return sprite;
}

function get(index, sprites) {
    var a = index * 16;
    var b = a + 8;
    var c = b + 8;
    var channelA = sprites.slice(a, b);
    var channelB = sprites.slice(b, c);

    return decode(channelA, channelB);
}

function put(index, sprites, sprite) {
    var start = index * 16;
    var encoded = this.encode_sprite(spr);
    var i, j;

    for (i=start, j=0; i < (start + 16); i++, j++){
        sprites[i] = encoded[j];
    }
    return sprites;
}

function encode(sprite) {
    var channelA = [];
    var channelB = [];

    var a, b, pixel, bit, x, y;

    for (y=0; y <8; y++){
        a = 0;
        b = 0;
        for (x=0; x < 8; x++){
            pixel = spr[y][x];
            bit = Math.pow(2,7-x);
            switch(pixel){
                case 1:
                    a = a | bit;
                    break;
                case 2:
                    b = b | bit;
                    break;
                case 3:
                    a = a | bit;
                    b = b | bit;
                    break;
            }
        }
        channelA.push(a);
        channelB.push(b);
    }
    return channelA.concat(channelB);
}

module.exports.load = load;
module.exports.get = get;
module.exports.put = put;
module.exports.read = read;

},{"fs":2}]},{},[1])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvbWF0dXphay93b3Jrc3BhY2UvbmVzbHktY2hyLWVkaXQvYnJvd3Nlci9tYWluLmpzIiwiL1VzZXJzL21hdHV6YWsvd29ya3NwYWNlL25lc2x5LWNoci1lZGl0L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLWJ1aWx0aW5zL2J1aWx0aW4vZnMuanMiLCIvVXNlcnMvbWF0dXphay93b3Jrc3BhY2UvbmVzbHktY2hyLWVkaXQvbm9kZV9tb2R1bGVzL2RvbXJlYWR5L3JlYWR5LmpzIiwiL1VzZXJzL21hdHV6YWsvd29ya3NwYWNlL25lc2x5LWNoci1lZGl0L25vZGVfbW9kdWxlcy9uZXNseS1zcHJpdGUvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgZG9tcmVhZHkgPSByZXF1aXJlKCdkb21yZWFkeScpO1xudmFyIG5lc2x5U3ByaXRlID0gcmVxdWlyZSgnbmVzbHktc3ByaXRlJyk7XG5cbmRvbXJlYWR5KGZ1bmN0aW9uICgpIHtcbiAgICBjb25zb2xlLmxvZygndGhlIGRvbSBpcyByZWFkeSEnKTtcbiAgICB2YXIgc3ByaXRlRWRpdG9yID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3Nwcml0ZS1lZGl0b3InKTtcbiAgICB2YXIgZmlsZURyb3A9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5maWxlLWRyb3AnKTtcblxuICAgIGNvbnNvbGUubG9nKGZpbGVEcm9wKTtcbiAgICBmaWxlRHJvcC5vbmRyYWdvdmVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmNsYXNzTmFtZSA9ICdwdXJlLXUtMSBmaWxlLWRyb3AgaG92ZXInO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfTtcblxuICAgIGZpbGVEcm9wLm9uZHJhZ2VuZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5jbGFzc05hbWUgPSAncHVyZS11LTEgZmlsZS1kcm9wJztcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH07XG5cbnZhciBwYWxldHRlID0gW1xuICAgIDB4Nzg4MDg0LCAweDAwMDBmYywgMHgwMDAwYzQsIDB4NDAyOGM0LFxuICAgIDB4OTQwMDhjLCAweGFjMDAyOCwgMHhhYzEwMDAsIDB4OGMxODAwLFxuICAgIDB4NTAzMDAwLCAweDAwNzgwMCwgMHgwMDY4MDAsIDB4MDA1ODAwLFxuICAgIDB4MDA0MDU4LCAweDAwMDAwMCwgMHgwMDAwMDAsIDB4MDAwMDA4LFxuXG4gICAgMHhiY2MwYzQsIDB4MDA3OGZjLCAweDAwODhmYywgMHg2ODQ4ZmMsXG4gICAgMHhkYzAwZDQsIDB4ZTQwMDYwLCAweGZjMzgwMCwgMHhlNDY5MTgsXG4gICAgMHhhYzgwMDAsIDB4MDBiODAwLCAweDAwYTgwMCwgMHgwMGE4NDgsXG4gICAgMHgwMDg4OTQsIDB4MmMyYzJjLCAweDAwMDAwMCwgMHgwMDAwMDAsXG5cbiAgICAweGZjZjhmYywgMHgzOGMwZmMsIDB4Njg4OGZjLCAweDljNzhmYyxcbiAgICAweGZjNzhmYywgMHhmYzU4OWMsIDB4ZmM3ODU4LCAweGZjYTA0OCxcbiAgICAweGZjYjgwMCwgMHhiY2Y4MTgsIDB4NThkODU4LCAweDU4Zjg5YyxcbiAgICAweDAwZThlNCwgMHg2MDYwNjAsIDB4MDAwMDAwLCAweDAwMDAwMCxcblxuICAgIDB4ZmNmOGZjLCAweGE0ZThmYywgMHhiY2I4ZmMsIDB4ZGNiOGZjLFxuICAgIDB4ZmNiOGZjLCAweGY0YzBlMCwgMHhmNGQwYjQsIDB4ZmNlMGI0LFxuICAgIDB4ZmNkODg0LCAweGRjZjg3OCwgMHhiOGY4NzgsIDB4YjBmMGQ4LFxuICAgIDB4MDBmOGZjLCAweGM4YzBjMCwgMHgwMDAwMDAsIDB4MDAwMDAwXG5dO1xuXG5cbiAgICBmaWxlRHJvcC5vbmRyb3AgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICB0aGlzLmNsYXNzTmFtZSA9ICcnO1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgdmFyIGZpbGUgPSBlLmRhdGFUcmFuc2Zlci5maWxlc1swXSxcbiAgICAgICAgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcbiAgICAgICAgcmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGV2ZW50LnRhcmdldC5yZXN1bHQ7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhyZXN1bHQpO1xuXG4gICAgICAgICAgICB2YXIgc3ByaXRlcyA9IG5lc2x5U3ByaXRlLmxvYWQocmVzdWx0KTtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coc3ByaXRlcyk7XG5cbiAgICAgICAgICAgIC8vIHRlc3RpbmdcbiAgICAgICAgICAgIHZhciBjb250ZXh0ID0gc3ByaXRlRWRpdG9yLmdldENvbnRleHQoJzJkJyk7XG4gICAgICAgICAgICB2YXIgc3ByaXRlU2l6ZSA9IDI1NjtcbiAgICAgICAgICAgIHZhciBpbWFnZURhdGEgPSBjb250ZXh0LmdldEltYWdlRGF0YSgwLCAwLCBzcHJpdGVTaXplLCBzcHJpdGVTaXplKTtcbiAgICAgICAgICAgIHZhciBzcHJpdGUgPSBuZXNseVNwcml0ZS5nZXQoMCwgc3ByaXRlcyk7XG4gICAgICAgICAgICBuZXdJbWFnZURhdGEgPSBmaWxsQ2FudmFzKHNwcml0ZSwgaW1hZ2VEYXRhLmRhdGEsIHBhbGV0dGUsIDMyLCAwKTtcbiAgICAgICAgICAgIGNvbnRleHQucHV0SW1hZ2VEYXRhKG5ld0ltYWdlRGF0YSwgMCwgMCk7XG4gICAgICAgIH07XG4gICAgICAgIHJlYWRlci5yZWFkQXNEYXRhVVJMKGZpbGUpO1xuXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9O1xufSk7XG5cbmZ1bmN0aW9uIGZpbGxDYW52YXMoc3ByaXRlLCBpbWFnZURhdGEsIHBhbGV0dGUsIHNpemUsIHBhZGRpbmcpe1xuXG4gICAgdmFyIGdldENvbG9yID0gZnVuY3Rpb24gKGluZGV4KSB7XG4gICAgICAgIHJldHVybiBwYWxldHRlW2luZGV4XTtcbiAgICB9O1xuXG4gICAgaWYgKHBhZGRpbmcgPT09IHVuZGVmaW5lZCl7XG4gICAgICAgIHBhZGRpbmcgPSAwO1xuICAgIH1cbiAgICB2YXIgYSA9IDA7XG4gICAgZm9yICh2YXIgeT0wOyB5IDwgOCpzaXplOyB5Kyspe1xuICAgICAgICBmb3IgKHZhciB4PTA7IHggPCA4KnNpemU7IHgrKykge1xuICAgICAgICAgICAgdmFyIHB4ID0gKHgvc2l6ZSkgPj4gMDtcbiAgICAgICAgICAgIHZhciBweSA9ICh5L3NpemUpID4+IDA7XG4gICAgICAgICAgICB2YXIgY29sb3JfaW5kZXggPSBwYWxldHRlW3NwcnRbcHldW3B4XV07XG4gICAgICAgICAgICB2YXIgY29sb3IgPSBnZXRDb2xvcihjb2xvcl9pbmRleCk7XG4gICAgICAgICAgICBpbWFnZURhdGFbYV0gPSAoY29sb3IgPj4gMTYpICYgMHhmZjtcbiAgICAgICAgICAgIGltYWdlRGF0YVthKzFdID0gKGNvbG9yID4+IDgpICYgMHhmZjtcbiAgICAgICAgICAgIGltYWdlRGF0YVthKzJdID0gY29sb3IgJiAweGZmO1xuICAgICAgICAgICAgaW1hZ2VEYXRhW2ErM10gPSAweGZmO1xuICAgICAgICAgICAgYSArPSA0O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGltYWdlRGF0YTtcbn1cbiIsIlxuLy8gbm90IGltcGxlbWVudGVkXG4vLyBUaGUgcmVhc29uIGZvciBoYXZpbmcgYW4gZW1wdHkgZmlsZSBhbmQgbm90IHRocm93aW5nIGlzIHRvIGFsbG93XG4vLyB1bnRyYWRpdGlvbmFsIGltcGxlbWVudGF0aW9uIG9mIHRoaXMgbW9kdWxlLlxuIiwiLyohXG4gICogZG9tcmVhZHkgKGMpIER1c3RpbiBEaWF6IDIwMTIgLSBMaWNlbnNlIE1JVFxuICAqL1xuIWZ1bmN0aW9uIChuYW1lLCBkZWZpbml0aW9uKSB7XG4gIGlmICh0eXBlb2YgbW9kdWxlICE9ICd1bmRlZmluZWQnKSBtb2R1bGUuZXhwb3J0cyA9IGRlZmluaXRpb24oKVxuICBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09ICdmdW5jdGlvbicgJiYgdHlwZW9mIGRlZmluZS5hbWQgPT0gJ29iamVjdCcpIGRlZmluZShkZWZpbml0aW9uKVxuICBlbHNlIHRoaXNbbmFtZV0gPSBkZWZpbml0aW9uKClcbn0oJ2RvbXJlYWR5JywgZnVuY3Rpb24gKHJlYWR5KSB7XG5cbiAgdmFyIGZucyA9IFtdLCBmbiwgZiA9IGZhbHNlXG4gICAgLCBkb2MgPSBkb2N1bWVudFxuICAgICwgdGVzdEVsID0gZG9jLmRvY3VtZW50RWxlbWVudFxuICAgICwgaGFjayA9IHRlc3RFbC5kb1Njcm9sbFxuICAgICwgZG9tQ29udGVudExvYWRlZCA9ICdET01Db250ZW50TG9hZGVkJ1xuICAgICwgYWRkRXZlbnRMaXN0ZW5lciA9ICdhZGRFdmVudExpc3RlbmVyJ1xuICAgICwgb25yZWFkeXN0YXRlY2hhbmdlID0gJ29ucmVhZHlzdGF0ZWNoYW5nZSdcbiAgICAsIHJlYWR5U3RhdGUgPSAncmVhZHlTdGF0ZSdcbiAgICAsIGxvYWRlZFJneCA9IGhhY2sgPyAvXmxvYWRlZHxeYy8gOiAvXmxvYWRlZHxjL1xuICAgICwgbG9hZGVkID0gbG9hZGVkUmd4LnRlc3QoZG9jW3JlYWR5U3RhdGVdKVxuXG4gIGZ1bmN0aW9uIGZsdXNoKGYpIHtcbiAgICBsb2FkZWQgPSAxXG4gICAgd2hpbGUgKGYgPSBmbnMuc2hpZnQoKSkgZigpXG4gIH1cblxuICBkb2NbYWRkRXZlbnRMaXN0ZW5lcl0gJiYgZG9jW2FkZEV2ZW50TGlzdGVuZXJdKGRvbUNvbnRlbnRMb2FkZWQsIGZuID0gZnVuY3Rpb24gKCkge1xuICAgIGRvYy5yZW1vdmVFdmVudExpc3RlbmVyKGRvbUNvbnRlbnRMb2FkZWQsIGZuLCBmKVxuICAgIGZsdXNoKClcbiAgfSwgZilcblxuXG4gIGhhY2sgJiYgZG9jLmF0dGFjaEV2ZW50KG9ucmVhZHlzdGF0ZWNoYW5nZSwgZm4gPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKC9eYy8udGVzdChkb2NbcmVhZHlTdGF0ZV0pKSB7XG4gICAgICBkb2MuZGV0YWNoRXZlbnQob25yZWFkeXN0YXRlY2hhbmdlLCBmbilcbiAgICAgIGZsdXNoKClcbiAgICB9XG4gIH0pXG5cbiAgcmV0dXJuIChyZWFkeSA9IGhhY2sgP1xuICAgIGZ1bmN0aW9uIChmbikge1xuICAgICAgc2VsZiAhPSB0b3AgP1xuICAgICAgICBsb2FkZWQgPyBmbigpIDogZm5zLnB1c2goZm4pIDpcbiAgICAgICAgZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICB0ZXN0RWwuZG9TY3JvbGwoJ2xlZnQnKVxuICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkgeyByZWFkeShmbikgfSwgNTApXG4gICAgICAgICAgfVxuICAgICAgICAgIGZuKClcbiAgICAgICAgfSgpXG4gICAgfSA6XG4gICAgZnVuY3Rpb24gKGZuKSB7XG4gICAgICBsb2FkZWQgPyBmbigpIDogZm5zLnB1c2goZm4pXG4gICAgfSlcbn0pXG4iLCJmdW5jdGlvbiByZWFkKGZpbGUpIHtcbiAgICB2YXIgZnMgPSByZXF1aXJlKCdmcycpO1xuICAgIHZhciBjaHIgPSBmcy5yZWFkRmlsZVN5bmMoZmlsZSwgJ2JpbmFyeScpO1xuXG4gICAgcmV0dXJuIGxvYWQoY2hyKTtcbn1cblxuZnVuY3Rpb24gbG9hZChjaHIpIHtcbiAgICB2YXIgY2hyU2l6ZSA9IGNoci5sZW5ndGg7XG4gICAgdmFyIHNwcml0ZXMgPSBbXTtcblxuICAgIGZvciAodmFyIGkgPTA7IGkgPCBjaHJTaXplOyBpKyspIHtcbiAgICAgICAgc3ByaXRlcy5wdXNoKGNoci5jaGFyQ29kZUF0KGkpICYmIDB4RkYpO1xuICAgIH1cblxuICAgIHJldHVybiBzcHJpdGVzO1xufVxuXG5mdW5jdGlvbiBkZWNvZGUoY2hhbm5lbEEsIGNoYW5uZWxCKSB7XG4gICAgdmFyIHNwcml0ZSA9IFtdO1xuICAgIHZhciBhLCBiLCBsaW5lLCBiaXQsIHBpeGVsLCB5O1xuXG4gICAgZm9yICh5PTA7IHkgPDg7IHkrKykge1xuICAgICAgICBhID0gY2hhbm5lbEFbeV07XG4gICAgICAgIGIgPSBjaGFubmVsQlt5XTtcbiAgICAgICAgbGluZSA9IFtdO1xuICAgICAgICBmb3IgKHZhciB4PTA7IHggPDg7IHgrKykge1xuICAgICAgICAgICAgYml0ID0gTWF0aC5wb3coMiw3LXgpO1xuICAgICAgICAgICAgcGl4ZWwgPSAtMTtcbiAgICAgICAgICAgIGlmICghKGEgJiBiaXQpICYmICEoYiAmIGJpdCkpIHtcbiAgICAgICAgICAgICAgICBwaXhlbCA9IDA7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKChhICYgYml0KSAmJiAhKGIgJiBiaXQpKSB7XG4gICAgICAgICAgICAgICAgcGl4ZWwgPSAxO1xuICAgICAgICAgICAgfSBlbHNlIGlmICghKGEgJiBiaXQpICYmIChiICYgYml0KSkge1xuICAgICAgICAgICAgICAgIHBpeGVsID0gMjtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoKGEgJiBiaXQpICYmIChiICYgYml0KSkge1xuICAgICAgICAgICAgICAgIHBpeGVsID0gMztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxpbmUucHVzaChwaXhlbCk7XG4gICAgICAgIH1cbiAgICAgICAgc3ByaXRlLnB1c2gobGluZSk7XG4gICAgfVxuICAgIHJldHVybiBzcHJpdGU7XG59XG5cbmZ1bmN0aW9uIGdldChpbmRleCwgc3ByaXRlcykge1xuICAgIHZhciBhID0gaW5kZXggKiAxNjtcbiAgICB2YXIgYiA9IGEgKyA4O1xuICAgIHZhciBjID0gYiArIDg7XG4gICAgdmFyIGNoYW5uZWxBID0gc3ByaXRlcy5zbGljZShhLCBiKTtcbiAgICB2YXIgY2hhbm5lbEIgPSBzcHJpdGVzLnNsaWNlKGIsIGMpO1xuXG4gICAgcmV0dXJuIGRlY29kZShjaGFubmVsQSwgY2hhbm5lbEIpO1xufVxuXG5mdW5jdGlvbiBwdXQoaW5kZXgsIHNwcml0ZXMsIHNwcml0ZSkge1xuICAgIHZhciBzdGFydCA9IGluZGV4ICogMTY7XG4gICAgdmFyIGVuY29kZWQgPSB0aGlzLmVuY29kZV9zcHJpdGUoc3ByKTtcbiAgICB2YXIgaSwgajtcblxuICAgIGZvciAoaT1zdGFydCwgaj0wOyBpIDwgKHN0YXJ0ICsgMTYpOyBpKyssIGorKyl7XG4gICAgICAgIHNwcml0ZXNbaV0gPSBlbmNvZGVkW2pdO1xuICAgIH1cbiAgICByZXR1cm4gc3ByaXRlcztcbn1cblxuZnVuY3Rpb24gZW5jb2RlKHNwcml0ZSkge1xuICAgIHZhciBjaGFubmVsQSA9IFtdO1xuICAgIHZhciBjaGFubmVsQiA9IFtdO1xuXG4gICAgdmFyIGEsIGIsIHBpeGVsLCBiaXQsIHgsIHk7XG5cbiAgICBmb3IgKHk9MDsgeSA8ODsgeSsrKXtcbiAgICAgICAgYSA9IDA7XG4gICAgICAgIGIgPSAwO1xuICAgICAgICBmb3IgKHg9MDsgeCA8IDg7IHgrKyl7XG4gICAgICAgICAgICBwaXhlbCA9IHNwclt5XVt4XTtcbiAgICAgICAgICAgIGJpdCA9IE1hdGgucG93KDIsNy14KTtcbiAgICAgICAgICAgIHN3aXRjaChwaXhlbCl7XG4gICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICBhID0gYSB8IGJpdDtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgICAgICBiID0gYiB8IGJpdDtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICAgICAgICBhID0gYSB8IGJpdDtcbiAgICAgICAgICAgICAgICAgICAgYiA9IGIgfCBiaXQ7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNoYW5uZWxBLnB1c2goYSk7XG4gICAgICAgIGNoYW5uZWxCLnB1c2goYik7XG4gICAgfVxuICAgIHJldHVybiBjaGFubmVsQS5jb25jYXQoY2hhbm5lbEIpO1xufVxuXG5tb2R1bGUuZXhwb3J0cy5sb2FkID0gbG9hZDtcbm1vZHVsZS5leHBvcnRzLmdldCA9IGdldDtcbm1vZHVsZS5leHBvcnRzLnB1dCA9IHB1dDtcbm1vZHVsZS5leHBvcnRzLnJlYWQgPSByZWFkO1xuIl19
;