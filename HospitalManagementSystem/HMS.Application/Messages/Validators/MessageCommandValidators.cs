using FluentValidation;
using HMS.Application.Messages.Commands;

namespace HMS.Application.Messages.Validators
{
    public class SendMessageCommandValidator : AbstractValidator<SendMessageCommand>
    {
        public SendMessageCommandValidator()
        {
            RuleFor(x => x.SenderId).NotEmpty();
            RuleFor(x => x.Dto.ReceiverId).NotEmpty();
            RuleFor(x => x.Dto.Content)
                .NotEmpty().WithMessage("Message content cannot be empty.")
                .MaximumLength(2000);
        }
    }
}
