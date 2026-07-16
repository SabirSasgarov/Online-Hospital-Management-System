namespace HMS.Application.Notifications.Commands
{
    public record DeleteNotificationCommand(Guid NotificationId, Guid CurrentUserId) : IRequest;

    public class DeleteNotificationCommandHandler(IAppDbContext db)
        : IRequestHandler<DeleteNotificationCommand>
    {
        public async Task Handle(DeleteNotificationCommand request, CancellationToken cancellationToken)
        {
            var notification = await db.Notifications
                .FirstOrDefaultAsync(n => n.Id == request.NotificationId, cancellationToken)
                ?? throw new NotFoundException(nameof(Notification), request.NotificationId);

            if (notification.UserId != request.CurrentUserId)
                throw new ForbiddenException("You can only delete your own notifications.");

            // Notification extends BaseEntity (no soft delete) — hard delete
            db.Notifications.Remove(notification);
            await db.SaveChangesAsync(cancellationToken);
        }
    }
}
