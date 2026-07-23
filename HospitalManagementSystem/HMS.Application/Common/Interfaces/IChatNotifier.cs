using HMS.Application.Messages.DTOs;

namespace HMS.Application.Common.Interfaces
{
    /// <summary>
    /// Pushes real-time chat events over SignalR (implemented in HMS.API, which owns the Hub type).
    /// Keeps the Application layer free of any ASP.NET Core/SignalR dependency.
    /// </summary>
    public interface IChatNotifier
    {
        /// <summary>Notifies the receiver's connected clients that a new message has arrived.</summary>
        Task NotifyNewMessageAsync(MessageDto message, CancellationToken cancellationToken = default);

        /// <summary>Notifies the sender's connected clients that the receiver has read their message.</summary>
        Task NotifyMessageReadAsync(Guid messageId, Guid senderId, Guid receiverId, CancellationToken cancellationToken = default);
    }
}
