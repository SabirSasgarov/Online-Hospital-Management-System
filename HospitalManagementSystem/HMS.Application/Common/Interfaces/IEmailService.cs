namespace HMS.Application.Common.Interfaces
{
	public interface IEmailService
	{
		Task SendEmailAsync(string toEmail, string toName, string subject, string htmlBody, CancellationToken cancellationToken = default);
		Task SendPasswordResetCodeEmailAsync(string toEmail, string toName, string code, CancellationToken cancellationToken = default);
		Task SendWelcomeEmailAsync(string toEmail, string toName, CancellationToken cancellationToken = default);
	}
}
