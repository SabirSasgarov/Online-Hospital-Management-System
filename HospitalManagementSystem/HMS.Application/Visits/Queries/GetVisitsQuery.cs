using HMS.Application.Patients.PatientsDTOs;
using HMS.Application.Visits.VisitsDTOs;

namespace HMS.Application.Visits.Queries
{
    public record GetVisitsQuery(
        Guid? PatientId,
        Guid? DoctorId,
        VisitStatus? Status,
        DateTime? From,
        DateTime? To,
        int Page = 1,
        int PageSize = 20
    ) : IRequest<PaginatedResult<VisitDto>>;

    public class GetVisitsQueryHandler(IAppDbContext db, IMapper mapper)
        : IRequestHandler<GetVisitsQuery, PaginatedResult<VisitDto>>
    {
        public async Task<PaginatedResult<VisitDto>> Handle(
            GetVisitsQuery request, CancellationToken cancellationToken)
        {
            var query = db.Visits
                .Include(v => v.Patient).ThenInclude(p => p.User)
                .Include(v => v.Doctor).ThenInclude(d => d.User)
                .Include(v => v.Bed)
                .AsNoTracking()
                .AsQueryable();

            if (request.PatientId.HasValue)
                query = query.Where(v => v.PatientId == request.PatientId.Value);

            if (request.DoctorId.HasValue)
                query = query.Where(v => v.DoctorId == request.DoctorId.Value);

            if (request.Status.HasValue)
                query = query.Where(v => v.Status == request.Status.Value);

            if (request.From.HasValue)
                query = query.Where(v => v.AdmissionDate >= request.From.Value);

            if (request.To.HasValue)
                query = query.Where(v => v.AdmissionDate <= request.To.Value);

            var total = await query.CountAsync(cancellationToken);
            var visits = await query
                .OrderByDescending(v => v.AdmissionDate)
                .Skip((request.Page - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToListAsync(cancellationToken);

            return new PaginatedResult<VisitDto>
            {
                Items      = mapper.Map<List<VisitDto>>(visits),
                TotalCount = total,
                Page       = request.Page,
                PageSize   = request.PageSize
            };
        }
    }
}
