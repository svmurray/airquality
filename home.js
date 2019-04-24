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

//    console.log(dateLimit);
    var app = new Vue(
    {
        el: "#vueApp", 
        data: 
        {


            limit: 1000,
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
            colors1: [
            	{
            	safety : 
            	{
            		pm10: '',
            		so2: '',
            		o3: '',
            		pm25: '',
            		no2: '',
            		co: ''
            	}
            }
            ],
            colors2: [
            	{
            	safety : 
            	{
            		pm10: '',
            		so2: '',
            		o3: '',
            		pm25: '',
            		no2: '',
            		co: ''
            	}
            }
            ],
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
//        updated(event)
//        {
//            clearTimeout(this.timeout);
//            console.log("waiting for user input to stop...");
//              this.timeout = setTimeout(() => {console.log(event);}, 200);
//        },
        filters: 
        {
            round2: function (value) 
            {
                if (!value) {return '';}
                else {return Math.round(value)/100;}
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
    document.getElementById("filterInput").onclick = () => (getParams(app, 1));
    document.getElementById("filterInput2").onclick = () => (getParams(app, 2));
}

function getParams(app, mapNum)
{
    var ps = '';
    var valid = true;
    for(var i=1+(mapNum-1)*6; i<=(mapNum*6); i++)
    {
        var str = document.getElementById("in"+i).value;
        console.log(str.length);
        if (str.length != 0 && !(str.indexOf('i.e') >=0))
        {
            var idx = str.indexOf(" ");
            ps = ps + "&parameter[]=" + str.substring(0, idx);
            if (str.indexOf(">") >=0)
            {
                ps=ps+"&value_from=" + str.substring(1+str.indexOf(" ", idx+1));
            }
            else if (str.indexOf("<") >=0)
            {
                ps=ps+"&value_to=" + str.substring(1+str.indexOf(" ", idx+1));
            }
            else
            {
                window.alert("Please Enter Valid Filter");
                valid = false;
            }
        }
    }
    if (valid)
    {
        updateAirData(app, mapNum, ps);
        console.log(ps);
    }
}

function heatMap(app, part, mapNum)
{
    var avgs;
    var map;
    var maxes;
    var pointArray = [];
    var relMax = {
        pm10: 700,
        pm25: 300,
        so2: 3000,
        co: 50,
        o3: 600,
        no2: 3300
    };
    var gradient = {
        .01: 'green',
        .15: 'yellow',
        .3: 'orange',
        .6: 'red',
        .8: 'purple',
        .95: 'maroon'
    };
    
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
            for (var i=0; i<avgs.length; i++) {{if (avgs[i].measurement.pm10 > 0){pointArray.push([avgs[i].measurement.coordinates.latitude, avgs[i].measurement.coordinates.longitude, (avgs[i].measurement.pm10/avgs[i].measurement.pm10Count)/relMax.pm10]);}}}
            break;
        case 'pm25':
            for (var i=0; i<avgs.length; i++){if(avgs[i].measurement.pm25 >0){pointArray.push([avgs[i].measurement.coordinates.latitude, avgs[i].measurement.coordinates.longitude, (avgs[i].measurement.pm25/avgs[i].measurement.pm25Count)/relMax.pm25]);}}
            break;
        case 'so2':
            for (var i=0; i<avgs.length; i++){if(avgs[i].measurement.so2 >0){pointArray.push([avgs[i].measurement.coordinates.latitude, avgs[i].measurement.coordinates.longitude, (avgs[i].measurement.so2/avgs[i].measurement.so2Count)/relMax.so2]);}}
            break;
        case 'co':
            for (var i=0; i<avgs.length; i++){if(avgs[i].measurement.co >0){pointArray.push([avgs[i].measurement.coordinates.latitude, avgs[i].measurement.coordinates.longitude, (avgs[i].measurement.coCount/avgs[i].measurement.coCount)/relMax.co]);}}
            break;
        case 'o3':
            for (var i=0; i<avgs.length; i++){if(avgs[i].measurement.o3 >0){pointArray.push([avgs[i].measurement.coordinates.latitude, avgs[i].measurement.coordinates.longitude, (avgs[i].measurement.o3/avgs[i].measurement.o3Count)/relMax.o3]);}}
            break;
        case 'no2':
            for (var i=0; i<avgs.length; i++){if(avgs[i].measurement.no2 >0){pointArray.push([avgs[i].measurement.coordinates.latitude, avgs[i].measurement.coordinates.longitude, (avgs[i].measurement.no2/avgs[i].measurement.no2Count)/relMax.no2]);}}
            break;

    }
    //console.log(pointArray);                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
    var heat = L.heatLayer(pointArray, {'gradient': gradient, 'radius': 50                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   }).addTo(map);

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
 
}

function myRound(value) 
{
    if (!value) {return '';}
    else {return Math.round(value)/100;}
}

function updateAirData(app, mapNum, paramString)
{
    var url;
    if (mapNum == 1) {url = "https://api.openaq.org/v1/measurements?limit="+app.limit+"&order_by=location&radius="+getRadius(app, "1")+"&coordinates="+app.latitude+","+app.longitude+"&date_from="+app.startDate1+"&date_to="+app.endDate1;}
    else {url = "https://api.openaq.org/v1/measurements?limit="+app.limit+"&order_by=location&radius="+getRadius(app, "2")+"&coordinates="+app.latitude2+","+app.longitude2+"&date_from="+app.startDate2+"&date_to="+app.endDate2;}
    
    if(paramString != undefined)
    {
        url = url + paramString;
        console.log(url);
    }

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
                	console.log(app);
                	var meas = app.measures;
                }
                else
                {
                    app.measure2s = [];
                    for (var i =0; i< length;i++) {app.measure2s.push({ measurement : response.data.results[i]});}
                	var meas = app.measure2s;
                }
                convertData(app, mapNum);
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
            }
        }) ;
}

