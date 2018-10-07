window.Event = new Vue();

Vue.component('toolbar', {
  template: `
  <div class="gameElts">
    <gamepad></gamepad>
    <navpreview></navpreview>
    <navpad></navpad>
  </div>
  `,
  data() {
    return {
      msg: 'Hello there'
    }
  }
})

Vue.component('gamepad', {
  template: `
  <div class="gameWrap">
    <svg id="gameNav" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
      <g v-for="wind in directions"
        :id="wind.name">
        <rect class="bumper" :x="wind.x" :y="wind.y" :width="wind.w" :height="wind.h" :rx="wind.bx" :ry="wind.bx"/>
        <polygon :class="wind.iconClass" :points="wind.iconPoints"/>
      </g>
      <rect id="core" class="bumpCore" x="55.5" y="55.5" width="90" height="90"/>
      <rect id="frame" class="bumpFrame" width="200" height="200"/>
    </svg>
  </div>
  `,
  data() {
    return {
      directions: [
        {
          name: 'NW',
          x: '2.5',
          y: '2.5',
          w: '45',
          h: '45',
          bx: '4.5',
          iconPoints: '20.5 34.9 20.5 20.5 34.9 20.5 20.5 34.9',
        },
      ]
    }
  }
})

Vue.component('navpreview', {
  // <div v-for="cell in child" class="navPreview-Cell"><span>{{ifExist(cell)}}</span></div>
  template: `
  <div class="navPreview">
    <div class="navPreview-Cell"><span>{{child.NW}}</span></div>
    <div class="navPreview-Cell"><span>{{child.N}}</span></div>
    <div class="navPreview-Cell"><span>{{child.NE}}</span></div>
    <div class="navPreview-Cell"><span>{{child.W}}</span></div>
    <div class="navPreview-Cell"><span>{{child.I}}</span></div>
    <div class="navPreview-Cell"><span>{{child.E}}</span></div>
    <div class="navPreview-Cell"><span>{{child.SW}}</span></div>
    <div class="navPreview-Cell"><span>{{child.S}}</span></div>
    <div class="navPreview-Cell"><span>{{child.SE}}</span></div>
  </div>
  `,
  data() {
    return {
      child: {
        N: '',
        NE: '',
        E: '',
        SE: '',
        S: '',
        SW: '',
        W: '',
        NW: '',
        I: '',
      }
      // N:
    }
  },
  methods: {
    getPotential: function(index) {
      var grid = this.$root.$children[1];
      var scan = grid.iGetPotentialMoves(index);
      scan['I'] = index;
      var mirror = {};
      for (let [key,value] of Object.entries(scan)) {
        if (value > (-1)) {
          mirror[key] = this.$root.iGetChar(value);
          // console.log(`${key}: ${value}`);
        }
      }
      this.chessboardPiece(index);
      this.child = mirror;
    },
    chessboardPiece: function(index) {
      var pieces = {
        p: 'pawn',
        r: 'rook',
        k: 'knight',
        b: 'bishop',
        q: 'queen',
        z: 'king',
      };
      // var temp = this.$root.grid[index];
      // console.log(this.$root.grid);
      // if (this.$root.grid[index].hasChar) {
      //   for (let [key, value] in Object.entries(pieces)) {
      //     var type = RegExp(this.$root.grid[index].value.charAt(0), 'i');
      //     if (type.test(value))
      //       console.log(`match at ${value}`);
      //   }
      //   style += 'fa fa-2x fa-chess-';
      // } else {
      //   style += 'noChar';
      // }
    }
  },
  mounted() {
    var self = this;
    Event.$on('navPad-update', this.getPotential)
    // this.getPotential(27);
  }
})

