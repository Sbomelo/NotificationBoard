// ADMIN PANEL — SignalR Client Logic
const connection = new signalR.HubConnectionBuilder()       
    .withUrl("/notificationHub")
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Information)
    .build();

// When connected, reveal our session info and enable the Send button.
connection.on("WelcomeMessage", function(connectionId) {   
    setStat(`Connected — Admin Session: ${connectionId.substring(0,16)}...`, true);
    document.getElementById("send").disabled = false;             
});

// Handle reconnecting — disable Send button while reconnecting
connection.onreconnecting(() => {
    setStat("Reconnecting...", false);
    document.getElementById("send").disabled = true;
});

// Reconnected — re-enable Send button
connection.onreconnected(() => {
    setStat("Reconnected", true);
    document.getElementById("send").disabled = false;
});

// THE SEND BUTTON 
//Invoke the SendNotification method 
document.getElementById("send").addEventListener("click", async function() { 

    const title    = document.getElementById("ntitle").value.trim();     
    const message  = document.getElementById("nmsg").value.trim();  
    const priority = document.querySelector('input[name="pri"]:checked').value;

    if (!title || !message) {                                
        addLog("❌ Title and Message cannot be empty.", false);
        return;
    }

    const btn = document.getElementById("send");
    btn.disabled = true;                                 
    btn.textContent = "Sending...";

    try {
        //calling the Hub method from JavaScript
        await connection.invoke("SendNotification", title, message, priority);  

        addLog(`✓ [${priority}] "${title}" sent at ${new Date().toLocaleTimeString()}`, true); 

        // Clears the form after successful send
        document.getElementById("ntitle").value = "";
        document.getElementById("nmsg").value = "";

    } catch (err) {                                        
        addLog(`❌ Send failed: ${err.message}`, false);
        console.error("invoke error:", err);

    } finally {                                               
        btn.disabled = false;
        btn.textContent = "Send to All Employees";
    }
});

function setStat(text, live) {
    document.getElementById("astatus").textContent = text;
    document.getElementById("adot").classList.toggle("live", live);
}

function addLog(text, ok) {
    const list = document.getElementById("log-list");
    const ph = list.querySelector(".log-ph");
    if (ph) ph.remove();
    const el = document.createElement("div");
    el.className = "log-entry " + (ok ? "log-ok" : "log-err");
    el.textContent = text;
    list.insertBefore(el, list.firstChild);
}

// Start connection with manual retry for initial failures
async function start() {
    try {
        await connection.start();
    } catch (e) {
        setStat("Connection failed — retrying in 5s...", false);
        setTimeout(start, 5000);
    }
}
start();