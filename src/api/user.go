package api

import (
	"google.golang.org/appengine"
	"google.golang.org/appengine/user"
	"google.golang.org/appengine/log"
	"net/http"
	"encoding/json"
)

type User struct {
	Email string
	Url string
}

// Redirect user to the authentication page
func GetUser(w http.ResponseWriter, r *http.Request){
	c := appengine.NewContext(r)
	//var localUser User
	
	u := user.Current(c)
	log.Infof(c, "Getting user %v", u)
	localUser := User {
		Email: u.Email,
		Url: "",
	}
	
	if u == nil {
        url, _ := user.LoginURL(c, "/")
		
		localUser.Url = url
		data, err := json.MarshalIndent(localUser, "", "\t")
		if err != nil {
			panic(err)
		}
		
		w.Write(data)
		return
    }
	
    url, _ := user.LogoutURL(c, "/")
	
	localUser.Url = url
	data, err := json.MarshalIndent(localUser, "", "\t")
	if err != nil {
		panic(err)
	}
	
	w.Write(data)
}
