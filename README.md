REAL-TIME NOTIFICATION BOARD

THE PROBLEM

Currently for this small company that tasked me with to develop a realtime notification board,
when something critical happens — a building evacuation drill, a company-wide system outage, an unplanned office closure — they send an email. 
But employees are heads-down in code, in meetings, or just not looking at email. 
Messages take 20–40 minutes to reach everyone. Last month, half the staff missed an evacuation drill because they never saw the email in time.

THE SOLUTION

A live notification board: a page that every employee keeps open on their second monitor all day. 
When IT or HR sends a notification through an admin panel, it must appear on every employee's screen within milliseconds. 
No refresh. No polling. Instant.

But this is just a simple SignalR project i developed for learning and understanding how the SignalR library works.
A simple starter project nothing complicated

Employess are notified with their connetion id, and a green dot at the top to show they are connected, and red do when disconnected.
They can also see the count number of connected users, and be notified when someone disconnects.
The count decreases when someone disconnects.

HOW TO TEST?
Clone and run the project

Prerequisites

NET 8 SDK. 
A code editor — Visual Studio 2022. 
Visual Studio Code with the C# Dev Kit extension, or JetBrains Rider. All work perfectly.
A terminal — PowerShell, Terminal on macOS, or any bash-compatible shell..
A modern browser — Chrome, Firefox, or Edge. You'll open two windows simultaneously (admin + employee) to test real-time behavior.

Open your browser and navigate to http://localhost:5000 — this loads the employee dashboard (index.html). 
You should see "Connecting..." change to "Connected" within a second, and the system message "✓ Connected to Meridian Live Feed at [time]" should appear.
Open a second browser window (or a second tab) and navigate to http://localhost:5000/admin.html — this loads the admin panel. 
You should see it connect and the "Send to All Employees" button should become active (purple, not greyed out).
Go back to the employee dashboard tab. You should see the user count increment from 1 to 2 as the admin connected.
In the admin panel, type a title like "Test Notification", a message like "This is a real-time test", select "Info" priority, and click Send.
Watch the employee dashboard tab. 
The notification should appear at the top of the feed instantly — no refresh, no delay beyond network latency.
Try sending a "Critical" priority notification. 
Notice the admin dashboard also receives the notification (because Clients.All includes the sender). 
If the employee tab is not active, watch for the tab title to flash.
Open a third browser window also at http://localhost:5000. 
The count should go up to 3. Close it — the count should drop back to 2

![image alt](https://github.com/Sbomelo/NotificationBoard/blob/master/Screenshot%20(41).png?raw=true)
