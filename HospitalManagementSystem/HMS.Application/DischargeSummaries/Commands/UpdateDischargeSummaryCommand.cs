using HMS.Application.DischargeSummaries.DTOs;

namespace HMS.Application.DischargeSummaries.Commands
{
    public record UpdateDischargeSummaryCommand(Guid DischargeSummaryId, UpdateDischargeSummaryDto Dto) : IRequest;

    public class UpdateDischargeSummaryCommandHandler(IAppDbContext db, IMapper mapper)
        : IRequestHandler<UpdateDischargeSummaryCommand>
    {
        public async Task Handle(UpdateDischargeSummaryCommand request, CancellationToken cancellationToken)
        {
            var summary = await db.DischargeSummaries
                .FirstOrDefaultAsync(d => d.Id == request.DischargeSummaryId, cancellationToken)
                ?? throw new NotFoundException(nameof(DischargeSummary), request.DischargeSummaryId);

            mapper.Map(request.Dto, summary);
            await db.SaveChangesAsync(cancellationToken);
        }
    }
}
