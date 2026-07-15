namespace HMS.Infrastructure.Templates;

public static class EmailTemplates
{
    // ── Shared layout ────────────────────────────────────────────────────────
    private const string BaseStyle = @"
        <style>
          body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
          .header { background: #1a1a2e; padding: 30px; text-align: center; }
          .header h1 { color: #ffffff; margin: 0; font-size: 24px; }
          .body { padding: 40px 30px; }
          .body p { color: #333; line-height: 1.6; }
          .code-box { display: inline-block; margin: 24px 0; padding: 16px 40px; background: #1a1a2e; color: #e94560; font-size: 36px; font-weight: bold; letter-spacing: 10px; border-radius: 8px; }
          .info-box { background: #f0f4ff; border-left: 4px solid #1a1a2e; padding: 16px 20px; border-radius: 4px; margin: 20px 0; }
          .info-box p { margin: 4px 0; color: #333; }
          .badge { display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 13px; font-weight: bold; }
          .badge-normal   { background: #d4edda; color: #155724; }
          .badge-abnormal { background: #fff3cd; color: #856404; }
          .badge-critical { background: #f8d7da; color: #721c24; }
          .med-list { list-style: none; padding: 0; margin: 16px 0; }
          .med-list li { padding: 8px 12px; border-bottom: 1px solid #eee; color: #333; }
          .med-list li:last-child { border-bottom: none; }
          .btn { display: inline-block; margin-top: 24px; padding: 12px 28px; background: #1a1a2e; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 14px; }
          .footer { background: #f4f4f4; padding: 20px; text-align: center; font-size: 12px; color: #999; }
        </style>";

    private static string Wrap(string title, string bodyContent) =>
        $@"<!DOCTYPE html>
<html lang=""en"">
<head><meta charset=""UTF-8""/><meta name=""viewport"" content=""width=device-width,initial-scale=1.0""/>
<title>{title}</title>{BaseStyle}</head>
<body>
  <div class=""container"">
    <div class=""header""><h1>CareFlow</h1></div>
    <div class=""body"">{bodyContent}</div>
    <div class=""footer"">&copy; {DateTime.UtcNow.Year} CareFlow Hospital Management System. All rights reserved.</div>
  </div>
</body></html>";

    // ── Auth ─────────────────────────────────────────────────────────────────

    public static string PasswordResetCode(string userName, string code) => Wrap("Password Reset",
        $@"<p>Hello <strong>{userName}</strong>,</p>
           <p>We received a request to reset your password. Use the code below:</p>
           <div style=""text-align:center;""><span class=""code-box"">{code}</span></div>
           <p>This code expires in <strong>15 minutes</strong>. If you did not request this, please ignore the email.</p>");

    public static string Welcome(string userName) => Wrap("Welcome to CareFlow",
        $@"<p>Hello <strong>{userName}</strong>,</p>
           <p>Your account has been successfully created. You can now log in to the CareFlow portal.</p>
           <p>If you have any questions, please contact our support team.</p>");

    public static string AccountCreated(string userName, string tempPassword) => Wrap("Your CareFlow Account",
        $@"<p>Hello <strong>{userName}</strong>,</p>
           <p>An account has been created for you on the CareFlow Hospital Management System.</p>
           <div class=""info-box"">
             <p><strong>Username:</strong> {userName}</p>
             <p><strong>Temporary Password:</strong> <code>{tempPassword}</code></p>
           </div>
           <p>Please log in and change your password immediately.</p>");

    // ── Appointments ─────────────────────────────────────────────────────────

    public static string AppointmentConfirmation(
        string patientName, string doctorName, DateTime scheduledAt, string appointmentType) =>
        Wrap("Appointment Confirmed",
        $@"<p>Hello <strong>{patientName}</strong>,</p>
           <p>Your appointment has been successfully booked.</p>
           <div class=""info-box"">
             <p><strong>Doctor:</strong> Dr. {doctorName}</p>
             <p><strong>Type:</strong> {appointmentType}</p>
             <p><strong>Date &amp; Time:</strong> {scheduledAt:dddd, MMMM d yyyy} at {scheduledAt:h:mm tt}</p>
           </div>
           <p>Please arrive 10 minutes early. Contact us if you need to reschedule.</p>");

    public static string AppointmentCancellation(
        string patientName, string doctorName, DateTime scheduledAt) =>
        Wrap("Appointment Cancelled",
        $@"<p>Hello <strong>{patientName}</strong>,</p>
           <p>Your appointment has been cancelled.</p>
           <div class=""info-box"">
             <p><strong>Doctor:</strong> Dr. {doctorName}</p>
             <p><strong>Date &amp; Time:</strong> {scheduledAt:dddd, MMMM d yyyy} at {scheduledAt:h:mm tt}</p>
           </div>
           <p>If this was unintentional or you wish to rebook, please log in to the patient portal.</p>");

    public static string AppointmentReminder(
        string patientName, string doctorName, DateTime scheduledAt) =>
        Wrap("Appointment Reminder",
        $@"<p>Hello <strong>{patientName}</strong>,</p>
           <p>This is a friendly reminder about your upcoming appointment.</p>
           <div class=""info-box"">
             <p><strong>Doctor:</strong> Dr. {doctorName}</p>
             <p><strong>Date &amp; Time:</strong> {scheduledAt:dddd, MMMM d yyyy} at {scheduledAt:h:mm tt}</p>
           </div>
           <p>Please arrive 10 minutes early and bring any relevant medical records.</p>");

    // ── Clinical ─────────────────────────────────────────────────────────────

    public static string PrescriptionIssued(
        string patientName, string doctorName, IEnumerable<string> medicationNames)
    {
        var items = string.Join("", medicationNames.Select(m => $"<li>{m}</li>"));
        return Wrap("New Prescription Issued",
            $@"<p>Hello <strong>{patientName}</strong>,</p>
               <p>Dr. <strong>{doctorName}</strong> has issued a new prescription for you.</p>
               <p><strong>Medications:</strong></p>
               <ul class=""med-list"">{items}</ul>
               <p>Please follow the dosage instructions carefully and contact your doctor with any concerns.</p>");
    }

    public static string LabResultReady(string patientName, string testName, string status)
    {
        var badgeClass = status.ToLower() switch
        {
            "critical" => "badge-critical",
            "abnormal" => "badge-abnormal",
            _          => "badge-normal"
        };
        return Wrap("Lab Result Available",
            $@"<p>Hello <strong>{patientName}</strong>,</p>
               <p>Your lab result is now available.</p>
               <div class=""info-box"">
                 <p><strong>Test:</strong> {testName}</p>
                 <p><strong>Status:</strong> <span class=""badge {badgeClass}"">{status}</span></p>
               </div>
               <p>Please log in to your patient portal to view the full result and discuss it with your doctor.</p>");
    }

    public static string DischargeSummaryReady(
        string patientName, string doctorName, DateOnly? followUpDate) =>
        Wrap("Discharge Summary Ready",
        $@"<p>Hello <strong>{patientName}</strong>,</p>
           <p>Your discharge summary prepared by Dr. <strong>{doctorName}</strong> is now available in your patient portal.</p>
           {(followUpDate.HasValue
               ? $@"<div class=""info-box""><p><strong>Follow-up date:</strong> {followUpDate.Value:MMMM d, yyyy}</p></div>"
               : "")}
           <p>Please review your follow-up instructions carefully and attend any scheduled appointments.</p>");
}
