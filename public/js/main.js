// FRONT-END (CLIENT) JAVASCRIPT HERE

const deleteButtons = [];

const submit = async function( event ) {
    if(event !== 0) {
        event.preventDefault()
    }

    const nameInput = document.querySelector( "#name" ),
        introInput = document.querySelector( "#intro" ),
        wingspanInput = document.querySelector( "#wingspan" ),
        catanInput = document.querySelector( "#catan" ),
        tickettorideInput = document.querySelector( "#tickettoride" ),
        clankInput = document.querySelector( "#clank" ),
        //gamePlayedInput = document.querySelector('input[name="game_played"]:checked'),
        gameTypeInput = document.querySelector('input[name="game_type"]:checked'),
        colorInput = document.querySelector( "#colors" );

    let json;

        if(event === 0){
            json = {name:""}
        }
        else {
            json = {
                name: nameInput.value,
                intro: introInput.value,
                gamePlayed: [wingspanInput.checked, catanInput.checked, tickettorideInput.checked, clankInput.checked],
                gameType: gameTypeInput.value,
                playerColor: colorInput.value
            };
        }
        const body = JSON.stringify( json );

    const response = await fetch( "/submit", {
        method:'POST',
        body
    })

    const text = await response.text()
    const appdata = JSON.parse(text);
    updateTable(appdata);
}

const deleteRow = async function( rowNum) {
    const body = JSON.stringify( rowNum );
    const response = await fetch( "/delete", {
        method:'POST',
        body
    })
    const text = await response.text()
    const appdata = JSON.parse(text);
    updateTable(appdata);
}

const updateTable = function(appdata){
    const resultsTable = document.getElementById("resultsTable");

    resultsTable.innerHTML = "<tr><th>Name</th><th>Intro</th><th>Favorite Mechanic</th><th>Color</th><th>Games Played</th></tr>";

    for (let i = 0; i < appdata.length; i++) {
        const namei = appdata[i].name;
        const introi = appdata[i].intro;
        const typei = appdata[i].gameType;
        const colori = appdata[i].playerColor;
        const numi = appdata[i].numGamesPlayed;

        resultsTable.innerHTML += `<tr><th>${namei}</th><th>${introi}</th><th>${typei}</th><th>${colori}</th><th>${numi}</th><th><button onclick="deleteRow(${i})">Delete</button></th></tr>`;
    }
}

window.onload = function() {
    const button = document.querySelector("button");
    button.onclick = submit;
    submit(0);
}
