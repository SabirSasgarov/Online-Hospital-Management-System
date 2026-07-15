using HMS.Application.Wards.WardsDTOs;

namespace HMS.Application.Wards.Commands
{
    public record UpdateWardCommand(Guid WardId, UpdateWardDto Dto) : IRequest;

    public class UpdateWardCommandHandler(IAppDbContext db, IMapper mapper)
        : IRequestHandler<UpdateWardCommand>
    {
        public async Task Handle(UpdateWardCommand request, CancellationToken cancellationToken)
        {
            var ward = await db.Wards
                .FirstOrDefaultAsync(w => w.Id == request.WardId, cancellationToken)
                ?? throw new NotFoundException(nameof(Ward), request.WardId);

            mapper.Map(request.Dto, ward);
            await db.SaveChangesAsync(cancellationToken);
        }
    }
}
