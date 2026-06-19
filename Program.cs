using NotificationBoard.Hubs;      

var builder = WebApplication.CreateBuilder(args);  

//PHASE 1: REGISTER SERVICES
builder.Services.AddSignalR();                 
builder.Services.AddSingleton<ConnectionTracker>();

var app = builder.Build();        

//PHASE 2: CONFIGURE MIDDLEWARE PIPELINE
app.UseDefaultFiles();               
app.UseStaticFiles();       

app.MapHub<NotificationHub>("/notificationHub");    

app.Run();