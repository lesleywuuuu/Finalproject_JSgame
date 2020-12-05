//===============================Define mycanvas and context===============================//
let canvas = document.getElementById("mycanvas");
let context = canvas.getContext("2d");
let user_UI = document.getElementById("myUI");
var user_Status = document.getElementById("playerStatus");
var newgame_btn = document.getElementById("new_game");
var playAI_btn = document.getElementById("playAI");
var playPlayer_btn = document.getElementById("pvp");

//======================================Initial Game======================================//
newgame_btn.onclick = function newGame()
{
    window.location.reload(); 
}

// playAI_btn.onclick = function playAi()
// {
//     playwithAI();
// }

// playPlayer_btn.onclick = function playAi()
// {
//     playwithPlayer();
// }

var chessboard = new Array(15);


//====================================Play with players===================================//
// function playwithPlayer()
// {

    for(var i=0; i<15; i++)                             //blcok chessboard
    {
        chessboard[i] = new Array(15);
        for(var j=0; j<15; j++)
        {
            chessboard[i][j] = 0;
        }
    }

    window.onload = function Initboard()
    {
        context.strokeStyle = "rbg(50,50,50)";
        for(var i=0; i<14; i++)
        {
            for(var j=0; j<14; j++)
            {
                context.strokeRect(30+j*40, 30+i*40, 40, 40);
            }
        }
    }

    //=====================================Mark Chess Move=====================================//
    var steps = 1;
    var total_inrow1 = 1;                               //Horizontal Check
    var total_inrow2 = 1;                               //Vertical Cheak
    var total_inrow3 = 1;                               //Left-slanting(/) Cheak
    var total_inrow4 = 1;                               //Right-slanting(\) Cheak
    var gameStatus = true;

    canvas.onclick = function Dropchess(e)
    {
        var x = ((e.offsetX-30)/40);                     //get x position
        var y = ((e.offsetY-30)/40);                     //get y position
        
        var clickX = Math.round(x);                      //set drop_x
        var clickY = Math.round(y);                      //set drop_y

        if(gameStatus)
        {
            oneStep(clickX,clickY);                      //drop_chess(drop_x, drop_y)

            if(chessboard[clickX][clickY]==1)            //check win bu each step
            {
                isWin(clickX,clickY,1); 
            }
            else if(chessboard[clickX][clickY]==2)
            {
                isWin(clickX,clickY,2);  
            }   
        }
        else 
        {
            alert("Please click New Game button to start a new game.");
            user_Status.innerText = "Please click New Game button to start a new game.";

        }
    }

    function oneStep(drop_x, drop_y)
    {
        var chesscolor = null;
        context.beginPath();                             //begin

        //（x,y,r,begin,end 2PI）draw a block chess
        context.arc(30+40*drop_x, 30+40*drop_y, 15, 0, 2*Math.PI); 
        context.closePath();                             //end
            
        if(steps%2==1 && chessboard[drop_x][drop_y]==0)
        {
            chesscolor = "black";                        //player1 drop black chess
            context.fillStyle = chesscolor;              //get chess color
            context.fill();                              //fill the color
            user_Status.innerText = "Now, White chess Turn";
            steps++;
            chessboard[drop_x][drop_y] = 1;              //mark blackchess = 1
        }
        else if(steps%2==0 && chessboard[drop_x][drop_y]==0)
        {
            chesscolor = "white";                        //player2 drop white chess
            context.fillStyle = chesscolor;              //get chess color
            context.fill();                              //fill the color
            user_Status.innerText = "Now, Black chess Turn";
            steps++;
            chessboard[drop_x][drop_y] = 2;              //mark whitechess = 2
        }
        else
        {
            alert("This point already exist a chess. Please try others");
            //user_Status.innerText = "This point already exist a chess. Please try others";
        }
    }

    //=====================================Check Win/Lose=====================================//
    function isWin(drop_x, drop_y, player)
    {
        var tempX = drop_x;
        var tempY = drop_y;

        //---------------Horizontal Check---------------//
        while((tempX-1)>=0 && chessboard[tempX-1][drop_y]==player && total_inrow1<5) //left dirc
        {
            total_inrow1++;
            tempX--;
        }
        tempX = drop_x;
        tempY = drop_y;

        while((tempX+1)<=15 && chessboard[tempX+1][drop_y]==player & total_inrow1<5) //right dirc
        {
            total_inrow1++;
            tempX++;
        }
        tempX = drop_x;
        tempY = drop_y;

        //---------------Vertical Cheak---------------//
        while((tempY-1)>=0 && chessboard[drop_x][tempY-1]==player && total_inrow2<5) //up dirc
        {
            total_inrow2++;
            tempY--;
        }
        tempX = drop_x;
        tempY = drop_y;

        while((tempY+1)<=15 && chessboard[drop_x][tempY+1]==player & total_inrow2<5) //down dirc
        {
            total_inrow2++;
            tempY++;
        }
        tempX = drop_x;
        tempY = drop_y;

        //---------------Left-slanting(/) Cheak---------------//
        while(((tempY-1)>=0 && (tempX+1)<=15) && chessboard[tempX+1][tempY-1]==player && total_inrow3<5) //up(/) dirc
        {
            total_inrow3++;
            tempY--;
            tempX++;
        }
        tempX = drop_x;
        tempY = drop_y;

        while(((tempY+1)<=15 && (tempX-1)>=0) && chessboard[tempX-1][tempY+1]==player & total_inrow3<5) //down(/) dirc
        {
            total_inrow3++;
            tempY++;
            tempX--;
        }
        tempX = drop_x;
        tempY = drop_y;

        //---------------Right-slanting(\) Cheak---------------//
        while(((tempY-1)>=0 && (tempX-1)>=0) && chessboard[tempX-1][tempY-1]==player && total_inrow4<5) //up(\) dirc
        {
            total_inrow4++;
            tempY--;
            tempX--;
        }
        tempX = drop_x;
        tempY = drop_y;

        while(((tempY+1)<=15 && (tempX+1)<=15) && chessboard[tempX+1][tempY+1]==player & total_inrow4<5) //down(\) dirc
        {
            total_inrow4++;
            tempY++;
            tempX++;
        }
        tempX = drop_x;
        tempY = drop_y;

        //---------------judge
        if(total_inrow1>4||total_inrow2>4||total_inrow3>4||total_inrow4>4)
        {
            if(player==1)
            {
                user_Status.innerText = "Black Win!";
                total_inrow1 = 1;
                total_inrow2 = 1;
                total_inrow3 = 1;
                total_inrow4 = 1;
            }
            else if(player==2)
            {
                user_Status.innerText = "White Win!";
                total_inrow1 = 1;
                total_inrow2 = 1;
                total_inrow3 = 1;
                total_inrow4 = 1;
            }
            gameStatus = false;
        }
        else
        {
            total_inrow1 = 1;
            total_inrow2 = 1;
            total_inrow3 = 1;
            total_inrow4 = 1;
        }
    }
//}
