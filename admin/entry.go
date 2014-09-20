package admin

import (
    "fmt"
    "net/http"
    
    "appengine"
    
    "model"
)

func init() {
    http.HandleFunc("/admin/", adminHandler)
    http.HandleFunc("/admin/season/", adminSeasonHandler)
    http.HandleFunc("/admin/season/add", seasonAddHandler)
    http.HandleFunc("/admin/person/", adminPersonHandler)
}

func adminHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprint(w, adminPageHtml)
}

func adminSeasonHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprint(w, adminSeasonPageHtml)
}

func seasonAddHandler(w http.ResponseWriter, r *http.Request) {
	year := r.FormValue("year")
	name := r.FormValue("name")
	model.SaveSeason(appengine.NewContext(r), name, year)
	fmt.Fprint(w, "added Season")
	fmt.Fprint(w, year)
	fmt.Fprint(w, name)
}

func adminPersonHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprint(w, "Yo Person!")
}



const adminSeasonPageHtml = `
<html>
	<body>
	<form name="season" action="/admin/season/add" method="post">
	Year: <input type="text" name="year"/><br/>
	Name: <input type="text" name="name"/><br/>
	<input type="submit" value="Add"/>
	</form>
	</body>
</html>
`


const adminPageHtml = `<html>
	<body>
		<a href="/admin/person/">Persons</a><br/>
		<a href="/admin/season/">Seasons</a>
	</body>
</html>`
