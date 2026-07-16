using HMS.Application.Prescriptions.DTOs;

namespace HMS.Application.Prescriptions.Queries
{
    public record GetPrescriptionByIdQuery(Guid PrescriptionId) : IRequest<PrescriptionDto>;

    public class GetPrescriptionByIdQueryHandler(IAppDbContext db, IMapper mapper)
        : IRequestHandler<GetPrescriptionByIdQuery, PrescriptionDto>
    {
        public async Task<PrescriptionDto> Handle(
            GetPrescriptionByIdQuery request, CancellationToken cancellationToken)
        {
            var prescription = await db.Prescriptions
                .Include(p => p.Patient).ThenInclude(p => p.User)
                .Include(p => p.Doctor).ThenInclude(d => d.User)
                .Include(p => p.Medications)
                .AsNoTracking()
                .FirstOrDefaultAsync(p => p.Id == request.PrescriptionId, cancellationToken)
                ?? throw new NotFoundException(nameof(Prescription), request.PrescriptionId);

            return mapper.Map<PrescriptionDto>(prescription);
        }
    }
}
