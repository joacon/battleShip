package model.dbModels;

import com.avaje.ebean.Model;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity(name = "nono")
@Table(name = "nono")
public class Match extends Model{
    @Id
    private long id;

    public Match() {
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }
}
