window.Event = new Vue();

Vue.component('fengrid', {
  template: `
    <div class="navGrid">
      <div
        v-for="cell in board"
        class="navCell">
          <div class="navCellHigh">
            <span>{{cell.index}}</span>
          </div>
          <div class="navCellMid">
            <span>{{cell.value}}</span>
          </div>
          <div class="navCellLow">
            <span>x:{{cell.x}}, y:{{cell.y}}</span>
          </div>
      </div>
    </div>
  `,
  computed: {
    board: function() {
      var self = this, grid = [];
      for (var i = 0; i < this.$root.TOTAL; i++) {
        var child = {
          index: i,
          value: this.$root.FEN[i],
          x: this.$root.iGetPos(i)[1],
          y: this.$root.iGetPos(i)[0],
        };
        grid.push(child);
      }
      return grid;
    }
  }
})

Vue.component('logic', {
  template : `
  <div class="logic">
    <div class="annoBounds">
      <span class="label"> raw </span>
      <span class="anno"> {{raw}} </span>
    </div>
    <div class="annoBounds">
      <span class="label"> ugly </span>
      <span class="anno"> {{ugly}} </span>
    </div>
    <div class="annoBounds">
      <span class="label"> pretty </span>
      <span class="anno"> {{pretty}} </span>
    </div>
    <div class="userFEN">
      <input class="userInput" v-model="raw"/>
    </div>
  </div>
  `,
  data() {
    return {
      raw: this.$root.FEN,
      pretty: this.$root.FENpretty,
      ugly: this.$root.FENugly,
    }
  },
})
var app = new Vue({
  el: '#app',
  data: {
    ROWS: 8,
    COLS: 8,
    X: 0,
    Y: 0,
    FENdex: 0,
    FEN: 'RKBZQBKRPPPPPP1P111111P111111111111p111111111111ppp1pppprkbzqbkr',
    rx: {
      unique: /[a-zA-Z]|(\d*)/gm,
      empty: /^$/gm,
      isWord: /[^\d]/,
      lowercase: /[a-z]/,
      single: /./,
      isRaw: /^[a-zA-Z1]*$/,
      isUgly: /^[a-zA-Z1\/]*\/[a-zA-Z1]*$/,
      isPretty: /(\w|\/)*\/\w{1,7}\/(\w|\/)*$/,
    },
  },
  computed: {
    LAST: function() {
      return this.TOTAL - 1;
    },
    TOTAL: function() {
      return this.ROWS * this.COLS;
    },
    FENugly: function() {
      return this.buildFEN(this.FEN).ugly;
    },
    FENpretty: function() {
      return this.buildFEN(this.FENugly).pretty;
    },
  },
  methods: {
    FENotype: function(str) {
      var result = '';
      if (this.rx.isRaw.test(str)) {
        result = 'raw'
      } else {
        if (this.rx.isPretty.test(str))
          result = 'pretty'
        else if (this.rx.isUgly.test(str))
          result = 'ugly'
        else
          result = 'unrecognized'
      }
      return result;
    },
    buildFEN: function(str) {
      var self = this;
      return FEN = {
        raw: str,
        pretty: self.prettify(str),
        ugly: self.uglify(str),
      }
    },
    prettify: function(str) {
      var result = str.split('/');
      var conv = '';
      for (var i = 0; i < result.length; i++) {
        var match = result[i].match(this.rx.unique);
        match.pop();
        for (var e = 0; e < match.length; e++) {
          if (this.rx.isWord.test(match[e]))
            conv += match[e]
          else
            conv += match[e].length
        }
        if (i < result.length - 1)
          conv += '/'
      }
      return conv;
    },
    uglify: function(str) {
      var self = this;
      var result = this.chunkString(str, self.ROWS);
      var conv = '';
      for (var i = 0; i < result.length; i++) {
        conv += result[i];
        if (i < result.length - 1)
          conv += '/'
      }
      return conv;
    },
    iGetRange: function(index) {
      var match = false;
      var minmax = this.iGetMinMax();
      for (var i = 0; i < minmax.length; i++) {
        if ((index >= minmax[i][0]) && (index <= minmax[i][1])) {
          match = i;
          break;
        } else {
          continue;
        }
      };
      this.iGetBounds(match);
      return match;
    },
    iGetPos: function(index) {
      return [this.iGetRange(index), index % this.ROWS]
    },
    iGetChar: function(index) {
      return this.FEN[index];
    },
    iGetCompass: function(index) {
      var canMove = {
        i: index,
        N: !this.iGetPos(index)[0] < 1,
        E: this.iGetPos(index)[1] !== this.ROWS - 1,
        S: this.iGetPos(index)[0] !== this.COLS - 1,
        W: !this.iGetPos(index)[1] < 1
      }
      return canMove;
    },
    iGetBounds: function(match) {
      var bounds = [];
      bounds.push((match >= 0) ? (match < this.TOTAL) ? true : false : false);
      return bounds;
    },
    iGetMinMax: function() {
      var ranges = [];
      for (var i = 0; i < this.ROWS; i++)
        ranges.push([i * this.ROWS, i * this.ROWS + this.ROWS - 1]);
      return ranges;
    },
    iPreview: function(index) {
      if (this.iGetBounds(index)[0]) {
        console.log(`FEN[${index}] = ${this.iGetChar(index)}
        x: ${this.iGetPos(index)[0]}, y: ${this.iGetPos(index)[1]}
        inside: ${this.iGetBounds(index)[0]}
        N: ${this.iGetCompass(index)['N']}, E: ${this.iGetCompass(index)['E']},
        S: ${this.iGetCompass(index)['S']}, W: ${this.iGetCompass(index)['W']}`);
      } else {
        console.log(`FEN[${index}] = False attempt
        inside: ${this.iGetBounds(index)[0]}`);
      }
    },
    datum: function() {
      console.log(`${this.ROWS} x ${this.COLS} grid of ${this.TOTAL} tiles`);
    },
    // https://stackoverflow.com/questions/7033639/split-large-string-in-n-size-chunks-in-javascript/14349616#14349616
    chunkString(str, len) {
      var _size = Math.ceil(str.length/len), _ret  = new Array(_size), _offset;
      for (var _i=0; _i<_size; _i++)
        _offset = _i * len, _ret[_i] = str.substring(_offset, _offset + len);
      return _ret;
    },
    getCSS(prop) {
      return window.getComputedStyle(document.documentElement).getPropertyValue('--' + prop);
    },
    setCSS(prop, data){
      document.documentElement.style.setProperty('--' + prop, data);
    }
  },
  mounted: function () {
    this.datum();
    this.iPreview(62);

  },
  beforeDestroy: function () {

  },
});
