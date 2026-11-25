let board = [
  ['', 'x', '', 'x', '', 'x', '', 'x',],
  ['x', '', 'x', '', 'x', '', 'x', '',],
  ['', 'x', '', 'x', '', 'x', '', 'x',],
  ['', '', '', '', '', '', '', '',],
  ['', '', '', '', '', '', '', '',],
  ['o', '', 'o', '', 'o', '', 'o', '',],
  ['', 'o', '', 'o', '', 'o', '', 'o',],
  ['o', '', 'o', '', 'o', '', 'o', '',]
];

let display = document.querySelector('.display');
renderBoard();
function renderBoard() {
  display.innerHTML = '';
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      let buttons = document.createElement('button');
      buttons.classList.add('js-button');
      buttons.dataset.row = i;
      buttons.dataset.col = j;
      let row = Number(buttons.dataset.row);
      let col = Number(buttons.dataset.col);
      if ((i + j) % 2 === 0) {
        buttons.style.background = '#6a4426';
      } else if ((i + j) % 2 !== 0) {
        buttons.style.background = '#c09551';
      }

      let pezzo = document.createElement('div');
      

      if (board[i][j] === 'o') {
        pezzo.classList = 'pezziBianchi';
        buttons.appendChild(pezzo);
      }
      if (board[i][j] === '(o)') {
        pezzo.classList= 'pezziBianchi';
        let span= document.createElement('span');
        span.classList= 'damaB';
        span.textContent='♛';
        pezzo.appendChild(span);
        buttons.appendChild(pezzo);
      }
      if (board[i][j] === 'x') {
        pezzo.classList= 'pezziNeri';
        buttons.appendChild(pezzo);
      }
      if (board[i][j] === '(x)'){
        pezzo.classList= 'pezziNeri';
        let span= document.createElement('span');
        span.classList= 'damaN';
        span.textContent='♕';
        pezzo.appendChild(span);
        buttons.appendChild(pezzo);
      }

      display.appendChild(buttons);
      buttons.addEventListener('click', (e) => {
        if (currentPiece === null) {
          firstTarget(e);
        } else {
          secondTarget(e);
        }
      });

    }
  }
}
let currentPlayer = 'o';
let currentPiece=null;
let oldRow = null;
let oldCol = null;
function firstTarget(e){
  currentPiece= e.currentTarget;
    let currentRow=null;
    let currentCol=null;
  currentCol = Number(currentPiece.dataset.col);
  currentRow = Number(currentPiece.dataset.row);
  if(checkEatingAll()){
    if(checkEating(currentRow,currentCol)){
      oldRow = Number(currentPiece.dataset.row);
      oldCol = Number(currentPiece.dataset.col);
    }else{
      currentPiece=null;
      return;
    }

    console.log(board[currentRow][currentCol]);
  }


  if (currentPiece === '') {
    console.log('nessun pezzo selezionato');
    currentPiece = null;
  }else if(playerSel(currentRow,currentCol)){
    oldRow = Number(currentPiece.dataset.row);
    oldCol = Number(currentPiece.dataset.col);
  } else {
    console.log('pezzo sbagliato');
    currentPiece = null;
  }
  console.log(currentPiece);
  console.log(playerSel(currentRow,currentCol));
  console.log(oldRow,oldCol);
}

function secondTarget(e){
  currentPiece = null;
  let newPosition = null;
  let newRow = null;
  let newCol = null;
  newPosition = e.target;
  if (newPosition.innerHTML === '') {
    newCol = Number(newPosition.dataset.col);
    newRow = Number(newPosition.dataset.row);
  }else{
    console.log('è occupata');
    return;
  }
  
  if(movePieces(newRow,newCol)){
    if(newRow===oldRow-2||newRow===oldRow+2){
      if(checkEating(newRow,newCol)){
        currentPlayer=currentPlayer;
      }else{
        switchPlayer();
      }
    }else{
      switchPlayer();
    }
  }

  renderBoard();
  console.log(newRow,newCol);
}

function playerSel(row,col){
  if((currentPlayer==='o' && (board[row][col]==='o'||board[row][col]==='(o)'))||(currentPlayer==='x' && (board[row][col]==='x'||board[row][col]==='(x)'))){
    return true;
  } else {
    return false;
  }
}

function valoreAss(a,b){
if(a>b){
  return a-b;
}else{
  return b-a;
}
}

