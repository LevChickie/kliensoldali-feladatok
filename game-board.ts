import * as $ from "jquery";
import {Tile, TileState} from "./tile";
import {Player} from "./player";

export class GameBoard{
    readonly x=10;
    readonly y=10;

    board: Tile[][];
    playerOne = new Player('Player one',1);
    playerTwo = new Player('Player two', 2);
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
    }
    startGame(){
        if(!this.loadState()){
            this.initializeBoard(this.tableElement, this.board=[]);
            this.currentPlayer = this.winner===this.playerOne ? this.playerTwo : this.playerOne;
        }
        this.registerHandles(this.board);
    }

    loadState(){return false;}
    saveState(){}

    onTileClicked(tile: Tile){
        if(tile.state=== TileState.Empty && this.winner === undefined){
            if(this.currentPlayer===this.playerOne)
            {
                tile.setState(TileState.X);
                this.currentPlayer=this.playerTwo;
            }
            else if(this.currentPlayer===this.playerTwo)
            {
                tile.setState(TileState.O);
                this.currentPlayer = this.playerOne;
            }
            this.checkWinner();
        }
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