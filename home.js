"use strict";
window.onload = function()
{
    console.log("js working...");
    var radius = 500000;
    var parameter = "";
    var coordinates = "44,-93";
    var url = "https://api.openaq.org/v1/locations?coordinates="+coordinates+"&limit=10000&radius="+radius+"&parameter="+parameter;
    var app = new Vue(
    {
        el: "#vueApp", 
        data: 
        {
            test: "Vue functional"
        },
        mounted() 
        {
            axios
                .get(url)
                .then(response => (this.test = response))
        }
    })
}


