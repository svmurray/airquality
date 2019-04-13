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
            city: "London",
            city2: "London",
            map: mymap,
            map2: mymap2,
            timeout: null,
            //order_by, sort(desc), value_from, value_to, date_to, date_from, radius, parameter,order_by
            url: "https://api.openaq.org/v1/measurements?limit=10&order_by=location",
            test: "Vue functional"
        },
        methods: 
        {
            update: function(){
                this.map.setView([this.latitude, this.longitude]);
            },
            update2: function(){
                this.map2.setView([this.latitude, this.longitude]);
            },
            cityLookup: function() {
                axios
                    .get("https://nominatim.openstreetmap.org/search?q=" + this.city + "&format=json&accept-language=en")
                    .then(response => {
                        this.latitude = response.data[0].lat; 
                        this.longitude = response.data[0].lon; 
                        this.map.setView([response.data[0].lat, response.data[0].lon]);
                    })
            },
            cityLookup2: function() {
                axios
                    .get("https://nominatim.openstreetmap.org/search?q=" + this.city2 + "&format=json&accept-language=en")
                    .then(response => {
                        this.latitude2 = response.data[0].lat; 
                        this.longitude2 = response.data[0].lon; 
                        this.map2.setView([response.data[0].lat, response.data[0].lon]);
                    })
            }
        },
        updated()
        {
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => (console.log("waiting for user input to stop...")), 500);
        }
        /*,
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
    var url ="https://nominatim.openstreetmap.org/reverse?lat=" + app.latitude + "&lon=" + app.longitude + "&format=json&accept-language=en";
    axios
        .get(url)
        .then(response => {app.city = response.data.address.city;})
}
function updateLatLong2(app)
{
    var vals = app.map2.getCenter()
    app.latitude2 = vals.lat; 
    app.longitude2 = vals.lng;
    var url ="https://nominatim.openstreetmap.org/reverse?lat=" + app.latitude2 + "&lon=" + app.longitude2 + "&format=json&accept-language=en";
    axios
        .get(url)
        .then(response => {app.city2 = response.data.address.city;})
}
function makeFullScreen(buttonId)
{
    var button = document.getElementById(buttonId);
    console.log(buttonId + " is working");
    var mapid = "mapid";
    if (buttonId.indexOf("2") >= 0)
    {
        mapid = mapid + "2";
    }
    if (button.innerHTML.indexOf("Full") >= 0)
    {
        document.getElementById(mapid).style.width = "98%";
        document.getElementById(mapid).style.height = "98vh";
        
        document.getElementById("mapid2").style.visibility = "hidden";
        document.getElementById("inputBox2").style.visibility = "hidden";
        document.getElementById("inputBox1").padding = "30vw";
        
        
        button.innerHTML = "Minimize";
    }
    else
    {
        document.getElementById(mapid).style.width = "48%";
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
