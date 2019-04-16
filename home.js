"use strict";
window.onload = function()
{
    console.log("js working...");
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
            //order_by -> Location (??), date_to, date_from, radius,    sort(desc), value_from, value_to, parameter,order_by
            url: "https://api.openaq.org/v1/measurements?limit=10&order_by=location",
            test: "Vue functional",
            air_qual: [
                {measurement : ''}
            ]

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
            },
          
        },
        updated()
        {
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
                console.log("waiting for user input to stop...");
                console.log(app);






                }, 1000);

        },
        computed:{

            updateAirData: function(){
                axios
                    .get("https://api.openaq.org/v1/measurements?limit=5&order_by=location"+"&radius=5000&coordinates="+this.latitude+","+this.longitude)
                    .then(response => {
                        console.log("inside response");
                        console.log(response.data.results.length);
                        var length = response.data.results.length;
                        this.air_qual = [];
                        app.air_qual.push({ measurement : response.data.results[0]});
                        app.air_qual.push({ measurement : response.data.results[1]});
                        
                       
                        
                       
                    }) 
                }
        }
    })
    console.log("vue created");
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
    
    app.map = mymap;
    app.map2 = mymap2;    
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
    var divId = "Map";
    var mapid = "mapid"
    if (buttonId.indexOf("2") >= 0) 
    {
        divId = "right" + divId;
        mapid = mapid + "2";
    }
    else {divId = "left" + divId;}
    
    var map = document.getElementById(mapid);
    var el = document.getElementById(divId);
    if (button.innerHTML.indexOf("Full") >= 0)
    {
        button.innerHTML = "Minimize";
        el.requestFullscreen();
        el.classList.add("fullscreen");
        map.classList.add("map");
        map.classList.remove("column");
        console.log(map.classList);
    }
    else
    {
        document.exitFullscreen();
        button.innerHTML = "Make This Map Full-Screen";
        el.classList.remove("fullscreen");
        map.classList.remove("map");
        map.classList.add("column");
   }
}

function addMarkers(app, length){
    console.log("inside function");
    var airData = app.air_qual;
    console.log(airData);
    console.log(length);
    
   

}
