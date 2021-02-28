var gameObject = {
    moves: ["green", "red", "yellow", "blue"],
    playerMoves: [],
    computerMoves: [],
    cursor: 0,
    level:1,
    gamePhases: ["setup", "computer", "player", "gameOver"],
    gamePhase: 0,
}

function gameStep() {
    console.log(gameObject.computerMoves)
    console.log(gameObject.playerMoves)
    console.log(gameObject.computerMoves.length == gameObject.playerMoves.length)
    switch (gameObject.gamePhases[gameObject.gamePhase]) {
        case "setup":
            gameObject.playerMoves = [];
            gameObject.computerMoves = [];
            gameObject.cursor = 0;
            gameObject.gamePhase = 1;
            $(document).off("keypress");
            break;
        case "computer":
            if (gameObject.cursor < gameObject.computerMoves.length) {
                $("#" + gameObject.computerMoves[gameObject.cursor]).fadeOut(100).fadeIn(100);
                let sample = new Audio("sounds/"+gameObject.computerMoves[gameObject.cursor]+".mp3");
                sample.play()
                gameObject.cursor++
            } else {
                gameObject.computerMoves.push(gameObject.moves[Math.trunc(Math.random() * gameObject.moves.length)]);
                $("#" + gameObject.computerMoves[gameObject.cursor]).fadeOut(100).fadeIn(100);
                gameObject.gamePhase = 2;
                let sample = new Audio("sounds/"+gameObject.computerMoves[gameObject.cursor]+".mp3");
                gameObject.cursor = 0;
                $("#level-title").text("Level: "+gameObject.level);
                sample.play()
            }
            break;
        case "player":
            $(".btn").on("click", (e) => {
                gameObject.playerMoves.push(e.target.id);
                $(e.target).toggleClass("pressed");
                setTimeout(()=>{
                    $(e.target).toggleClass("pressed");
                },100);
                // console.log(gameObject.cursor)
                if (gameObject.computerMoves[gameObject.cursor] == gameObject.playerMoves[gameObject.cursor]) {
                    console.log(gameObject.computerMoves[gameObject.cursor] + "==" + gameObject.playerMoves[gameObject.cursor])
                    let sample = new Audio("sounds/"+e.target.id+".mp3");
                    sample.play();
                    gameObject.cursor++;
                    if (gameObject.cursor == gameObject.computerMoves.length) {
                        $(".btn").off();
                        gameObject.playerMoves = []
                        gameObject.gamePhase = 1;
                        gameObject.cursor = 0;
                        gameObject.level++;
                        setTimeout(gameStep, 800);
                    }
                } else {
                    let sample = new Audio("sounds/wrong.mp3");
                    sample.play()
                    $(".btn").off()
                    gameObject.gamePhase = 3;
                    setTimeout(gameStep, 500);
                }
            })
            return;
        default:
            gameObject.gamePhase=0;
            gameObject.level=1;
            $("#level-title").html("You Lost!<br>Press any key to restart");
            $(document).on("keypress", gameStep);
            return
            break;
    }
    setTimeout(gameStep, 500);
}


$(document).on("keypress", gameStep)