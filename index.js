const http = require("http");
const fs = require("fs");
var requests = require("requests");

const homeFile = fs.readFileSync("home.html", "utf-8");
// Math.round(((org.main.temp - 273.15)*10)/10)
const replaceVal = (tempVal,org)=>{
    let temperature = tempVal.replace("{%tempval%}",(org.main.temp - 273.15).toFixed(2));
    temperature = temperature.replace("{%tempmin%}",(org.main.temp_min - 273.15).toFixed(2));
    temperature = temperature.replace("{%tempmax%}",(org.main.temp_max - 273.15).toFixed(2));
    temperature = temperature.replace("{%location%}",org.name );
    temperature = temperature.replace("{%country%}",org.sys.country);
    temperature = temperature.replace("{%tempStatus%}",org.weather[0].main);
    console.log(org.weather[0].main)
    
    "{%tepStatus%}"
    return temperature;
}

const server = http.createServer((req, res) => {
    if (req.url == "/") {
        requests("http://api.openweathermap.org/data/2.5/weather?q=Varanasi&appid=f1dc2140560da0e1cee7321488abc11f"
        )
            .on('data',  (chunk)=> {
                const objData = JSON.parse(chunk);
                // console.log(chunk)
                const arrData = [objData];
                // console.log(arrData[0].main.temp - 273)
                const realTimeData = arrData.map((val)=>
                    replaceVal(homeFile,val)).join("")
                res.write(realTimeData);
            })
            .on('end',  (err)=> {
                if (err) return console.log('connection closed due to errors', err);
                res.end()
                
            });
    }
})
server.listen(8000,"127.0.0.1")