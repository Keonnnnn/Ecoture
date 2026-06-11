import { useRef, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import EmailEditor from 'react-email-editor';
import { Button, CircularProgress, Box, TextField, Typography } from '@mui/material';
import http from 'utils/http';

function EditNewsletter() {
  const { id } = useParams();
  const navigate = useNavigate();
  const emailEditorRef = useRef(null);
  const [newsletter, setNewsletter] = useState(null);
  const [editorReady, setEditorReady] = useState(false);

  useEffect(() => {
    http.get(`/newsletter/${id}`).then((res) => setNewsletter(res.data));
  }, [id]);

  useEffect(() => {
    if (editorReady && newsletter?.template) {
      try {
        const design = JSON.parse(newsletter.template);
        setTimeout(() => {
          emailEditorRef.current?.editor?.loadDesign(design);
        }, 500);
      } catch {
        console.error('Failed to parse newsletter template JSON');
      }
    }
  }, [editorReady, newsletter]);

  const handleEditorReady = () => setEditorReady(true);

  const saveTemplate = () => {
    if (!emailEditorRef.current?.editor) return;
    emailEditorRef.current.editor.saveDesign((design) => {
      emailEditorRef.current.editor.exportHtml(({ html }) => {
        const payload = {
          IssueTitle: newsletter.issueTitle,
          NewsletterCategory: newsletter.newsletterCategory,
          DateSent: newsletter.dateSent,
          Template: JSON.stringify(design),
          Html: html,
        };
        http.put(`/newsletter/${id}`, payload)
          .then(() => navigate('/newsletter'))
          .catch((err) => console.error('Error updating newsletter:', err));
      });
    });
  };

  if (!newsletter) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div>
      <Box sx={{ p: 2, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          label="Newsletter Title"
          value={newsletter.issueTitle}
          onChange={(e) => setNewsletter((prev) => ({ ...prev, issueTitle: e.target.value }))}
          size="small"
          sx={{ minWidth: 260 }}
        />
        <TextField
          label="Category"
          value={newsletter.newsletterCategory}
          onChange={(e) => setNewsletter((prev) => ({ ...prev, newsletterCategory: e.target.value }))}
          size="small"
          sx={{ minWidth: 180 }}
        />
        <TextField
          label="Date"
          type="date"
          value={newsletter.dateSent ? new Date(newsletter.dateSent).toISOString().slice(0, 10) : ''}
          onChange={(e) => setNewsletter((prev) => ({ ...prev, dateSent: e.target.value }))}
          size="small"
          InputLabelProps={{ shrink: true }}
        />
      </Box>
      <EmailEditor
        ref={emailEditorRef}
        onReady={handleEditorReady}
        minHeight={600}
        options={{
          customFonts: [
            { name: 'Open Sans', url: 'https://fonts.googleapis.com/css?family=Open+Sans', family: 'Open Sans, sans-serif' },
            { name: 'Lobster', url: 'https://fonts.googleapis.com/css?family=Lobster', family: 'Lobster, cursive' },
          ],
        }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={saveTemplate}
        style={{ marginTop: '16px', display: 'block', marginLeft: 'auto', marginRight: '16px' }}
      >
        Save Changes
      </Button>
    </div>
  );
}

export default EditNewsletter;
