using FluentValidation;
using HMS.Application.LabResults.Commands;

namespace HMS.Application.LabResults.Validators
{
    public class CreateLabResultCommandValidator : AbstractValidator<CreateLabResultCommand>
    {
        public CreateLabResultCommandValidator()
        {
            RuleFor(x => x.Dto.VisitId).NotEmpty();
            RuleFor(x => x.Dto.PatientId).NotEmpty();
            RuleFor(x => x.Dto.OrderedById).NotEmpty();
            RuleFor(x => x.Dto.TestName).NotEmpty().MaximumLength(200);
            RuleFor(x => x.Dto.Result).NotEmpty().MaximumLength(500);
            RuleFor(x => x.Dto.NormalRange).NotEmpty().MaximumLength(200);
            RuleFor(x => x.Dto.TestedAt)
                .NotEmpty()
                .LessThanOrEqualTo(DateTime.UtcNow).WithMessage("Tested date cannot be in the future.");
            RuleFor(x => x.Dto.Status).IsInEnum();
            RuleFor(x => x.Dto.Notes).MaximumLength(1000).When(x => x.Dto.Notes is not null);
        }
    }
}
