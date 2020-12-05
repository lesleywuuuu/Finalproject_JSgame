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

//======================================Play With AI======================================//
// function playwithAI()
// {
    //AI
    var player_wins = new Array(15);
    var ai_wins = new Array(15);
    var gamestatus = false; // restart game when game over
    var playerStep = true; // step

    var myWin = []; //init player win status
    var computerWin = []; //init computer win status
    var wins = [];  //init all point that can win
    var count = 0; 

    for(var i=0; i<15; i++)                             //blcok chessboard
    {
        chessboard[i] = new Array(15);

        //AI
        player_wins[i] = new Array(15);
        ai_wins[i] = new Array(15);

        for(var j=0; j<15; j++)
        {
            chessboard[i][j] = 0;
            player_wins[i][j] = 0;
            ai_wins[i][j] = 0;
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


    for(var i = 0; i < 15; i++)
    {
        wins[i] = [];
        for(var j = 0; j < 15; j++)
        {
            wins[i][j] = [];
        }
    }

    //---------------Horizontal Check---------------//
    for(var i = 0; i < 15; i++)
    {
        for(var j = 0; j < 11; j++)
        {
            for(var k = 0; k < 5; k++)
            {
                wins[i][j+k][count] = true;
            }
            count++;
        }
    }

   //---------------Vertical Cheak---------------//
    for(var i = 0; i < 15; i++)
    {
        for(var j = 0; j < 11; j++)
        {
            for(var k = 0; k < 5; k++)
            {
                wins[j+k][i][count] = true;
            }
            count++;
        }
    }

   //------------Right-slanting(\) Cheak----------//
    for(var i = 0; i < 11; i++)
    {
        for(var j = 0; j < 11; j++)
        {
            for(var k = 0; k < 5; k++)
            {
                wins[i+k][j+k][count] = true;
            }
            count++;
        }
    }

    //------------Left-slanting(/) Cheak----------//
    for(var i = 0; i < 11; i++){ 
        for(var j = 14; j > 3; j--)
        {
            for(var k = 0; k < 5; k++)
            {
                wins[i+k][j-k][count] = true;
            }
            count++;
        }
    }
    // reset
    for(var i = 0; i < count; i++)
    {
        myWin[i] = 0;
        computerWin[i] = 0;
    }

    canvas.onclick = function Dropchess(e)
    {
        var x = ((e.offsetX-30)/40);                     //get x position
        var y = ((e.offsetY-30)/40);                     //get y position
        
        var i = Math.round(x);                      //set drop_x
        var j = Math.round(y);                      //set drop_y

        if(gamestatus)                              //gameover
        { 
            return;
        }
        if(!playerStep)
        {
            return;
        }
        
        if(chessboard[i][j] == 0)
        {
            oneStep(i,j,playerStep);
            chessboard[i][j] = 1;
            for(var k = 0; k < count; k++) //mark possiable win
            {
                if(wins[i][j][k])
                {
                    myWin[k]++;
                    computerWin[k] = 0;//mark cannot win
                    if(myWin[k] == 5)
                    {
                        user_Status.innerHTML = "Black(Player) Win!";
                        gamestatus = true;
                        
                    }
                }
            }
            if(!gamestatus)
            {
                playerStep = !playerStep;
                computerAI();
            }
        }
    }

    function oneStep(drop_x, drop_y, playerStep)
    {
        var chesscolor = null;
        context.beginPath();                             //begin

        //（x,y,r,begin,end 2PI）draw a block chess
        context.arc(30+40*drop_x, 30+40*drop_y, 15, 0, 2*Math.PI); 
        context.closePath();                             //end
    
        if(playerStep)
        {

            chesscolor = "black";
            if(chessboard[drop_x][drop_y]!=0)
            {
                 alert("This point already exist a chess. Please try others");
            }
            //user_Status.innerText = "Now, Player(Black) chess Turn";

        }
        else if(!playerStep)
        {
            chesscolor = "white"; 
            //user_Status.innerText = "Now, Computer(white) chess Turn";
        }
        // else
        // {
        //     alert("This point already exist a chess. Please try others");
        //     //user_Status.innerText = "This point already exist a chess. Please try others";
        // }
        context.fillStyle = chesscolor;
        context.fill();
    }

    function computerAI()
    {
        var myScore = [];
        var computerScore = [];
        var max = 0;
        var u = 0, v = 0;
        for(var i = 0; i < 15; i++)
        {
            myScore[i] = [];
            computerScore[i] = [];
            for(var j = 0; j < 15; j++)
            {
                myScore[i][j] = 0;
                computerScore[i][j] = 0;
            }
        }

        for(var i = 0; i < 15; i++)
        {
            for(var j = 0; j < 15; j++)
            {
                if(chessboard[i][j] == 0)
                {
                    for(var k = 0; k < count; k++)
                    {
                        if(wins[i][j][k])
                        {
                            if(myWin[k] == 1)
                            {
                                myScore[i][j] += 200;
                            }
                            else if(myWin[k] == 2)
                            {
                                myScore[i][j] += 400;
                            }
                            else if(myWin[k] == 3)
                            {
                                myScore[i][j] += 2000;
                            }
                            else if(myWin[k] == 4)
                            {
                                myScore[i][j] += 10000;
                            }
                            
                            if(computerWin[k] == 1)
                            {
                                computerScore[i][j] += 220;
                            }
                            else if(computerWin[k] == 2)
                            {
                                computerScore[i][j] += 420;
                            }
                            else if(computerWin[k] == 3)
                            {
                                computerScore[i][j] += 2100;
                            }
                            else if(computerWin[k] == 4)
                            {
                                computerScore[i][j] += 20000;
                            }                        
                        }
                    }
                    
                    if(myScore[i][j] > max)
                    {
                        max  = myScore[i][j];
                        u = i;
                        v = j;
                    }
                    else if(myScore[i][j] == max)
                    {
                        if(computerScore[i][j] > computerScore[u][v])
                        {
                            u = i;
                            v = j;    
                        }
                    }
                    
                    if(computerScore[i][j] > max)
                    {
                        max  = computerScore[i][j];
                        u = i;
                        v = j;
                    }
                    else if(computerScore[i][j] == max)
                    {
                        if(myScore[i][j] > myScore[u][v])
                        {
                            u = i;
                            v = j;    
                        }
                    }
                    
                }
            }
        }
       
        oneStep(u,v,false);
        chessboard[u][v] = 2;  //mark ai
        for(var k = 0; k < count; k++)
        {
            if(wins[u][v][k])
            {
                computerWin[k]++;
                myWin[k] = 6;   //mark this position cannot win
                if(computerWin[k] == 5)
                {
                    user_Status.innerHTML = "White(Computer) Win!";
                    gamestatus = true;
                }
            }
        }
        if(!gamestatus)
        {
            playerStep = !playerStep;
        }
    }

//}