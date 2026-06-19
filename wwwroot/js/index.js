// EMPLOYEE DASHBOARD — SignalR Client Logic

// Track how many users are currently connected (estimated client-side count)
let connectedCount = 0;                                

// STEP A: BUILD THE HUB CONNECTION

const connection = new signalR.HubConnectionBuilder()  
    .withUrl("/notificationHub")                         
    .withAutomaticReconnect()                                  
    .configureLogging(signalR.LogLevel.Information)         
    .build();                                               

// STEP B: REGISTER ALL HANDLERS BEFORE start() 
// CRITICAL: Always register handlers before calling connection.start().
// Any message that arrives during the window between start() resolving
// and a handler being registered will be silently lost.
// Register first. Start second. No exceptions.

// Handler: Server confirms our connection and tells us our connection ID
connection.on("WelcomeMessage", function(connectionId, serverTime) { 
    document.getElementById("my-id").textContent = connectionId;      
    connectedCount++;                                        
    refreshCount();                                             
    const localTime = new Date(serverTime).toLocaleTimeString();   
    addSysMsg(`✓ Connected to Meridian Live Feed at ${localTime}`);  
});

// Handler: Another user connected — increment our displayed count
connection.on("UserConnected", function(connectionId) {     
    connectedCount++;
    refreshCount();
});

// Handler: A user disconnected — decrement count (never below 0)
connection.on("UserDisconnected", function(connectionId) {      
    connectedCount = Math.max(0, connectedCount - 1);              
    refreshCount();
});

// Handler: An admin broadcast a notification — this is the main event!
connection.on("ReceiveNotification", function(notification) {   
    removeEmptyState();                                     
    const card = buildCard(notification);                        
    const feed = document.getElementById("feed");
    feed.insertBefore(card, feed.firstChild);                

    if (notification.priority.toLowerCase() === "critical") {  
        flashTitle("🚨 URGENT: " + notification.title);
    }
});

// Reconnection lifecycle — update UI to show reconnecting state
connection.onreconnecting(function(error) {          
    setStatus("Reconnecting...", false);
});

// Reconnection succeeded — restore UI and log the event
connection.onreconnected(function(newConnectionId) {        
    setStatus("Connected", true);
    addSysMsg("Reconnected after network interruption.");
    // IMPORTANT: newConnectionId is different from the original!
    // Update the display if we're showing it:
    document.getElementById("my-id").textContent = newConnectionId + " (reconnected)";
});

// Connection permanently closed (after exhausting reconnect retries)
connection.onclose(function(error) {                        
    setStatus("Disconnected", false);
    addSysMsg("Connection closed. Refresh the page to reconnect.");
});

//STEP C: START THE CONNECTION

async function startConnection() {                             
    try {
        await connection.start();            
        setStatus("Connected", true);
    } catch (err) {
        console.error("SignalR connection error:", err);              
        setStatus("Connection Failed — Retrying in 5s", false);
        setTimeout(startConnection, 5000);                      
    }
}

startConnection();                                    

//STEP D: HELPER FUNCTIONS 

function setStatus(text, isLive) {                              
    document.getElementById("conn-text").textContent = text;
    document.getElementById("dot").classList.toggle("live", isLive);
}

function refreshCount() {                                     
    document.getElementById("count").textContent = connectedCount;
}

function removeEmptyState() {                     
    const el = document.getElementById("empty");
    if (el) el.remove();
}

function addSysMsg(text) {                                   
    const feed = document.getElementById("feed");
    const el = document.createElement("div");
    el.className = "sys-msg";
    el.textContent = text;
    feed.insertBefore(el, feed.firstChild);
    const emptyState = document.getElementById("empty");
    if (emptyState) emptyState.remove();
}

function buildCard(notification) {                  
    const p = (notification.priority || "info").toLowerCase();
    const t = new Date(notification.timestamp).toLocaleTimeString();
    const card = document.createElement("div");
    card.className = `notif-card p-${p}`;
    card.innerHTML = `
      <div class="card-top">
        <div class="card-title">${esc(notification.title)}</div>
        <span class="badge badge-${p}">${p}</span>
      </div>
      <div class="card-body">${esc(notification.message)}</div>
      <div class="card-foot">
        <span>Received: ${t}</span>
        <span>ID: ${notification.id.substring(0,8)}...</span>
      </div>`;
    return card;
}

function esc(text) {                         
    const d = document.createElement("div");
    d.appendChild(document.createTextNode(text));
    return d.innerHTML;
}

let _flashTimer;
function flashTitle(alertText) {                
    const orig = document.title;
    let toggle = false;
    clearInterval(_flashTimer);
    _flashTimer = setInterval(() => {
        document.title = toggle ? orig : alertText;
        toggle = !toggle;
    }, 750);
    setTimeout(() => { clearInterval(_flashTimer); document.title = orig; }, 12000);
}
