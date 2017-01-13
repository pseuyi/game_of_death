var gameOfLife = {
  width: 120, //120
  height: 48, //48
  stepInterval: null,
  environment: 3,

  createAndShowBoard: function () {
    // create <table> element
    var goltable = document.createElement("tbody");
    
    // build Table HTML
    var tablehtml = '';
    for (var h=0; h<this.height; h++) {
      tablehtml += `<tr id='row+${h}'>`;
      for (var w=0; w<this.width; w++) {
        tablehtml += `<td data-status='dead' id='${w}-${h}'></td>`;
      }
      tablehtml += "</tr>";
    }
    goltable.innerHTML = tablehtml;
    
    // add table to the #board element
    var board = document.getElementById('board');
    board.appendChild(goltable);
    
    // once html elements are added to the page, attach events to them
    this.setupBoardEvents();
  },

  forEachCell: function (iteratorFunc) {
    /* 
      Write forEachCell here. You will have to visit
      each cell on the board, call the "iteratorFunc" function,
      and pass into func, the cell and the cell's x & y
      coordinates. For example: iteratorFunc(cell, x, y)
    */
    
    // Array.from(document.getElementsBytagName('td')).forEach(function(cell){
    //   iteratorFunc(cell, x, y)
    // })

    for(var x=0;x<this.width;x++) {
      for(var y=0;y<this.height;y++) {
        let cell = document.getElementById(`${x}-${y}`)
        iteratorFunc(cell, x, y)
      }
    }

  },
  
  setupBoardEvents: function() {
    // each board cell has an CSS id in the format of: "x-y" 
    // where x is the x-coordinate and y the y-coordinate
    // use this fact to loop through all the ids and assign
    // them "on-click" events that allow a user to click on 
    // cells to setup the initial state of the game
    // before clicking "Step" or "Auto-Play"
    
    // clicking on a cell should toggle the cell between "alive" & "dead"
    // for ex: an "alive" cell be colored "blue", a dead cell could stay white
    
    // EXAMPLE FOR ONE CELL
    // Here is how we would catch a click event on just the 0-0 cell
    // You need to add the click event on EVERY cell on the board
    
    var onCellClick = function (e) {
      // QUESTION TO ASK YOURSELF: What is "this" equal to here?

      // how to set the style of the cell when it's clicked
        if (this.getAttribute('data-status') == 'dead') {
          this.className = "alive";
          this.setAttribute('data-status', 'alive');
        } else {
          this.className = "dead";
          this.setAttribute('data-status', 'dead');
        }
    };

    // helper to set click listeners
    var setClickListener = function (cell, x, y) {
      cell.onclick = onCellClick
    }
    // set click listeners
    this.forEachCell(setClickListener)

    // attach events to btns
    document.getElementById('play_btn').onclick = this.enableAutoPlay.bind(this) 
    document.getElementById('step_btn').onclick = this.step.bind(this)
    document.getElementById('clear_btn').onclick = this.clearAll.bind(this)
    document.getElementById('reset_btn').onclick = this.resetRandom.bind(this)  
    document.getElementById('env_setting').onchange = this.setEnvironment.bind(this)      
  },

  step: function (e) {
    // Here is where you want to loop through all the cells
    // on the board and determine, based on it's neighbors,
    // whether the cell should be dead or alive in the next
    // evolution of the game. 
    //
    // You need to:
    // 1. Count alive neighbors for all cells
    // 2. Set the next state of all cells based on their alive neighbors
    const cellsToChange = []
    const env = this.environment
    this.forEachCell(function(cell, x, y){
      var cell = document.getElementById(x+"-"+y);

      var neighbors = [
      document.getElementById((x-1)+"-"+(y-1)),
      document.getElementById((x-1)+"-"+y),
      document.getElementById((x-1)+"-"+(y+1)),
      document.getElementById(x+"-"+(y-1)),
      document.getElementById(x+"-"+(y+1)),
      document.getElementById((x+1)+"-"+(y-1)),
      document.getElementById((x+1)+"-"+y),
      document.getElementById((x+1)+"-"+(y+1)),
      ]

      neighbors = neighbors.filter(cell => cell !=null)
    
      const aliveNeighbors = neighbors.map(cell => cell.getAttribute('data-status') === "alive"? cell : null
      ).filter(cell => cell !=null)
      const aliveCount = aliveNeighbors.length;

      if(cell.getAttribute('data-status')==='alive') {
        if(aliveCount!=2 && aliveCount!=3) {
          cellsToChange.push(cell)
        }
      }
      else if (cell.getAttribute('data-status')==='dead'){
        if(aliveCount===env) {
          cellsToChange.push(cell)
        }
      }     
    })  

    // cell change is outside of forEachCell to collect snapshot of all cells that need to be toggeled for next step
    cellsToChange.forEach(cell=>{
      if(cell.getAttribute('data-status')==='alive') {
        cell.setAttribute('data-status', 'dead');
        cell.className = 'dead';          
      } else {
        cell.setAttribute('data-status', 'alive');
        cell.className = 'alive';          
      }
    })
  },

  setEnvironment: function (e) {
    this.environment = document.getElementById('env_setting').value
    // document.getElementById('range').innerHTML = this.environment
  },

  enableAutoPlay: function (e) {
    // Start Auto-Play by running the 'step' function
    // automatically repeatedly every fixed time interval
    if(document.getElementById('play_btn').innerHTML === 'play') {
      document.getElementById('play_btn').innerHTML = 'stop'
    } else {
      document.getElementById('play_btn').innerHTML = 'play'
    }
    if(this.stepInterval === null) {
      this.stepInterval = setInterval(this.step.bind(this), 100);
          //setInterval returns an event id that can be used to clear steps or stop
    } else {
      clearInterval(this.stepInterval);
      this.stepInterval = null;
    }
    
  },

  clearAll: function (e) {
    this.forEachCell((cell, x, y) => {
      cell.className = 'dead'
      cell.setAttribute('data-status', 'dead')
    })
  },

  resetRandom: function (e) {
    this.forEachCell((cell, x, y) => {
      let status = Math.round(Math.random()) ===1? 'alive' : 'dead'
      cell.className = status
      cell.setAttribute('data-status', status)
    })
  }

};

  gameOfLife.createAndShowBoard();