Vue.component('navpad', {
  template: `
  <div class="navPad">
    <div class="navPad-Corner"><span>{{(child.NW > -1) ? child.NW : ''}}</span></div>
    <div class="navPad-Bumper"><span>{{(child.N > -1) ? child.N : ''}}</span></div>
    <div class="navPad-Corner"><span>{{(child.NE > -1) ? child.NE : ''}}</span></div>
    <div class="navPad-Bumper"><span>{{(child.W > -1) ? child.W : ''}}</span></div>
    <div class="navPad-Center"><span>{{(child.I > -1) ? child.I : ''}}</span></div>
    <div class="navPad-Bumper"><span>{{(child.E > -1) ? child.E : ''}}</span></div>
    <div class="navPad-Corner"><span>{{(child.SW > -1) ? child.SW : ''}}</span></div>
    <div class="navPad-Bumper"><span>{{(child.S > -1) ? child.S : ''}}</span></div>
    <div class="navPad-Corner"><span>{{(child.SE > -1) ? child.SE : ''}}</span></div>
  </div>
  `,
  data() {
    return {
      child: {
        N: '',
        NE: '',
        E: '',
        SE: '',
        S: '',
        SW: '',
        W: '',
        NW: '',
        I: '',
      },
      selection: '',
    }
  },
  methods: {
    getPotential: function(index) {
      var grid = this.$root.$children[1];
      var scan = grid.iGetPotentialMoves(index);
      scan['I'] = index;
      this.child = scan;
    }
  },
  mounted() {
    var self = this;
    Event.$on('navPad-update', this.getPotential)
    // this.getPotential(27);
  }
})

