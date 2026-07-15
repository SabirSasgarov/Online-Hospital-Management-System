using FluentValidation;
using HMS.Application.Common.Exceptions;
using ValidationException = HMS.Application.Common.Exceptions.ValidationException;

namespace HMS.Application.Common.Behaviours
{
    /// <summary>
    /// MediatR pipeline step that runs every registered IValidator&lt;TRequest&gt;
    /// before the handler executes. Throws <see cref="ValidationException"/> on failure.
    /// </summary>
    public class ValidationBehavior<TRequest, TResponse>(IEnumerable<IValidator<TRequest>> validators)
        : IPipelineBehavior<TRequest, TResponse>
        where TRequest : notnull
    {
        public async Task<TResponse> Handle(
            TRequest request,
            RequestHandlerDelegate<TResponse> next,
            CancellationToken cancellationToken)
        {
            if (!validators.Any())
                return await next();

            var context = new ValidationContext<TRequest>(request);

            var results = await Task.WhenAll(
                validators.Select(v => v.ValidateAsync(context, cancellationToken)));

            var failures = results
                .SelectMany(r => r.Errors)
                .Where(f => f is not null)
                .GroupBy(f => f.PropertyName, f => f.ErrorMessage)
                .ToDictionary(g => g.Key, g => g.ToArray());

            if (failures.Count != 0)
                throw new ValidationException(failures);

            return await next();
        }
    }
}
