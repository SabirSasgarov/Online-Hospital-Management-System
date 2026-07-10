using Microsoft.AspNetCore.Mvc;

namespace HMS.API.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public abstract class BaseApiController : ControllerBase
	{
	}
}
