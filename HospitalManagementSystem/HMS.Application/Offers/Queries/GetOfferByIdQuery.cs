using HMS.Application.Offers.OffersDTOs;

namespace HMS.Application.Offers.Queries
{
    public record GetOfferByIdQuery(Guid OfferId) : IRequest<OfferDto>;

    public class GetOfferByIdQueryHandler(IAppDbContext db, IMapper mapper)
        : IRequestHandler<GetOfferByIdQuery, OfferDto>
    {
        public async Task<OfferDto> Handle(GetOfferByIdQuery request, CancellationToken cancellationToken)
        {
            var offer = await db.Offers
                .AsNoTracking()
                .FirstOrDefaultAsync(o => o.Id == request.OfferId, cancellationToken)
                ?? throw new NotFoundException(nameof(Offer), request.OfferId);

            return mapper.Map<OfferDto>(offer);
        }
    }
}
