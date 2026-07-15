using HMS.Application.Doctors.DoctorsDTOs;

namespace HMS.Application.Doctors.Queries
{
    public record GetDoctorScheduleQuery(Guid DoctorId) : IRequest<List<DoctorScheduleDto>>;

    public class GetDoctorScheduleQueryHandler(IAppDbContext db, IMapper mapper)
        : IRequestHandler<GetDoctorScheduleQuery, List<DoctorScheduleDto>>
    {
        public async Task<List<DoctorScheduleDto>> Handle(
            GetDoctorScheduleQuery request, CancellationToken cancellationToken)
        {
            var exists = await db.Doctors.AnyAsync(d => d.Id == request.DoctorId, cancellationToken);
            if (!exists) throw new NotFoundException(nameof(Doctor), request.DoctorId);

            var schedules = await db.Doctors
                .Where(d => d.Id == request.DoctorId)
                .SelectMany(d => d.Schedules)
                .AsNoTracking()
                .OrderBy(s => s.Day)
                .ToListAsync(cancellationToken);

            return mapper.Map<List<DoctorScheduleDto>>(schedules);
        }
    }
}
