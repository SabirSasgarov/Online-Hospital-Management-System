namespace HMS.Application.Doctors.Commands
{
    /// <summary>Soft-deletes the doctor profile. AppUser remains intact.</summary>
    public record DeleteDoctorCommand(Guid DoctorId) : IRequest;

    public class DeleteDoctorCommandHandler(IAppDbContext db)
        : IRequestHandler<DeleteDoctorCommand>
    {
        public async Task Handle(
            DeleteDoctorCommand request, CancellationToken cancellationToken)
        {
            var doctor = await db.Doctors
                .FirstOrDefaultAsync(d => d.Id == request.DoctorId, cancellationToken)
                ?? throw new NotFoundException(nameof(Doctor), request.DoctorId);

            doctor.IsDeleted = true;

            await db.SaveChangesAsync(cancellationToken);
        }
    }
}
