package model.dbModels;

import com.avaje.ebean.Model;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class User extends Model{
    @Id
    private long id;

    private String firstName;

    private String lastName;

    private long facebookId;

    private long wins;

    private long totalMatches;


    public User(long facebookId) {
        this.facebookId = facebookId;
        this.wins = 0;
        this.totalMatches = 0;
    }

    public User(String firstName, String lastName, long facebookId) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.facebookId = facebookId;
        this.wins = 0;
        this.totalMatches = 0;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public long getFacebookId() {
        return facebookId;
    }

    public void setFacebookId(long facebookId) {
        this.facebookId = facebookId;
    }

    public long getWins() {
        return wins;
    }

    public void setWins(long wins) {
        this.wins = wins;
    }

    public long getTotalMatches() {
        return totalMatches;
    }

    public void setTotalMatches(long totalMatches) {
        this.totalMatches = totalMatches;
    }

    public void addMatch() { this.totalMatches++;}

    public void addWins() { this.wins++;}
}