function illigalMove(newRow,newCol){
  if (checkEating(oldRow,oldCol)){
    //console.log('sono dentro illigalMove, dentro checkEating');
    if( valoreAss(newCol,oldCol)===2 && valoreAss(newRow,oldRow)===2){
      //console.log('sono dentro illigalMove, dentro checkEating,dentro valore ass');
      if(newRow<oldRow){//mangiamo verso l'alto
        //console.log('sono dentro illigalMove, dentro checkEating verso alto');
        if(newCol>oldCol){//verso destra
          if(board[oldRow-1][oldCol+1]!=='' && board[oldRow-1][oldCol+1]!==currentPlayer){
            console.log(eatPieces(newRow,newCol));
            return false;
          }
        }else{//verso sinistra
          //console.log('sono dentro illigalMove, dentro checkEating sinistra');
          if(board[oldRow-1][oldCol-1]!==''&& board[oldRow-1][oldCol-1]!==currentPlayer ){
            eatPieces(newRow,newCol);
            return false;
          }
        }
      }else{//mangiamo verso il basso
        if(newCol>oldCol){//verso destra
          if(board[oldRow+1][oldCol+1]!==''&& board[oldRow+1][oldCol+1]!==currentPlayer){
            eatPieces(newRow,newCol);
            return false;
          }
        }else{//verso sinistra
          if(board[oldRow+1][oldCol-1]!==''&& board[oldRow+1][oldCol-1]!==currentPlayer){
            eatPieces(newRow,newCol);
            return false;
          }
        }
      }
    }
    return true;
  }

  if ((newCol + newRow) % 2 === 0) {
    return true;
  }

  if(board[oldRow][oldCol]==='o' && newRow===oldRow-1){
    return false
  }
  if(board[oldRow][oldCol]==='(o)' && (newRow===oldRow-1 || newRow===oldRow+1)){
    return false
  }

  if(board[oldRow][oldCol]==='x' && newRow===oldRow+1){
    return false
  }
  if(board[oldRow][oldCol]==='(x)' && (newRow===oldRow-1 || newRow===oldRow+1)){
    return false
  }

  return true;
}

function movePieces(newRow,newCol){

  if(!illigalMove(newRow,newCol)){
    //console.log('sono nel movePieces')
    if(promotion(newRow)){
      //console.log('promozione');
      if(currentPlayer==='o'){
        //console.log('promozione o')
        board[newRow][newCol]='(o)';
        board[oldRow][oldCol]='';
        return true;
      }else{
        //console.log('promozione x')
        board[newRow][newCol]='(x)';
        board[oldRow][oldCol]='';
        return true;
      }
    }else{
      //console.log('non promozione');
      board[newRow][newCol]=board[oldRow][oldCol];
      board[oldRow][oldCol]='';
      return true
    }
  } else {
    //console.log('mossa non valida');
    return false;
  }
}

function switchPlayer(){
  if(currentPlayer==='o'){
    currentPlayer='x';
  }else{
    currentPlayer='o';
  }
}

