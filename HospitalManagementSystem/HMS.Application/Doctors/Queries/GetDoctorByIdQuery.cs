using HMS.Application.Doctors.DoctorsDTOs;

namespace HMS.Application.Doctors.Queries
{
    public record GetDoctorByIdQuery(Guid DoctorId) : IRequest<DoctorDto>;

    public class GetDoctorByIdQueryHandler(IAppDbContext db, IMapper mapper)
        : IRequestHandler<GetDoctorByIdQuery, DoctorDto>
    {
        public async Task<DoctorDto> Handle(
            GetDoctorByIdQuery request, CancellationToken cancellationToken)
        {
            var doctor = await db.Doctors
                .Include(d => d.User)
                .Include(d => d.Schedules)
                .Include(d => d.Appointments)
                .Include(d => d.Visits)
                .AsNoTracking()
                .FirstOrDefaultAsync(d => d.Id == request.DoctorId, cancellationToken)
                ?? throw new NotFoundException(nameof(Doctor), request.DoctorId);

            return mapper.Map<DoctorDto>(doctor);
        }
    }
}
