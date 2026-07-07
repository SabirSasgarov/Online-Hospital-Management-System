namespace HMS.Infrastructure.Services;

public class GoogleTokenValidator(IOptions<GoogleAuthSettings> googleOptions, ILogger<GoogleTokenValidator> logger)
{
    private readonly GoogleAuthSettings _settings = googleOptions.Value;

    public async Task<GoogleJsonWebSignature.Payload?> ValidateAsync(string idToken)
    {
        try
        {
            var settings = new GoogleJsonWebSignature.ValidationSettings
            {
                Audience = [_settings.ClientId]
            };
            return await GoogleJsonWebSignature.ValidateAsync(idToken, settings);
        }
        catch (InvalidJwtException ex)
        {
            logger.LogWarning("Google token validation failed: {Message}", ex.Message);
            return null;
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Unexpected error during Google token validation.");
            return null;
        }
    }
}
