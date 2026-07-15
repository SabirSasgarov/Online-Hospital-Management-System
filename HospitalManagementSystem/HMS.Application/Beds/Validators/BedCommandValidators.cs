using FluentValidation;
using HMS.Application.Beds.Commands;

namespace HMS.Application.Beds.Validators
{
    public class CreateBedCommandValidator : AbstractValidator<CreateBedCommand>
    {
        public CreateBedCommandValidator()
        {
            RuleFor(x => x.Dto.RoomId)
                .NotEmpty().WithMessage("Room is required.");

            RuleFor(x => x.Dto.BedNumber)
                .NotEmpty().WithMessage("Bed number is required.")
                .MaximumLength(10);
        }
    }

    public class UpdateBedStatusCommandValidator : AbstractValidator<UpdateBedStatusCommand>
    {
        public UpdateBedStatusCommandValidator()
        {
            RuleFor(x => x.BedId).NotEmpty();
            RuleFor(x => x.Dto.Status).IsInEnum().WithMessage("Invalid bed status.");
        }
    }

    public class AssignPatientToBedCommandValidator : AbstractValidator<AssignPatientToBedCommand>
    {
        public AssignPatientToBedCommandValidator()
        {
            RuleFor(x => x.BedId).NotEmpty();
            RuleFor(x => x.Dto.PatientId).NotEmpty().WithMessage("Patient is required.");
        }
    }
}
