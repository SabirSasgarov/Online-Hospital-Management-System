using HMS.Application.Doctors.DoctorsDTOs;

namespace HMS.Application.Doctors.Queries
{
    public record GetDoctorsQuery(
        string? Search,
        string? Specialization,
        bool? IsAvailable,
        int Page = 1,
        int PageSize = 10
    ) : IRequest<PaginatedResult<DoctorSummaryDto>>;

    public class GetDoctorsQueryHandler(IAppDbContext db, IMapper mapper)
        : IRequestHandler<GetDoctorsQuery, PaginatedResult<DoctorSummaryDto>>
    {
        public async Task<PaginatedResult<DoctorSummaryDto>> Handle(
            GetDoctorsQuery request, CancellationToken cancellationToken)
        {
            var query = db.Doctors
                .Include(d => d.User)
                .Include(d => d.Schedules)
                .AsNoTracking()
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(request.Search))
            {
                var s = request.Search.ToLower();
                query = query.Where(d =>
                    d.User.FirstName.ToLower().Contains(s) ||
                    d.User.LastName.ToLower().Contains(s) ||
                    d.User.Email!.ToLower().Contains(s) ||
                    d.Specialization.ToLower().Contains(s));
            }

            if (!string.IsNullOrWhiteSpace(request.Specialization))
            {
                var spec = request.Specialization.ToLower();
                query = query.Where(d => d.Specialization.ToLower().Contains(spec));
            }

            if (request.IsAvailable.HasValue)
                query = query.Where(d => d.IsAvailable == request.IsAvailable.Value);

            var total = await query.CountAsync(cancellationToken);

            var doctors = await query
                .OrderBy(d => d.User.LastName)
                .ThenBy(d => d.User.FirstName)
                .Skip((request.Page - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToListAsync(cancellationToken);

            return new PaginatedResult<DoctorSummaryDto>
            {
                Items      = mapper.Map<List<DoctorSummaryDto>>(doctors),
                TotalCount = total,
                Page       = request.Page,
                PageSize   = request.PageSize
            };
        }
    }
}
