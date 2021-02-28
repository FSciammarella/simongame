const SETUP = 0, // Magic Numbers
    COMPUTER = 1,
    PLAYER = 2,
    GAME_OVER = 3;

var gameObject = {
    moves: ["green", "red", "yellow", "blue"], // Valid Moves
    playerMoves: [],
    computerMoves: [],
    cursor: 0,
    level: 1,
    gamePhase: SETUP,
}

function playAudio(id = "wrong") {
    let sample = new Audio("sounds/" + id + ".mp3");
    sample.play()
}

function animateButtonPress(target) {
    $(target).toggleClass("pressed");
    setTimeout(() => {
        $(target).toggleClass("pressed");
    }, 100);
}

function blink(targetID, duration = 100) {
    console.log(targetID)
    $("#" + targetID).fadeOut(duration).fadeIn(duration);
}

function newMove() {
    return gameObject.moves[Math.trunc(Math.random() * gameObject.moves.length)]
}

function gameStep() {
    switch (gameObject.gamePhase) {
        case SETUP:
            gameObject.playerMoves = [];
            gameObject.computerMoves = [];
            gameObject.cursor = 0;
            gameObject.gamePhase = COMPUTER;
            gameObject.level = 1
            $(document).off();
            break;
        case COMPUTER:
            $("#level-title").text("Level: " + gameObject.level);
            if (gameObject.cursor < gameObject.computerMoves.length) {
                // Sequentially replay computer moves
                blink(gameObject.computerMoves[gameObject.cursor]);
                playAudio(gameObject.computerMoves[gameObject.cursor]);
                gameObject.cursor++
            } else {
                // Add new Move to computerMoves
                gameObject.computerMoves.push(newMove());
                blink(gameObject.computerMoves[gameObject.cursor]);
                playAudio(gameObject.computerMoves[gameObject.cursor]);
                // Transition to player Phase
                gameObject.cursor = 0;
                gameObject.gamePhase = PLAYER;
            }
            break;
        case PLAYER:
            $(".btn").on("click", (e) => {
                gameObject.playerMoves.push(e.target.id);
                animateButtonPress(e.target);
                if (gameObject.computerMoves[gameObject.cursor] == gameObject.playerMoves[gameObject.cursor]) {
                    playAudio(e.target.id)
                    gameObject.cursor++;
                    if (gameObject.cursor == gameObject.computerMoves.length) {
                        $(".btn").off();
                        gameObject.playerMoves = []
                        gameObject.gamePhase = COMPUTER;
                        gameObject.cursor = 0;
                        gameObject.level++;
                        setTimeout(gameStep, 800);
                    }
                } else {
                    playAudio();
                    $(".btn").off()
                    gameObject.gamePhase = GAME_OVER;
                    $("body").toggleClass("game-over");
                    setTimeout(() => {
                        $("body").toggleClass("game-over")
                    }, 200);
                    setTimeout(gameStep, 500);
                }
            })
            return;
        default:
            $("#level-title").html("You Lost!<br>Press any key to restart");
            // Returns to Setup Phase
            gameObject.gamePhase = SETUP;
            $(document).on("keypress", gameStep);
            $(document).on("click", gameStep)

            return
    }
    // Chains next game loop
    setTimeout(gameStep, 500);
}

$(document).on("keypress", gameStep)
$(document).on("click", gameStep)