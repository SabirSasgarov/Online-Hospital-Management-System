using HMS.Application.Appointments.AppointmentsDTOs;

namespace HMS.Application.Appointments.Queries
{
    public record GetAppointmentByIdQuery(Guid AppointmentId) : IRequest<AppointmentDto>;

    public class GetAppointmentByIdQueryHandler(IAppDbContext db, IMapper mapper)
        : IRequestHandler<GetAppointmentByIdQuery, AppointmentDto>
    {
        public async Task<AppointmentDto> Handle(
            GetAppointmentByIdQuery request, CancellationToken cancellationToken)
        {
            var appointment = await db.Appointments
                .Include(a => a.Patient).ThenInclude(p => p.User)
                .Include(a => a.Doctor).ThenInclude(d => d.User)
                .AsNoTracking()
                .FirstOrDefaultAsync(a => a.Id == request.AppointmentId, cancellationToken)
                ?? throw new NotFoundException(nameof(Appointment), request.AppointmentId);

            return mapper.Map<AppointmentDto>(appointment);
        }
    }
}
