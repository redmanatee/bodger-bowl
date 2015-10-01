package api

import (
	"google.golang.org/appengine"
	"google.golang.org/appengine/user"
	"google.golang.org/appengine/log"
	"net/http"
	oauth2 "golang.org/x/oauth2"
	"encoding/json"
)

const profileInfoURL = "https://www.googleapis.com/oauth2/v1/userinfo?alt=json"

var oauthCfg = oauth2.Config {
	// Client values need to match the values from AppEngine
	ClientID: "695871446763-9h06v864gp8msr5mtu9m81e9gqilrsvr.apps.googleusercontent.com",
	ClientSecret: "WLjP8kZyeoeQAYZr7Ar95zex",
	
	// Endpoints to the Google Authentication server
	Endpoint: oauth2.Endpoint {
		AuthURL: "https://accounts.google.com/o/oauth2/auth",
		TokenURL: "https://accounts.google.com/o/oauth2/token",
	},
	
	// Callback to somewhere in this project
	RedirectURL: "http://localhost:8080/api/oauth2callback",
	
	// List of APIs to request authentication for
	Scopes: []string {"https://www.googleapis.com/auth/plus.people.get"},
}

// Redirect user to the authentication page
func AuthorizeUser(w http.ResponseWriter, r *http.Request){
	c := appengine.NewContext(r)
	
	u, err := user.CurrentOAuth(c, oauthCfg.Scopes[0])
	log.Infof(c, "Getting user %v", u)
	log.Infof(c, "Getting err %v", err)
	if err != nil {
       http.Error(w, "OAuth Authorization header required", http.StatusUnauthorized)
       return
    }
	
	url := oauthCfg.AuthCodeURL("")
	log.Infof(c, "authorizing user at url %v", url)
	http.Redirect(w, r, "/admin/", http.StatusFound)
}

// Handle authorization callback from the Google server
func HandleOAuth2Callback(w http.ResponseWriter, r *http.Request) {
	c := appengine.NewContext(r)
	
	// Exchange with authentication server to receive a token
	code := r.FormValue("code")
	token, err := oauthCfg.Exchange(c, code)
	if err == nil {
		log.Errorf(c, "failed retrieve token")
	}
	
	// Use token to build a Token Source
	t := oauth2.Transport{
		Source: oauthCfg.TokenSource(c, token),
	}
	
	// Authenticate with the given information
	t.RoundTrip(r)
	resp, _ := oauthCfg.Client(c, token).Get(profileInfoURL)

	log.Infof(c, "User information is %v", resp)
    buf := make([]byte, 1024)
    resp.Body.Read(buf)
}

func GetUser(w http.ResponseWriter, r *http.Request) {
	c := appengine.NewContext(r)
	log.Infof(c, "entering getUser()")
	
	u, err := user.CurrentOAuth(c, oauthCfg.Scopes[0])
	data, err := json.MarshalIndent(u, "", "\t")
	if err != nil {
		panic(err)
	}
	w.Write(data)
}
