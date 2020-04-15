"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TileState;
(function (TileState) {
    TileState[TileState["Empty"] = 0] = "Empty";
    TileState[TileState["X"] = 1] = "X";
    TileState[TileState["O"] = 2] = "O";
})(TileState = exports.TileState || (exports.TileState = {}));
var Tile = (function () {
    function Tile(element) {
        this.element = element;
        this.state = TileState.Empty;
    }
    Tile.prototype.setState = function (state) {
        if (this.state === TileState.Empty && state !== TileState.Empty) {
            this.state = state;
            if (state === TileState.X) {
                this.element.addClass("mark mark-x");
                this.element.append($("<i class='glyphicon glyphicon-record'></i>"));
            }
            else if (state === TileState.O) {
                this.element.addClass("mark mark-o");
                this.element.append($("<i class='glyphicon glyphicon-remove'></i>"));
            }
        }
    };
    return Tile;
}());
exports.Tile = Tile;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGlsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInRpbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFZLFNBRVg7QUFGRCxXQUFZLFNBQVM7SUFDckIsMkNBQU8sQ0FBQTtJQUFFLG1DQUFHLENBQUE7SUFBRSxtQ0FBRyxDQUFBO0FBQ2pCLENBQUMsRUFGVyxTQUFTLEdBQVQsaUJBQVMsS0FBVCxpQkFBUyxRQUVwQjtBQUNEO0lBRUksY0FBbUIsT0FBZTtRQUFmLFlBQU8sR0FBUCxPQUFPLENBQVE7UUFEbEMsVUFBSyxHQUFjLFNBQVMsQ0FBQyxLQUFLLENBQUM7SUFDQyxDQUFDO0lBRXJDLHVCQUFRLEdBQVIsVUFBUyxLQUFnQjtRQUNyQixFQUFFLENBQUEsQ0FBQyxJQUFJLENBQUMsS0FBSyxLQUFLLFNBQVMsQ0FBQyxLQUFLLElBQUksS0FBSyxLQUFLLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQSxDQUFDO1lBQzVELElBQUksQ0FBQyxLQUFLLEdBQUUsS0FBSyxDQUFDO1lBQ2xCLEVBQUUsQ0FBQSxDQUFDLEtBQUssS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUEsQ0FBQztnQkFDdEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLENBQUM7Z0JBQ3JDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUNmLENBQUMsQ0FBQyw0Q0FBNEMsQ0FBQyxDQUFDLENBQUM7WUFDekQsQ0FBQztZQUFBLElBQUksQ0FBQyxFQUFFLENBQUEsQ0FBQyxLQUFLLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFBLENBQUM7Z0JBQzVCLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFDO2dCQUNyQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FDZixDQUFDLENBQUMsNENBQTRDLENBQUMsQ0FBQyxDQUFDO1lBQ3pELENBQUM7UUFDTCxDQUFDO0lBQ0wsQ0FBQztJQUNMLFdBQUM7QUFBRCxDQUFDLEFBbEJELElBa0JDO0FBbEJZLG9CQUFJIn0=