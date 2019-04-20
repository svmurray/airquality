"use strict";
window.onload = function()
{
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
            average2s : [
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
        filters: 
        {
            round2: function (value) 
            {
                if (!value) {return '';}
                else
                {
                    return Math.round(value)/100;
                }
            }
        }
    })
	var mymap = L.map('mapid').setView([51.505, -0.09], 13);
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
	    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
	    maxZoom: 16,
	    minZoom: 9,
	    id: 'mapbox.streets',
	    accessToken: 'pk.eyJ1IjoibnNhdWVyIiwiYSI6ImNqdWNzY3hrazBkaDg0MHBhazVjcGE0cjkifQ.38ZAD_BPbe9s5ziTqG6U1A'
    }).addTo(mymap);
//    var marker = L.marker([51.5, -0.09]).addTo(mymap);
    
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
    var url;
    if (mapNum == 1) {url = "https://api.openaq.org/v1/measurements?limit=25&order_by=location&radius="+getRadius(app, "1")+"&coordinates="+app.latitude+","+app.longitude;}
    else {url = "https://api.openaq.org/v1/measurements?limit=25&order_by=location&radius="+getRadius(app, "2")+"&coordinates="+app.latitude2+","+app.longitude2;}

    axios
        .get(url)
        .then(response => 
        {
            var length = response.data.results.length;
            if (length > 0)
            {
                var meas;
                if (mapNum == 1)
                {
                    app.measures = [];
                    for (var i =0; i< length;i++)
                    {
                        app.measures.push({ measurement : response.data.results[i]});
                    }
                    meas = app.measures;
                }
                else
                {
                    app.measure2s = [];
                    for (var i =0; i< length;i++)
                    {
                        app.measure2s.push({ measurement : response.data.results[i]});
                    }
                    meas = app.measure2s;
                }
                sortData(app, mapNum, [], [], meas);
                getRadius(app, mapNum);
                addMarkers(app, mapNum);
            }
            else
            {
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

function sortData(app, mapNum, hold, holdMark, meas)
{
    var dup = false;
    var idx = -1;
    var markDup = false;
    var markIdx = -1;
    var curr;
    
    console.log("sorting map " + mapNum + "...");
    for (var i=0; i< meas.length; i++)
    {
        curr = meas[i].measurement;
        dup = false;
        var part = curr.parameter;
        for (var j=0; j<hold.length; j++)
        {
            if (curr.location == hold[j].measurement.location && !markDup)
            {
                markDup = true;
                markIdx = j;
            }
            if (curr.date.local == hold[j].measurement.date.local && markDup && !dup)
            {
                dup = true;
                idx = j;
            }
        }
        if (!dup)
        {
            var holdCurr = iterationCopy(curr);
            hold.push({measurement: holdCurr})
            hold[hold.length-1].measurement.pm10 = '-';
            hold[hold.length-1].measurement.so2 = '-';
            hold[hold.length-1].measurement.o3 = '-';
            hold[hold.length-1].measurement.pm25 = '-';
            hold[hold.length-1].measurement.no2 = '-';
            switch (part)
            {
                case "pm10":
                    hold[hold.length-1].measurement.pm10 = meas[i].measurement.value;
                    break;
                case "so2":
                    hold[hold.length-1].measurement.so2 = meas[i].measurement.value;
                    break;
                case "o3":
                    hold[hold.length-1].measurement.o3 = meas[i].measurement.value;
                    break;
                case "pm25":
                    hold[hold.length-1].measurement.pm25 = meas[i].measurement.value;
                    break;
                case "no2":
                    hold[hold.length-1].measurement.no2 = meas[i].measurement.value;                    
                    break;
            }
        }
        else
        {
            switch (part) 
            {
                case "pm10":
                    hold[idx].measurement.pm10 = meas[i].measurement.value;
                    break;
                case "so2":
                    hold[idx].measurement.so2 = meas[i].measurement.value;
                    break;
                case "o3":
                    hold[idx].measurement.o3 = meas[i].measurement.value;
                    break;
                case "pm25":
                    hold[idx].measurement.pm25 = meas[i].measurement.value;
                    break;
                case "no2":
                    hold[idx].measurement.no2 = meas[i].measurement.value;
                    break;
                }
        }
        if(!markDup)
        {
            holdMark.push({measurement: curr})
            holdMark[holdMark.length-1].measurement.pm10 = 0;
            holdMark[holdMark.length-1].measurement.so2 = 0;
            holdMark[holdMark.length-1].measurement.o3 = 0;
            holdMark[holdMark.length-1].measurement.pm25 = 0;
            holdMark[holdMark.length-1].measurement.no2 = 0;
            holdMark[holdMark.length-1].measurement.pm10Count = 0;
            holdMark[holdMark.length-1].measurement.so2Count = 0;
            holdMark[holdMark.length-1].measurement.o3Count = 0;
            holdMark[holdMark.length-1].measurement.pm25Count = 0;
            holdMark[holdMark.length-1].measurement.no2Count = 0;
            switch (part)
            {
                case "pm10":
                    holdMark[holdMark.length-1].measurement.pm10 = meas[i].measurement.value;
                    break;
                case "so2":
                    holdMark[holdMark.length-1].measurement.so2 = meas[i].measurement.value;
                    break;
                case "o3":
                    holdMark[holdMark.length-1].measurement.o3 = meas[i].measurement.value;
                    break;
                case "pm25":
                    holdMark[holdMark.length-1].measurement.pm25 = meas[i].measurement.value;
                    break;
                case "no2":
                    holdMark[holdMark.length-1].measurement.no2 = meas[i].measurement.value;                    
                    break;
            }
        }
        else
        {
            switch (part) 
            {
                case "pm10":
                    holdMark[markIdx].measurement.pm10 += meas[i].measurement.value;
                    holdMark[holdMark.length-1].measurement.pm10Count++;
                    break;
                case "so2":
                    holdMark[markIdx].measurement.so2 += meas[i].measurement.value;
                    holdMark[holdMark.length-1].measurement.so2Count++;
                    break;
                case "o3":
                    holdMark[markIdx].measurement.o3 += meas[i].measurement.value;
                    holdMark[holdMark.length-1].measurement.o3Count++;
                    break;
                case "pm25":
                    holdMark[markIdx].measurement.pm25 += meas[i].measurement.value;
                    holdMark[holdMark.length-1].measurement.pm25Count++;
                    break;
                case "no2":
                    holdMark[markIdx].measurement.no2 += meas[i].measurement.value;
                    holdMark[holdMark.length-1].measurement.no2Count++;
                    break;
                }
        }
        idx = -1;
    }
    if (mapNum == 1)
    {
        app.averages = holdMark;
        app.measures = hold;
    }
    else
    {
        app.average2s = holdMark;
        app.measure2s = hold;
    }
}

function addMarkers(app, mapNum){
    var i=0;
    var lat;
    var lon;
    var marker;
    var myMap;
    
    if (mapNum == 1)
    {
        myMap = app.map;
        console.log("Average: " + app.averages.length);
        for(var i = 0; i<app.averages.length; i++)
        {
            lat = app.averages[i].measurement.coordinates.latitude;
            lon = app.averages[i].measurement.coordinates.longitude;
            marker = L.marker([lat, lon]).addTo(myMap)
                .bindPopup(
                    "<table>"+
                    "<tr><th>"+app.averages[i].measurement.location+"</th>"+
                    "<tr><td>pm10= "+(app.averages[i].measurement.pm10 / app.averages[i].measurement.pm10Count)+"</td></tr>"+
                    "<tr><td>so2= "+(app.averages[i].measurement.so2 / app.averages[i].measurement.so2Count)+"</td></tr>"+
                    "<tr><td>so3= "+(app.averages[i].measurement.o3 / app.averages[i].measurement.o3Count)+"</td></tr>"+
                    "<tr><td>pm25= "+(app.averages[i].measurement.pm25 / app.averages[i].measurement.pm25Count)+"</td></tr>"+
                    "<tr><td>no3= "+(app.averages[i].measurement.no2 / app.averages[i].measurement.no2Count)+"</td></tr>"+
                    "</table>"
                    );
                   

            marker.on("mouseover", function(){
                marker.openPopup();
            });
            marker.on("mouseout", function(){
                marker.closePopup();
            });
        }
    }
    else
    {
        myMap = app.map2;
        console.log("average2: " + app.average2s.length);
        for(i=0; i<app.average2s.length; i++)
        {
            lat = app.average2s[i].measurement.coordinates.latitude;
            lon = app.average2s[i].measurement.coordinates.longitude;
            marker = L.marker([lat, lon]).addTo(myMap);
        }
    }
}

function getRadius(app, mapNum){
    if(mapNum == 2){var myMap = app.map2;}
    else{var myMap = app.map;}
    var northEast = myMap.getBounds().getNorthEast();
    return northEast.distanceTo(myMap.getCenter());
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

function iterationCopy(src) 
{
    var target = {};
    for (var prop in src) 
    {
        if (src.hasOwnProperty(prop)) 
        {
            target[prop] = src[prop];
        }
    }
    return target;
}
