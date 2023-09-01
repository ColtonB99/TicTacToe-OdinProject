console.log("app loaded");

// Login Screen Functionality
const LoginScreen = document.querySelector(".loginScreen");
// START GAME BUTTONS:
const playAgainstAI = LoginScreen.querySelector(".ai-Wrapper");
const playAgainstFriends = LoginScreen.querySelector(".friends-wrapper");
// TicTacToe Boxes
const TicTacToeBoxes = document.querySelectorAll(".gameScreen .TicTacToe .gamebox");
var whosTurn = 0;
const Scoreboard = document.querySelector(".gameScreen .scoreboard .content-wrap");
var disableMouseClick = false;

playAgainstAI.addEventListener("click", function(){
    game.Start(0)
});

playAgainstFriends.addEventListener("click", function(){
    game.Start(1)
});

const difficultySelect = document.querySelector('#difficulty'); // Select the form
const langSelect = document.querySelector('#lang'); // Select the dropdown

// Add an event listener for the 'change' event on the dropdown
langSelect.addEventListener('change', function() {
    const selectedOption = langSelect.options[langSelect.selectedIndex]; // Get the selected option
    const selectedValue = selectedOption.value; // Get the value of the selected option

    AIdifficulty = selectedValue;
});

var Round = 1;
var currentWinner = null;
var AIdifficulty = 0;

const winningCombinations = [
    [1, 2, 3], // Horizontal Wins
    [4, 5, 6],
    [7, 8, 9],
    [1, 4, 7], // Vertical Wins
    [2, 5, 8],
    [3, 6, 9],
    [1, 5, 9], // Diagonal Wins
    [3, 5, 7]
];

// Duplicate The List So Entries Can Be Removed For The AI
var winningCombDuplication = [...winningCombinations];


