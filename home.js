"use strict";
window.onload = function()
{
    /*Haversine
    
    Marrinan said that Leaflet might have a built in for the distance between two points, and if it doesn't to just email him and he could post it to canvas.
    
        //values need to be as radians --> lat*pi/180
    
	    var a = Math.pow(Math.sin((dataVar[1][0]-dataVar[0][0])/2),2) + Math.cos(dataVar[1][0])*Math.cos(dataVar[0][0])*Math.pow(Math.sin((dataVar[1][1]-dataVar[0][1])/2),2);
            a = sin[(lat1-lat2)/2]^2 + cos(lat1)*cos(lat2)*sin[(lon1-lon2)/2]^2
        //not sure which is easier to read, but the two statements above are equivalent
            
        var c = 2*Math.asin(Math.sqrt(a));
            c = 2*sin^-1(a^.5)
        var dist = c*3959;
    */

    
//    console.log("js working...");
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
            measures: [
                {
                    measurement :
                    {
                        location: '',
                        date:
                        {
                            local: ''
                        },
                        parameter: '',
                        value: '',
                        unit: ''
                    }
                }
            ], 
            averages : [
                {
                    measurement :
                    {
                        location: '',
                        date:
                        {
                            local: ''
                        },
                        parameter: '',
                        value: '',
                        unit: ''
                    }
                }
            ], 
            averages2 : [
                {
                    measurement :
                    {
                        location: '',
                        date:
                        {
                            local: ''
                        },
                        parameter: '',
                        value: '',
                        unit: ''
                    }
                }
            ], 
            measure2s: [
                {
                    measurement :
                    {
                        location: '',
                        date:
                        {
                            local: ''
                        },
                        parameter: '',
                        value: '',
                        unit: ''
                    }
                }
            ], 

        },
        methods: 
        {
            update: function(){
                this.map.setView([this.latitude, this.longitude]);
                updateAirData(this, 1);
            },
            update2: function(){
                this.map2.setView([this.latitude, this.longitude]);
                updateAirData(this, 2);
            },
            cityLookup: function() {
                axios
                    .get("https://nominatim.openstreetmap.org/search?q=" + this.city + "&format=json&accept-language=en")
                    .then(response => {
                        this.latitude = response.data[0].lat; 
                        this.longitude = response.data[0].lon; 
                        this.map.setView([response.data[0].lat, response.data[0].lon]);
                        updateAirData(this, 1);
                    })
            },
            cityLookup2: function() {
                axios
                    .get("https://nominatim.openstreetmap.org/search?q=" + this.city2 + "&format=json&accept-language=en")
                    .then(response => {
                        this.latitude2 = response.data[0].lat; 
                        this.longitude2 = response.data[0].lon; 
                        this.map2.setView([response.data[0].lat, response.data[0].lon]);
                        updateAirData(this, 2);
                    })
            },
          
        },
        updated(event)
        {
            clearTimeout(this.timeout);
            console.log("waiting for user input to stop...");
            this.timeout = setTimeout(() => {
            //update function would go here, we might need to modify how this works
                console.log(event);
//                console.log(app);






                }, 200);

        },
/*        computed:{

            updateAirData: function(){
                console.log("in computed.updateAirData");
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
        }*/
    })
//    console.log("vue created");
	var mymap = L.map('mapid').setView([51.505, -0.09], 13);
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
	    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
	    maxZoom: 16,
	    minZoom: 9,
	    id: 'mapbox.streets',
	    accessToken: 'pk.eyJ1IjoibnNhdWVyIiwiYSI6ImNqdWNzY3hrazBkaDg0MHBhazVjcGE0cjkifQ.38ZAD_BPbe9s5ziTqG6U1A'
    }).addTo(mymap);
//    var marker = L.marker([51.5, -0.09]).addTo(mymap);
//    console.log("map1 done");
    
	var mymap2 = L.map('mapid2').setView([51.505, -0.09], 13);
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
	    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
	    maxZoom: 16,
	    minZoom: 9,
	    id: 'mapbox.streets',
	    accessToken: 'pk.eyJ1IjoibnNhdWVyIiwiYSI6ImNqdWNzY3hrazBkaDg0MHBhazVjcGE0cjkifQ.38ZAD_BPbe9s5ziTqG6U1A'
    }).addTo(mymap2);
