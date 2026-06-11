import React, { useEffect, useState, useContext } from "react";
import { Box, Typography, Card, CardContent, Button } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import http from "utils/http";
import UserContext from "contexts/UserContext";

function RefundRequests() {
  const navigate = useNavigate();
  const location = useLocation();
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(UserContext);
  const userId = user.userId;

  useEffect(() => {
    http.get(`/refund/${userId}`)
      .then((res) => setRefunds(res.data))
      .catch(() => alert("Failed to fetch refund requests."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Typography>Loading refund requests...</Typography>;

  return (
    <Box sx={{ mt: 4, mx: "auto", maxWidth: 1200 }}>

      {/* Navigation Tabs */}
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Button 
          sx={{
            mx: 1, 
            fontWeight: "bold",
            backgroundColor: location.pathname === "/order-history" ? "#3E3E3E" : "transparent",
            color: location.pathname === "/order-history" ? "white" : "black",
            borderRadius: "20px",
            padding: "8px 16px",
            "&:hover": { backgroundColor: "#3E3E3E", color: "white" }
          }} 
          onClick={() => navigate("/order-history")}
        >
          Order History
        </Button>
        <Button 
          sx={{
            mx: 1, 
            fontWeight: "bold",
            backgroundColor: location.pathname === "/refund-requests" ? "#3E3E3E" : "transparent",
            color: location.pathname === "/refund-requests" ? "white" : "black",
            borderRadius: "20px",
            padding: "8px 16px",
            "&:hover": { backgroundColor: "#3E3E3E", color: "white" }
          }} 
          onClick={() => navigate("/refund-requests")}
        >
          Refund Requests
        </Button>
      </Box>

      {/* Refund List */}
      {refunds.length === 0 ? (
        <Typography>No refund requests found.</Typography>
      ) : (
        refunds.map((refund) => {
          let statusColor = "black";
          if (refund.status === "Approved") statusColor = "green";
          if (refund.status === "Rejected") statusColor = "red";

          return (
            <Card
              key={refund.id}
              sx={{
                mb: 4,
                p: 3,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                minHeight: 150,
                borderRadius: 2,
                boxShadow: 2
              }}
            >

              {/* Product Image */}
              <Box sx={{ display: "flex", alignItems: "center", width: "15%" }}>
                <img
                  src={refund.imageFile ? `${import.meta.env.VITE_FILE_BASE_URL}${refund.imageFile}` : "/placeholder.png"}
                  alt={refund.productTitle || "Product Image"}
                  width="100"
                  height="100"
                  style={{ borderRadius: 8 }}
                  onError={(e) => e.target.src = "/placeholder.png"}
                />
              </Box>

              {/* Refund Details */}
              <CardContent sx={{ flex: 1 }}>
                <Typography variant="h6"><strong>{refund.productTitle || "Unknown Product"}</strong></Typography>
                <Typography><strong>Reason:</strong> {refund.reason}</Typography>
                <Typography><strong>Requested At:</strong> {new Date(refund.createdAt).toLocaleString()}</Typography>
              </CardContent>

              {/* Refund Status */}
              <Typography 
                sx={{ 
                  fontWeight: "bold", 
                  textAlign: "right", 
                  minWidth: "150px", 
                  textTransform: "capitalize",
                  color: statusColor // 🎨 Change color dynamically
                }}
              >
                <strong>Status:</strong> {refund.status}
              </Typography>

            </Card>
          );
        })
      )}
    </Box>
  );
}

export default RefundRequests;
