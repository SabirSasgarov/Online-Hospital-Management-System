using HMS.Application.Offers.OffersDTOs;

namespace HMS.Application.Offers.Commands
{
    public record UpdateOfferCommand(Guid OfferId, UpdateOfferDto Dto) : IRequest;

    public class UpdateOfferCommandHandler(IAppDbContext db, IMapper mapper)
        : IRequestHandler<UpdateOfferCommand>
    {
        public async Task Handle(UpdateOfferCommand request, CancellationToken cancellationToken)
        {
            var offer = await db.Offers
                .FirstOrDefaultAsync(o => o.Id == request.OfferId, cancellationToken)
                ?? throw new NotFoundException(nameof(Offer), request.OfferId);

            mapper.Map(request.Dto, offer);
            await db.SaveChangesAsync(cancellationToken);
        }
    }
}
