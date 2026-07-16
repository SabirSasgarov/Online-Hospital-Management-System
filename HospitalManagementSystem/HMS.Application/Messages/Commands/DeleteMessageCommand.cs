namespace HMS.Application.Messages.Commands
{
    public record DeleteMessageCommand(Guid MessageId, Guid CurrentUserId) : IRequest;

    public class DeleteMessageCommandHandler(IAppDbContext db)
        : IRequestHandler<DeleteMessageCommand>
    {
        public async Task Handle(DeleteMessageCommand request, CancellationToken cancellationToken)
        {
            var message = await db.Messages
                .FirstOrDefaultAsync(m => m.Id == request.MessageId, cancellationToken)
                ?? throw new NotFoundException(nameof(Message), request.MessageId);

            if (message.SenderId != request.CurrentUserId && message.ReceiverId != request.CurrentUserId)
                throw new ForbiddenException("You can only delete your own messages.");

            // Message doesn't inherit AuditableEntity — use hard delete
            db.Messages.Remove(message);
            await db.SaveChangesAsync(cancellationToken);
        }
    }
}
