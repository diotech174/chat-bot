var response = ""; // RESERVA A ULTIMA RESPOSTA ENVIADO PELO ROBÔ
var nova_pergunta = false;

//=====================================================================================

function getRndInteger(min, max) { // SELECIONA UM VALOR ALEATÓRIAMENTE
    return Math.floor(Math.random() * (max - min) ) + min;
}

//=====================================================================================

function getResponse(filename, pergunta) { // PROCESSA A RESPOSTA 

    fetch(filename).then((resp) => resp.text()).then(function(data) {

        core = JSON.parse(data); 

        var chat = document.getElementById('chat').value;

        var results = 0;

        for(i=0; i < core.length; i++)
        {
            var aux = core[i].router;

            if(aux.pergunta.indexOf(pergunta.toLowerCase()) > -1)
            {

                results++;

                var max = aux.respostas.length -1;
                response = chat + "\n" + aux.respostas[getRndInteger(0, max)];               
            }
        }

        if(results == 0) // QUANDO NÃO ENCONTRAR UMA RESPOSTA
        {
            response = chat + "\nnão entendi! pode ser mais claro?";
        }
    });
}

//=====================================================================================

function send() // ENVIA PERGUNTA AO ROBÔ
{
    nova_pergunta = true;

    var pergunta = document.getElementById("msg").value;
    var chat = document.getElementById('chat').value;

    document.getElementById('chat').innerHTML = chat + "\n" + pergunta;
    getResponse("core.json", pergunta);

    document.getElementById("msg").value = "";

    setTimeout(function(){ // 15 SEGUNDOS DE SILÊNCIO

        if(nova_pergunta == false)
        {
            var chat = document.getElementById('chat').value;
            response = chat + "\nolá você está ai???";
        }

    }, 15000);
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

                document.getElementById('chat').innerHTML = chat;
                document.getElementById('status').setAttribute('class', 'stoped');
                nova_pergunta = false;

            }, getRndInteger(1000, 2000));

        }, getRndInteger(1000, 5000));
    }
}, 1000);

//=====================================================================================