//    var marker = L.marker([51.5, -0.09]).addTo(mymap2);
    
    app.map = mymap;
    app.map2 = mymap2;    
    mymap.on("moveend", ()=>(updateLatLong(app)))
    mymap2.on("moveend", ()=>(updateLatLong2(app)))
    document.getElementById("FSButton1").onclick = () => (makeFullScreen("FSButton1"));
    document.getElementById("FSButton2").onclick = () => (makeFullScreen("FSButton2"));
    updateAirData(app, 1);
    updateAirData(app, 2);
    console.log("onload finished");
}

function updateAirData(app, mapNum)
{
    console.log("in computed.updateAirData");
    var url;
    if (mapNum == 1)
    {
        url = "https://api.openaq.org/v1/measurements?limit=25&order_by=location&radius="+getRadius(app, "1")+"&coordinates="+app.latitude+","+app.longitude;
    }
    else
    {
        url = "https://api.openaq.org/v1/measurements?limit=5&order_by=location&radius="+getRadius(app, "2")+"&coordinates="+app.latitude2+","+app.longitude2;
    }

    axios
        .get(url)
        .then(response => 
        {
            var length = response.data.results.length;
            if (length > 0)
            {
//                console.log(response.data.results);
                if (mapNum == 1)
                {
                    app.measures = [];
                    for (var i =0; i< length;i++)
                    {
                        app.measures.push({ measurement : response.data.results[i]});
                    }
                }
                else
                {
                    app.measure2s = [];
                    for (var i =0; i< length;i++)
                    {
                        app.measure2s.push({ measurement : response.data.results[i]});
                    }
                }
                sortData(app, mapNum);
                getRadius(app, mapNum);
                addMarkers(app, mapNum);
                createAverage(app, mapNum);
            }
            else
            {
//                console.log("no results");
                if (mapNum == 1) {
                    app.measures = [];
                }else if(mapNum == 2){
                    app.measure2s = [];
                }else{
                    console.log("something is very wrong");
                }

            }
        }) ;
}

function sortData(app, mapNum)
{
    var hold = [];
    var dup = false;
    var idx = -1;
    if(mapNum==1)
    {
        var curr;
        console.log("sorting map 1...");
        for (var i=0; i< app.measures.length; i++)
        {
            curr = app.measures[i].measurement;
            dup = false;
            var part = curr.parameter;
            for (var j=0; j<hold.length; j++)
            {
                if (curr.date.local == app.measures[j].measurement.date.local && curr.location == app.measures[j].measurement.location)
                {
                    dup = true;
                    idx = j;
                }
            }
            if (!dup)
            {
                hold.push({measurement: curr})
                switch (part)
                {
                    case "pm10":
                        hold[hold.length-1].measurement.pm10 = app.measures[i].measurement.value;
                        break;
                    case "so2":
                        hold[hold.length-1].measurement.so2 = app.measures[i].measurement.value;
                        break;
                    case "o3":
                        hold[hold.length-1].measurement.o3 = app.measures[i].measurement.value;
                        break;
                    case "pm25":
                        hold[hold.length-1].measurement.pm25 = app.measures[i].measurement.value;
                        break;
                    case "no2":
                        hold[hold.length-1].measurement.no2 = app.measures[i].measurement.value;                    
                        break;
                }
            }
            else
            {
                switch (part) 
                {
                    case "pm10":
                        hold[idx].measurement.pm10 = app.measures[i].measurement.value;
                        break;
                    case "so2":
                        hold[idx].measurement.so2 = app.measures[i].measurement.value;
                        break;
                    case "o3":
                        hold[idx].measurement.o3 = app.measures[i].measurement.value;
                        break;
                    case "pm25":
                        hold[idx].measurement.pm25 = app.measures[i].measurement.value;
                        break;
                    case "no2":
                        hold[idx].measurement.no2 = app.measures[i].measurement.value;
                        break;
                    }
            }
            idx = -1;
        }
        app.measures = hold;
    }
}

