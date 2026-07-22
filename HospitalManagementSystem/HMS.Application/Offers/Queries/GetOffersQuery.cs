using HMS.Application.Offers.OffersDTOs;

namespace HMS.Application.Offers.Queries
{
    /// <summary>Admin CMS list — includes inactive offers unless <see cref="Active"/> filters to one state.</summary>
    public record GetOffersQuery(
        bool? Active,
        int Page = 1,
        int PageSize = 50
    ) : IRequest<PaginatedResult<OfferDto>>;

    public class GetOffersQueryHandler(IAppDbContext db, IMapper mapper)
        : IRequestHandler<GetOffersQuery, PaginatedResult<OfferDto>>
    {
        public async Task<PaginatedResult<OfferDto>> Handle(
            GetOffersQuery request, CancellationToken cancellationToken)
        {
            var query = db.Offers.AsNoTracking().AsQueryable();

            if (request.Active.HasValue)
                query = query.Where(o => o.IsActive == request.Active.Value);

            var total = await query.CountAsync(cancellationToken);
            var items = await query
                .OrderBy(o => o.DisplayOrder).ThenByDescending(o => o.CreatedAt)
                .Skip((request.Page - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToListAsync(cancellationToken);

            return new PaginatedResult<OfferDto>
            {
                Items      = mapper.Map<List<OfferDto>>(items),
                TotalCount = total,
                Page       = request.Page,
                PageSize   = request.PageSize
            };
        }
    }
}
