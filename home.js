"use strict";
window.onload = function()
{
    console.log("js working...");
    var app = new Vue(
    {
        el: "#vueApp", 
        data: 
        {
            coordinates: "44,-93",
            dateTo: "",
            dateFrom: "",
            radius: "",
            parameter: "",
            orderBy: "location",
            //order_by, sort(desc), value_from, value_to
            url: "https://api.openaq.org/v1/measurements?limit=10&order_by=location",
            test: "Vue functional"
        },
        mounted() 
        {
            axios
                .get(this.url)
                .then(response => (this.test = response))
        }
    })
    
/*    function createUrl(appObj)
    {
        var final = appObj.url;
        if (*/
}


