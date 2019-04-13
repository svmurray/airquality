"use strict";
window.onload = function()
{
    console.log("js working...");
	var mymap = L.map('mapid').setView([51.505, -0.09], 13);
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
	    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
	    maxZoom: 16,
	    minZoom: 9,
	    id: 'mapbox.streets',
	    accessToken: 'pk.eyJ1IjoibnNhdWVyIiwiYSI6ImNqdWNzY3hrazBkaDg0MHBhazVjcGE0cjkifQ.38ZAD_BPbe9s5ziTqG6U1A'
    }).addTo(mymap);
    var marker = L.marker([51.5, -0.09]).addTo(mymap);
    console.log("map1 done");
    
	var mymap2 = L.map('mapid2').setView([51.505, -0.09], 13);
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
	    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
	    maxZoom: 16,
	    minZoom: 9,
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
            latitude2: "51.505",
            longitude2: "-0.09",
            city1: "London",
            city2: "London",
            dateTo: "",
            dateFrom: "",
            radius: "",
            parameter: "",
            map: mymap,
            map2: mymap2,
            orderBy: "location",
            //order_by, sort(desc), value_from, value_to
            url: "https://api.openaq.org/v1/measurements?limit=10&order_by=location",
            test: "Vue functional"
        },
        methods: {
            update: function(){
                this.map.setView([this.latitude, this.longitude]);
            },
            update2: function(){
                this.map2.setView([this.latitude, this.longitude]);
            },
            cityLookup: function() {
	            var response;
	            var addr = "https://nominatim.openstreetmap.org/search?q=" + this.city1 + "&format=json&accept-language=en";
                console.log("getCity vue" + addr);
	            var req = new XMLHttpRequest();
	            req.onreadystatechange = function() {
		                if(req.readyState ==4 && req.status ==200)
			            {
				            response = JSON.parse(this.responseText);
				            //response works, I'm running into 'this' scope issues for resetting data and the maps
			            }
		            };
	            req.open("GET", addr, true);
	            req.send();
            },
            cityLookup2: function() {
	            var response;
	            var addr = "https://nominatim.openstreetmap.org/search?q=" + this.city2 + "&format=json&accept-language=en";
                console.log("getCity2 vue" + addr);
	            var req = new XMLHttpRequest();
	            req.onreadystatechange = function() {
		                if(req.readyState ==4 && req.status ==200)
			            {
				            response = JSON.parse(this.responseText)
				            //response works, I'm running into 'this' scope issues for resetting data and the maps
			            }
		            };
	            req.open("GET", addr, true);
	            req.send();
            }
        }/*,
        mounted() 
        {
            axios
                .get(this.url)
                .then(response => (this.test = response))
        }*/
    })
    console.log("vue created");
    mymap.on("moveend", ()=>(updateLatLong(app)))
    mymap2.on("moveend", ()=>(updateLatLong2(app)))
    document.getElementById("FSButton1").onclick = () => (makeFullScreen("FSButton1"));
    document.getElementById("FSButton2").onclick = () => (makeFullScreen("FSButton2"));
}

function updateLatLong(app)
{
    var vals = app.map.getCenter()
    app.latitude = vals.lat; 
    app.longitude = vals.lng;
}
function updateLatLong2(app)
{
    var vals = app.map2.getCenter()
    app.latitude2 = vals.lat; 
    app.longitude2 = vals.lng;
}
function makeFullScreen(buttonId)
{
    var button = document.getElementById(buttonId);
    console.log("button is working");
    if (button.innerHTML.indexOf("Full") >= 0)
    {
        button.innerHTML = "Minimize";
    }
    else
    {
        button.innerHTML = "Make This Map Full-Screen";
    }
}

function update1()
{
//    app.map.setView([this.latitude, this.longitude]);
}
function update2()
{
//    app.map.setView([this.latitude, this.longitude]);
}
