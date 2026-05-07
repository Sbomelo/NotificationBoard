using Microsoft.AspNetCore.SignalR;          

namespace NotificationBoard.Hubs;            

public class NotificationHub : Hub          
{

    // HUB METHOD — Called by connected clients (the admin panel). 
    // When an admin clicks "Send", JavaScript invokes this method.
    public async Task SendNotification(string title, string message, string priority)                       
    {
        // Build a structured notification object to send to all clients
        var notification = new                   
        {
            Id    = Guid.NewGuid().ToString(),  
            Title = title,                
            Message = message,                
            Priority = priority,                
            Timestamp = DateTime.UtcNow.ToString("o"), 
            SenderConnectionId = Context.ConnectionId 
        };

        // Broadcast to ALL connected clients simultaneously
        await Clients.All.SendAsync("ReceiveNotification", notification); 

    }

    // LIFECYCLE METHOD — SignalR calls this automatically every time a new client establishes a connection. Override to add logic.

    public override async Task OnConnectedAsync()  
    {
        string connectionId = Context.ConnectionId; 

        // Tell just the newly connected client their own connection ID
        await Clients.Caller.SendAsync( "WelcomeMessage",connectionId, DateTime.UtcNow.ToString("o"));   


        // Notify everyone else that a new user has connected
        await Clients.Others.SendAsync( "UserConnected", connectionId);                  

        // ALWAYS call the base implementation — it performs internal housekeeping
        await base.OnConnectedAsync();    

    }

    // LIFECYCLE METHOD — Fires when a client disconnects, either gracefully or because of a network error/timeout.
    public override async Task OnDisconnectedAsync(Exception? exception) 
    {
        string connectionId = Context.ConnectionId; 

        // Notify remaining clients that this connection has ended
        await Clients.Others.SendAsync("UserDisconnected", connectionId);  

        // ALWAYS call the base — pass the exception through faithfully
        await base.OnDisconnectedAsync(exception); 
    }
}