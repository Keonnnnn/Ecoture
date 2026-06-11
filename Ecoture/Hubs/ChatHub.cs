using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Ecoture.Model.Entity;

namespace Ecoture.Hubs
{
    public class ChatHub : Hub
    {
        private static Dictionary<string, string> userConnections = new Dictionary<string, string>();

        private readonly IServiceScopeFactory _scopeFactory;

        public ChatHub(IServiceScopeFactory scopeFactory)
        {
            _scopeFactory = scopeFactory;
        }

        public override async Task OnConnectedAsync()
        {
            string userId = Context.ConnectionId;
            if (Context.GetHttpContext().Request.Query.ContainsKey("username"))
            {
                userId = Context.GetHttpContext().Request.Query["username"];
            }

            userConnections[userId] = Context.ConnectionId;

            // Send updated connection list to all clients
            await Clients.All.SendAsync("Connections", userConnections.Keys);

            if (userId == "Admin")
            {
                // Push any messages that arrived while admin was offline
                using var scope = _scopeFactory.CreateScope();
                var db = scope.ServiceProvider.GetRequiredService<MyDbContext>();

                var pending = await db.LivechatMessages
                    .Where(m => !m.IsDelivered)
                    .OrderBy(m => m.Timestamp)
                    .ToListAsync();

                if (pending.Any())
                {
                    var grouped = pending
                        .GroupBy(m => m.Sender)
                        .ToDictionary(
                            g => g.Key,
                            g => g.Select(m => new { sender = m.Sender, message = m.Message, timestamp = m.Timestamp }).ToList()
                        );

                    await Clients.Caller.SendAsync("PendingMessages", grouped);

                    foreach (var msg in pending)
                        msg.IsDelivered = true;

                    await db.SaveChangesAsync();
                }
            }
            else
            {
                // Welcome message for customers/guests
                var welcomeMsg = "Hi, welcome to Ecoture live chat. How may I help you today?";
                await Clients.Client(Context.ConnectionId).SendAsync("ReceiveMessage", "Admin", welcomeMsg);

                // Mirror welcome to admin so it appears in their chat window
                if (userConnections.TryGetValue("Admin", out string adminConnId))
                {
                    await Clients.Client(adminConnId).SendAsync("AdminMessageSent", userId, welcomeMsg);
                }
            }

            await base.OnConnectedAsync();
        }

        public async Task SendMessage(string user, string message)
        {
            using var scope = _scopeFactory.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<MyDbContext>();

            var chatMsg = new LivechatMessages
            {
                Sender = user,
                Message = message,
                Timestamp = DateTime.UtcNow,
                IsDelivered = userConnections.ContainsKey("Admin")
            };
            db.LivechatMessages.Add(chatMsg);
            await db.SaveChangesAsync();

            await Clients.Others.SendAsync("ReceiveMessage", user, message);
        }

        public async Task SendMessageToUser(string targetUser, string sender, string message)
        {
            if (userConnections.TryGetValue(targetUser, out string connectionId))
            {
                await Clients.Client(connectionId).SendAsync("ReceiveMessage", sender, message);
            }
            else
            {
                await Clients.Caller.SendAsync("ReceiveMessage", "System", $"User {targetUser} is not online.");
            }
        }

        public override async Task OnDisconnectedAsync(System.Exception exception)
        {
            var user = userConnections.FirstOrDefault(x => x.Value == Context.ConnectionId).Key;
            if (user != null)
            {
                userConnections.Remove(user);
                await Clients.Others.SendAsync("ReceiveMessage", "System", $"{user} disconnected");
                await Clients.Others.SendAsync("Connections", userConnections.Keys);
            }

            await base.OnDisconnectedAsync(exception);
        }
    }
}
