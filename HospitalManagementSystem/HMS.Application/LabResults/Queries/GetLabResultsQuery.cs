using HMS.Application.LabResults.DTOs;

namespace HMS.Application.LabResults.Queries
{
    public record GetLabResultsQuery(
        Guid? VisitId,
        Guid? PatientId,
        LabResultStatus? Status,
        int Page = 1,
        int PageSize = 20
    ) : IRequest<PaginatedResult<LabResultDto>>;

    public class GetLabResultsQueryHandler(IAppDbContext db, IMapper mapper)
        : IRequestHandler<GetLabResultsQuery, PaginatedResult<LabResultDto>>
    {
        public async Task<PaginatedResult<LabResultDto>> Handle(
            GetLabResultsQuery request, CancellationToken cancellationToken)
        {
            var query = db.LabResults
                .Include(l => l.Patient).ThenInclude(p => p.User)
                .Include(l => l.OrderedBy)
                .AsNoTracking().AsQueryable();

            if (request.VisitId.HasValue)   query = query.Where(l => l.VisitId   == request.VisitId.Value);
            if (request.PatientId.HasValue) query = query.Where(l => l.PatientId == request.PatientId.Value);
            if (request.Status.HasValue)    query = query.Where(l => l.Status    == request.Status.Value);

            var total = await query.CountAsync(cancellationToken);
            var items = await query.OrderByDescending(l => l.TestedAt)
                .Skip((request.Page - 1) * request.PageSize).Take(request.PageSize)
                .ToListAsync(cancellationToken);

            return new PaginatedResult<LabResultDto>
            {
                Items = mapper.Map<List<LabResultDto>>(items),
                TotalCount = total, Page = request.Page, PageSize = request.PageSize
            };
        }
    }
}
