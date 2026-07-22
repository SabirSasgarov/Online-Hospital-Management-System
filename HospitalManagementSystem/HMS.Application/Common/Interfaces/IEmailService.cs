namespace HMS.Application.Common.Interfaces
{
    public interface IEmailService
    {
        // ── Generic ──────────────────────────────────────────────────────────
        Task SendEmailAsync(string toEmail, string toName, string subject, string htmlBody,
            CancellationToken cancellationToken = default);

        // ── Auth ──────────────────────────────────────────────────────────────
        Task SendWelcomeEmailAsync(string toEmail, string toName,
            CancellationToken cancellationToken = default);

        Task SendPasswordResetCodeEmailAsync(string toEmail, string toName, string code,
            CancellationToken cancellationToken = default);

        Task SendEmailConfirmationCodeAsync(string toEmail, string toName, string code,
            CancellationToken cancellationToken = default);

        Task SendAccountCreatedEmailAsync(string toEmail, string toName, string tempPassword,
            CancellationToken cancellationToken = default);

        // ── Appointments ─────────────────────────────────────────────────────
        Task SendAppointmentConfirmationAsync(string toEmail, string toName,
            string doctorName, DateTime scheduledAt, string appointmentType,
            CancellationToken cancellationToken = default);

        Task SendAppointmentCancellationAsync(string toEmail, string toName,
            string doctorName, DateTime scheduledAt,
            CancellationToken cancellationToken = default);

        Task SendAppointmentReminderAsync(string toEmail, string toName,
            string doctorName, DateTime scheduledAt,
            CancellationToken cancellationToken = default);

        // ── Clinical ─────────────────────────────────────────────────────────
        Task SendPrescriptionIssuedAsync(string toEmail, string toName,
            string doctorName, IEnumerable<string> medicationNames,
            CancellationToken cancellationToken = default);

        Task SendLabResultReadyAsync(string toEmail, string toName,
            string testName, string status,
            CancellationToken cancellationToken = default);

        Task SendDischargeSummaryReadyAsync(string toEmail, string toName,
            string doctorName, DateOnly? followUpDate,
            CancellationToken cancellationToken = default);
    }
}
