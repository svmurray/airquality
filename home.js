"use strict";
window.onload = function()
{
    var date = new Date();
    var dd = String(date.getDate()).padStart(2, '0');
    var mm = String(date.getMonth() + 1).padStart(2, '0');
    var yyyy = date.getFullYear();
    date = yyyy + '-' + mm + '-' + dd;
    var dateLimit = new Date();
    dateLimit = new Date(new Date().setDate(dateLimit.getDate() - 90));
    dd = String(dateLimit.getDate()).padStart(2, '0');
    mm = String(dateLimit.getMonth() + 1).padStart(2, '0');
    yyyy = dateLimit.getFullYear();
    dateLimit = yyyy + '-' + mm + '-' + dd;
    var firstEnd = new Date();
    firstEnd = new Date(new Date().setDate(firstEnd.getDate() - 30));
    dd = String(firstEnd.getDate()).padStart(2, '0');
    mm = String(firstEnd.getMonth() + 1).padStart(2, '0');
    yyyy = firstEnd.getFullYear();
    firstEnd = yyyy + '-' + mm + '-' + dd;

    console.log(dateLimit);
    var app = new Vue(
    {
        el: "#vueApp", 
        data: 
        {
            limit: 100,
            latitude: "51.505",
            longitude: "-0.09",
            latitude2: "51.505",
            longitude2: "-0.09",
            city: "London",
            city2: "London",
            map: mymap,
            map2: mymap2,
            timeout: null,
            startDate1: firstEnd,
            startDate2: firstEnd,
            endDate1: date,
            endDate2: date,
            earliestDate: dateLimit,
            latestDate: date,
            map1Max: {
                pm10: 0,
                pm25: 0,
                co: 0,
                no2: 0,
                so2: 0,
                o3: 0
            },
            map2Max: {
                pm10: 0,
                pm25: 0,
                co: 0,
                no2: 0,
                so2: 0,
                o3: 0
            },
            //order_by -> Location (??), date_to, date_from, radius,    sort(desc), value_from, value_to, parameter,order_by
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
                        unit: '',
                        safety: ''
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
                        unit: '',
                        safety: ''
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
            hm: function(part, num) {heatMap(this, part, num);}
        },
        updated(event)
        {
            clearTimeout(this.timeout);
            console.log("waiting for user input to stop...");
            this.timeout = setTimeout(() => {console.log(event);}, 200);
        },
        filters: 
        {
            round2: function (value) 
            {
                if (!value) {return '';}
                else {return Math.round(value)/100;}
            }
        }
    })
    
    console.log(date);
    
	var mymap = L.map('mapid').setView([51.505, -0.09], 13);
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
	    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
	    maxZoom: 16,
	    minZoom: 9,
	    id: 'mapbox.streets',
	    accessToken: 'pk.eyJ1IjoibnNhdWVyIiwiYSI6ImNqdWNzY3hrazBkaDg0MHBhazVjcGE0cjkifQ.38ZAD_BPbe9s5ziTqG6U1A'
    }).addTo(mymap);
    
	var mymap2 = L.map('mapid2').setView([51.505, -0.09], 13);
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
	    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
	    maxZoom: 16,
	    minZoom: 9,
	    id: 'mapbox.streets',
	    accessToken: 'pk.eyJ1IjoibnNhdWVyIiwiYSI6ImNqdWNzY3hrazBkaDg0MHBhazVjcGE0cjkifQ.38ZAD_BPbe9s5ziTqG6U1A'
    }).addTo(mymap2);
    
    app.map = mymap;
    app.map2 = mymap2;    
    mymap.on("moveend", ()=>(updateLatLong(app)))
    mymap2.on("moveend", ()=>(updateLatLong2(app)))
    document.getElementById("FSButton1").onclick = () => (makeFullScreen("FSButton1"));
    document.getElementById("FSButton2").onclick = () => (makeFullScreen("FSButton2"));
    updateAirData(app, 1);
    updateAirData(app, 2);
    console.log("onload finished");
    document.getElementById("filterpm10").onclick = () => (filterTable("no", "pm10", "1"));
    document.getElementById("filterso2").onclick = () => (filterTable("no", "so2", "1"));
    document.getElementById("filtero3").onclick = () => (filterTable("no", "o3", "1"));
    document.getElementById("filterpm25").onclick = () => (filterTable("no", "pm25", "1"));
    document.getElementById("filterno2").onclick = () => (filterTable("no", "no2", "1"));
}

