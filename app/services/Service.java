package services;

import com.avaje.ebean.Model;

import java.util.Optional;

public abstract class Service<T extends Model> {

    private final Model.Finder<Long, T> finder;

    protected Service(Model.Finder<Long, T> finder) {
        this.finder = finder;
    }

    public Model.Finder<Long, T> getFinder() {
        return finder;
    }

    public Optional<T> get(long id) {
        return Optional.ofNullable(finder.byId(id));
    }
}
