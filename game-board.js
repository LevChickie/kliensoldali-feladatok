"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var $ = require("jquery");
var tile_1 = require("./tile");
var player_1 = require("./player");
var GameBoard = (function () {
    function GameBoard(tableElement) {
        this.tableElement = tableElement;
        this.x = 10;
        this.y = 10;
        this.stepCount = 0;
        this.playerOne = new player_1.Player('Player one', 1);
        this.playerTwo = new player_1.Player('Player two', 2);
        this.startGame();
    }
    GameBoard.prototype.initializeBoard = function (tableElement, board) {
        tableElement.children().remove();
        var tBody = $("<tbody></tbody>");
        tableElement.append(tBody);
        console.log(tableElement.children());
        for (var i = 0; i < this.y; i++) {
            var rowTiles = [];
            var row = $("<tr></tr>");
            tBody.append(row);
            for (var j = 0; j < this.x; j++) {
                var column = $("<td></td>");
                row.append(column);
                rowTiles.push(new tile_1.Tile(column));
            }
            this.board.push(rowTiles);
        }
        this.stepCount = 0;
    };
    GameBoard.prototype.startGame = function () {
        if (!this.loadState()) {
            this.initializeBoard(this.tableElement, this.board = []);
            this.currentPlayer = this.winner === this.playerOne ? this.playerTwo : this.playerOne;
        }
        this.displayVariables();
        this.registerHandles(this.board);
    };
    GameBoard.prototype.loadState = function () {
        var data = JSON.parse(localStorage.getItem("amoeba-table"));
        if (!data) {
            return false;
        }
        if (this.x !== data.x || this.y !== data.y) {
            localStorage.removeItem("amoeba-table");
            return false;
        }
        this.initializeBoard(this.tableElement, this.board = []);
        for (var i = 0; i < data.x; i++) {
            for (var j = 0; j < data.y; j++) {
                this.board[i][j].setState(data.tileStates[i][j]);
            }
        }
        this.playerOne = data.playerOne;
        this.playerTwo = data.playerTwo;
        this.currentPlayer = (data.current == 'player-one') ? data.playerOne : data.playerTwo;
        this.stepCount = data.steps;
        return true;
    };
    GameBoard.prototype.saveState = function () {
        localStorage.setItem("amoeba-table", JSON.stringify({
            playerOne: this.playerOne,
            playerTwo: this.playerTwo,
            current: (this.currentPlayer.id === 1) ? "player-one" : "player-two",
            x: this.x,
            y: this.y,
            tileStates: this.board.map(function (row) { return row.map(function (tile) { return tile.state; }); }),
            steps: this.stepCount
        }));
    };
    GameBoard.prototype.displayVariables = function () {
        $(".won-rounds:eq(0)").text(this.playerOne.gamesWon + " rounds won");
        $(".won-rounds:eq(1)").text(this.playerTwo.gamesWon + " rounds won");
        $(".player-name:eq(0)").text(this.playerOne.name);
        $(".player-name:eq(1)").text(this.playerTwo.name);
        $(".step-number").text(this.stepCount);
    };
    GameBoard.prototype.onTileClicked = function (tile) {
        if (tile.state === tile_1.TileState.Empty && this.winner === undefined) {
            if (this.currentPlayer === this.playerOne) {
                tile.setState(tile_1.TileState.X);
                this.currentPlayer = this.playerTwo;
            }
            else if (this.currentPlayer === this.playerTwo) {
                tile.setState(tile_1.TileState.O);
                this.currentPlayer = this.playerOne;
            }
            this.stepCount++;
            $(".step-number").text(this.stepCount);
            this.checkWinner();
            this.saveState();
        }
    };
    GameBoard.prototype.onRestartButtonClicked = function () {
        this.initializeBoard(this.tableElement, this.board = []);
        this.saveState();
        this.displayVariables();
        this.startGame();
    };
    GameBoard.prototype.onClearButtonClicked = function () {
        this.playerOne.gamesWon = 0;
        this.playerTwo.gamesWon = 0;
        this.onRestartButtonClicked();
    };
    GameBoard.prototype.onNameDoubleClick = function (evt) {
        var _this = this;
        var playerName = $(evt.target).html();
        var player;
        if (player === this.playerOne) {
            player = this.playerOne;
        }
        else {
            player = this.playerTwo;
        }
        $(evt.target).replaceWith(function () { return "<input type=\"text\" id=\"player-" + player.id + "-name-input\" value=\"" + player.name + "\" /> \
                                         <button class=\"change-name\" id=\"player-" + player.id + "-name-button\">Ok</button>"; });
        $(".change-name").click(function (evt) { return _this.onSaveChangesButtonClicked(evt); });
    };
    GameBoard.prototype.onSaveChangesButtonClicked = function (evt) {
        var id = $(evt.target).attr("id");
        var player = (id[7] === "1") ? this.playerOne : this.playerTwo;
        var input = $("#player-" + id[7] + "-name-input");
        player.name = input.val();
        input.replaceWith(function () { return "<b class=\"player-name\">" + player.name + "</b>"; });
        $("#player-" + id[7] + "-name-button").remove();
        this.saveState();
    };
    GameBoard.prototype.checkWinner = function () {
        var _this = this;
        var points = 0;
        for (var _i = 0, _a = [
            function (i, j) { return _this.board[i][j]; },
            function (i, j) { return _this.board[j][i]; }
        ]; _i < _a.length; _i++) {
            var fun = _a[_i];
            for (var i = 0; i < this.x; i++) {
                var state = tile_1.TileState.Empty;
                points = 1;
                for (var j = 0; j < this.y; j++) {
                    var tile = fun(i, j);
                    console.log('${i}, ${j}, ${tile.state}, ${state}, ${points}');
                    if (tile.state !== tile_1.TileState.Empty && tile.state == state) {
                        if (++points >= 5) {
                            this.won(tile.state === tile_1.TileState.X ? this.playerOne : this.playerTwo);
                        }
                    }
                    else {
                        points = 1;
                    }
                    state = tile.state;
                }
            }
        }
    };
    GameBoard.prototype.registerHandles = function (board) {
        var _this = this;
        for (var i = 0; i < board.length; i++) {
            var _loop_1 = function (j) {
                var tile = board[i][j];
                tile.element.click(function () { return _this.onTileClicked(tile); });
            };
            for (var j = 0; j < board[i].length; j++) {
                _loop_1(j);
            }
        }
        var restartButton = $(".restart-current-game");
        restartButton.click(function () { return _this.onRestartButtonClicked(); });
        var clearButton = $(".clear-results");
        clearButton.click(function () { return _this.onClearButtonClicked(); });
        $(".player-name").dblclick(function (evt) { return _this.onNameDoubleClick(evt); });
    };
    GameBoard.prototype.won = function (player) {
        var _this = this;
        alert("Player " + player.id + " won! Congrats, " + player.name + "!");
        player.gamesWon++;
        var continueButton = $(".continue-game");
        continueButton.removeAttr("disabled").click(function () {
            continueButton.attr("disabled", "disabled");
            _this.winner = undefined;
            _this.startGame();
        });
        this.winner = player;
    };
    return GameBoard;
}());
exports.GameBoard = GameBoard;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2FtZS1ib2FyZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImdhbWUtYm9hcmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwwQkFBNEI7QUFDNUIsK0JBQXVDO0FBQ3ZDLG1DQUFnQztBQUdoQztJQVlJLG1CQUFtQixZQUFvQjtRQUFwQixpQkFBWSxHQUFaLFlBQVksQ0FBUTtRQVg5QixNQUFDLEdBQUMsRUFBRSxDQUFDO1FBQ0wsTUFBQyxHQUFDLEVBQUUsQ0FBQztRQUNkLGNBQVMsR0FBVSxDQUFDLENBQUM7UUFJckIsY0FBUyxHQUFHLElBQUksZUFBTSxDQUFDLFlBQVksRUFBQyxDQUFDLENBQUMsQ0FBQztRQUN2QyxjQUFTLEdBQUcsSUFBSSxlQUFNLENBQUMsWUFBWSxFQUFDLENBQUMsQ0FBQyxDQUFDO1FBS25DLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUNyQixDQUFDO0lBRUQsbUNBQWUsR0FBZixVQUFnQixZQUFvQixFQUFFLEtBQWU7UUFDakQsWUFBWSxDQUFDLFFBQVEsRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ2pDLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBQ2pDLFlBQVksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDM0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztRQUNyQyxHQUFHLENBQUEsQ0FBQyxJQUFJLENBQUMsR0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQzFCLENBQUM7WUFDRyxJQUFJLFFBQVEsR0FBUyxFQUFFLENBQUM7WUFDeEIsSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQ3pCLEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDbEIsR0FBRyxDQUFBLENBQUMsSUFBSSxDQUFDLEdB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