function heatMap(app, part, mapNum)
{
    var map;
    var maxes;
    var relMax;
    var pointArray = [];
    var avgs;
    var gradient;
    var maximum;
    
    if (mapNum == 1)
    {
        map = app.map;
        maxes = app.map1Max;
        avgs = app.averages;
    }
    else
    {
        map = app.map2;
        maxes = app.map2Max;
        avgs = app.average2s;
    }
    switch (part)
    {
        case 'pm10':
            /*gradient = {
                54: "green",
                124: "yellow",
                254: "orange", 
                354: "red", 
                424: "purple", 
                500: "black"
            }*/
            gradient = {
                .1: 'green',
                .2: 'yellow',
                .4: 'orange',
                .6: 'red',
                .8: 'purple',
                .9: 'maroon'
            }

            relMax = 700;            
            for (var i=0; i<avgs.length; i++) 
            {
                if (avgs[i] != undefined)
                {
                    if (avgs[i].measurement.pm10 > 0)
                    {
                        console.log(avgs[i].measurement.location);
                        
                        pointArray.push([avgs[i].measurement.coordinates.latitude, avgs[i].measurement.coordinates.longitude, (avgs[i].measurement.pm10)/500]);
                    }                                                                                                                                                               	
                }
            }
            break;
        case 'pm25':/*
            gradient = {
                12: "green",
                35.4: "yellow",
                55.4: "orange", 
                150.4: "red", 
                250.4: "purple", 
                300: "maroon"
            }*/
//            relMax = gradient.maroon;
            for (var i=0; i<avgs.length; i++){if(avgs[i].measurement.pm25 >0){pointArray.push([avgs[i].measurement.coordinates.longitude, avgs[i].measurement.coordinates.longitude, avgs[i].measurement.pm25]);}}
            break;
        case 'so2':
            gradient = {
                91.7: "green",
                196.5: "yellow",
                484.7: "orange", 
                796.5: "red", 
                1582.5: "purple", 
                3000: "maroon"
            }        
//            relMax = gradient.maroon;
            for (var i=0; i<avgs.length; i++){if(avgs[i].measurement.so2 >0){pointArray.push([avgs[i].measurement.coordinates.longitude, avgs[i].measurement.coordinates.longitude, avgs[i].measurement.so2]);}}
            break;
        case 'co':
            gradient = {
                5.1: "green",
                10.9: "yellow",
                14.4: "orange", 
                17.8: "red", 
                35.2: "purple", 
                50: "maroon"
            }
//            relMax = gradient.maroon;
            for (var i=0; i<avgs.length; i++){if(avgs[i].measurement.co >0){pointArray.push([avgs[i].measurement.coordinates.longitude, avgs[i].measurement.coordinates.longitude, avgs[i].measurement.co]);}}
            break;
        case 'o3':
            gradient = {
                108: "green",
                140: "yellow",
                170: "orange", 
                210: "red", 
                400: "purple", 
                600: "maroon"
            }
//            relMax = gradient.maroon;
            for (var i=0; i<avgs.length; i++){if(avgs[i].measurement.o3 >0){pointArray.push([avgs[i].measurement.coordinates.longitude, avgs[i].measurement.coordinates.longitude, avgs[i].measurement.o3]);}}
            break;
        case 'no2':
            gradient = {
                100: "green",
                188: "yellow",
                676.8: "orange", 
                1220.12: "red", 
                2348.12: "purple", 
                3300: "maroon"
            }
//            relMax = gradient.maroon;
            for (var i=0; i<avgs.length; i++){if(avgs[i].measurement.no2 >0){pointArray.push([avgs[i].measurement.coordinates.latitude, avgs[i].measurement.coordinates.longitude, avgs[i].measurement.no2]);}}
            break;
    }
//    var heat = L.heatLayer(pointArray).addTo(map);
    var heat = L.heatLayer(pointArray, {'gradient': gradient}).addTo(map);    
//    console.log("create heatmap for " + part + " on " + mapNum + " && " + relMax);, 
    console.log(pointArray);
    console.log(map);
}

