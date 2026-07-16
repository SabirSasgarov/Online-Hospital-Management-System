using HMS.Application.Messages.DTOs;

namespace HMS.Application.Messages.Commands
{
    public record SendMessageCommand(Guid SenderId, SendMessageDto Dto) : IRequest<Guid>;

    public class SendMessageCommandHandler(IAppDbContext db)
        : IRequestHandler<SendMessageCommand, Guid>
    {
        public async Task<Guid> Handle(SendMessageCommand request, CancellationToken cancellationToken)
        {
            var receiverExists = await db.Users.AnyAsync(
                u => u.Id == request.Dto.ReceiverId, cancellationToken);
            if (!receiverExists)
                throw new NotFoundException(nameof(AppUser), request.Dto.ReceiverId);

            var message = new Message
            {
                SenderId    = request.SenderId,
                ReceiverId  = request.Dto.ReceiverId,
                Content     = request.Dto.Content,
                SentAt      = DateTime.UtcNow
            };

            db.Messages.Add(message);
            await db.SaveChangesAsync(cancellationToken);
            return message.Id;
        }
    }
}
