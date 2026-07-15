using HMS.Application.Wards.WardsDTOs;

namespace HMS.Application.Wards.Commands
{
    public record CreateWardCommand(CreateWardDto Dto) : IRequest<Guid>;

    public class CreateWardCommandHandler(IAppDbContext db, IMapper mapper)
        : IRequestHandler<CreateWardCommand, Guid>
    {
        public async Task<Guid> Handle(CreateWardCommand request, CancellationToken cancellationToken)
        {
            var exists = await db.Wards.AnyAsync(
                w => w.Name == request.Dto.Name && w.Floor == request.Dto.Floor, cancellationToken);
            if (exists)
                throw new ConflictException($"A ward named '{request.Dto.Name}' already exists on floor {request.Dto.Floor}.");

            var ward = mapper.Map<Ward>(request.Dto);
            db.Wards.Add(ward);
            await db.SaveChangesAsync(cancellationToken);
            return ward.Id;
        }
    }
}
