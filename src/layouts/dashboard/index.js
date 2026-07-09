import { useState, useEffect } from "react";

// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

// Helper XML parser to read the Azure blob list count
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
  const [stats, setStats] = useState({
    totalVideos: 0,
    totalViews: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  // Deterministic calculation engine matching your table analytics logic
  const generateMockMetric = (name, factor, max) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash % max) * factor;
  };

  useEffect(() => {
    const fetchContainerStats = async () => {
      try {
        const storageAccountName = "videoplatformstore1";
        const containerName = "videos";
        const sasToken = "?sv=2026-02-06&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2027-07-10T05:01:27Z&st=2026-07-09T20:46:27Z&spr=https&sig=Rxoxp89OCTI5c6ylDEnmdWTtgC4cgdbcKyPV2Nd1%2F7w%3D";
        
        const listUrl = `https://${storageAccountName}.blob.core.windows.net/${containerName}${sasToken}&restype=container&comp=list`;
        const response = await fetch(listUrl);
        
        if (response.ok) {
          const textData = await response.text();
          const videoNames = parseAzureXmlCount(textData);
          
          let calculatedViews = 0;
          let calculatedRevenue = 0;

          // Cycle through files to accumulate total dashboard aggregates
          videoNames.forEach((name) => {
            const views = generateMockMetric(name, 12, 450) + 14;
            const revenue = views * 0.08;
            calculatedViews += views;
            calculatedRevenue += revenue;
          });

          setStats({
            totalVideos: videoNames.length,
            totalViews: calculatedViews,
            totalRevenue: calculatedRevenue.toFixed(2),
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
          {/* CARD 1: LIVE AZURE CONTAINER FILE COUNT */}
          <Grid item xs={12} md={6} lg={4}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="video_library"
                title="Total Cloud Videos"
                count={loading ? "..." : stats.totalVideos}
                percentage={{
                  color: "success",
                  amount: "Live Connection",
                  label: "Azure Blob Container",
                }}
              />
            </MDBox>
          </Grid>

          {/* CARD 2: AGGREGATED VIEW COUNT ANALYTICS */}
          <Grid item xs={12} md={6} lg={4}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon="leaderboard"
                title="Platform Traffic (Views)"
                count={loading ? "..." : stats.totalViews.toLocaleString()}
                percentage={{
                  color: "success",
                  amount: "+15%",
                  label: "increase vs yesterday",
                }}
              />
            </MDBox>
          </Grid>

          {/* CARD 3: AGGREGATED MONETIZATION METRIC OVERVIEW */}
          <Grid item xs={12} md={6} lg={4}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="currency_rupee"
                title="Estimated Revenue"
                count={loading ? "..." : `₹${stats.totalRevenue}`}
                percentage={{
                  color: "success",
                  amount: "Stripe/Razorpay",
                  label: "Simulated Monetization active",
                }}
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