Vue.component('fengrid', {
  template: `
    <div class="navGrid">
      <div
        v-for="cell in grid"
        :key="cell.index"
        :class="cellClass(cell)"
        @mouseover="hover(cell.index, $event)"
        @mouseout="hoverOut(cell.index, $event)"
        @click="select(cell, $event)">
          <div class="navAnnoHigh">
            <span>{{cell.index}}</span>
            <span v-if="cell.details" class="navAnnoType">{{(cell.hasChar)?'char':'bg'}}</span>
          </div>
          <div class="navAnnoMid">
            <span>{{cell.value}}</span>
          </div>
          <div class="navAnnoLow">
            <span>x:{{cell.x}}, y:{{cell.y}}</span>
          </div>
      </div>
    </div>
  `,
  data() {
    return {
      grid: [],
      hasSelection: false,
      selection: {
        index: false,
      },
      selectedIndex: false,
    }
  },
  methods: {
    cellClass: function(cell) {
      this.checkSelected();
      var style = 'navCell';
      if (cell.isSelected) {
        style += '-Selected';
      } else if (cell.isActive) {
        style += '-Active'
        // style += this.grid[cell.index].isActive ? '-Active' : '-Idle';
      } else if (cell.isPath) {
        if (cell.hasChar) {
          style += '-Char'
        } else {
          style += '-Path'
        }
        // style += this.grid[cell.index].isPath ? ' nav-Path' : '';
      } else {
        style += '-Idle'
      }
      return style;
    },
    hoverToggle: function(val, index, evt) {
      if (!this.grid[index].isSelected) {
        this.grid[index].isActive = val;
        this.grid[index].details = val;
      }
      if (this.grid[index].isPath) {
        console.log('Can travel');
      }
      if (this.grid[index].isActive) {
        if (this.$root.Shift) {
          this.highlightSteps(index, 1);
          this.iGetPotentialMoves(index);
          Event.$emit('navPad-update', index);
        }
      }
      this.$root.iParseModifiers(evt);
    },
    hover: function(index, evt) {
      // if (this.$root.Shift)
      if (!this.hasSelection) {
        this.hoverToggle(true, index, evt);
      }
      // this.iMove(index, 'N')
    },
    hoverOut: function(index, evt) {
      if (!this.hasSelection) {
        this.hoverToggle(false, index, evt);
        this.clearPath(index);
      }
      this.$root.iParseModifiers(evt);
    },
    // select: function(cell, evt) {
    //   // ????
    //   if (this.selection) {
    //     console.log(`Has a selection`);
    //     console.log(`${this.selectedIndex}, ${cell.index}`);
    //     var siblings = this.iGetPotentialMoves(this.selectedIndex);
    //     var matches = [], dir = false, self = this;
    //     // console.log(siblings);
    //     var wind = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    //     for (var i = 0; i < wind.length; i++) {
    //       var thisWind = wind[i];
    //       var result = (cell.index == siblings[thisWind]);
    //       if (result) {
    //         console.log(`${cell.index} == ${siblings[thisWind]} : ${result}`);
    //         matches.push(cell.index);
    //         // var charCheck = this.$root.grid[cindex];
    //         // console.log(`${cindex}`);
    //         // console.log(charCheck);
    //         this.$root.iSwitchChars(self.selection.index, cell.index);
    //         this.resetSelection(cell);
    //         break;
    //       }
    //     }
    //     console.log(matches);
    //     if (!matches.length) {
    //       // console.log('What is this?');
    //       // this.resetSelection(cell);
    //       // this.clearSelected();
    //       // this.clearPath();
    //       // cell.isActive = true;
    //       // this.selection = cell;
    //       // this.highlightSteps(cell.index, 1);
    //       // this.iGetPotentialMoves(cell.index);
    //       // Event.$emit('navPad-update', cell.index);
    //     }
    //     console.log(siblings);
    //   // } else if (this.selectedIndex == cell.index) {
    //   //   this.clearPath();
    //   //   this.clearSelected();
    //   } else {
    //     console.log('Does not have selection');
    //     var toggle = cell.isSelected;
    //     this.clearSelected();
    //     // console.log(`This was toggled ${!toggle}`);
    //     // console.log(evt);
    //     this.$root.iParseModifiers(evt);
    //     cell.isSelected = !toggle;
    //   }
    //   // if (cell.isSelected) {
    //   //   console.log('This is already selected');
    //   //   this.clearSelected();
    //   //   this.clearPath();
    //   //   cell.isSelected = false;
    //   //   cell.isActive = true;
    //   //   // this.resetSelection();
    //   //   this.selection = '';
    //   //   this.highlightSteps(cell.index, 1);
    //   //   this.iGetPotentialMoves(cell.index);
    //   //   Event.$emit('navPad-update', cell.index);
    //   // }
    // },
    isSibling: function(elt) {
      console.log(`Current selection is ${this.selectedIndex}`);
      var siblings = this.iGetPotentialMoves(this.selectedIndex);
      var matches = [], dir = false, self = this;
      // console.log(siblings);
      var wind = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
      for (var i = 0; i < wind.length; i++) {
        var thisWind = wind[i];
        var result = (elt.index == siblings[thisWind]);
        if (result) {
          console.log(`${elt.index} == ${siblings[thisWind]} : ${result}`);
          matches.push(elt.index);
          // var charCheck = this.$root.grid[cindex];
          // this.$root.iSwitchChars(self.selection.index, elt.index);
          // this.resetSelection(elt);
          break;
        }
      }
      // console.log(siblings);
      // console.log(matches);
      if (matches.length)
        return matches[0];
      else
        return false;
    },
    updateSelection(elt) {
      this.clearSelected();
      this.clearPath();
      elt.isActive = false;
      elt.isSelected = true;
      this.selectedIndex = elt.index;
      console.log('Updated');
      console.log(elt.isSelected);
      // this.selection.hasChar = elt.hasChar;
      // this.selection.
    },
    checkSelected: function() {

      if (this.hasSelection) {
        var targ = this.selectedIndex;
        this.grid[targ].isPath = false;
        this.grid[targ].isActive = false;
        this.grid[targ].isSelected = true;
      }
    },
    select: function(elt, evt) {
      console.log(`Current selection is ${this.selectedIndex}`);
      if (!this.hasSelection) {
        this.updateSelection(elt);
        elt.isSelected = true;
        this.hasSelection = true;
        console.log('No prior selection');
        console.log(`${elt.index}, ${evt}`);
        this.highlightSteps(elt.index, 1);
        Event.$emit('navPad-update', elt.index);
      } else {
        if (elt.isSelected) {
          console.log('Cell was already selected, toggle off');
          elt.isSelected = false;
          elt.isActive = true;
          this.hasSelection = false;
          this.clearPath();
        } else {
          if (this.isSibling(elt)) {
            console.log(`${this.selectedIndex} is sibling to ${elt.index}`);
            this.$root.iSwitchChars(this.selectedIndex, elt.index);
            this.updateSelection(elt);
            this.selectedIndex = elt.index;
            elt.isSelected = true;
            this.highlightSteps(elt.index, 1);
            Event.$emit('navPad-update', elt.index);
          } else {
            console.log(`Changing selection from ${this.selectedIndex} to ${elt.index}`);
            this.clearSelected();
            // this.updateSelection(elt);
            elt.isSelected = true;
            this.hasSelection = true;
            this.highlightSteps(elt.index, 1);
            Event.$emit('navPad-update', elt.index);
          }
        }
        // elt.isSelected = false;
        // console.log(`Selection is ${this.selection}`);
      }

    },
    resetSelection: function(toElt) {
      console.log('Resetting');
      // this.clearSelected();
      this.clearSelected();
      this.clearPath();
      this.hasSelection = toElt|false;
      if (this.hasSelection) {
        toElt.isActive = true;
        this.highlightSteps(toElt.index, 1);
        this.iGetPotentialMoves(toElt.index);
        Event.$emit('navPad-update', toElt.index);
      }
    },
    clearSelected: function(cell) {
      for (var i = 0; i < this.$root.TOTAL; i++) {
        this.grid[i].isSelected = false;
        this.grid[i].isActive = false;
      }
      this.selection = false;
    },
    clearPath: function(cell) {
      for (var i = 0; i < this.$root.TOTAL; i++) {
        this.grid[i].isPath = false;
      }
    },
    getBoard: function() {
      var self = this, grid = [];
      for (var i = 0; i < this.$root.TOTAL; i++) {
        var cell = {
          index: i,
          value: this.$root.FEN[i],
          x: this.$root.iGetPos(i)[1],
          y: this.$root.iGetPos(i)[0],
          isSelected: false,
          isActive: false,
          isPath: false,
          details: false,
        };
        if (this.$root.rx.isWord.test(cell.value))
          cell.hasChar = true;
        else
          cell.hasChar = false;
        grid.push(cell);
      }
      return grid;
    },
    showRoute: function() {

    },
    highlightSteps: function(index, steps) {
      // console.log(`Steps for ${index}`);
      // console.log(`Highlighting ${index} for ${steps} steps`);
      var xs = ['N', 'S'], ys = ['E', 'W'];
      for (var s = 0; s < steps; s++) {
        for (var a = 0; a < xs.length; a++) {
          this.iMove(index, xs[a]);
          this.iMove(index, ys[a]);
          for (var n = 0; n < ys.length; n++) {
            var wind = xs[a] + ys[n];
            this.iMove(index, wind);
          }
        }
      }
    },
    iGetPotentialMoves: function(index) {
      var mirror = {};
      var xs = ['N', 'S'], ys = ['E', 'W'];
      for (var a = 0; a < xs.length; a++) {
        var currentX = xs[a], currentY = ys[a];
        if (this.$root.canStreamInDirection(index, currentX))
          mirror[currentX] = this.$root.iStream(index, currentX);
        else
          mirror[currentX] = -1;
        if (this.$root.canStreamInDirection(index, currentY))
          mirror[currentY] = this.$root.iStream(index, currentY);
        else
          mirror[currentY] = -1;
        for (var n = 0; n < ys.length; n++) {
          var wind = xs[a] + ys[n];
          if (this.$root.canStreamInDirection(index, wind))
            mirror[wind] = this.$root.iStream(index, wind);
          else
            mirror[wind] = -1;
        }
      }
      // console.log(mirror);
      return mirror;
    },
    iMove: function(index, dir, steps) {
      steps = steps|1;
      var result = this.$root.iStream(index, dir, steps);
      if (/NW/.test(dir) || /NE/.test(dir) || /SW/.test(dir) || /SE/.test(dir)) {
        // if ()
      }
      this.grid[result].isPath = true;
    },
    updateBoard: function() {
      console.log('Updating');
      this.grid = this.getBoard();
      this.clearPath();
      this.clearSelected();
    }
  },
  mounted: function () {
    this.updateBoard();
    Event.$on('updateBoard', this.updateBoard);
  },
  // computed: {
  //
  // },
})