function eatPieces(newRow, newCol){
  //console.log('sono dentro eatPieces');
  if (oldRow - 2 >= 0 && oldCol - 2 >= 0){
    if(currentPlayer==='o' && (board[oldRow-1][oldCol-1] === 'x'||board[oldRow-1][oldCol-1] === '(x)') && board[oldRow-2][oldCol-2]===''&& oldRow-2===newRow && oldCol-2===newCol){
      board[oldRow-1][oldCol-1]='';
      return true;
    }
  }

  if (oldRow - 2 >= 0 && oldCol + 2 < board.length){
    if(currentPlayer==='o' &&(board[oldRow-1][oldCol+1]=== 'x'||board[oldRow-1][oldCol+1]=== '(x)')&& board[oldRow-2][oldCol+2]==='' && oldRow-2===newRow && oldCol+2===newCol){
      board[oldRow-1][oldCol+1]='';
      return true;
    }
  }
  
  if(oldRow + 2 < board.length && oldCol - 2 >= 0){
    if(currentPlayer==='x'&& (board[oldRow+1][oldCol-1] === 'o'||board[oldRow+1][oldCol-1] === '(o)') && board[oldRow+2][oldCol-2]===''&& oldRow+2===newRow && oldCol-2===newCol){
      board[oldRow+1][oldCol-1]='';
      return true;
    }
  }

  if(oldRow + 2 < board.length && oldCol + 2 < board.length){
    if(currentPlayer==='x'&& (board[oldRow+1][oldCol+1]=== 'o'||board[oldRow+1][oldCol+1]=== '(o)') && board[oldRow+2][oldCol+2]===''&& oldRow+2===newRow && oldCol+2===newCol){
      board[oldRow+1][oldCol+1]='';
      return true;
    }
  }
  
  //dama o
  if(oldRow - 2 >= 0 && oldCol - 2 >= 0){
    if(currentPlayer==='o'&& board[oldRow][oldCol]==='(o)'&&(board[oldRow-1][oldCol-1] === 'x'||board[oldRow-1][oldCol-1] === '(x)') && board[oldRow-2][oldCol-2]===''&& oldRow-2===newRow && oldCol-2===newCol){
      board[oldRow-1][oldCol-1]='';
      return true;
    }
  }
  
  if(oldRow - 2 >= 0 && oldCol + 2 < board.length){
    if(currentPlayer==='o' && board[oldRow][oldCol]==='(o)'&&(board[oldRow-1][oldCol+1]=== 'x'||board[oldRow-1][oldCol+1]=== '(x)') && board[oldRow-2][oldCol+2]==='' && oldRow-2===newRow && oldCol+2===newCol){
      board[oldRow-1][oldCol+1]='';
      return true;
    }
  }
  
  if(oldRow + 2 < board.length && oldCol - 2 >= 0){
    if(currentPlayer==='o'&& board[oldRow][oldCol]==='(o)'&& (board[oldRow+1][oldCol-1] === 'x'||board[oldRow+1][oldCol-1] === '(x)')&& board[oldRow+2][oldCol-2]===''&& oldRow+2===newRow && oldCol-2===newCol){
      board[oldRow+1][oldCol-1]='';
      return true;
    }
  }

  if(oldRow + 2 < board.length && oldCol + 2 < board.length){
    if(currentPlayer==='o'&& board[oldRow][oldCol]==='(o)'&& (board[oldRow+1][oldCol+1]=== 'x'||board[oldRow+1][oldCol+1]=== '(x)') && board[oldRow+2][oldCol+2]===''&& oldRow+2===newRow && oldCol+2===newCol){
      board[oldRow+1][oldCol+1]='';
      return true;
    }
  }
  
  //dama x 
  if(oldRow - 2 >= 0 && oldCol - 2 >= 0){
    if(currentPlayer==='x'&& board[oldRow][oldCol]==='(x)'&&(board[oldRow-1][oldCol-1] === 'o'||board[oldRow-1][oldCol-1] === '(o)') && board[oldRow-2][oldCol-2]===''&& oldRow-2===newRow && oldCol-2===newCol){
      board[oldRow-1][oldCol-1]='';
      return true;
    }
  }

  if(oldRow - 2 >= 0 && oldCol + 2 < board.length){
    if(currentPlayer==='x' && board[oldRow][oldCol]==='(x)'&& (board[oldRow-1][oldCol+1]=== 'o'||board[oldRow-1][oldCol+1]=== '(o)')&& board[oldRow-2][oldCol+2]==='' && oldRow-2===newRow && oldCol+2===newCol){
      board[oldRow-1][oldCol+1]='';
      return true;
    }
  }

  if(oldRow + 2 < board.length && oldCol - 2 >= 0){
    if(currentPlayer==='x'&& board[oldRow][oldCol]==='(x)'&& (board[oldRow+1][oldCol-1] === 'o'||board[oldRow+1][oldCol-1] === '(o)') && board[oldRow+2][oldCol-2]===''&& oldRow+2===newRow && oldCol-2===newCol){
      board[oldRow+1][oldCol-1]='';
      return true;
    }
  }

  if(oldRow + 2 < board.length && oldCol + 2 < board.length){
    if(currentPlayer==='x'&& board[oldRow][oldCol]==='(x)'&&(board[oldRow+1][oldCol+1]=== 'o'||board[oldRow+1][oldCol+1]=== '(o)') && board[oldRow+2][oldCol+2]===''&& oldRow+2===newRow && oldCol+2===newCol){
      board[oldRow+1][oldCol+1]='';
      return true;
    }
  }
  
  
  return false
}

function checkEatingAll() {
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      let button = board[i][j];
      if ((currentPlayer==='o'&&(button==='o'||button==='(o)'))||(currentPlayer==='x'&&(button==='x'||button==='(x)'))) {
        console.log(checkEating(i, j));
        if (checkEating(i, j)) {
          return true;
        }
      }

    }
  }
  return false
}

