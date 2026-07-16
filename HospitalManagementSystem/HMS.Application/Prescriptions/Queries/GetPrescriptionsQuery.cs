using HMS.Application.Prescriptions.DTOs;

namespace HMS.Application.Prescriptions.Queries
{
    public record GetPrescriptionsQuery(
        Guid? VisitId,
        Guid? PatientId,
        Guid? DoctorId,
        PrescriptionStatus? Status,
        int Page = 1,
        int PageSize = 20
    ) : IRequest<PaginatedResult<PrescriptionDto>>;

    public class GetPrescriptionsQueryHandler(IAppDbContext db, IMapper mapper)
        : IRequestHandler<GetPrescriptionsQuery, PaginatedResult<PrescriptionDto>>
    {
        public async Task<PaginatedResult<PrescriptionDto>> Handle(
            GetPrescriptionsQuery request, CancellationToken cancellationToken)
        {
            var query = db.Prescriptions
                .Include(p => p.Patient).ThenInclude(p => p.User)
                .Include(p => p.Doctor).ThenInclude(d => d.User)
                .Include(p => p.Medications)
                .AsNoTracking().AsQueryable();

            if (request.VisitId.HasValue)   query = query.Where(p => p.VisitId   == request.VisitId.Value);
            if (request.PatientId.HasValue) query = query.Where(p => p.PatientId == request.PatientId.Value);
            if (request.DoctorId.HasValue)  query = query.Where(p => p.DoctorId  == request.DoctorId.Value);
            if (request.Status.HasValue)    query = query.Where(p => p.Status    == request.Status.Value);

            var total = await query.CountAsync(cancellationToken);
            var items = await query.OrderByDescending(p => p.IssuedAt)
                .Skip((request.Page - 1) * request.PageSize).Take(request.PageSize)
                .ToListAsync(cancellationToken);

            return new PaginatedResult<PrescriptionDto>
            {
                Items = mapper.Map<List<PrescriptionDto>>(items),
                TotalCount = total, Page = request.Page, PageSize = request.PageSize
            };
        }
    }
}
