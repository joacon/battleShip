package services;

import com.avaje.ebean.Finder;
import com.avaje.ebean.Model;
import model.dbModels.User;

import java.util.Optional;

public class UserService extends Service<User>{

    private static UserService userService;

    private UserService(Model.Finder<Long, User> finder) {
        super(finder);
    }

    public static UserService getUserService(){
        if (userService == null) userService = new UserService(new Model.Finder<>(User.class));
        return userService;
    }

    public Optional<User> getUserByFBId(long facebookId){
        return Optional.ofNullable(getFinder().where().eq("facebook_id", facebookId).findUnique());
    }
}
