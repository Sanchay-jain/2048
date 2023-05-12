document.addEventListener('DOMContentLoaded', () =>  {
  const gridDisplay = document.querySelector('.grid')
  const scoreDisplay = document.getElementById('score')
  const resultDisplay = document.getElementById('result')
  const sizeInput = document.getElementById('size')
  let squares = []
  let size = parseInt(sizeInput.value)         //SET BOARD SIZE HERE
  let score = 0
  
  let ele = document.querySelector(':root');
  ele.style.setProperty('--width',`${456/size-11}px`)
  ele.style.setProperty('--height',`${456/size-11}px`)
  ele.style.setProperty('--fontsize',`${120/size}px`)
  //create the playing board
  function createBoard() {
    for (let i=0; i < size*size; i++) {
      square = document.createElement('div')
      square.innerHTML = 0
      gridDisplay.appendChild(square)
      squares.push(square)
    }
    generate()
    generate()
  }
  createBoard()


  //generate a new number
  function generate() {
    randomNumber = Math.floor(Math.random() * squares.length)
    if (squares[randomNumber].innerHTML == 0 || size===1) {
      squares[randomNumber].innerHTML = Math.random()>0.5?2:4
      checkForGameOver()
    } else generate()
  }

  function moveRight() {
    for (let i=0; i < size*size; i++) {
      if (i % size === 0) {
        let arr=[]
        for(let j =0;j<size;j++)
          arr.push(squares[i+j].innerHTML)
        let row =arr.map((a)=>parseInt(a))                            
        let filteredRow = row.filter(num => num)
        let missing = size - filteredRow.length
        let zeros = Array(missing).fill(0)                                  
        let newRow = zeros.concat(filteredRow)                           // 0 2 0 2 0  becomes 0 0 0 2 2     
        for(let j =0;j<size;j++)
         squares[i+j].innerHTML = newRow[j]
      }
    }
  }

  function moveLeft() {
    for (let i=0; i < size*size; i++) {
      if (i % size === 0) {
        let arr=[]
        for(let j =0;j<size;j++)
          arr.push(squares[i+j].innerHTML)
        
        let row =arr.map((a)=>parseInt(a))
        let filteredRow = row.filter(num => num)
        let missing = size - filteredRow.length
        let zeros = Array(missing).fill(0)
        let newRow = filteredRow.concat(zeros)

        for(let j =0;j<size;j++)
         squares[i+j].innerHTML = newRow[j]
      }
    }
  }


  function moveUp() {
    for (let i=0; i < size; i++) {
      let arr=[]
      for(let j =0;j<size;j++)
        arr.push(squares[i+size*j].innerHTML)
      
      let column =arr.map((a)=>parseInt(a))
      let filteredColumn = column.filter(num => num)
      let missing = size - filteredColumn.length
      let zeros = Array(missing).fill(0)
      let newColumn = filteredColumn.concat(zeros)

      for(let j =0;j<size;j++)
       squares[i+j*size].innerHTML = newColumn[j]
    }
  }

  function moveDown() {
    for (let i=0; i < size; i++) {
      let arr=[]
      for(let j =0;j<size;j++)
        arr.push(squares[i+size*j].innerHTML)
      
      let column =arr.map((a)=>parseInt(a))
      let filteredColumn = column.filter(num => num)
      let missing = size - filteredColumn.length
      let zeros = Array(missing).fill(0)
      let newColumn = zeros.concat(filteredColumn)

      for(let j =0;j<size;j++)
       squares[i+j*size].innerHTML = newColumn[j]
    }
  }
 
  function combineRow(dir) {
    if(dir==='left')
    {
     for (let i =0; i < size*size-1; i++) {
      if ((i % size !== size-1) && squares[i].innerHTML === squares[i + 1].innerHTML) {
        let combinedTotal = parseInt(squares[i].innerHTML) + parseInt(squares[i + 1].innerHTML)    //combining from left to right
        squares[i].innerHTML = combinedTotal
        squares[i + 1].innerHTML = 0
        score += combinedTotal
        scoreDisplay.innerHTML = score
      }
     }
    } 
    else if(dir==='right')
    {
     for (let i =size*size-1; i>0; i--) {
      if ((i % size !== 0) && squares[i].innerHTML === squares[i-1].innerHTML) {
        let combinedTotal = parseInt(squares[i].innerHTML) + parseInt(squares[i - 1].innerHTML)   //combining from right to left
        squares[i].innerHTML = combinedTotal
        squares[i - 1].innerHTML = 0
        score += combinedTotal
        scoreDisplay.innerHTML = score
      }
     }
    }

    checkForWin()
  }

  function combineColumn(dir) {
    if(dir==='up')
     for (let i =0; i < size*(size-1); i++) {
      if (squares[i].innerHTML === squares[i + size].innerHTML) {
        let combinedTotal = parseInt(squares[i].innerHTML) + parseInt(squares[i + size].innerHTML)
        squares[i].innerHTML = combinedTotal
        squares[i + size].innerHTML = 0
        score += combinedTotal
        scoreDisplay.innerHTML = score
      }
     }
    else if(dir==='down')
     for (let i =size*size-1; i>=size ; i--) {
      if (squares[i].innerHTML === squares[i - size].innerHTML) {
        let combinedTotal = parseInt(squares[i].innerHTML) + parseInt(squares[i - size].innerHTML)  
        squares[i].innerHTML = combinedTotal
        squares[i - size].innerHTML = 0
        score += combinedTotal
        scoreDisplay.innerHTML = score
      }
     }
    checkForWin()
  }

  //assign functions to keyCodes
  function control(e) {
    if(e.keyCode === 37) {
      keyLeft()
    } else if (e.keyCode === 38) {
      keyUp()
    } else if (e.keyCode === 39) {
      keyRight()
    } else if (e.keyCode === 40) {
      keyDown()
    }
  }
  document.addEventListener('keyup', control)
  
  //UNDO
  const undoButton = document.getElementById("undo")
  undoButton.addEventListener('click', function(){
    for(let i =0;i<size*size;i++)
    {
      squares[i].innerHTML=previous[i]
    }
  })

  let previous=[]
  function buildPrevious(){
    for(let i =0;i<size*size;i++)
    {
      previous[i] = squares[i].innerHTML
    }
  }
   
  function keyRight() {
    let previous1 = JSON.stringify(squares.map(num => num.innerHTML))  // get the numbers on the grid 
    buildPrevious()
    moveRight()
    combineRow('right')
    moveRight() 
    let now = JSON.stringify(squares.map(num => num.innerHTML))
    if (previous1 != now)                               //Check for invalid move(game state unchanged)
    { generate() }
  }

  function keyLeft() {
    let previous1 = JSON.stringify(squares.map(num => num.innerHTML))
    
    buildPrevious()
    moveLeft()
    combineRow('left')
    moveLeft()
    let now = JSON.stringify(squares.map(num => num.innerHTML))
    if (previous1 != now) 
    { generate() }
  }

  function keyUp() {
    let previous1 = JSON.stringify(squares.map(num => num.innerHTML))
    
    buildPrevious()
    moveUp()
    combineColumn('up')
    moveUp()
    let now = JSON.stringify(squares.map(num => num.innerHTML))
    if (previous1 != now) 
    { generate() }
  }

  function keyDown() {
    let previous1 = JSON.stringify(squares.map(num => num.innerHTML))
    
    buildPrevious()
    moveDown()
    combineColumn('down')
    moveDown()
    let now = JSON.stringify(squares.map(num => num.innerHTML))
    if (previous1 != now) 
    { generate() }
  }

  //check for the number 2048 in the squares to win
  function checkForWin() {
    for (let i=0; i < squares.length; i++) {
      if (squares[i].innerHTML == 2048) {
        resultDisplay.innerHTML = 'You WIN'
        document.removeEventListener('keyup', control)
        setTimeout(() => clear(), 3000)
      }
    }
  }

  //check if there are no zeros on the board to lose
  function checkForGameOver() {
    let zeros = 0
    for (let i=0; i < squares.length; i++) {
      if (squares[i].innerHTML == 0) {
        zeros++
      }
    }
    if (zeros === 0) {
      let f = false
      for (let i =0; i < size*(size-1); i++) {                                            //checking if any combine is possible when board full, if not then game over
        if (squares[i].innerHTML === squares[i + size].innerHTML) {
          f = true
        }
      }
      for (let i =0; i < size*size-1; i++) {
          if ((i % size !== size-1) && squares[i].innerHTML === squares[i + 1].innerHTML) {
            f = true
          }
        }
      if(!f)
      { resultDisplay.innerHTML = 'You LOSE'
        document.removeEventListener('keyup', control)
        setTimeout(() => clear(), 3000)
      }
    }
  }

  //refresh when clicking on reset
  document.getElementById('reset').addEventListener('click',function(){
    location.reload()
  })

  //clear timer
  function clear() {
    clearInterval(myTimer)
  }


  //add colours
  function addColours() {
    for (let i=0; i < squares.length; i++) {
      if (squares[i].innerHTML == 0) squares[i].style.backgroundColor = '#afa192'
      else if (squares[i].innerHTML == 2) squares[i].style.backgroundColor = '#eee4da'
      else if (squares[i].innerHTML  == 4) squares[i].style.backgroundColor = '#ede0c8' 
      else if (squares[i].innerHTML  == 8) squares[i].style.backgroundColor = '#f2b179' 
      else if (squares[i].innerHTML  == 16) squares[i].style.backgroundColor = '#ffcea4' 
      else if (squares[i].innerHTML  == 32) squares[i].style.backgroundColor = '#e8c064' 
      else if (squares[i].innerHTML == 64) squares[i].style.backgroundColor = '#ffab6e' 
      else if (squares[i].innerHTML == 128) squares[i].style.backgroundColor = '#fd9982' 
      else if (squares[i].innerHTML == 256) squares[i].style.backgroundColor = '#ead79c' 
      else if (squares[i].innerHTML == 512) squares[i].style.backgroundColor = '#76daff' 
      else if (squares[i].innerHTML == 1024) squares[i].style.backgroundColor = '#beeaa5' 
      else if (squares[i].innerHTML == 2048) squares[i].style.backgroundColor = '#d7d4f0' 
    }
}
addColours()

var myTimer = setInterval(addColours, 50)

})