function myRound(value) 
{
    if (!value) {return '';}
    else {return Math.round(value)/100;}
}

function updateAirData(app, mapNum)
{
    var url;
    if (mapNum == 1) {url = "https://api.openaq.org/v1/measurements?limit="+app.limit+"&order_by=location&radius="+getRadius(app, "1")+"&coordinates="+app.latitude+","+app.longitude+"&date_from="+app.startDate1+"&date_to="+app.endDate1;}
    else {url = "https://api.openaq.org/v1/measurements?limit="+app.limit+"&order_by=location&radius="+getRadius(app, "2")+"&coordinates="+app.latitude2+","+app.longitude2+"&date_from="+app.startDate2+"&date_to="+app.endDate2;}

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
                    for (var i =0; i< length;i++) {app.measures.push({ measurement : response.data.results[i]});}
                    meas = app.measures;
                }
                else
                {
                    app.measure2s = [];
                    for (var i =0; i< length;i++) {app.measure2s.push({ measurement : response.data.results[i]});}
                    meas = app.measure2s;
                }
                convertData(app);
                sortData(app, mapNum, [], [], meas);
                getRadius(app, mapNum);
                addMarkers(app, mapNum);
                setColor(app, mapNum);
                addBanner(app, mapNum);


            }
            else
            {
                if (mapNum == 1) {app.measures = [];}
                else if(mapNum == 2){app.measure2s = [];}
                else{console.log("something is very wrong");}
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
    var maxes = app.map1Max;
    
    if (mapNum ==2) {maxes = app.map2Max;}
    
    console.log("sorting map " + mapNum + "...");
    for (var i=0; i< meas.length; i++)
    {
        curr = meas[i].measurement;
        dup = false;
        markDup = false;
        var part = curr.parameter;
        for (var j=0; j<hold.length; j++)
        {
            if ( j<holdMark.length)
            {
                if (curr.location == holdMark[j].measurement.location && !markDup)
                {
                    markDup = true;
                    markIdx = j;
                }
            }
            if (markDup && curr.date.local == hold[j].measurement.date.local && !dup)
            {
                dup = true;
                idx = j;
                j = hold.length + 1;
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
            hold[hold.length-1].measurement.co = '-';
            switch (part)
            {
                case "pm10":
                    hold[hold.length-1].measurement.pm10 = meas[i].measurement.value;
                    if (maxes.pm10 < meas[i].measurement.value) {maxes.pm10 = meas[i].measurement.value;}
                    break;
                case "so2":
                    hold[hold.length-1].measurement.so2 = meas[i].measurement.value;
                    if (maxes.so2 < meas[i].measurement.value) {maxes.so2 = meas[i].measurement.value;}
                    break;
                case "o3":
                    hold[hold.length-1].measurement.o3 = meas[i].measurement.value;
                    if (maxes.o3 < meas[i].measurement.value) {maxes.o3 = meas[i].measurement.value;}
                    break;
                case "pm25":
                    hold[hold.length-1].measurement.pm25 = meas[i].measurement.value;
                    if (maxes.pm25 < meas[i].measurement.value) {maxes.pm25 = meas[i].measurement.value;}
                    break;
                case "no2":
                    hold[hold.length-1].measurement.no2 = meas[i].measurement.value;                    
                    if (maxes.no2 < meas[i].measurement.value) {maxes.no2 = meas[i].measurement.value;}
                    break;
                case "co":
                    hold[hold.length-1].measurement.co = meas[i].measurement.value;                    
                    if (maxes.co < meas[i].measurement.value) {maxes.co = meas[i].measurement.value;}
                    break;
            }
        }
        else
        {
            switch (part) 
            {
                case "pm10":
                    hold[idx].measurement.pm10 = meas[i].measurement.value;
                    if (maxes.pm10 < meas[i].measurement.value) {maxes.pm10 = meas[i].measurement.value;}
                    break;
                case "so2":
                    hold[idx].measurement.so2 = meas[i].measurement.value;
                    if (maxes.so2 < meas[i].measurement.value) {maxes.so2 = meas[i].measurement.value;}
                    break;
                case "o3":
                    hold[idx].measurement.o3 = meas[i].measurement.value;
                    if (maxes.o3 < meas[i].measurement.value) {maxes.o3 = meas[i].measurement.value;}
                    break;
                case "pm25":
                    hold[idx].measurement.pm25 = meas[i].measurement.value;
                    if (maxes.pm25 < meas[i].measurement.value) {maxes.pm25 = meas[i].measurement.value;}
                    break;
                case "no2":
                    hold[idx].measurement.no2 = meas[i].measurement.value;
                    if (maxes.no2 < meas[i].measurement.value) {maxes.no2 = meas[i].measurement.value;}
                    break;
                case "co":
                    hold[idx].measurement.co = meas[i].measurement.value;
                    if (maxes.co < meas[i].measurement.value) {maxes.co = meas[i].measurement.value;}
                    break;

            }
        }
        if(!markDup)
        {
            console.log("new location");
            holdMark.push({measurement: curr})
            holdMark[holdMark.length-1].measurement.pm10 = 0;
            holdMark[holdMark.length-1].measurement.so2 = 0;
            holdMark[holdMark.length-1].measurement.o3 = 0;
            holdMark[holdMark.length-1].measurement.pm25 = 0;
            holdMark[holdMark.length-1].measurement.no2 = 0;
            holdMark[holdMark.length-1].measurement.co = 0;
            holdMark[holdMark.length-1].measurement.pm10Count = 0;
            holdMark[holdMark.length-1].measurement.so2Count = 0;
            holdMark[holdMark.length-1].measurement.o3Count = 0;
            holdMark[holdMark.length-1].measurement.pm25Count = 0;
            holdMark[holdMark.length-1].measurement.no2Count = 0;
            holdMark[holdMark.length-1].measurement.coCount = 0;
            switch (part)
            {
                case "pm10":
                    holdMark[holdMark.length-1].measurement.pm10 = meas[i].measurement.value;
                    holdMark[holdMark.length-1].measurement.pm10Count++;
                    if (maxes.pm10 < meas[i].measurement.value) {maxes.pm10 = meas[i].measurement.value;}
                    break;
                case "so2":
                    holdMark[holdMark.length-1].measurement.so2 = meas[i].measurement.value;
                    holdMark[holdMark.length-1].measurement.so2Count++;
                    if (maxes.so2 < meas[i].measurement.value) {maxes.so2 = meas[i].measurement.value;}
                    break;
                case "o3":
                    holdMark[holdMark.length-1].measurement.o3 = meas[i].measurement.value;
                    holdMark[holdMark.length-1].measurement.o3Count++;
                    if (maxes.o3 < meas[i].measurement.value) {maxes.o3 = meas[i].measurement.value;}
                    break;
                case "pm25":
                    holdMark[holdMark.length-1].measurement.pm25 = meas[i].measurement.value;
                    holdMark[holdMark.length-1].measurement.pm25Count++;
                    if (maxes.pm25 < meas[i].measurement.value) {maxes.pm25 = meas[i].measurement.value;}
                    break;
                case "no2":
                    holdMark[holdMark.length-1].measurement.no2 = meas[i].measurement.value;                    
                    holdMark[holdMark.length-1].measurement.no2Count++;
                    if (maxes.no2 < meas[i].measurement.value) {maxes.no2 = meas[i].measurement.value;}
                    break;
                case "co":
                    holdMark[holdMark.length-1].measurement.co = meas[i].measurement.value;                    
                    holdMark[holdMark.length-1].measurement.coCount++;
                    if (maxes.co < meas[i].measurement.value) {maxes.co = meas[i].measurement.value;}
                    break;
            }
        }
        else
        {
            switch (part) 
            {
                case "pm10":
                    holdMark[markIdx].measurement.pm10 += meas[i].measurement.value;
                    holdMark[markIdx].measurement.pm10Count++;
                    if (maxes.pm10 < meas[i].measurement.value) {maxes.pm10 = meas[i].measurement.value;}
                    break;
                case "so2":
                    holdMark[markIdx].measurement.so2 += meas[i].measurement.value;
                    holdMark[markIdx].measurement.so2Count++;
                    if (maxes.so2 < meas[i].measurement.value) {maxes.so2 = meas[i].measurement.value;}
                    break;
                case "o3":
                    holdMark[markIdx].measurement.o3 += meas[i].measurement.value;
                    holdMark[markIdx].measurement.o3Count++;
                    if (maxes.o3 < meas[i].measurement.value) {maxes.o3 = meas[i].measurement.value;}
                    break;
                case "pm25":
                    holdMark[markIdx].measurement.pm25 += meas[i].measurement.value;
                    holdMark[markIdx].measurement.pm25Count++;
                    if (maxes.pm25 < meas[i].measurement.value) {maxes.pm25 = meas[i].measurement.value;}
                    break;
                case "no2":
                    holdMark[markIdx].measurement.no2 += meas[i].measurement.value;
                    holdMark[markIdx].measurement.no2Count++;
                    if (maxes.no2 < meas[i].measurement.value) {maxes.no2 = meas[i].measurement.value;}
                    break;
                case "co":
                    holdMark[markIdx].measurement.co += meas[i].measurement.value;
                    holdMark[markIdx].measurement.coCount++;
                    if (maxes.co < meas[i].measurement.value) {maxes.co = meas[i].measurement.value;}
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
    console.log(holdMark);
}

function addMarkers(app, mapNum){
    var i=0;
    var lat;
    var lon;
    var myMap;
    
    if (mapNum == 1)
    {
        myMap = app.map;
        for(var i = 0; i<app.averages.length; i++)
        {
            var marker;
            lat = app.averages[i].measurement.coordinates.latitude;
            lon = app.averages[i].measurement.coordinates.longitude;
            marker = L.marker([lat, lon]).addTo(myMap)
                .bindPopup(
                    "<table>"+
                    "<tr><th>"+app.averages[i].measurement.location+"</th>"+
                    "<tr><td>pm10= "+myRound(100*app.averages[i].measurement.pm10 / app.averages[i].measurement.pm10Count)+"</td></tr>"+
                    "<tr><td>so2= "+myRound(100*app.averages[i].measurement.so2 / app.averages[i].measurement.so2Count)+"</td></tr>"+
                    "<tr><td>so3= "+myRound(100*app.averages[i].measurement.o3 / app.averages[i].measurement.o3Count)+"</td></tr>"+
                    "<tr><td>pm25= "+myRound(100*app.averages[i].measurement.pm25 / app.averages[i].measurement.pm25Count)+"</td></tr>"+
                    "<tr><td>no2= "+myRound(100*app.averages[i].measurement.no2 / app.averages[i].measurement.no2Count)+"</td></tr>"+
                    "<tr><td>co= "+myRound(100*app.averages[i].measurement.co / app.averages[i].measurement.coCount)+"</td></tr>"+
                    "</table>"
                );
            marker.on("mouseover", function (e) { this.openPopup();});
//            marker.on("mouseover", function(){marker.openPopup();});
//            marker.on("mouseout", function(){marker.closePopup();});
            marker.on("mouseout", function (e) { this.closePopup();});
        }
    }
    else
    {
        myMap = app.map2;
        for(i=0; i<app.average2s.length; i++)
        {
            var marker;
            lat = app.average2s[i].measurement.coordinates.latitude;
            lon = app.average2s[i].measurement.coordinates.longitude;
            marker = L.marker([lat, lon]).addTo(myMap)
                .bindPopup(
                    "<table>"+
                    "<tr><th>"+app.average2s[i].measurement.location+"</th>"+
                    "<tr><td>pm10= "+myRound(100*app.average2s[i].measurement.pm10 / app.average2s[i].measurement.pm10Count)+"</td></tr>"+
                    "<tr><td>so2= "+myRound(100*app.average2s[i].measurement.so2 / app.average2s[i].measurement.so2Count)+"</td></tr>"+
                    "<tr><td>so3= "+myRound(100*app.average2s[i].measurement.o3 / app.average2s[i].measurement.o3Count)+"</td></tr>"+
                    "<tr><td>pm25= "+myRound(100*app.average2s[i].measurement.pm25 / app.average2s[i].measurement.pm25Count)+"</td></tr>"+
                    "<tr><td>no2= "+myRound(100*app.average2s[i].measurement.no2 / app.average2s[i].measurement.no2Count)+"</td></tr>"+
                    "<tr><td>co= "+myRound(100*app.average2s[i].measurement.co / app.average2s[i].measurement.coCount)+"</td></tr>"+
                    "</table>"
                );
            marker.on("mouseover", function(){marker.openPopup();});
            marker.on("mouseout", function(){marker.closePopup();});
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
        .then(response => {
            app.city2 = response.data.address.city;
            updateAirData(app, 2);
        })
}

function iterationCopy(input) 
{
    var target = {};
    for (var prop in input) {if (input.hasOwnProperty(prop)) {target[prop] = input[prop];}}
    return target;
}

function filterTable(logical, parameter, mapNum){
    if(logical === "no"){
        var parameter = parameter;
        if(mapNum == 2){
            parameter = "."+parameter+"2";
        }else{
            parameter = "."+parameter;
        }
        console.log(parameter);
        $(document).ready(function(){
            $(parameter).hide();
        });
    }else{
    }
}

function filterLogical(input, paramter, mapNum){

}
function setColor(app, mapNum){
    console.log("in set color");
    
    if(mapNum ==2){
        var holder = app.measure2s;
    }else{
        var holder = app.measures;
    }
    for(var i = 0; i<holder.length;i++){
    
        if(holder[i].measurement.parameter == "pm10"){
            
            if(holder[i].measurement.value <= 54){
                holder[i].measurement.safety = "green"; 
            }else if(holder[i].measurement.value <= 154){
                holder[i].measurement.safety = "yellow";
            }else if(holder[i].measurement.value <= 254){
                holder[i].measurement.safety = "orange";
            }else if(holder[i].measurement.value <= 354){
                holder[i].measurement.safety = "red";
            }else if(holder[i].measurement.value <= 454){
                holder[i].measurement.safety = "purple";
            }else {
                holder[i].measurement.safety = "maroon";
            }
        }else if(holder[i].measurement.parameter == "so2"){
            
            if(holder[i].measurement.value <= 91.7){
                holder[i].measurement.safety = "green"; 
            }else if(holder[i].measurement.value <= 196.5){
                holder[i].measurement.safety = "yellow";
            }else if(holder[i].measurement.value <= 484.7){
                holder[i].measurement.safety = "orange";
            }else if(holder[i].measurement.value <= 796.48){
                holder[i].measurement.safety = "red";
            }else if(holder[i].measurement.value <= 1582.48){
                holder[i].measurement.safety = "purple";
            }else{
                holder[i].measurement.safety = "maroon";
            }
        }else if(holder[i].measurement.parameter == "o3"){
            
            if(holder[i].measurement.value <= 108){
                holder[i].measurement.safety = "green"; 
            }else if(holder[i].measurement.value <= 140){
                holder[i].measurement.safety = "yellow";
            }else if(holder[i].measurement.value <= 170){
                holder[i].measurement.safety = "orange";
            }else if(holder[i].measurement.value <= 210){
                holder[i].measurement.safety = "red";
            }else if(holder[i].measurement.value <= 400){
                holder[i].measurement.safety = "purple";
            }else{
                holder[i].measurement.safety = "maroon";
            }
        }else if(holder[i].measurement.parameter == "pm25"){
            
            if(holder[i].measurement.value <= 12){
                holder[i].measurement.safety = "green"; 
            }else if(holder[i].measurement.value <= 34.5){
                holder[i].measurement.safety = "yellow";
            }else if(holder[i].measurement.value <= 55.5){
                holder[i].measurement.safety = "orange";
            }else if(holder[i].measurement.value <= 150.4){
                holder[i].measurement.safety = "red";
            }else if(holder[i].measurement.value <= 250.4){
                holder[i].measurement.safety = "purple";
            }else{
                holder[i].measurement.safety = "maroon";
            }
        }else if(holder[i].measurement.parameter == "no2"){
            
            if(holder[i].measurement.value <= 99.64){
                holder[i].measurement.safety = "green"; 
            }else if(holder[i].measurement.value <= 188){
                holder[i].measurement.safety = "yellow";
            }else if(holder[i].measurement.value <= 676.8){
                holder[i].measurement.safety = "orange";
            }else if(holder[i].measurement.value <= 1220.12){
                holder[i].measurement.safety = "red";
            }else if(holder[i].measurement.value <= 2348.12){
                holder[i].measurement.safety = "purple";
            }else{
                holder[i].measurement.safety = "maroon";
            }
        }else if(holder[i].measurement.parameter == "co"){
            console.log("in co");
            console.log(holder[i].measurement.value);
        	if(holder[i].measurement.value <= 5.1){
        		holder[i].measurement.safety = "green";
        	}else if(holder[i].measurement.safety <= 10.9){
        		holder[i].measurement.safety = "yellow";
        	}
        }
    }
}

function addBanner(app, mapNum){
	if(mapNum ==2){
        var holder = app.measure2s;
        var maxColor = '';
    	for(var i=0; i<holder.length;i++){
    		if(holder[i].measurement.safety=="maroon"){
    			maxColor = "maroon";
        	}else if(holder[i].measurement.safety=="purple" && maxColor != "maroon"){
        		maxColor = "purple";
        	}else if(holder[i].measurement.safety=="red" && maxColor != "purple"){
        		maxColor = "red";
        	}else if(holder[i].measurement.safety=="orange" && maxColor != "red"){
        		maxColor = "orange";
        	}else{

        	}
    
    	if(maxColor != ''){
    		var banner = "."+maxColor+"_"+"banner2";
    		$(document).ready(function(){
    		
    		$(".maroon_banner2").hide();
    		$(".purple_banner2").hide();
    		$(".red_banner2").hide();
    		$(".orange_banner2").hide();
    		$(banner).show();
    		});
    	}else{
    		$(".maroon_banner2").hide();
    		$(".purple_banner2").hide();
    		$(".red_banner2").hide();
    		$(".orange_banner2").hide();
    	}
    	}
    }else{
    var holder = app.measures;
    var maxColor = '';
    console.log(app);
    for(var i=0; i<holder.length;i++){
    	if(holder[i].measurement.safety=="maroon"){
    		maxColor = "maroon";
        }else if(holder[i].measurement.safety=="purple" && maxColor != "maroon"){
        	maxColor = "purple";
        }else if(holder[i].measurement.safety=="red" && maxColor != "purple"){
        	maxColor = "red";
        }else if(holder[i].measurement.safety=="orange" && maxColor != "red"){
        	maxColor = "orange";
        }else{

        }
    
    if(maxColor != ''){
    	var banner = "."+maxColor+"_"+"banner";
    	$(document).ready(function(){
    		
    		$(".maroon_banner").hide();
    		$(".purple_banner").hide();
    		$(".red_banner").hide();
    		$(".orange_banner").hide();
    		$(banner).show();

    	})
    }else{
    	$(".maroon_banner").hide();
    	$(".purple_banner").hide();
    	$(".red_banner").hide();
    	$(".orange_banner").hide();
    }


    }
}
}


function convertData(app, mapNum){

	if(mapNum == 2){
		var holder = app.measure2s;
	}else{
		var holder = app.measures;
	}

	for(var i = 0; i<holder.length; i++){
		console.log(holder[i].measurement.value);
		if(holder[i].measurement.parameter == "co" && holder[i].measurement.unit == "ppm"){
			holder[i].measurement.value = myRound(holder[i].measurement.value * .0409 * 28.01);
			holder[i].measurement.unit = "µg/m³";
		
		}else if(holder[i].measurement.parameter == "so2" && holder[i].measurement.unit == "ppm"){
			holder[i].measurement.value = myRound(holder[i].measurement.value * .0409 * 64.06);
			holder[i].measurement.unit = "µg/m³";
		}else if(holder[i].measurement.parameter == "o3" && holder[i].measurement.unit == "ppm"){
			holder[i].measurement.value = myRound(holder[i].measurement.value * .0409 * 48.00);
			holder[i].measurement.unit = "µg/m³";
		
		}else if(holder[i].measurement.parameter == "no2" && holder[i].measurement.unit == "ppm"){
			holder[i].measurement.value = myRound(holder[i].measurement.value * .0409 * 46.01);
			holder[i].measurement.unit = "µg/m³";
		}
	}

}
