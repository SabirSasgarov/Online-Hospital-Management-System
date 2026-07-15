using FluentValidation;
using HMS.Application.Rooms.Commands;

namespace HMS.Application.Rooms.Validators
{
    public class CreateRoomCommandValidator : AbstractValidator<CreateRoomCommand>
    {
        public CreateRoomCommandValidator()
        {
            RuleFor(x => x.Dto.WardId)
                .NotEmpty().WithMessage("Ward is required.");

            RuleFor(x => x.Dto.RoomNumber)
                .NotEmpty().WithMessage("Room number is required.")
                .MaximumLength(10);

            RuleFor(x => x.Dto.Type)
                .IsInEnum().WithMessage("Invalid room type.");
        }
    }

    public class UpdateRoomCommandValidator : AbstractValidator<UpdateRoomCommand>
    {
        public UpdateRoomCommandValidator()
        {
            RuleFor(x => x.RoomId).NotEmpty();

            RuleFor(x => x.Dto.RoomNumber)
                .NotEmpty().WithMessage("Room number is required.")
                .MaximumLength(10);

            RuleFor(x => x.Dto.Type)
                .IsInEnum().WithMessage("Invalid room type.");
        }
    }
}