function updateLatLong(app)
{
    var vals = app.map.getCenter()
    app.latitude = vals.lat; 
    app.longitude = vals.lng;
    var url ="https://nominatim.openstreetmap.org/reverse?lat=" + app.latitude + "&lon=" + app.longitude + "&format=json&accept-language=en";
    axios
        .get(url)
        .then(response => {
            app.city = response.data.address.city;
            updateAirData(app, 1);
        })
}
function updateLatLong2(app)
{
    var vals = app.map2.getCenter()
    app.latitude2 = vals.lat; 
    app.longitude2 = vals.lng;
    var url ="https://nominatim.openstreetmap.org/reverse?lat=" + app.latitude2 + "&lon=" + app.longitude2 + "&format=json&accept-language=en";
    axios
        .get(url)
        .then(response => 
        {
            app.city2 = response.data.address.city;
            updateAirData(app, 2);
        })
}
function makeFullScreen(buttonId)
{
    var button = document.getElementById(buttonId);
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

function addMarkers(app, mapNum){
//    console.log("inside addMarkers");
    var i=0;
    var lat;
    var lon;
    var marker;
    var myMap;
    
    if (mapNum == 1)
    {
        myMap = app.map;
        for(var i = 0; i<app.measures.length; i++)
        {
            lat = app.measures[i].measurement.coordinates.latitude;
            lon = app.measures[i].measurement.coordinates.longitude;
            marker = L.marker([lat, lon]).addTo(myMap);
        }
    }
    else
    {
        myMap = app.map2;
        for(i=0; i<app.measure2s.length; i++)
        {
            lat = app.measure2s[i].measurement.coordinates.latitude;
            lon = app.measure2s[i].measurement.coordinates.longitude;
            marker = L.marker([lat, lon]).addTo(myMap);
        }
    
    }
}

function getRadius(app, mapNum){
///    console.log("In getRadius function");
    if(mapNum == 2){var myMap = app.map2;}
    else{var myMap = app.map;}
    var northEast = myMap.getBounds().getNorthEast();
    return northEast.distanceTo(myMap.getCenter());
}

function createAverage(app, mapNum){
/*    var locations = [];
    for(var i = 0; i<app.measures.length; i++){

        locations.push({"location" : app.measures[i].measurement.location, "parameter" : app.measures[i].measurement.parameter});

    }
    console.log(locations[0].location);
    var uniqueLocations = [];
    uniqueLocations.push({"location" : locations[0].location, "parameter": locations[0].parameter});
    locations.pop(0);
  
    console.log(locations);
    console.log(uniqueLocations[0].location);
    console.log(uniqueLocations[0].parameter);
    
    /**
    for(var i = 0; i<locations.length; i++){
        
        
       if(locations[i] == uniqueLocations[0].location && value[1] == uniqueLocations[0].parameter){
        locations.pop(i);
    }
    }
    console.log(locations);
    
     console.log(uniqueLocations.length);
    
     
    for(var j = 0; j<uniqueLocations.length; j++){
        console.log(locations.length);
        for(var i = 0; i<locations.length; i++){
           
            if(locations[i].location === uniqueLocations[j].location && locations[i].parameter === uniqueLocations[j].parameter){
                //uniqueLocations.push({"location" : locations[i].location, "parameter": locations[i].parameter});
                locations.pop(i);
            }else{
                
            }
        }
        if(locations.length > 0){

            uniqueLocations.push({"location" : locations[0].location, "parameter": locations[0].parameter});
            locations.pop(0);
            console.log(uniqueLocations);
            console.log(uniqueLocations.length);
        }
    }
    console.log(uniqueLocations);
    

    for(var i = 0; i<uniqueLocations.length; i++){
        var count = 0;
        var totalValue = 0;
        for(var j = 0; j<app.measures.length; j++){
            if(app.measures[j].measurement.location==uniqueLocations[i][0] && app.measures[j].measurement.parameter ==uniqueLocations[i][1]){
                //getting subtotals for each location and parameter.
                totalValue = totalValue + app.measures[j].measurement.value;
                count = count + 1;
            }
            totalValue = totalValue / count;
            app.averages.push([uniqueLocations[i][0], uniqueLocations[i][1], totalValue]);
        }
    }
    console.log(app.averages);
    **/
}

