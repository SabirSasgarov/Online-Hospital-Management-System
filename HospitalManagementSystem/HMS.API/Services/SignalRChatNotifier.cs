using HMS.API.Hubs;
using HMS.Application.Messages.DTOs;
using Microsoft.AspNetCore.SignalR;

namespace HMS.API.Services
{
    public class SignalRChatNotifier(IHubContext<ChatHub> hub) : IChatNotifier
    {
        public Task NotifyNewMessageAsync(MessageDto message, CancellationToken cancellationToken = default) =>
            hub.Clients.User(message.ReceiverId.ToString()).SendAsync("ReceiveMessage", message, cancellationToken);

        public Task NotifyMessageReadAsync(Guid messageId, Guid senderId, Guid receiverId, CancellationToken cancellationToken = default) =>
            hub.Clients.User(senderId.ToString()).SendAsync("MessageRead", new { messageId, readByUserId = receiverId }, cancellationToken);
    }
}
