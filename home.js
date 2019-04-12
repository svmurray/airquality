"use strict";
window.onload = function()
{
    console.log("js working...");
	var mymap = L.map('mapid').setView([51.505, -0.09], 13);
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
	    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
	    maxZoom: 18,
	    id: 'mapbox.streets',
	    accessToken: 'pk.eyJ1IjoibnNhdWVyIiwiYSI6ImNqdWNzY3hrazBkaDg0MHBhazVjcGE0cjkifQ.38ZAD_BPbe9s5ziTqG6U1A'
    }).addTo(mymap);
    var marker = L.marker([51.5, -0.09]).addTo(mymap);
    console.log("map1 done");
    
	var mymap2 = L.map('mapid2').setView([51.505, -0.09], 13);
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
	    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
	    maxZoom: 18,
	    id: 'mapbox.streets',
	    accessToken: 'pk.eyJ1IjoibnNhdWVyIiwiYSI6ImNqdWNzY3hrazBkaDg0MHBhazVjcGE0cjkifQ.38ZAD_BPbe9s5ziTqG6U1A'
    }).addTo(mymap2);
    var marker = L.marker([51.5, -0.09]).addTo(mymap2);

    var app = new Vue(
    {
        el: "#vueApp", 
        data: 
        {
            latitude: "51.505",
            longitude: "-0.09",
            coordinates: "44,-93",
            dateTo: "",
            dateFrom: "",
            radius: "",
            parameter: "",
            map: mymap,
            orderBy: "location",
            //order_by, sort(desc), value_from, value_to
            url: "https://api.openaq.org/v1/measurements?limit=10&order_by=location",
            test: "Vue functional"
        },
        methods: {
            update: function(event){
                console.log(event);
            }
        },
        watch: {
            latitude: function(val, oldVal) {
                console.log(val + "&&" + oldVal);
            }
        },
        mounted() 
        {
            axios
                .get(this.url)
                .then(response => (this.test = response))
        }
    })
    console.log("vue created");
    
/*    function createUrl(appObj)
    {
        var final = appObj.url;
        if (*/
}


