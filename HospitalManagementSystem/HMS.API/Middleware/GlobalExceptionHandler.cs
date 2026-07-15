using HMS.Application.Common.Exceptions;
using Microsoft.AspNetCore.Diagnostics;
using ValidationException = HMS.Application.Common.Exceptions.ValidationException;

namespace HMS.API.Middleware
{
    public class GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger) : IExceptionHandler
    {
        public async ValueTask<bool> TryHandleAsync(
            HttpContext context,
            Exception exception,
            CancellationToken cancellationToken)
        {
            logger.LogError(exception, "Unhandled exception: {Message}", exception.Message);

            var (statusCode, title, errors) = exception switch
            {
                ValidationException ve => (
                    StatusCodes.Status400BadRequest,
                    "Validation failed.",
                    ve.Errors),

                NotFoundException => (
                    StatusCodes.Status404NotFound,
                    exception.Message,
                    (IDictionary<string, string[]>?)null),

                ConflictException => (
                    StatusCodes.Status409Conflict,
                    exception.Message,
                    (IDictionary<string, string[]>?)null),

                ForbiddenException => (
                    StatusCodes.Status403Forbidden,
                    exception.Message,
                    (IDictionary<string, string[]>?)null),

                UnauthorizedException => (
                    StatusCodes.Status401Unauthorized,
                    exception.Message,
                    (IDictionary<string, string[]>?)null),

                _ => (
                    StatusCodes.Status500InternalServerError,
                    "An unexpected error occurred.",
                    (IDictionary<string, string[]>?)null)
            };

            context.Response.StatusCode = statusCode;

            var problem = new ProblemDetails
            {
                Status = statusCode,
                Title  = title,
                Type   = $"https://httpstatuses.com/{statusCode}"
            };

            if (errors is not null)
                problem.Extensions["errors"] = errors;

            await context.Response.WriteAsJsonAsync(problem, cancellationToken);
            return true;
        }
    }
}
