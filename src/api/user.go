package api

import (
	"google.golang.org/appengine"
	"google.golang.org/appengine/user"
	"net/http"
	"encoding/json"
)

type User struct {
	Email string
	Url string
}

// Retrieve User object and return the user's email
// If the user is logged in, return a logout URL so
// the user can logout
func GetUser(w http.ResponseWriter, r *http.Request){
	c := appengine.NewContext(r)
	
	u := user.Current(c)
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
