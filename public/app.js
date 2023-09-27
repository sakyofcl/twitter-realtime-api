// WebSocket setup
const socket = new WebSocket('ws://localhost:3000');
let terms = [];
const streamData = [];
const termKeys = ['ETH-USD','BTC-USD'];
renderTwitterData();

// Handle WebSocket messages
socket.addEventListener('message', (event) => {
    const data = JSON.parse(event.data.toString('ascii'));
    if('message' in data){
        const isConnected = data.message == 'on';
        const connectionStatusEle = document.getElementById('connection-status');
        const sendBtnEle = document.getElementById('send-term');

        connectionStatusEle.textContent = isConnected ? 'Connected' : 'Disconnected';

        if(isConnected){
            connectionStatusEle.classList.remove('badge-danger');
            connectionStatusEle.classList.add('badge-success');
            sendBtnEle.disabled=false;
        }
        else{
            connectionStatusEle.classList.remove('badge-success');
            connectionStatusEle.classList.add('badge-danger');
            sendBtnEle.disabled=true;
        }
    }

    if('twitterData' in data){
        streamData.push(data.twitterData);
        renderTwitterData();
    }

    if('streamData' in data){
        displayStreamData(data.streamData);
    }
});

socket.addEventListener('open', (event) =>{
    console.log('WebSocket is connected.');
});

document.getElementById('toggle-connection').addEventListener('click', () => {
    sendToServer({action: 'toggleConnection'});
});

document.getElementById('send-term').addEventListener('click', () => {
    const sendBtnEle = document.getElementById('send-term');

    if(getSelectedTerm().length){
        sendToServer({action: 'terms', payload: getSelectedTerm()});
        sendBtnEle.classList.remove('btn-danger');
        sendBtnEle.classList.add('btn-primary');
    }
    else{
        sendBtnEle.classList.remove('btn-primary');
        sendBtnEle.classList.add('btn-danger');
    }
    
});


function sendToServer(data){
    socket.send(JSON.stringify(data));
}

function renderTerms(){
    const term = terms.join(", "); 
    document.getElementById('list-all-terms').textContent = term;
}

function renderTwitterData(){
    let view = "";
    streamData.map((v)=>{
        view += twitterCard(v);    
    });
    document.getElementById('list-all-tweets').innerHTML = ""; 
    document.getElementById('list-all-tweets').innerHTML = view;
}

function displayStreamData(data){
    setValueToEle(`${data.s}-p`, data.p);
    setValueToEle(`${data.s}-q`, data.q);
    setValueToEle(`${data.s}-dc`, data.dc);
    setValueToEle(`${data.s}-dd`, data.dd);
    setValueToEle(`${data.s}-t`, new Date(data.t).toLocaleString());
}

function twitterCard(data){

    return `
    <div class="col-md-4 p-2">
        <div class="tweet wrapper">
            <header>
                <div class="title">
                    <img alt="avatar" class="avatar avatar--small" src="https://assets.stickpng.com/images/580b57fcd9996e24bc43c53e.png"/>
                    <div class="avatar-text">
                    <h3 class='mb-0'>${data}</h3>
                    <span>@isocpp</span>
                    </div>
                </div>
        
            </header>

            <section class="body">
                <div class="tweet-message">
                    <p>Use the official range-v3 with MSVC 2017 version 15.9 
                </div>
                
                <footer class="footer-time">
                    <p>12:24 PM - 12 Nov 2018</p>
                </footer>
        
            </section>
        </div>
    </div>
    `;
}

function getSelectedTerm(){
    return termKeys.filter((v)=> document.getElementById(v).checked);
}

function setValueToEle(key, value){
    const ele = document.getElementById(key);
    ele.innerText = "";
    ele.innerText = value;
}
