import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

function parseAzureXmlCount(xmlString) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, "text/xml");
  const blobs = xmlDoc.getElementsByTagName("Blob");
  
  const result = [];
  for (let i = 0; i < blobs.length; i++) {
    result.push(blobs[i].getElementsByTagName("Name")[0]?.textContent || "unknown");
  }
  return result;
}

function Dashboard() {
  const [stats, setStats] = useState({ totalVideos: 0, totalViews: 0, totalRevenue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContainerStats = async () => {
      try {
        const savedViews = localStorage.getItem("azure_video_views") 
          ? JSON.parse(localStorage.getItem("azure_video_views")) 
          : {};

        const storageAccountName = "videoplatformstore1";
        const containerName = "videos";
        const sasToken = "?sv=2026-02-06&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2027-07-10T05:01:27Z&st=2026-07-09T20:46:27Z&spr=https&sig=Rxoxp89OCTI5c6ylDEnmdWTtgC4cgdbcKyPV2Nd1%2F7w%3D";
        
        const listUrl = `https://${storageAccountName}.blob.core.windows.net/${containerName}${sasToken}&restype=container&comp=list`;
        const response = await fetch(listUrl);
        
        if (response.ok) {
          const textData = await response.text();
          const videoNames = parseAzureXmlCount(textData);
          
          let calculatedViews = 0;

          videoNames.forEach((name) => {
            // If it exists in storage database use it, otherwise add 0 base views
            if (savedViews[name] !== undefined) {
              calculatedViews += savedViews[name];
            }
          });

          setStats({
            totalVideos: videoNames.length,
            totalViews: calculatedViews,
            totalRevenue: (calculatedViews * 0.08).toFixed(2),
          });
        }
      } catch (error) {
        console.error("Dashboard calculation error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContainerStats();
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={4}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="video_library"
                title="Total Cloud Videos"
                count={loading ? "..." : stats.totalVideos}
                percentage={{ color: "success", amount: "Live Connection", label: "Azure Blob" }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon="leaderboard"
                title="Platform Traffic (Views)"
                count={loading ? "..." : stats.totalViews}
                percentage={{ color: "success", amount: "Real-time Tracker", label: "Cosmos DB Simulated State" }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="currency_rupee"
                title="Estimated Revenue"
                count={loading ? "..." : `₹${stats.totalRevenue}`}
                percentage={{ color: "success", amount: "Stripe Gateway", label: "Pay-Per-View Revenue" }}
              />
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
