using HMS.Application.Appointments.AppointmentsDTOs;

namespace HMS.Application.Appointments.Commands
{
    public record CreateAppointmentCommand(CreateAppointmentDto Dto) : IRequest<Guid>;

    public class CreateAppointmentCommandHandler(IAppDbContext db, IMapper mapper)
        : IRequestHandler<CreateAppointmentCommand, Guid>
    {
        public async Task<Guid> Handle(
            CreateAppointmentCommand request, CancellationToken cancellationToken)
        {
            // Verify patient and doctor exist
            var patientExists = await db.Patients.AnyAsync(p => p.Id == request.Dto.PatientId, cancellationToken);
            if (!patientExists) throw new NotFoundException(nameof(Patient), request.Dto.PatientId);

            var doctorExists = await db.Doctors.AnyAsync(d => d.Id == request.Dto.DoctorId, cancellationToken);
            if (!doctorExists) throw new NotFoundException(nameof(Doctor), request.Dto.DoctorId);

            // Conflict check: doctor already has a Scheduled appointment within 30 minutes
            var windowStart = request.Dto.ScheduledAt.AddMinutes(-30);
            var windowEnd   = request.Dto.ScheduledAt.AddMinutes(30);

            var hasConflict = await db.Appointments.AnyAsync(a =>
                a.DoctorId  == request.Dto.DoctorId &&
                a.Status    == AppointmentStatus.Scheduled &&
                a.ScheduledAt >= windowStart &&
                a.ScheduledAt <= windowEnd,
                cancellationToken);

            if (hasConflict)
                throw new ConflictException(
                    "The doctor already has an appointment within 30 minutes of the requested time.");

            var appointment = mapper.Map<Appointment>(request.Dto);
            appointment.Status = AppointmentStatus.Scheduled;

            db.Appointments.Add(appointment);
            await db.SaveChangesAsync(cancellationToken);

            return appointment.Id;
        }
    }
}
