import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Box, Card, CardContent, CardActions, CircularProgress, Snackbar, Typography, Grid, Button } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import http from 'utils/http';
import EmailEditor from 'react-email-editor';

function Newsletter() {
  const navigate = useNavigate();
  const [newsletters, setNewsletters] = useState([]);
  const editorRef = useRef(null);
  const [sending, setSending] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const getEmailList = async () => {
    try {
      const res = await http.get('/emaillist');
      return res.data; // Assuming res.data contains an array of email strings
    } catch (error) {
      console.error("Error fetching email list:", error);
      alert("Failed to fetch email list. Please try again.");
      return []; // Return an empty array if there's an error
    }
  };

  const sendEmails = async (id, subject, template) => {
    setSending(id);
    const recipientEmails = await getEmailList();
    const payload = { recipientEmails, subject, template };

    await http.post(`/newsletter/send/${id}`, payload)
      .then(() => setSnackbar({ open: true, message: 'Newsletter sent successfully!', severity: 'success' }))
      .catch(() => setSnackbar({ open: true, message: 'Failed to send newsletter. Please try again.', severity: 'error' }))
      .finally(() => setSending(null));
  };

  // Convert a single JSON design to HTML using the hidden editor
  const convertDesignToHtml = (design) => {
    return new Promise((resolve, reject) => {
      if (!editorRef.current?.editor) {
        return reject(new Error("Editor not ready"));
      }
      editorRef.current.editor.loadDesign(design, () => {
        editorRef.current.editor.exportHtml(({ html }) => {
          resolve(html);
        });
      });
    });
  };

  useEffect(() => {
    let isMounted = true;
    http.get('/newsletter')
      .then(async (res) => {
        const items = res.data;
        // for (const nl of items) {
        //   if (nl.template) {
        //     try {
        //       const design = JSON.parse(nl.template);
        //       const html = await convertDesignToHtml(design);
        //       nl.html = html; 
        //     } catch (err) {
        //       console.error("Error parsing or converting template JSON:", err);
        //     }
        //   }
        // }
        if (isMounted) {
          setNewsletters(items);
        }
      })
      .catch(err => console.error("Error fetching newsletters:", err));

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <Box sx={{ padding: '16px' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">Newsletters</Typography>
        <Button variant="contained" onClick={() => navigate('/createnewsletter')}>
          Create Newsletter
        </Button>
      </Box>

      {/* Hidden email editor for converting JSON -> HTML */}
      <div style={{ display: 'none' }}>
        <EmailEditor ref={editorRef} />
      </div>

      <Grid container spacing={2}>
        {newsletters.map((nl) => (
          <Grid item xs={12} sm={6} md={4} key={nl.issueId}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {nl.issueTitle}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Date Created: {new Date(nl.dateCreated).toLocaleDateString()}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Category: {nl.newsletterCategory}
                </Typography>

                {nl.html ? (
                  /* Outer container: fixed size, no scrollbars */
                  <div
                    style={{
                      width: '300px',        // Adjust to desired bounding box
                      height: '400px',       // Adjust to desired bounding box
                      overflow: 'hidden',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      margin: '0 auto',      // center horizontally (optional)
                      backgroundColor: '#fff'
                    }}
                  >
                    {/* Inner container: scaled down so it fits in outer container */}
                    <div
                      style={{
                        transform: 'scale(0.5)',         // adjust scale factor
                        transformOrigin: 'top left',
                        width: '600px',                  // must be outer.width / scale
                        height: '800px',                 // must be outer.height / scale
                        pointerEvents: 'none',           // so it doesn’t respond to mouse
                      }}
                      dangerouslySetInnerHTML={{ __html: nl.html }}
                    />
                  </div>
                ) : (
                  <Typography variant="body2" color="gray">
                    No template available.
                  </Typography>
                )}
              </CardContent>

              <CardActions>
                <Button
                  variant="outlined"
                  onClick={() => navigate(`/editnewsletter/${nl.issueId}`)}>
                  Edit
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  disabled={sending === nl.issueId}
                  startIcon={sending === nl.issueId ? <CircularProgress size={16} color="inherit" /> : null}
                  onClick={() => sendEmails(nl.issueId, nl.issueTitle, nl.html)}>
                  {sending === nl.issueId ? 'Sending...' : 'Send'}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          severity={snackbar.severity}
          icon={snackbar.severity === 'success' ? <CheckCircleOutlineIcon /> : undefined}
          sx={{ width: '100%', fontSize: '1rem' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Newsletter;
