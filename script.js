const cells=document.querySelectorAll(".cell");
const resultScreen=document.getElementById("resultScreen");
const resultText=document.getElementById("resultText");
const winLine=document.getElementById("winLine");

let board=["","","","","","","","",""];
let gameActive=true;

/* ---------- SOUND (NO FILES) ---------- */
const audioCtx=new (window.AudioContext||window.webkitAudioContext)();

function playSound(freq,duration){
    const osc=audioCtx.createOscillator();
    const gain=audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.frequency.value=freq;
    osc.start();
    gain.gain.exponentialRampToValueAtTime(
        0.00001,audioCtx.currentTime+duration
    );
    osc.stop(audioCtx.currentTime+duration);
}

/* ---------- SCOREBOARD ---------- */
let scores=JSON.parse(localStorage.getItem("tttScore"))||
{X:0,O:0,draw:0};

function updateScore(){
    xScore.textContent=scores.X;
    oScore.textContent=scores.O;
    drawScore.textContent=scores.draw;
}
updateScore();

function saveScore(){
    localStorage.setItem("tttScore",JSON.stringify(scores));
}

/* ---------- WIN PATTERNS ---------- */
const winPatterns=[
[0,1,2],[3,4,5],[6,7,8],
[0,3,6],[1,4,7],[2,5,8],
[0,4,8],[2,4,6]
];

/* ---------- PLAYER MOVE ---------- */
cells.forEach((cell,index)=>{
cell.addEventListener("click",()=>{
if(!gameActive||board[index]!="") return;

makeMove(index,"X");
if(gameActive) setTimeout(aiMove,400);
});
});

function makeMove(index,player){
board[index]=player;
cells[index].textContent=player;
playSound(400,.1);
checkWinner(player);
}

/* ---------- AI MOVE ---------- */
function aiMove(){
let empty=board
.map((v,i)=>v===""?i:null)
.filter(v=>v!==null);

if(empty.length===0) return;

let move=empty[Math.floor(Math.random()*empty.length)];
makeMove(move,"O");
}

/* ---------- CHECK WIN ---------- */
function checkWinner(player){

for(let pattern of winPatterns){
const[a,b,c]=pattern;

if(board[a]&&board[a]===board[b]&&board[a]===board[c]){
drawWinningLine(pattern);
playSound(900,.4);

scores[player]++;
saveScore();
updateScore();

showResult(`🎉 ${player} Wins!`);
gameActive=false;
return;
}
}

if(!board.includes("")){
scores.draw++;
saveScore();
updateScore();
showResult("😮 Draw!");
gameActive=false;
}
}

/* ---------- WIN LINE ---------- */
function drawWinningLine(pattern){
const map={
"0,1,2":"translateY(50px)",
"3,4,5":"translateY(150px)",
"6,7,8":"translateY(250px)",
"0,3,6":"rotate(90deg) translateX(100px)",
"1,4,7":"rotate(90deg) translateX(200px)",
"2,5,8":"rotate(90deg) translateX(300px)",
"0,4,8":"rotate(45deg)",
"2,4,6":"rotate(-45deg)"
};
winLine.style.width="100%";
winLine.style.transform=map[pattern.toString()];
}

/* ---------- RESULT ---------- */
function showResult(msg){
resultText.textContent=msg;
resultScreen.classList.add("show");
}

/* ---------- NEW GAME ---------- */
function newGame(){
board=["","","","","","","","",""];
gameActive=true;

cells.forEach(c=>c.textContent="");
winLine.style.width="0";
resultScreen.classList.remove("show");
}