Vue.component('fenput', {
  template : `
  <div class="inputFEN">
    <input class="input" v-model="raw"/>
  </div>
  `,
  data() {
    return {
      raw: this.$root.FEN,
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
      double: /../,
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
    canStreamInDirection: function(index, dir) {
      // console.log(`        NW: ${this.iGetCompass(index).NW}, N:${this.iGetCompass(index).N}, NE: ${this.iGetCompass(index).NE},
      //   W: ${this.iGetCompass(index).W}, index:${index}, E: ${this.iGetCompass(index).E},
      //   SW: ${this.iGetCompass(index).SW}, S:${this.iGetCompass(index).S}, SE: ${this.iGetCompass(index).SE}`);
      if (this.iGetCompass(index)[dir])
        return true;
      else
        return false;
    },
    iStream: function(index, dir, steps) {
      var origin = index, steps = steps|1, flags = [];
      if (/N/.test(dir)) {
        target = this.$root.ROWS * steps;
        if (this.canStreamInDirection(index, dir))
          index = index - (target);
        else
          flags.push(index + '/' + dir)
      }
      if (/E/.test(dir)) {
        target = steps;
        if (this.canStreamInDirection(index, dir))
          index = index + target;
        else
          flags.push(index + '/' + dir)
      }
      if (/S/.test(dir)) {
        target = this.$root.ROWS * steps;
        if (this.canStreamInDirection(index, dir))
          index = index + target;
        else
          flags.push(index + '/' + dir)
      }
      if (/W/.test(dir)) {
        target = steps;
        if (this.canStreamInDirection(index, dir))
          index = index - target;
        else
          flags.push(index + '/' + dir)
      }
      if (flags.length) {
        // console.log(flags);
        for (var i = 0; i < flags.length; i++) {
          var valkeys = flags[i].split('/');
          if (this.isNearEdge(origin)['any']) {
            if ((this.isNearEdge(origin)['S']) && (!this.isOnEdge(origin)['W'])) {
              if (valkeys[1] == ('SW')) {
                index = Number(valkeys[0]) - 1;
              }
            } else if (this.isNearEdge(origin)['N']) {
              if ((valkeys[1] == ('NW')) && (!this.isOnEdge(origin)['W'])) {
                index = Number(valkeys[0]) - 1;
              } else if ((valkeys[1] == ('NE')) && (!this.isOnEdge(origin)['E'])) {
                index = Number(valkeys[0]) + 1;
              }
            }
            if ((this.isNearEdge(origin)['E']) && (!this.isOnEdge(origin)['S'])) {
              if (valkeys[1] == ('SE')) {
                index = Number(valkeys[0]) + this.$root.ROWS;
              }
            }
          }

        }
      }
      return index;
    },
    iGetCompass: function(index) {
      var canMove = {
        N: !this.iGetPos(index)[0] < 1,
        E: this.iGetPos(index)[1] !== this.ROWS - 1,
        S: this.iGetPos(index)[0] !== this.COLS - 1,
        W: !this.iGetPos(index)[1] < 1
      }
      var xs = ['N', 'S'], ys = ['E', 'W'];
      for (var a = 0; a < xs.length; a++) {
        for (var n = 0; n < ys.length; n++) {
          var xss = xs[a], yss = ys[n], mix = xss + yss;
          if (canMove[xss] && canMove[yss])
            canMove[mix] = true;
          else
            canMove[mix] = false;
        }
      }
      // console.log(canMove);
      return canMove;
    },
    isOnEdge: function(index) {
      var mirror = {};
      for (let [key, value] of Object.entries(this.iGetCompass(index))) {
        if (!this.rx.double.test(key))
          mirror[key] = !value;
      }
      // console.log(mirror);
      return mirror;
    },
    isNearEdge: function(index) {
      var x = this.iGetPos(index)[0], y = this.iGetPos(index)[1], result = {}, edges = [];
      result.N = (x == 1) ? true : false;
      result.S = (x == this.$root.ROWS - 2) ? true : false;
      result.E = (y == this.$root.COLS - 2) ? true : false;
      result.W = (y == 1) ? true : false;
      if (result.N || result.S || result.E || result.W)
        result.any = true;
      else
        result.any = false;
      return result;
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
    iParseModifiers: function(evt) {
      // console.log(evt);
      this.Ctrl = (evt.ctrlKey) ? true : false;
      this.Shift = (evt.shiftKey) ? true : false;
      this.Alt = (evt.altKey) ? true : false;
    },
    iSwitchChars: function(iA, iB) {
      var result = this.FEN;
      if (iA > iB) {
        var tempA = iB, tempB = iA,
        iA = tempA, iB = tempB;
      }
      var charA = this.iGetChar(iA), charB = this.iGetChar(iB);
      var start = (iA < iB) ? iA : iB, end = (iA > iB) ? iA : iB;
      var heads = (iA > 0) ? result.substring(0, start) : '';
      var body = result.substring(start, end);
      var tails = (iB < result.length) ? result.substring(end, result.length) : '';
      var newBody = charB + body.substr(1, body.length);
      var newTails = charA + tails.substr(1, tails.length);
      result = heads + newBody + newTails;
      // console.log(`FEN[${iA}]: ${charA}, FEN[${iB}]: ${charB}
      //   h: ${heads}
      //   b: ${body}
      //   t: ${tails}
      //
      //   f: ${this.FEN}
      //   n: ${result}`);
      this.FEN = result;
      Event.$emit('updateBoard');
      console.log(this.FEN);
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
    // this.iSwitchChars(14, 0);
  },
});
