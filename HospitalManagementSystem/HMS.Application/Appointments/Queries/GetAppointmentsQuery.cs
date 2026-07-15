using HMS.Application.Appointments.AppointmentsDTOs;

namespace HMS.Application.Appointments.Queries
{
    public record GetAppointmentsQuery(
        Guid? PatientId,
        Guid? DoctorId,
        AppointmentStatus? Status,
        AppointmentType? Type,
        DateTime? From,
        DateTime? To,
        int Page = 1,
        int PageSize = 10
    ) : IRequest<PaginatedResult<AppointmentSummaryDto>>;

    public class GetAppointmentsQueryHandler(IAppDbContext db, IMapper mapper)
        : IRequestHandler<GetAppointmentsQuery, PaginatedResult<AppointmentSummaryDto>>
    {
        public async Task<PaginatedResult<AppointmentSummaryDto>> Handle(
            GetAppointmentsQuery request, CancellationToken cancellationToken)
        {
            var query = db.Appointments
                .Include(a => a.Patient).ThenInclude(p => p.User)
                .Include(a => a.Doctor).ThenInclude(d => d.User)
                .Include(a => a.Doctor)
                .AsNoTracking()
                .AsQueryable();

            if (request.PatientId.HasValue)
                query = query.Where(a => a.PatientId == request.PatientId.Value);

            if (request.DoctorId.HasValue)
                query = query.Where(a => a.DoctorId == request.DoctorId.Value);

            if (request.Status.HasValue)
                query = query.Where(a => a.Status == request.Status.Value);

            if (request.Type.HasValue)
                query = query.Where(a => a.Type == request.Type.Value);

            if (request.From.HasValue)
                query = query.Where(a => a.ScheduledAt >= request.From.Value);

            if (request.To.HasValue)
                query = query.Where(a => a.ScheduledAt <= request.To.Value);

            var total = await query.CountAsync(cancellationToken);

            var items = await query
                .OrderByDescending(a => a.ScheduledAt)
                .Skip((request.Page - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToListAsync(cancellationToken);

            return new PaginatedResult<AppointmentSummaryDto>
            {
                Items      = mapper.Map<List<AppointmentSummaryDto>>(items),
                TotalCount = total,
                Page       = request.Page,
                PageSize   = request.PageSize
            };
        }
    }
}