const Game = () => {

    


    var xPositions = [];
    var oPositions = [];
    var Gamemode = null;

    var Player1Score = 0;
    var Player2Score = 0;

    // Setup Game
    const Start = (GameType) => {
        Gamemode = GameType;
        ClearBoard();
        closeLoginScreen();


        if (Gamemode == 1) {
            Scoreboard.querySelector(".playerScore").textContent = "Player 1: 0";
            Scoreboard.querySelector(".enemyScore").textContent = "Player 2: 0";
            Scoreboard.querySelector("#scoreboard-header").textContent = "Player 1's Turn"
            difficultySelect.parentElement.style.display = "none";
        }




    };

    // Clear The Board
    const ClearBoard = () => {
        TicTacToeBoxes.forEach(element => {
            element.style.backgroundImage = "";
        });
    };

    const closeLoginScreen = () => {
        LoginScreen.style.backgroundColor = "#fff";
        LoginScreen.style.scale = "1.5";
        LoginScreen.style.opacity = "0";
        setTimeout(() => {
            LoginScreen.style.display = "none";
        }, 500);
    };

    const showLoginScreen = () => {
        LoginScreen.style.display = "flex";
        LoginScreen.style.backgroundColor = "#f3f3f3";
        LoginScreen.style.scale = "1";
        LoginScreen.style.opacity = "1";
    };


    const checkWin = () => {
        let winner = null;


        const newoPosit = [...TicTacToeBoxes]
            .filter(element => element.style.backgroundImage.includes('o.png'))
            .map(element => parseInt(element.getAttribute("id").match(/\d+/)[0]));

        const newxPosit = [...TicTacToeBoxes]
            .filter(element => element.style.backgroundImage.includes('x.png'))
            .map(element => parseInt(element.getAttribute("id").match(/\d+/)[0]));

        

        for (const combination of winningCombinations) {
            const xMatchCount = combination.filter(pos => newxPosit.includes(pos)).length;
            const oMatchCount = combination.filter(pos => newoPosit.includes(pos)).length;
    
            if (xMatchCount >= 3) {
                RegisterWin("Player1");
                winner = 0; // X wins
                break;
            } else if (oMatchCount >= 3) {
                RegisterWin("Player2");
                winner = 1; // O wins
                break;
            }
        }

    
        currentWinner = winner;
    };

    
    const ClickHandler = (gamebox) => {

        // Gamemode Against AI
        if (Gamemode == 0) {
            if (whosTurn == 0) {
                if (gamebox.style.backgroundImage == '') {
                    // Mark X
                    gamebox.style.backgroundImage = 'url("x.png")';
                    // Register Position
                    xPositions.push(parseInt(gamebox.getAttribute("id").match(/\d+/)[0]));
                    console.log(`Added position: ${parseInt(gamebox.getAttribute("id").match(/\d+/)[0])}`);
                    whosTurn = 1;
                    RoundHandler();
                }
            }
        } else if (Gamemode == 1) {

            if (!disableMouseClick) {
                if (whosTurn == 0) {
                    if (gamebox.style.backgroundImage == '') {
                        // Mark X
                        gamebox.style.backgroundImage = 'url("x.png")';
                        // Register Position
                        xPositions.push(parseInt(gamebox.getAttribute("id").match(/\d+/)[0]));
                        console.log(`Added position: ${parseInt(gamebox.getAttribute("id").match(/\d+/)[0])}`);
                        whosTurn = 1;
                        Scoreboard.querySelector("#scoreboard-header").textContent = "Player 2's Turn"
                        RoundHandler();
                    }
                } else {    
                    if (gamebox.style.backgroundImage == '') {
                        // Mark X
                        gamebox.style.backgroundImage = 'url("o.png")';
                        // Register Position
                        oPositions.push(parseInt(gamebox.getAttribute("id").match(/\d+/)[0]));
                        console.log(`Added position: ${parseInt(gamebox.getAttribute("id").match(/\d+/)[0])}`);
                        whosTurn = 0;
                        Scoreboard.querySelector("#scoreboard-header").textContent = "Player 1's Turn"
                        RoundHandler();
                    }
                }
            }
        }
        
    };


    const announceWinner = (winnar) => {
        whosTurn = 3;
        const announcement = document.querySelector('.winnerAnnouncement');
        const announcementText = document.querySelector(".winnerAnnouncement p");


        if (Gamemode == 0) {
            if (winnar == "Tie") {
                announcementText.textContent = announcementText.textContent = "It was a tie!";
            } else {
                announcementText.textContent = announcementText.textContent = `${winnar} Won The Round`;
            }
        } else if (Gamemode == 1) {

            if (winnar == "Player") { winnar = "Player 1"} else if (winnar == "Computer") { winnar = "Player 2"}


            if (winnar == "Tie") {
                announcementText.textContent = announcementText.textContent = "It was a tie!";
            } else {
                announcementText.textContent = announcementText.textContent = `${winnar} Won The Round`;
            }
        }

        disableMouseClick = true;
        

        announcement.style.display = "flex";
        setTimeout(() => {
            announcement.style.display = "none";

            // Reset The Board, Set All To Default
            ClearBoard();
            Round = 1;
            xPositions = [];
            oPositions = [];
            currentWinner = null;
            whosTurn = 0;
            winningCombDuplication = [...winningCombinations];
            disableMouseClick = false;

        }, 3000);

        if (Gamemode == 1) {
            Scoreboard.querySelector("#scoreboard-header").textContent = "Player 1's Turn"
        }

    }


    const EnemyAIClickHandler = (difficulty) => {

        if (difficulty == 0) { 
            // Look for open tiles
            var openTiles = [];
            
            TicTacToeBoxes.forEach(element => {
                if (element.style.backgroundImage == "") {
                    openTiles.push(element);
                }
            });

            // Generate A Random Number
            let randomNum = Math.floor(Math.random() * openTiles.length);

            // Make The Move
            setTimeout(() => {
                if (openTiles.length > 0) {
                    openTiles[randomNum].style.backgroundImage = "url('o.png')";
                    oPositions.push(parseInt(openTiles[randomNum].getAttribute("id").match(/\d+/)[0]));
                    checkWin();
                    whosTurn = 0;
                }
            }, 500);


        } else if (difficulty == 1) {
            
            let deepBreak = false;
            // If it makes sense, Check for 3 Pairs
            if (Round >= 3 && Round < 10)
            {
                let checkList = [];

                // Loop Through The Duplicated Combination List ~ Discover High Risk Positions -> Input Them Into The Checklist

                for (const combination of winningCombDuplication) {
                    const xMatchCount = combination.filter(pos => xPositions.includes(pos)).length;
            
                    if (xMatchCount >= 2) {
                        checkList.push(combination);
                        winningCombDuplication.pop(combination);
                    }
                }

                for (const listItem of checkList) {
                    var missingXPosition = listItem.find(pos => !xPositions.includes(pos));
                    
                    if (missingXPosition !== undefined) {
                        missingXPosition -= 1;
                        // Validate
                        if (TicTacToeBoxes[missingXPosition].style.backgroundImage == "") {
                            // Make the Move
                            console.log(`missingXPosition Click, Round: ${Round}. Clicking at: ${missingXPosition + 1}`);
                            setTimeout(() => {
                                TicTacToeBoxes[missingXPosition].style.backgroundImage = "url('o.png')";
                                oPositions.push(parseInt(TicTacToeBoxes[missingXPosition].getAttribute("id").match(/\d+/)[0]));
                                checkWin();
                                whosTurn = 0;
                            }, 500);
                            break
                        } else {
                            setTimeout(() => {
                                if (whosTurn == 1) {
                                    // Located All Open Tiles
                                    var openTiles = [];
                                    TicTacToeBoxes.forEach(element => {
                                        if (element.style.backgroundImage == "") {
                                            openTiles.push(element);
                                        }
                                    });
                                    
                                    // Generate A Random Move Position
                                    let randomNum = Math.floor(Math.random() * openTiles.length);

                                    // Make The Move
                                    console.log(`The Space Was Occupied, Round: ${Round}. Clicking at: ${randomNum}`);
                                    if (openTiles.length > 0) {
                                        openTiles[randomNum].style.backgroundImage = "url('o.png')";
                                        oPositions.push(parseInt(openTiles[randomNum].getAttribute("id").match(/\d+/)[0]));
                                        checkWin();
                                        whosTurn = 0;
                                    }
                                    
                                }
                            }, 510);
                        }
                    } else {

                        // Nothing Was Found, Choose Randomly
                        // Located All Open Tiles
                        var openTiles = [];
                        TicTacToeBoxes.forEach(element => {
                            if (element.style.backgroundImage == "") {
                                openTiles.push(element);
                            }
                        });
                        
                        // Generate A Random Move Position
                        let randomNum = Math.floor(Math.random() * openTiles.length);

                        // Make The Move
                        setTimeout(() => {
                            console.log(`Nothing Was Found, Round: ${Round}. Clicking at: ${randomNum}`);
                            if (openTiles.length > 0) {
                                openTiles[randomNum].style.backgroundImage = "url('o.png')";
                                oPositions.push(parseInt(openTiles[randomNum].getAttribute("id").match(/\d+/)[0]));
                                checkWin();
                                whosTurn = 0;
                            }
                        }, 500);
                    }
                }


            } else {
                if (Round < 3) {
                    // Its Round 1-3 ~ Randomly Make Moves
                    console.log("Making A Random Move (Round 1-2)");
                    
                    // Located All Open Tiles
                    var openTiles = [];
                    TicTacToeBoxes.forEach(element => {
                        if (element.style.backgroundImage == "") {
                            openTiles.push(element);
                        }
                    });
                    
                    // Generate A Random Move Position
                    let randomNum = Math.floor(Math.random() * openTiles.length);

                    // Make The Move
                    setTimeout(() => {
                        if (openTiles.length > 0) {
                            openTiles[randomNum].style.backgroundImage = "url('o.png')";
                            oPositions.push(parseInt(openTiles[randomNum].getAttribute("id").match(/\d+/)[0]));
                            checkWin();
                            whosTurn = 0;
                        }
                    }, 500);
                }
                
            }

            // Default behavior if no conditions are met
            setTimeout(() => {
                if (whosTurn == 1) {
                    console.log("Default Behavior")
                    // Located All Open Tiles
                    var openTiles = [];
                    TicTacToeBoxes.forEach(element => {
                        if (element.style.backgroundImage == "") {
                            openTiles.push(element);
                        }
                    });
                    
                    // Generate A Random Move Position
                    let randomNum = Math.floor(Math.random() * openTiles.length);

                    // Make The Move
                    console.log(`No specific move found, making a random move.`);
                    if (openTiles.length > 0) {
                        openTiles[randomNum].style.backgroundImage = "url('o.png')";
                        oPositions.push(parseInt(openTiles[randomNum].getAttribute("id").match(/\d+/)[0]));
                        checkWin();
                        whosTurn = 0;
                    }
                }
            }, 700);



        } else if (difficulty == 2) {

            // Hard Mode
            
            let deepBreak = false;
            // If it makes sense, Check for 3 Pairs
            if (Round >= 3 && Round < 10)
            {
                let checkListO = [];
                let checkListX = [];

                // Loop Through And Check For Victory Plays
                for (const combination of winningCombinations) {
                    const oMatchCount = combination.filter(pos => oPositions.includes(pos)).length;
                    
                    if (oMatchCount >= 2) {
                        checkListO.push(combination);
                    }

                };

                for (const listItem of checkListO) {
                    var missingOPosition = listItem.find(pos => !oPositions.includes(pos));

                    if (missingOPosition !== undefined) {
                        missingOPosition -= 1;
                        // Validate
                        if (TicTacToeBoxes[missingOPosition].style.backgroundImage == "") {
                            
                            setTimeout(() => {
                                if (whosTurn == 1){
                                    console.log(`missingOPosition Click, Round: ${Round}. Clicking at: ${missingOPosition + 1}`)
                                    TicTacToeBoxes[missingOPosition].style.backgroundImage = "url('o.png')";
                                    oPositions.push(parseInt(TicTacToeBoxes[missingXPosition].getAttribute("id").match(/\d+/)[0]));
                                    checkWin();
                                    whosTurn = 0;
                                }
                            }, 450);
                            break
                        }
                    }
                }



                // Loop Through The Duplicated Combination List ~ Discover High Risk Positions -> Input Them Into The Checklist
                for (const combination of winningCombDuplication) {
                    const xMatchCount = combination.filter(pos => xPositions.includes(pos)).length;

                    if (xMatchCount >= 2) {
                        checkListX.push(combination);
                        winningCombDuplication.pop(combination);
                    }
                }

                for (const listItem of checkListX) {
                    var missingXPosition = listItem.find(pos => !xPositions.includes(pos));
                    
                    
                    
                    if (missingXPosition !== undefined) {
                        missingXPosition -= 1;
                        // Validate
                        if (TicTacToeBoxes[missingXPosition].style.backgroundImage == "") {
                            // Make the Move
                            setTimeout(() => {
                                if (whosTurn == 1) {
                                    console.log(`missingXPosition Click, Round: ${Round}. Clicking at: ${missingXPosition + 1}`);
                                    TicTacToeBoxes[missingXPosition].style.backgroundImage = "url('o.png')";
                                    oPositions.push(parseInt(TicTacToeBoxes[missingXPosition].getAttribute("id").match(/\d+/)[0]));
                                    checkWin();
                                    whosTurn = 0;
                                }
                            }, 500);
                            break
                        } else {
                            setTimeout(() => {
                                if (whosTurn == 1) {
                                    // Located All Open Tiles
                                    var openTiles = [];
                                    TicTacToeBoxes.forEach(element => {
                                        if (element.style.backgroundImage == "") {
                                            openTiles.push(element);
                                        }
                                    });
                                    
                                    // Generate A Random Move Position
                                    let randomNum = Math.floor(Math.random() * openTiles.length);

                                    // Make The Move
                                    console.log(`The Space Was Occupied, Round: ${Round}. Clicking at: ${parseInt(openTiles[randomNum].getAttribute("id").match(/\d+/)[0])}`);
                                    if (openTiles.length > 0) {
                                        openTiles[randomNum].style.backgroundImage = "url('o.png')";
                                        oPositions.push(parseInt(openTiles[randomNum].getAttribute("id").match(/\d+/)[0]));
                                        checkWin();
                                        whosTurn = 0;
                                    }
                                    
                                }
                            }, 510);
                        }
                    } else {

                        // Nothing Was Found, Choose Randomly
                        // Located All Open Tiles
                        var openTiles = [];
                        TicTacToeBoxes.forEach(element => {
                            if (element.style.backgroundImage == "") {
                                openTiles.push(element);
                            }
                        });
                        
                        // Generate A Random Move Position
                        let randomNum = Math.floor(Math.random() * openTiles.length);

                        // Make The Move
                        setTimeout(() => {
                            console.log(`Nothing Was Found, Round: ${Round}. Clicking at: ${randomNum}`);
                            if (openTiles.length > 0) {
                                openTiles[randomNum].style.backgroundImage = "url('o.png')";
                                oPositions.push(parseInt(openTiles[randomNum].getAttribute("id").match(/\d+/)[0]));
                                checkWin();
                                whosTurn = 0;
                            }
                        }, 500);
                    }
                }


            } else {
                if (Round < 3) {
                    // Its Round 1-3 ~ Randomly Make Moves
                    console.log("Making A Random Move (Round 1-2)");
                    
                    // Located All Open Tiles
                    var openTiles = [];
                    TicTacToeBoxes.forEach(element => {
                        if (element.style.backgroundImage == "") {
                            openTiles.push(element);
                        }
                    });
                    
                    // Generate A Random Move Position
                    let randomNum = Math.floor(Math.random() * openTiles.length);


                    // Play Center If I Can
                    if (TicTacToeBoxes[4].style.backgroundImage == "") {
                        setTimeout(() => {
                            if (whosTurn == 1) {
                                TicTacToeBoxes[4].style.backgroundImage = "url('o.png')";
                                oPositions.push(parseInt(TicTacToeBoxes[4].getAttribute("id").match(/\d+/)[0]));
                                checkWin();
                                whosTurn = 0;
                            }
                        }, 480);
                    }

                    // Make The Move
                    setTimeout(() => {
                        if (whosTurn == 1) {
                            if (openTiles.length > 0) {
                                openTiles[randomNum].style.backgroundImage = "url('o.png')";
                                oPositions.push(parseInt(openTiles[randomNum].getAttribute("id").match(/\d+/)[0]));
                                checkWin();
                                whosTurn = 0;
                            }
                        }
                    }, 500);
                }
                
            }


            // Default behavior if no conditions are met
            setTimeout(() => {
                if (whosTurn == 1) {
                    console.log("Default Behavior")
                    // Located All Open Tiles
                    var openTiles = [];
                    TicTacToeBoxes.forEach(element => {
                        if (element.style.backgroundImage == "") {
                            openTiles.push(element);
                        }
                    });
                    
                    // Generate A Random Move Position
                    let randomNum = Math.floor(Math.random() * openTiles.length);

                    // Make The Move
                    console.log(`No specific move found, making a random move.`);
                    if (openTiles.length > 0) {
                        openTiles[randomNum].style.backgroundImage = "url('o.png')";
                        oPositions.push(parseInt(openTiles[randomNum].getAttribute("id").match(/\d+/)[0]));
                        checkWin();
                        whosTurn = 0;
                    }
                }
            }, 700);




        }

    }

    const RoundHandler = () => {
        
        checkWin();

        if (currentWinner === null) {
            Round += 1;
            if (whosTurn == 1 && Gamemode == 0) {
                EnemyAIClickHandler(AIdifficulty)
                
            }
        }
         
        

        if (Round >= 6 && currentWinner == null && Gamemode == 0) {
            announceWinner("Tie");
        } else if (Round >= 10 && currentWinner == null && Gamemode == 1) {
            announceWinner("Tie");
        }
    };


    const RegisterWin = (Who) => {

        if (Gamemode == 0) {
            if (Who == "Player1") {
                // Increase Player1's Score
                Player1Score += 1;
                // Announce Player1's Victory
                announceWinner("Player");
                // Update Scoreboard
                Scoreboard.querySelector(".playerScore").textContent = `You: ${Player1Score}`;

            } else if (Who == "Player2") {
                // Increase Player2's Score
                Player2Score += 1;
                // Announce Player 2's Victory
                announceWinner("Computer");
                // Update Scoreboard
                Scoreboard.querySelector(".enemyScore").textContent = `AI: ${Player2Score}`;
            }
        } else if (Gamemode == 1) {
            if (Who == "Player1") {
                // Increase Player1's Score
                Player1Score += 1;
                // Announce Player1's Victory
                announceWinner("Player");
                // Update Scoreboard
                Scoreboard.querySelector(".playerScore").textContent = `Player 1: ${Player1Score}`;

            } else if (Who == "Player2") {
                // Increase Player2's Score
                Player2Score += 1;
                // Announce Player 2's Victory
                announceWinner("Computer");
                // Update Scoreboard
                Scoreboard.querySelector(".enemyScore").textContent = `Player 2: ${Player2Score}`;
            }


        }

        

    };




    // Set Player to X
    TicTacToeBoxes.forEach(element => {
        element.addEventListener("click", function() {
            ClickHandler(element, Gamemode);
        });
    });

    return {Start, ClickHandler, showLoginScreen, closeLoginScreen, xPositions, oPositions, winningCombinations, checkWin };
}

const game = Game();