function sortData(app, mapNum, hold, holdMark, meas)
{
    var curr;
    var dup = false;
    var idx = -1;
    var markDup = false;
    var markIdx = -1;
    var maxes = app.map1Max;

    if (mapNum ==2) {maxes = app.map2Max;}
    console.log("sorting map " + mapNum + "...");
    for (var i=0; i< meas.length; i++)
    {
        if (i%1000 == 0) {console.log(i);}
        curr = meas[i].measurement;
        dup = false;
        markDup = false;
        var part = curr.parameter;
        for (var j=0; j<hold.length; j++)
        {
            for (var k = 0; k<holdMark.length; k++)
            {
                if (curr.location == holdMark[k].measurement.location && !markDup)
                {
                    markDup = true;
                    markIdx = k;
                    k = 10000;
                }
            }
//            console.log(curr.location == hold[j].measurement.location && curr.date.local == hold[j].measurement.date.local && !dup);
            if (curr.location == hold[j].measurement.location && curr.date.local == hold[j].measurement.date.local && !dup)
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
            var plsWorkIdx = holdMark.length;
            holdMark.push({measurement: curr})
            holdMark[plsWorkIdx].measurement.pm10 = 0;
            holdMark[plsWorkIdx].measurement.so2 = 0;
            holdMark[plsWorkIdx].measurement.o3 = 0;
            holdMark[plsWorkIdx].measurement.pm25 = 0;
            holdMark[plsWorkIdx].measurement.no2 = 0;
            holdMark[plsWorkIdx].measurement.co = 0;
            holdMark[plsWorkIdx].measurement.pm10Count = 0;
            holdMark[plsWorkIdx].measurement.so2Count = 0;
            holdMark[plsWorkIdx].measurement.o3Count = 0;
            holdMark[plsWorkIdx].measurement.pm25Count = 0;
            holdMark[plsWorkIdx].measurement.no2Count = 0;
            holdMark[plsWorkIdx].measurement.coCount = 0;
            switch (part)
            {
                case "pm10":
                    holdMark[plsWorkIdx].measurement.pm10 = meas[i].measurement.value;
                    holdMark[plsWorkIdx].measurement.pm10Count++;
                    if (maxes.pm10 < meas[i].measurement.value) {maxes.pm10 = meas[i].measurement.value;}
                    break;
                case "so2":
                    holdMark[plsWorkIdx].measurement.so2 = meas[i].measurement.value;
                    holdMark[plsWorkIdx].measurement.so2Count++;
                    if (maxes.so2 < meas[i].measurement.value) {maxes.so2 = meas[i].measurement.value;}
                    break;
                case "o3":
                    holdMark[plsWorkIdx].measurement.o3 = meas[i].measurement.value;
                    holdMark[plsWorkIdx].measurement.o3Count++;
                    if (maxes.o3 < meas[i].measurement.value) {maxes.o3 = meas[i].measurement.value;}
                    break;
                case "pm25":
                    holdMark[plsWorkIdx].measurement.pm25 = meas[i].measurement.value;
                    holdMark[plsWorkIdx].measurement.pm25Count++;
                    if (maxes.pm25 < meas[i].measurement.value) {maxes.pm25 = meas[i].measurement.value;}
                    break;
                case "no2":
                    holdMark[plsWorkIdx].measurement.no2 = meas[i].measurement.value;
                    holdMark[plsWorkIdx].measurement.no2Count++;
                    if (maxes.no2 < meas[i].measurement.value) {maxes.no2 = meas[i].measurement.value;}
                    break;
                case "co":
                    holdMark[plsWorkIdx].measurement.co = meas[i].measurement.value;                    
                    holdMark[plsWorkIdx].measurement.coCount++;
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
}

function addMarkers(app, mapNum){
    var i=0;
    var lat;
    var lon;
    var myMap;
    
    console.log("adding markers...");
    
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

function filterTable(logical, parameter, mapNum, app){

    if(logical === "no"){

    	
    	
        if(mapNum == 2){
            parameter = "."+parameter+"2";
        }else{
            parameter = "."+parameter;
        }
        
    	if($(parameter).css('display') != "none"){
    		$(document).ready(function(){
            $(parameter).hide();
        	});
    	}else{
    		$(document).ready(function(){
            $(parameter).show();
    		});
		}
	}

}
function filterLogical(input, paramter, mapNum){


        

}


function setColor(app, mapNum){
    
    
    if(mapNum == 2){
    	app.colors2 = [];
    	var colors = app.colors2;
    	var holder = app.measure2s;
    }else{
       	app.colors1 = [];
        var colors = app.colors1;
        var holder = app.measures;
  	}

   
   
   
    for(var i = 0; i<holder.length;i++){

   			var updates = {}; 	
       
         

            
            if(holder[i].measurement.pm10 <= 54){
                updates.pm10 = "green";
            }else if(holder[i].measurement.pm10 <= 154){
                updates.pm10 = "yellow";
            }else if(holder[i].measurement.pm10 <= 254){
                updates.pm10 =  "orange";
            }else if(holder[i].measurement.pm10 <= 354){
                updates.pm10 =  "red";
            }else if(holder[i].measurement.pm10 <= 454){
               updates.pm10 = "purple";
            }else if(holder[i].measurement.pm10 > 454){
                updates.pm10 = "maroon";
            }

            if(holder[i].measurement.so2  <= 91.7){
                updates.so2 = "green";
            }else if(holder[i].measurement.so2 <= 196.5){
                updates.so2 = "yellow";
            }else if(holder[i].measurement.so2 <= 484.7){
                updates.so2 =  "orange";
            }else if(holder[i].measurement.so2 <= 796.48){
                updates.so2 =  "red";
            }else if(holder[i].measurement.so2 <= 1582.48){
               updates.so2= "purple";
            }else if(holder[i].measurement.so2 > 1582.48) {
                updates.so2 = "maroon";
            }


            if(holder[i].measurement.o3 <= 108){
                updates.o3= "green";
            }else if(holder[i].measurement.o3 <= 140){
                updates.o3 = "yellow";
            }else if(holder[i].measurement.o3 <= 170){
                updates.o3 =  "orange";
            }else if(holder[i].measurement.o3 <= 210){
                updates.o3 =  "red";
            }else if(holder[i].measurement.o3 <= 400){
               updates.o3= "purple";
            }else if(holder[i].measurement.o3 > 400){
                updates.o3= "maroon";
            }

            if(holder[i].measurement.pm25 <= 12){
                updates.pm25 = "green";
            }else if(holder[i].measurement.pm25  <= 35.4){
                updates.pm25  = "yellow";
            }else if(holder[i].measurement.pm25  <= 55.4){
                updates.pm25  =  "orange";
            }else if(holder[i].measurement.pm25  <= 150.4){
                updates.pm25  =  "red";
            }else if(holder[i].measurement.pm25  <= 250.4){
               updates.pm25  = "purple";
            }else if(holder[i].measurement.pm25 > 250.4){
                updates.pm25  = "maroon";
            }

            if(holder[i].measurement.no2 <= 99.64){
                updates.no2 = "green";
            }else if(holder[i].measurement.no2 <= 188){
                updates.no2 = "yellow";
            }else if(holder[i].measurement.no2 <= 676.8){
                updates.no2 =  "orange";
            }else if(holder[i].measurement.no2<= 1220.12){
                updates.no2 =  "red";
            }else if(holder[i].measurement.no2 <= 2348.12){
               updates.no2 = "purple";
            }else if(holder[i].measurement.no2 > 2348.12){
                updates.no2 = "maroon";
            }


            if(holder[i].measurement.co <= 5.1){
                updates.co  = "green";
            }else if(holder[i].measurement.co  <= 10.9){
                updates.co  = "yellow";
            }else if(holder[i].measurement.co  <= 14.4){
                updates.co =  "orange";
            }else if(holder[i].measurement.co <= 17.8){
                updates.co  =  "red";
            }else if(holder[i].measurement.co  <= 35.2){
               updates.co  = "purple";
            }else if(holder[i].measurement.co > 35.2){
                updates.co  = "maroon";
            }
        colors.push({safety : updates})    
        }    
    }

function addBanner(app, mapNum){
	if(mapNum ==2){
        var holder = app.colors2;
        var maxColor = '';
    	for(var i=0; i<holder.length;i++){

    		if(holder[i].safety.pm10=="maroon"|holder[i].safety.so2=="maroon"|holder[i].safety.o3=="maroon"|holder[i].safety.pm25=="maroon"|holder[i].safety.no2=="maroon"|holder[i].safety.co=="maroon"){
    			maxColor = "maroon";
        	}else if(holder[i].safety.pm10=="purple"|holder[i].safety.so2=="purple"|holder[i].safety.o3=="purple"|holder[i].safety.pm25=="purple"|holder[i].safety.no2=="purple"|holder[i].safety.co=="purple" && maxColor != "maroon"){
        		maxColor = "purple";
        	}else if(holder[i].safety.pm10=="red"|holder[i].safety.so2=="red"|holder[i].safety.o3=="red"|holder[i].safety.pm25=="red"|holder[i].safety.no2=="red"|holder[i].safety.co=="red" && maxColor != "purple"){
        		maxColor = "red";
        	}else if(holder[i].safety.pm10=="orange"|holder[i].safety.so2=="orange"|holder[i].safety.o3=="orange"|holder[i].safety.pm25=="orange"|holder[i].safety.no2=="orange"|holder[i].safety.co=="orange" && maxColor != "red"){
        		maxColor = "orange";
        	}else{}
        }
    

    		

    	if(maxColor != ''){
    		var banner = "."+maxColor+"_"+"banner2";
    		console.log(banner);
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
    	
    }else{
        var holder = app.colors1;
        var maxColor = '';
    
    for(var i=0; i<holder.length;i++){
    	if(holder[i].safety.pm10=="maroon"|holder[i].safety.so2=="maroon"|holder[i].safety.o3=="maroon"|holder[i].safety.pm25=="maroon"|holder[i].safety.no2=="maroon"|holder[i].safety.co=="maroon"){
    			maxColor = "maroon";
        	}else if(holder[i].safety.pm10=="purple"|holder[i].safety.so2=="purple"|holder[i].safety.o3=="purple"|holder[i].safety.pm25=="purple"|holder[i].safety.no2=="purple"|holder[i].safety.co=="purple" && maxColor != "maroon"){
        		maxColor = "purple";
        	}else if(holder[i].safety.pm10=="red"|holder[i].safety.so2=="red"|holder[i].safety.o3=="red"|holder[i].safety.pm25=="red"|holder[i].safety.no2=="red"|holder[i].safety.co=="red" && maxColor != "purple"){
        		maxColor = "red";
        	}else if(holder[i].safety.pm10=="orange"|holder[i].safety.so2=="orange"|holder[i].safety.o3=="orange"|holder[i].safety.pm25=="orange"|holder[i].safety.no2=="orange"|holder[i].safety.co=="orange" && maxColor != "red"){
        		maxColor = "orange";
        	}else{

        	}
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


function convertData(app, mapNum){
	if(mapNum == 2){var holder = app.measure2s;}
	else{var holder = app.measures;}
	for(var i = 0; i<holder.length; i++){
		if(holder[i].measurement.parameter == "co" && holder[i].measurement.unit == "ppm"){
			holder[i].measurement.value = myRound(holder[i].measurement.value * .0409 * 28.01);
			holder[i].measurement.unit = "µg/m³";
		}
		else if(holder[i].measurement.parameter == "so2" && holder[i].measurement.unit == "ppm"){
			holder[i].measurement.value = myRound(holder[i].measurement.value * .0409 * 64.06);
			holder[i].measurement.unit = "µg/m³";
		}
		else if(holder[i].measurement.parameter == "o3" && holder[i].measurement.unit == "ppm"){
			holder[i].measurement.value = myRound(holder[i].measurement.value * .0409 * 48.00);
			holder[i].measurement.unit = "µg/m³";
		}
		else if(holder[i].measurement.parameter == "no2" && holder[i].measurement.unit == "ppm"){
			holder[i].measurement.value = myRound(holder[i].measurement.value * .0409 * 46.01);
			holder[i].measurement.unit = "µg/m³";
		}
	}

}
