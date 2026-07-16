using HMS.Application.DischargeSummaries.DTOs;

namespace HMS.Application.DischargeSummaries.Queries
{
    public record GetDischargeSummariesQuery(
        Guid? PatientId,
        Guid? DoctorId,
        int Page = 1,
        int PageSize = 20
    ) : IRequest<PaginatedResult<DischargeSummaryDto>>;

    public class GetDischargeSummariesQueryHandler(IAppDbContext db, IMapper mapper)
        : IRequestHandler<GetDischargeSummariesQuery, PaginatedResult<DischargeSummaryDto>>
    {
        public async Task<PaginatedResult<DischargeSummaryDto>> Handle(
            GetDischargeSummariesQuery request, CancellationToken cancellationToken)
        {
            var query = db.DischargeSummaries
                .Include(d => d.Patient).ThenInclude(p => p.User)
                .Include(d => d.Doctor).ThenInclude(d => d.User)
                .Include(d => d.Visit)
                .AsNoTracking().AsQueryable();

            if (request.PatientId.HasValue) query = query.Where(d => d.PatientId == request.PatientId.Value);
            if (request.DoctorId.HasValue)  query = query.Where(d => d.DoctorId  == request.DoctorId.Value);

            var total = await query.CountAsync(cancellationToken);
            var items = await query.OrderByDescending(d => d.Visit.DischargeDate)
                .Skip((request.Page - 1) * request.PageSize).Take(request.PageSize)
                .ToListAsync(cancellationToken);

            return new PaginatedResult<DischargeSummaryDto>
            {
                Items = mapper.Map<List<DischargeSummaryDto>>(items),
                TotalCount = total, Page = request.Page, PageSize = request.PageSize
            };
        }
    }
}
