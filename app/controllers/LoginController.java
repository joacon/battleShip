package controllers;

import com.restfb.DefaultFacebookClient;
import com.restfb.FacebookClient;
import com.restfb.types.User;
import play.mvc.Controller;
import play.mvc.Http;
import play.mvc.Result;
import services.UserService;
import views.html.index;

import java.util.Optional;

/**
 * Created by: yankee
 * Created on: 31/05/16
 */
public class LoginController extends Controller {

    public Result index() {
        return ok(index.render());
    }

    public Result saveUser(String id, String firstname, String lastname){
        Optional<model.dbModels.User> userOptional = UserService.getUserService().getUserByFBId(Long.parseLong(id));
        if (!userOptional.isPresent()){
            model.dbModels.User user = new model.dbModels.User(firstname, lastname, Long.parseLong(id));
            user.save();
        }
        System.out.println(firstname);
        session("id", id);
        flash("id", id);
        return ok(index.render());
    }
}
