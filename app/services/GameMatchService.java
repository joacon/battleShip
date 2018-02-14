package services;

import com.avaje.ebean.Model;
import model.dbModels.GameMatch;

import java.util.List;
import java.util.Optional;

public class GameMatchService extends Service<GameMatch> {
    private static GameMatchService gameMatchService;

    private GameMatchService(Model.Finder<Long, GameMatch> finder) {
        super(finder);
    }

    public static GameMatchService getGameMatchService(){
        if (gameMatchService == null) gameMatchService = new GameMatchService(new Model.Finder<>(GameMatch.class));
        return gameMatchService;
    }

    public List<GameMatch> getAllRunningMatches(){
        return getFinder().where().eq("winner", null).findList();
    }
}
