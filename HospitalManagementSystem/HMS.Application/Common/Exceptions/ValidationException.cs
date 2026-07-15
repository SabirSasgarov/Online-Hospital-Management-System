namespace HMS.Application.Common.Exceptions
{
    /// <summary>
    /// Thrown by <c>ValidationBehavior</c> when one or more FluentValidation rules fail.
    /// Carries the full dictionary of field → error list so the API can return them verbatim.
    /// </summary>
    public class ValidationException : Exception
    {
        public IDictionary<string, string[]> Errors { get; }

        public ValidationException(IDictionary<string, string[]> errors)
            : base("One or more validation errors occurred.")
        {
            Errors = errors;
        }
    }
}
