const http = require( "node:http" ),
    fs   = require( "node:fs" ),
    // IMPORTANT: you must run `npm install` in the directory for this assignment
    // to install the mime library if you're testing this on your local machine.
    // However, Glitch will install it automatically by looking in your package.json
    // file.
    mime = require( "mime" ),
    dir  = "public/",
    port = 3000

const appdata = [];

// let fullURL = ""
const server = http.createServer( function( request,response ) {
    if( request.method === "GET" ) {
        handleGet( request, response )
    }else if( request.method === "POST" ){
        handlePost( request, response )
    }

    // The following shows the requests being sent to the server
    // fullURL = `http://${request.headers.host}${request.url}`
    // console.log( fullURL );
})

const handleGet = function( request, response ) {
    const filename = dir + request.url.slice( 1 )

    if( request.url === "/" ) {
        sendFile( response, "public/index.html" )
    }else{
        sendFile( response, filename )
    }
}

const handlePost = function( request, response ) {
    let dataString = ""
    let dataInt = -1;
    //if(request.URL === "/submit") {

        request.on("data", function (data) {

                dataString += data

        })


        request.on("end", function () {
            if(isNaN(dataString)) {
                const data = JSON.parse(dataString);

                if (data.name !== "") {

                    const gamesPlayed = data.gamePlayed;
                    var numGamesPlayed = 0;
                    for (let i = 0; i < gamesPlayed.length; i++) {
                        if (gamesPlayed[i]) numGamesPlayed++;
                    }

                    data.numGamesPlayed = numGamesPlayed;

                    console.log(data);

                    appdata.push(data);
                }

                response.writeHead(200, "OK", {"Content-Type": "text/plain"})
                response.end(JSON.stringify(appdata));
            }
            else{
                console.log(dataString);
                appdata.splice(+dataString, 1);
                response.end(JSON.stringify(appdata));
            }
        })

    /*
        response.writeHead(200, "OK", {"Content-Type": "text/plain"});
        console.log(appdata);
        response.end(JSON.stringify(appdata));
    */
}

const sendFile = function( response, filename ) {
    const type = mime.getType( filename )

    fs.readFile( filename, function( err, content ) {

        // if the error = null, then we've loaded the file successfully
        if( err === null ) {

            // status code: https://httpstatuses.com
            response.writeHeader( 200, { "Content-Type": type })
            response.end( content )

        } else {

            // file not found, error code 404
            response.writeHeader( 404 )
            response.end( "404 Error: File Not Found" )

        }
    })
}

// process.env.PORT references the port that Glitch uses
// the following line will either use the Glitch port or one that we provided
server.listen( process.env.PORT || port )

