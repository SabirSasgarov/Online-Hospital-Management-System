using HMS.Application.Visits.VisitsDTOs;

namespace HMS.Application.Visits.Queries
{
    public record GetVisitByIdQuery(Guid VisitId) : IRequest<VisitDto>;

    public class GetVisitByIdQueryHandler(IAppDbContext db, IMapper mapper)
        : IRequestHandler<GetVisitByIdQuery, VisitDto>
    {
        public async Task<VisitDto> Handle(
            GetVisitByIdQuery request, CancellationToken cancellationToken)
        {
            var visit = await db.Visits
                .Include(v => v.Patient).ThenInclude(p => p.User)
                .Include(v => v.Doctor).ThenInclude(d => d.User)
                .Include(v => v.Bed)
                .Include(v => v.Prescriptions)
                    .ThenInclude(p => p.Doctor).ThenInclude(d => d.User)
                .Include(v => v.Prescriptions)
                    .ThenInclude(p => p.Medications)
                .Include(v => v.LabResults)
                .AsNoTracking()
                .FirstOrDefaultAsync(v => v.Id == request.VisitId, cancellationToken)
                ?? throw new NotFoundException(nameof(Visit), request.VisitId);

            return mapper.Map<VisitDto>(visit);
        }
    }
}
