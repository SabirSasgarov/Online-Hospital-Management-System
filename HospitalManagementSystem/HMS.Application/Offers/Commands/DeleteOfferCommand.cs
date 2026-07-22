namespace HMS.Application.Offers.Commands
{
    public record DeleteOfferCommand(Guid OfferId) : IRequest;

    public class DeleteOfferCommandHandler(IAppDbContext db)
        : IRequestHandler<DeleteOfferCommand>
    {
        public async Task Handle(DeleteOfferCommand request, CancellationToken cancellationToken)
        {
            var offer = await db.Offers
                .FirstOrDefaultAsync(o => o.Id == request.OfferId, cancellationToken)
                ?? throw new NotFoundException(nameof(Offer), request.OfferId);

            offer.IsDeleted = true;
            await db.SaveChangesAsync(cancellationToken);
        }
    }
}