function checkEating(row, col) {
  if (currentPlayer === 'o' && board[row][col]==='o') {
    if (row - 2 >= 0 && col - 2 >= 0) {
      if ((board[row - 1][col - 1] === 'x'||board[row - 1][col - 1] === '(x)') && board[row - 2][col - 2] === '') {
        return true
      }
    }

    if (row - 2 >= 0 && col + 2 < board.length) {
      if ((board[row - 1][col + 1] === 'x'||board[row - 1][col + 1] === '(x)') && board[row - 2][col + 2] === '') {
        return true
      }
    }
  }

  if(currentPlayer === 'o' && board[row][col]==='(o)'){
    if (row - 2 >= 0 && col - 2 >= 0) {
      if ((board[row - 1][col - 1] === 'x'||board[row - 1][col - 1] === '(x)') && board[row - 2][col - 2] === '') {
        return true
      }
    }

    if (row - 2 >= 0 && col + 2 < board.length) {
      if ((board[row - 1][col + 1] === 'x'||board[row - 1][col + 1] === '(x)') && board[row - 2][col + 2] === '') {
        return true
      }
    }

    if (row + 2 < board.length && col + 2 < board.length) {
      if ((board[row + 1][col + 1] === 'x'||board[row + 1][col + 1] === '(x)') && board[row + 2][col + 2] === '') {
        return true
      }
    }

    if (row + 2 < board.length && col - 2 >= 0) {
      if ((board[row + 1][col - 1] === 'x'||board[row + 1][col - 1] === '(x)') && board[row + 2][col - 2] === '') {
        return true
      }
    }
  }

  if (currentPlayer === 'x' && board[row][col]==='x') {
    if (row + 2 < board.length && col + 2 < board.length) {
      if ((board[row + 1][col + 1] === 'o'||board[row + 1][col + 1] === '(o)') && board[row + 2][col + 2] === '') {
        return true
      }
    }

    if (row + 2 < board.length && col - 2 >= 0) {
      if ((board[row + 1][col - 1] === 'o'||board[row + 1][col - 1] === '(o)') && board[row + 2][col - 2] === '') {
        return true
      }
    }
  }

  if(currentPlayer === 'x' && board[row][col]==='(x)'){
    if (row - 2 >= 0 && col - 2 >= 0) {
      if ((board[row - 1][col - 1] === 'o'||board[row - 1][col - 1] === '(o)') && board[row - 2][col - 2] === '') {
        return true
      }
    }

    if (row - 2 >= 0 && col + 2 < board.length) {
      if ((board[row - 1][col + 1] === 'o'||board[row - 1][col + 1] === '(o)') && board[row - 2][col + 2] === '') {
        return true
      }
    }

    if (row + 2 < board.length && col + 2 < board.length) {
      if ((board[row + 1][col + 1] === 'o'||board[row + 1][col + 1] === '(o)') && board[row + 2][col + 2] === '') {
        return true
      }
    }

    if (row + 2 < board.length && col - 2 >= 0) {
      if ((board[row + 1][col - 1] === 'o'||board[row + 1][col - 1] === '(o)') && board[row + 2][col - 2] === '') {
        return true
      }
    }
  }

  return false
}

function promotion(newRow){
  if (currentPlayer === 'o') {
      if (newRow === 0) {
        return true
      }
  } 
  
    if(currentPlayer === 'x'){
      if (newRow === 7) {
        return true
      }
  }

  return false
}

function checkWin() {
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      let button = board[i][j];
      if (currentPlayer==='o' && (button=='o' || button==='(o)')) {
        return false
      }

      if(currentPlayer==='x' && (button==='x' || button==='(x)')){
        return false
      }

    }
  }
  if(currentPlayer==='o'){
    console.log('I pezzi bianchi hanno vinto');
  }else{
    console.log('I pezzi neri hanno vinto');
  }
  return true
}

document.querySelector('.restart-btn').addEventListener('click', ()=>{
  board = [
  ['', 'x', '', 'x', '', 'x', '', 'x',],
  ['x', '', 'x', '', 'x', '', 'x', '',],
  ['', 'x', '', 'x', '', 'x', '', 'x',],
  ['', '', '', '', '', '', '', '',],
  ['', '', '', '', '', '', '', '',],
  ['o', '', 'o', '', 'o', '', 'o', '',],
  ['', 'o', '', 'o', '', 'o', '', 'o',],
  ['o', '', 'o', '', 'o', '', 'o', '',]
]

currentPlayer='o';
renderBoard();
})
