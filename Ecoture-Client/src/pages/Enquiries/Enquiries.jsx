import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import http from 'utils/http';

import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  Typography,
} from '@mui/material';

function Enquiries() {
  const navigate = useNavigate();
  const [enquiries, setEnquiries] = useState([]);

  const getEnquiries = () => {
    http.get('/Enquiry').then((res) => {
      setEnquiries(res.data);
    });
  };

  const handleUpdateStatus = (enquiryId) => {
    navigate(`/updateenquiry/${enquiryId}`);
  };

  useEffect(() => {
    getEnquiries();
  }, []);

  return (
    <Box>
      <Box
        sx={{
          backgroundColor: '#f9f9f9',
          padding: '40px 20px',
          minHeight: '100vh',
        }}
      >
        <Typography
          variant="h4"
          align="center"
          sx={{
            fontWeight: 600,
            mb: 4,
            color: 'black',
          }}
        >
          All Enquiries
        </Typography>

        <Grid container spacing={4}>
          {enquiries.map((enquiry) => (
            <Grid item xs={12} sm={6} md={4} key={enquiry.enquiryId}>
              <Card
                sx={{
                  borderRadius: '10px',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                  overflow: 'hidden',
                  height: '100%',
                }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      mb: 1,
                      color: '#333',
                    }}
                  >
                    {enquiry.subject}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      mb: 1,
                      color: 'gray',
                    }}
                  >
                    Email: {enquiry.email}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      mb: 1,
                      color: 'gray',
                    }}
                  >
                    Status: {enquiry.status}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      mb: 1,
                      color: 'gray',
                    }}
                  >
                    Created At: {new Date(enquiry.createdAt).toLocaleString()}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      mb: 2,
                      color: 'gray',
                    }}
                  >
                    Updated At: {new Date(enquiry.updatedAt).toLocaleString()}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 400,
                      mb: 2,
                      color: '#555',
                    }}
                  >
                    {enquiry.message}
                  </Typography>

                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      mb: 1,
                      mt: 2,
                      color: '#333',
                    }}
                  >
                    Responses
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  {enquiry.responses.length > 0 ? (
                    enquiry.responses.map((response) => (
                      <Box
                        key={response.responseId}
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: response.isCustomerReply ? 'flex-end' : 'flex-start',
                          mb: 1,
                        }}
                      >
                        <Typography variant="caption" color="text.secondary" sx={{ mb: 0.3 }}>
                          {response.isCustomerReply ? enquiry.email : 'Support'}
                        </Typography>
                        <Box sx={{
                          bgcolor: response.isCustomerReply ? '#e8f0fe' : '#f0f0f0',
                          borderRadius: 2,
                          p: '8px 12px',
                          maxWidth: '85%',
                        }}>
                          <Typography variant="body2" sx={{ color: '#333' }}>
                            {response.message}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(response.responseDate).toLocaleString()}
                          </Typography>
                        </Box>
                      </Box>
                    ))
                  ) : (
                    <Typography variant="body2" sx={{ color: 'gray' }}>
                      No responses yet.
                    </Typography>
                  )}

                  <Button
                    variant="outlined"
                    color="primary"
                    sx={{
                      textTransform: 'none',
                      fontSize: '1rem',
                      borderColor: 'black',
                      color: 'black',
                      ':hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                        borderColor: 'black',
                      },
                      marginTop: '20px',
                      marginRight: '10px',
                    }}
                    onClick={() =>
                      navigate(`/manageenquiry/${enquiry.enquiryId}`)
                    }
                  >
                    Add Response
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}

export default Enquiries;