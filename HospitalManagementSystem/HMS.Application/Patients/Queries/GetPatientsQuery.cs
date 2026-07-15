using HMS.Application.Patients.PatientsDTOs;

namespace HMS.Application.Patients.Queries
{
    public record GetPatientsQuery(
        string? Search,
        string? Condition,
        int Page = 1,
        int PageSize = 10
    ) : IRequest<PaginatedResult<PatientSummaryDto>>;

    public class GetPatientsQueryHandler(IAppDbContext db, IMapper mapper)
        : IRequestHandler<GetPatientsQuery, PaginatedResult<PatientSummaryDto>>
    {
        public async Task<PaginatedResult<PatientSummaryDto>> Handle(
            GetPatientsQuery request, CancellationToken cancellationToken)
        {
            var query = db.Patients
                .Include(p => p.User)
                .Include(p => p.CurrentBed)
                .AsNoTracking()
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(request.Search))
            {
                var s = request.Search.ToLower();
                query = query.Where(p =>
                    p.User.FirstName.ToLower().Contains(s) ||
                    p.User.LastName.ToLower().Contains(s) ||
                    p.User.Email!.ToLower().Contains(s) ||
                    p.Phone.Contains(s));
            }

            if (!string.IsNullOrWhiteSpace(request.Condition))
            {
                var c = request.Condition.ToLower();
                query = query.Where(p => p.Conditions.ToLower().Contains(c));
            }

            var total = await query.CountAsync(cancellationToken);

            var patients = await query
                .OrderBy(p => p.User.LastName)
                .ThenBy(p => p.User.FirstName)
                .Skip((request.Page - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToListAsync(cancellationToken);

            return new PaginatedResult<PatientSummaryDto>
            {
                Items      = mapper.Map<List<PatientSummaryDto>>(patients),
                TotalCount = total,
                Page       = request.Page,
                PageSize   = request.PageSize
            };
        }
    }
}
