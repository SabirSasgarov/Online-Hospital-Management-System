using HMS.Application.Patients.PatientsDTOs;

namespace HMS.Application.Patients.Queries
{
    public record GetPatientByIdQuery(Guid PatientId) : IRequest<PatientDto>;

    public class GetPatientByIdQueryHandler(IAppDbContext db, IMapper mapper)
        : IRequestHandler<GetPatientByIdQuery, PatientDto>
    {
        public async Task<PatientDto> Handle(
            GetPatientByIdQuery request, CancellationToken cancellationToken)
        {
            var patient = await db.Patients
                .Include(p => p.User)
                .Include(p => p.CurrentBed)
                .AsNoTracking()
                .FirstOrDefaultAsync(p => p.Id == request.PatientId, cancellationToken)
                ?? throw new NotFoundException(nameof(Patient), request.PatientId);

            return mapper.Map<PatientDto>(patient);
        }
    }
}
