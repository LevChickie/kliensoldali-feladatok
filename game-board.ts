import * as $ from "jquery";
import {Tile, TileState} from "./tile";
import {Player} from './player';
import {SaveData} from "./save-data";

export class GameBoard{
    readonly x=10;
    readonly y=10;
    stepCount:number = 0;


    board: Tile[][];
    playerOne = new Player('Player one',1);
    playerTwo = new Player('Player two',2);
    currentPlayer: Player;
    winner: Player;

    constructor(public tableElement: JQuery){
        this.startGame();
    }

    initializeBoard(tableElement: JQuery, board: Tile[][]){
        tableElement.children().remove();
        let tBody = $("<tbody></tbody>");
        tableElement.append(tBody);
        console.log(tableElement.children());
        for(let i=0; i<this.y; i++)
        {
            var rowTiles: Tile[]=[];
            let row = $("<tr></tr>");
            tBody.append(row);
            for(let j=0; j<this.x; j++)
            {
                let column =$("<td></td>");
                row.append(column);
                rowTiles.push(new Tile(column));
            }
            this.board.push(rowTiles);
        }
        this.stepCount=0;
    }
    startGame(){
        if(!this.loadState()){
            this.initializeBoard(this.tableElement, this.board=[]);
            this.currentPlayer = this.winner===this.playerOne ? this.playerTwo : this.playerOne;
        }
        this.displayVariables();
        this.registerHandles(this.board);
    }

    loadState(){
        let data = <SaveData>JSON.parse(localStorage.getItem("amoeba-table"));
        if(!data)
        {
            return false;
        }
        if(this.x!== data.x||this.y!== data.y){
            localStorage.removeItem("amoeba-table");
            return false;
        }

        this.initializeBoard(this.tableElement, this.board=[]);
        for(let i=0; i<data.x;i++)
        {
            for(let j=0;j<data.y;j++)
            {
                this.board[i][j].setState(data.tileStates[i][j]);
            }
        }
        this.playerOne=data.playerOne;
        this.playerTwo=data.playerTwo;
        this.currentPlayer=(data.current=='player-one')?data.playerOne : data.playerTwo;
        this.stepCount=data.steps;
        return true;
    }
    saveState(){
        localStorage.setItem("amoeba-table",JSON.stringify(<SaveData>{
            playerOne: this.playerOne,
            playerTwo: this.playerTwo,
            current: (this.currentPlayer.id===1)? "player-one":"player-two",
            x:this.x,
            y:this.y,
            tileStates: this.board.map(row=>row.map(tile=>tile.state)),
            steps:this.stepCount

        }));
    }
    displayVariables() {
        $(".won-rounds:eq(0)").text(this.playerOne.gamesWon + " rounds won");
        $(".won-rounds:eq(1)").text(this.playerTwo.gamesWon + " rounds won");
        $(".player-name:eq(0)").text(this.playerOne.name);
        $(".player-name:eq(1)").text(this.playerTwo.name);
        $(".step-number").text(this.stepCount);
    }
    
    onTileClicked(tile: Tile){
        if(tile.state === TileState.Empty && this.winner === undefined){
            if(this.currentPlayer === this.playerOne)
            {
                tile.setState(TileState.X);
                this.currentPlayer = this.playerTwo;
            }
            else if(this.currentPlayer === this.playerTwo)
            {
                tile.setState(TileState.O);
                this.currentPlayer = this.playerOne;
            }
            this.stepCount++;
            $(".step-number").text(this.stepCount);
            this.checkWinner();
            this.saveState();
        }
    }


    onRestartButtonClicked()
    {
     this.initializeBoard(this.tableElement, this.board=[]);
     this.saveState();
     this.displayVariables();
     this.startGame();   
    }

    onClearButtonClicked()
    {
     this.playerOne.gamesWon=0;
     this.playerTwo.gamesWon=0;
     this.onRestartButtonClicked();
    }

    onNameDoubleClick(evt: JQuery.DoubleClickEvent)
    {
        var playerName = $(evt.target).html();
        var player: Player;
        if(player === this.playerOne){player = this.playerOne;}
        else{player = this.playerTwo;}
        $(evt.target).replaceWith(() => "<input type=\"text\" id=\"player-" + player.id + "-name-input\" value=\"" + player.name + "\" /> \
                                         <button class=\"change-name\" id=\"player-" + player.id + "-name-button\">Ok</button>");
        $(".change-name").click((evt) => this.onSaveChangesButtonClicked(evt));
    }

    onSaveChangesButtonClicked(evt: JQuery.ClickEvent)
    {
        var id = $(evt.target).attr("id");
        var player = (id[7]==="1") ? this.playerOne : this.playerTwo;
        var input = $("#player-" + id[7] + "-name-input");
        player.name = <string> input.val();
        input.replaceWith(() => "<b class=\"player-name\">" +player.name + "</b>");
        $("#player-" + id[7] + "-name-button").remove();        
        this.saveState();

    }

    checkWinner(){
        var points=0;
        for( let fun of [
            (i: number, j: number)=> this.board[i][j],
            (i: number, j: number)=> this.board[j][i]
        ]){
            for(let i = 0; i<this.x;i++)
            {
                let state =  TileState.Empty;
                points=1;
                for(let j=0; j<this.y;j++)
                {
                    let tile = fun(i,j);
                    console.log('${i}, ${j}, ${tile.state}, ${state}, ${points}');
                    if(tile.state!== TileState.Empty && tile.state==state)
                    {
                        if(++points>= 5)
                        {
                            this.won(tile.state=== TileState.X ? this.playerOne : this.playerTwo);
                        }
                    }else{
                        points= 1;
                    }
                    state= tile.state;
                }
              
            }
        }
    }

    registerHandles(board: Tile[][]){
        for(let i = 0; i<board.length;i++){
            for(let j=0; j<board[i].length;j++){
                let tile = board[i][j];
                tile.element.click(()=>this.onTileClicked(tile));
            }
        }
        var restartButton = $(".restart-current-game");
        restartButton.click(() => this.onRestartButtonClicked());
        var clearButton = $(".clear-results");
        clearButton.click(() => this.onClearButtonClicked());
        $(".player-name").dblclick((evt) => this.onNameDoubleClick(evt));
    }

    won(player: Player)
    {
        alert("Player "+player.id+" won! Congrats, "+player.name+"!");
        player.gamesWon++;
        var continueButton=$(".continue-game");
        continueButton.removeAttr("disabled").click(()=>{continueButton.attr("disabled","disabled");
        this.winner= undefined;
        this.startGame();
    });
       this.winner=player;
    }
}