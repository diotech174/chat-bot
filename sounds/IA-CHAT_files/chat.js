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
            response = robot + ": não entendi! pode ser mais claro?";
        }
    });
}

//=====================================================================================

function send() // ENVIA PERGUNTA AO ROBÔ
{
    nova_pergunta = true;

    document.getElementById("start").innerHTML = "Conversa iniciada...";

    var pergunta = document.getElementById("message").value;

    var balloon = document.createElement('div');
    balloon.setAttribute('style', 'min-width: 20px; background-color: #CFE3F7; border: 1px solid #E1F2F6; padding: 8px; border-radius: 5px 5px');

    var x = document.createElement('label');
    x.setAttribute('style', 'color: #5882FA');
    x.innerHTML =  "Você: " + pergunta;

    balloon.appendChild(x);

    document.getElementById('chat').appendChild(balloon);
    var br = document.createElement('br');
    document.getElementById('chat').appendChild(br);

    var objDiv = document.getElementById("chat");
    objDiv.scrollTop = objDiv.scrollHeight;

    getResponse("core.json", pergunta);

    document.getElementById("message").value = "";
    document.getElementById("message").focus();

    setTimeout(function(){ // 40 A 60 SEGUNDOS DE SILÊNCIO

        if(nova_pergunta == false)
        {
            response = robot + ": olá você está ai???";
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
            document.getElementById('status').innerHTML = robot+" está escrevendo...";

            setTimeout(function(){ // MOSTRA RESPOSTA

                var balloon = document.createElement('div');
                balloon.setAttribute('style', 'min-width: 20px; margin-left: 30px; background-color: #CEF7E2; border: 1px solid #58FAAC; padding: 8px; border-radius: 5px 5px');

    
                var x = document.createElement('label');
                x.setAttribute('style', 'color: green');
                x.innerHTML = chat;

                var img = document.createElement('img');
                img.src = "img/zia.png";
                img.setAttribute("style", "width: 30px; margin-right: 8px");

                balloon.appendChild(img);
                balloon.appendChild(x);

                document.getElementById('chat').appendChild(balloon);
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