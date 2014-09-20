package admin

import (
    "fmt"
    "net/http"
    "html/template"
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
	tmpl := template.Must(template.ParseFiles("admin/admin_home.html"))
	err := tmpl.Execute(w, nil)
	if err != nil {
		panic(err)
	}
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
	<head>
		<!-- The core React library -->
		<script src="http://fb.me/react-0.11.1.js"></script>
		<!-- In-browser JSX transformer, remove when pre-compiling JSX. -->
		<script src="http://fb.me/JSXTransformer-0.11.1.js"></script>
	</head>
	<body>
	<form name="season" action="/admin/season/add" method="post">
	Year: <input type="text" name="year"/><br/>
	Name: <input type="text" name="name"/><br/>
	<input type="submit" value="Add"/>
	</form>
	</body>
</html>
`


const adminPageHtml = `<?xml version="1.0"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
        "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
	<head>
		<!-- The core React library -->
		<script src="http://fb.me/react-0.11.1.js" type="text/js" />
		<!-- In-browser JSX transformer, remove when pre-compiling JSX. -->
		<script src="http://fb.me/JSXTransformer-0.11.1.js" type="text/js" />
		<script src="/jsx/components.jsx" type="text/jsx" />
	</head>
	<body>
		<a href="/admin/person/">Persons</a><br/>
		<a href="/admin/season/">Seasons</a>
		<CommentBox />
	</body>
</html>`
