using FluentValidation;
using HMS.Application.DischargeSummaries.Commands;

namespace HMS.Application.DischargeSummaries.Validators
{
    public class CreateDischargeSummaryCommandValidator : AbstractValidator<CreateDischargeSummaryCommand>
    {
        public CreateDischargeSummaryCommandValidator()
        {
            RuleFor(x => x.Dto.VisitId).NotEmpty();
            RuleFor(x => x.Dto.FollowUpInstructions).NotEmpty().MaximumLength(2000);
            RuleFor(x => x.Dto.FollowUpDate)
                .GreaterThan(DateOnly.FromDateTime(DateTime.UtcNow))
                .WithMessage("Follow-up date must be in the future.")
                .When(x => x.Dto.FollowUpDate.HasValue);
        }
    }

    public class UpdateDischargeSummaryCommandValidator : AbstractValidator<UpdateDischargeSummaryCommand>
    {
        public UpdateDischargeSummaryCommandValidator()
        {
            RuleFor(x => x.DischargeSummaryId).NotEmpty();
            RuleFor(x => x.Dto.FollowUpInstructions).MaximumLength(2000)
                .When(x => x.Dto.FollowUpInstructions is not null);
            RuleFor(x => x.Dto.FollowUpDate)
                .GreaterThan(DateOnly.FromDateTime(DateTime.UtcNow))
                .WithMessage("Follow-up date must be in the future.")
                .When(x => x.Dto.FollowUpDate.HasValue);
        }
    }
}
