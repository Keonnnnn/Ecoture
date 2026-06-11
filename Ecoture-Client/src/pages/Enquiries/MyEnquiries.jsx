import React, { useEffect, useState, useContext } from "react";
import { Box, Typography, Card, CardContent, Chip, Divider, TextField, Button } from "@mui/material";
import http from "utils/http";
import UserContext from "contexts/UserContext";

const statusColor = { Open: "warning", Closed: "success", InProgress: "info" };
const statusLabel = { 0: "Open", 1: "Closed", 2: "InProgress" };

function MyEnquiries() {
  const { user } = useContext(UserContext);
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState({});
  const [submitting, setSubmitting] = useState({});

  useEffect(() => {
    if (!user?.email) return;
    http.get(`/Enquiry/my?email=${encodeURIComponent(user.email)}`)
      .then((res) => setEnquiries(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleReply = (enquiryId) => {
    const message = replyText[enquiryId]?.trim();
    if (!message) return;

    setSubmitting((prev) => ({ ...prev, [enquiryId]: true }));
    http.post("/Response", { enquiryId, message })
      .then((res) => {
        setEnquiries((prev) =>
          prev.map((enq) =>
            enq.enquiryId === enquiryId
              ? { ...enq, responses: [...(enq.responses || []), res.data] }
              : enq
          )
        );
        setReplyText((prev) => ({ ...prev, [enquiryId]: "" }));
      })
      .catch(() => alert("Failed to send reply."))
      .finally(() => setSubmitting((prev) => ({ ...prev, [enquiryId]: false })));
  };

  if (loading) return <Typography sx={{ mt: 4, textAlign: "center" }}>Loading...</Typography>;

  return (
    <Box sx={{ mt: 4, mx: "auto", maxWidth: 900, px: 2 }}>
      <Typography variant="h5" fontWeight="bold" mb={3}>My Enquiries</Typography>

      {enquiries.length === 0 ? (
        <Typography>You have no enquiries yet.</Typography>
      ) : (
        enquiries.map((enq) => {
          const status = statusLabel[enq.status] ?? "Open";
          const isOpen = status !== "Closed";
          return (
            <Card key={enq.enquiryId} sx={{ mb: 3, boxShadow: 2, borderRadius: 2 }}>
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                  <Typography variant="h6" fontWeight="bold">{enq.subject}</Typography>
                  <Chip label={status} color={statusColor[status] ?? "default"} size="small" />
                </Box>
                <Typography variant="body2" color="text.secondary" mb={1}>
                  Submitted: {new Date(enq.createdAt).toLocaleString()}
                </Typography>
                <Typography variant="body1" mb={2}>{enq.message}</Typography>

                {enq.responses && enq.responses.length > 0 && (
                  <>
                    <Divider sx={{ mb: 2 }} />
                    <Typography variant="subtitle2" fontWeight="bold" mb={1}>Responses:</Typography>
                    {enq.responses.map((r) => (
                      <Box key={r.responseId} sx={{ bgcolor: "#f5f5f5", borderRadius: 1, p: 2, mb: 1 }}>
                        <Typography variant="body2">{r.message}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(r.responseDate).toLocaleString()}
                        </Typography>
                      </Box>
                    ))}
                  </>
                )}

                {(!enq.responses || enq.responses.length === 0) && (
                  <Typography variant="body2" color="text.secondary" fontStyle="italic" mb={1}>
                    No response yet.
                  </Typography>
                )}

                {isOpen && (
                  <>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle2" fontWeight="bold" mb={1}>Send a follow-up:</Typography>
                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      placeholder="Type your message..."
                      value={replyText[enq.enquiryId] || ""}
                      onChange={(e) => setReplyText((prev) => ({ ...prev, [enq.enquiryId]: e.target.value }))}
                      sx={{ mb: 1 }}
                    />
                    <Button
                      variant="contained"
                      size="small"
                      disabled={submitting[enq.enquiryId] || !replyText[enq.enquiryId]?.trim()}
                      onClick={() => handleReply(enq.enquiryId)}
                      sx={{ bgcolor: "#3E3E3E", "&:hover": { bgcolor: "#555" } }}
                    >
                      {submitting[enq.enquiryId] ? "Sending..." : "Send"}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          );
        })
      )}
    </Box>
  );
}

export default MyEnquiries;
