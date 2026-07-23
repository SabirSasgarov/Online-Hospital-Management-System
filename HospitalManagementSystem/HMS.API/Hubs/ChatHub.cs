using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace HMS.API.Hubs
{
    /// <summary>
    /// Push-only chat hub: clients just connect and listen. All message sending/reading still goes
    /// through the existing REST endpoints (POST /api/message, PATCH /api/message/{id}/read) — this
    /// hub only broadcasts "ReceiveMessage" / "MessageRead" events afterwards so both sides update
    /// instantly instead of polling. ASP.NET Core's default user-id provider groups connections by
    /// the JWT's "sub"/NameIdentifier claim, so Clients.User(userId) reaches every open tab/device
    /// for that account automatically.
    /// </summary>
    [Authorize]
    public class ChatHub : Hub
    {
    }
}
