using HMS.Application.DischargeSummaries.DTOs;

namespace HMS.Application.DischargeSummaries.Queries
{
    public record GetDischargeSummaryByIdQuery(Guid DischargeSummaryId) : IRequest<DischargeSummaryDto>;

    public class GetDischargeSummaryByIdQueryHandler(IAppDbContext db, IMapper mapper)
        : IRequestHandler<GetDischargeSummaryByIdQuery, DischargeSummaryDto>
    {
        public async Task<DischargeSummaryDto> Handle(
            GetDischargeSummaryByIdQuery request, CancellationToken cancellationToken)
        {
            var summary = await db.DischargeSummaries
                .Include(d => d.Patient).ThenInclude(p => p.User)
                .Include(d => d.Doctor).ThenInclude(d => d.User)
                .Include(d => d.Visit)
                .AsNoTracking()
                .FirstOrDefaultAsync(d => d.Id == request.DischargeSummaryId, cancellationToken)
                ?? throw new NotFoundException(nameof(DischargeSummary), request.DischargeSummaryId);

            return mapper.Map<DischargeSummaryDto>(summary);
        }
    }
}
