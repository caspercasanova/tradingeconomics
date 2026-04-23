package main

import (
	"io/ioutil"
	"log"
	"net/http"
	"fmt"
)

var apikey = "" // Please subscribe to a plan at https://tradingeconomics.com/api/pricing.aspx to get an API key. 

func main() {

	news()

}

func news() {
	resp, err := http.Get(fmt.Sprint("https://api.tradingeconomics.com/news?c=", apikey))

	if err != nil {
		log.Fatalln(err)
	}

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Fatalln(err)
	}
	log.Println(string("News"), "\n")

	log.Println(string(body), "\n")

}


