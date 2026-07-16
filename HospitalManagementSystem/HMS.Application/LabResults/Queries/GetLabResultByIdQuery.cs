using HMS.Application.LabResults.DTOs;

namespace HMS.Application.LabResults.Queries
{
    public record GetLabResultByIdQuery(Guid LabResultId) : IRequest<LabResultDto>;

    public class GetLabResultByIdQueryHandler(IAppDbContext db, IMapper mapper)
        : IRequestHandler<GetLabResultByIdQuery, LabResultDto>
    {
        public async Task<LabResultDto> Handle(
            GetLabResultByIdQuery request, CancellationToken cancellationToken)
        {
            var result = await db.LabResults
                .Include(l => l.Patient).ThenInclude(p => p.User)
                .Include(l => l.OrderedBy)
                .AsNoTracking()
                .FirstOrDefaultAsync(l => l.Id == request.LabResultId, cancellationToken)
                ?? throw new NotFoundException(nameof(LabResult), request.LabResultId);

            return mapper.Map<LabResultDto>(result);
        }
    }
}
