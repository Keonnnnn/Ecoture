using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Linq;
using System.Collections.Generic;
using Ecoture.Model.Entity;
using Ecoture.Services;

namespace Ecoture.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class EmailListController : ControllerBase
    {
        private readonly MyDbContext _context;
        private readonly ILogger<EmailListController> _logger;
        private readonly IEmailService _emailService;

        public EmailListController(MyDbContext context, ILogger<EmailListController> logger, IEmailService emailService)
        {
            _context = context;
            _logger = logger;
            _emailService = emailService;
        }

        [HttpGet]
        public IActionResult GetAllEmails()
        {
            try
            {
                var emails = _context.EmailLists
                    .Select(e => e.Email) 
                    .ToList();

                if (!emails.Any())
                {
                    return NotFound(new { message = "No emails found." });
                }

                return Ok(emails);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching email list");
                return StatusCode(500, new { message = "Error retrieving email list." });
            }
        }

        [HttpPost]
        public async Task<IActionResult> Subscribe([FromBody] EmailList emailEntry)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var existingEmail = _context.EmailLists.FirstOrDefault(e => e.Email == emailEntry.Email);
                if (existingEmail != null)
                    return Conflict(new { message = "This email is already subscribed." });

                emailEntry.SubscribedAt = DateTime.UtcNow;
                _context.EmailLists.Add(emailEntry);
                _context.SaveChanges();

                await _emailService.SendAsync(
                    emailEntry.Email,
                    "Welcome to Ecoture – You're subscribed!",
                    @"<html><body style='font-family:Arial,sans-serif;color:#333'>
                        <h2>Welcome to Ecoture! 🌿</h2>
                        <p>Thank you for subscribing to our newsletter.</p>
                        <p>You'll be the first to know about new arrivals, exclusive deals, and the latest fashion trends.</p>
                        <br/>
                        <p>Stay stylish,<br/><strong>The Ecoture Team</strong></p>
                      </body></html>"
                );

                return Ok(new { message = "Successfully subscribed!" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error subscribing user");
                return StatusCode(500, new { message = "Internal server error while subscribing." });
            }
        }
    }
}