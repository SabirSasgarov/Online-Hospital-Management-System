using HMS.Application.Offers.OffersDTOs;

namespace HMS.Application.Offers.Queries
{
    /// <summary>Unauthenticated home-page feed — active offers only, in display order.</summary>
    public record GetPublicOffersQuery : IRequest<List<OfferDto>>;

    public class GetPublicOffersQueryHandler(IAppDbContext db, IMapper mapper)
        : IRequestHandler<GetPublicOffersQuery, List<OfferDto>>
    {
        public async Task<List<OfferDto>> Handle(GetPublicOffersQuery request, CancellationToken cancellationToken)
        {
            var items = await db.Offers
                .AsNoTracking()
                .Where(o => o.IsActive)
                .OrderBy(o => o.DisplayOrder)
                .ToListAsync(cancellationToken);

            return mapper.Map<List<OfferDto>>(items);
        }
    }
}
