"use strict";
window.onload = function()
{
    console.log("js working...");
    var url = "https://api.openaq.org/v1/locations?coordinates=44,-93";
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


