using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Ecoture.Model.DTO;
using Ecoture.Model.Entity;
using Ecoture.Model.Request;
using Ecoture.Services;
using AutoMapper;

namespace Ecoture.Controllers
{
	[Route("[controller]")]
	[ApiController]
	public class ResponseController(MyDbContext context, IMapper mapper, ILogger<ResponseController> logger, IEmailService emailService) : ControllerBase
	{
		private readonly MyDbContext _context = context;
		private readonly IMapper _mapper = mapper;
		private readonly ILogger<ResponseController> _logger = logger;
		private readonly IEmailService _emailService = emailService;

		[HttpGet]
		[ProducesResponseType(typeof(IEnumerable<ResponseDTO>), StatusCodes.Status200OK)]
		public IActionResult GetAllResponses()
		{
			try
			{
				var responses = _context.Responses.Include(r => r.Enquiry).ToList();
				var responseDTOs = responses.Select(_mapper.Map<ResponseDTO>);
				return Ok(responseDTOs);
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error fetching all responses.");
				return StatusCode(500, "Internal server error.");
			}
		}

		[HttpGet("{id}")]
		public async Task<IActionResult> GetResponse(int id)
		{
			var response = await _context.Responses.Include(r => r.Enquiry).FirstOrDefaultAsync(r => r.responseId == id);
			if (response == null)
			{
				return NotFound("Response not found.");
			}
			return Ok(response);
		}

		[HttpPost]
		[ProducesResponseType(typeof(ResponseDTO), StatusCodes.Status200OK)]
		public async Task<IActionResult> AddResponse(AddResponse responseRequest)
		{
			try
			{
				var enquiry = _context.Enquiries.Find(responseRequest.EnquiryId);
				if (enquiry == null)
				{
					return NotFound("Enquiry not found.");
				}

				var now = DateTime.UtcNow;
				var newResponse = new Response
				{
					enquiryId = responseRequest.EnquiryId,
					csoId = 0,
					message = responseRequest.Message.Trim(),
					responseDate = now
				};

				_context.Responses.Add(newResponse);
				enquiry.updatedAt = now;
				_context.SaveChanges();

				// Email the customer with the admin's response
				await _emailService.SendAsync(
					enquiry.email,
					$"Response to your enquiry: {enquiry.subject}",
					$@"<html><body style='font-family:Arial,sans-serif;color:#333'>
						<h2>We've responded to your enquiry</h2>
						<p><strong>Subject:</strong> {enquiry.subject}</p>
						<p><strong>Your message:</strong><br/>{enquiry.message}</p>
						<hr/>
						<p><strong>Our response:</strong><br/>{responseRequest.Message.Trim()}</p>
						<br/>
						<p>You can view all your enquiries at <a href='https://ecoture.keonshu.com/my-enquiries'>ecoture.keonshu.com/my-enquiries</a>.</p>
						<br/>
						<p>Thank you,<br/><strong>The Ecoture Team</strong></p>
					</body></html>"
				);

				var responseDTO = _mapper.Map<ResponseDTO>(newResponse);
				return Ok(responseDTO);
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error adding response.");
				return StatusCode(500, "Internal server error.");
			}
		}

	}
}
