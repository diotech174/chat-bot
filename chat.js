var response = ""; // RESERVA A ULTIMA RESPOSTA ENVIADO PELO ROBÔ
var nova_pergunta = false;
var robot = "Zia"; // NOME DO ROBÔ

//=====================================================================================

function getRndInteger(min, max) { // SELECIONA UM VALOR ALEATÓRIAMENTE
    return Math.floor(Math.random() * (max - min) ) + min;
}

//=====================================================================================

function getResponse(filename, search) { // PROCESSA A RESPOSTA 

    fetch(filename).then((resp) => resp.text()).then(function(data) {

        core = JSON.parse(data); 

        var results = 0;

        for(i=0; i < core.length; i++)
        {
            var aux = core[i].router;

            if(aux.pergunta.indexOf(search.toLowerCase()) != -1)
            {

                results++;

                var max = aux.respostas.length -1;
                response = robot + ": " + aux.respostas[getRndInteger(0, max)];               
            }
        }

        if(results == 0) // QUANDO NÃO ENCONTRAR UMA RESPOSTA
        {
            response = "não entendi! pode ser mais claro?";
        }
    });
}

//=====================================================================================

function send() // ENVIA PERGUNTA AO ROBÔ
{
    nova_pergunta = true;

    var pergunta = document.getElementById("msg").value;

    var x = document.createElement('label');
    x.setAttribute('style', 'color: blue');
    x.innerHTML =  "Você: " + pergunta;

    document.getElementById('chat').appendChild(x);
    var br = document.createElement('br');
    document.getElementById('chat').appendChild(br);

    var objDiv = document.getElementById("chat");
    objDiv.scrollTop = objDiv.scrollHeight;

    getResponse("core.json", pergunta);

    document.getElementById("msg").value = "";

    setTimeout(function(){ // 40 A 60 SEGUNDOS DE SILÊNCIO

        if(nova_pergunta == false)
        {
            response = robot + " olá você está ai???";
        }

    }, getRndInteger(40000, 60000));
}

//=====================================================================================

setInterval(function(){ // SIMULAÇÃO

    if(response.length > 0)
    {
        var chat = response;
        response = "";
        setTimeout(function(){ // INICIA SIMULAÇÃO DE "ESCRENDO RESPOSTA"
            document.getElementById('status').setAttribute('class', 'writing');

            setTimeout(function(){ // MOSTRA RESPOSTA

                var x = document.createElement('label');
                x.setAttribute('style', 'color: green');
                x.innerHTML = chat;

                document.getElementById('chat').appendChild(x);
                var br = document.createElement('br');
                document.getElementById('chat').appendChild(br);

                var objDiv = document.getElementById("chat");
                objDiv.scrollTop = objDiv.scrollHeight;

                document.getElementById('status').setAttribute('class', 'stoped');

                new Audio('sounds/notify.mp3').play();
                nova_pergunta = false;

            }, getRndInteger(2000, 8000));

        }, getRndInteger(2000, 5000));
    }
}, 1000);

//=====================================================================================