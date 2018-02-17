package services;

import actor.GameRoomManager;
import actor.Messages;
import akka.actor.ActorRef;
import model.dbModels.GameMatch;
import model.dbModels.User;

import java.util.TimerTask;

public class EndGameTask extends TimerTask{
    private ActorRef player1;
    private ActorRef player2;
    private ActorRef gameRoom;
    private GameMatch match;
    private User winner;

    public EndGameTask(ActorRef player1, ActorRef player2, GameMatch match, User winner, ActorRef gameRoom) {
        this.player1 = player1;
        this.player2 = player2;
        this.gameRoom = gameRoom;
        this.match = match;
        this.winner = winner;
    }

    @Override
    public void run() {
        System.out.println("End match? " + match.getId());
        if (!match.isPlayer1Ready() || !match.isPlayer2Ready()) {
            System.out.println("ENDED");
            match.setWinner(winner);
            winner.addWins();
            winner.save();
            match.save();
            GameRoomManager.MAIN_GAME.tell(new Messages.EndGame(player1, player2, gameRoom), gameRoom);
            player1.tell(new Messages.Win(null, true), gameRoom);
            player2.tell(new Messages.Win(null, true), gameRoom);
        }
    }
}
