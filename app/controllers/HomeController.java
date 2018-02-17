package controllers;

import play.libs.Json;
import play.mvc.*;

import services.UserService;
import views.html.*;

/**
 * This controller contains an action to handle HTTP requests
 * to the application's home page.
 */
public class HomeController extends Controller {

    /**
     * An action that renders an HTML page with a welcome message.
     * The configuration in the <code>routes</code> file means that
     * this method will be called when the application receives a
     * <code>GET</code> request with a path of <code>/</code>.
     */

    public Result main() {
        String id = flash("id");
        String id2= session("id");
        Http.Flash flash = flash();
        if (id != null || id2 != null) {
            return ok(main.render());
        }
        return ok(index.render());
    }

    public Result game() {
        String id = flash("id");
        String id2= session("id");
        if (id != null || id2 != null) {
            return ok(game.render());
        }
        return ok(index.render());
    }

    public Result getUserGames(){
        String id2= session("id");
//        System.out.println(id);
        System.out.println(id2);
//        UserService.getUserService().getUserByFBId()
        return ok(Json.toJson(UserService.getUserService().getUserByFBId(Long.parseLong(session("id")))));
    }

}
