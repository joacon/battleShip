package controllers;

import com.restfb.DefaultFacebookClient;
import com.restfb.FacebookClient;
import com.restfb.types.User;
import play.mvc.Controller;
import play.mvc.Http;
import play.mvc.Result;
import views.html.index;

/**
 * Created by: yankee
 * Created on: 31/05/16
 */
public class LoginController extends Controller {

    public Result index() {
        return ok(index.render());
    }

    public Result saveUser(String id, String firstname, String lastname){
        System.out.println(firstname);
        session("id", id);
        flash("id", id);
        Http.Flash flash = flash();
        return ok(index.render());
    }
}
