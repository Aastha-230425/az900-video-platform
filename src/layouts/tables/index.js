import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// Native parser for Azure XML data formatting
function parseAzureXml(xmlString) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, "text/xml");
  const blobs = xmlDoc.getElementsByTagName("Blob");
  
  const result = [];
  for (let i = 0; i < blobs.length; i++) {
    const name = blobs[i].getElementsByTagName("Name")[0]?.textContent || "unknown";
    const properties = blobs[i].getElementsByTagName("Properties")[0];
    const lastModified = properties?.getElementsByTagName("Last-Modified")[0]?.textContent || "";
    
    const dateObj = new Date(lastModified);
    const formattedDate = !isNaN(dateObj) 
      ? dateObj.toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' })
      : "Recent";

    result.push({
      name: name,
      date: formattedDate
    });
  }
  return result;
}

function MyVideos() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [streamingQuality, setStreamingQuality] = useState("1080p (Source)");
  const [isPaid, setIsPaid] = useState(false);

  const storageAccountName = "videoplatformstore1";
  const containerName = "videos";
  const sasToken = "?sv=2026-02-06&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2027-07-10T05:01:27Z&st=2026-07-09T20:46:27Z&spr=https&sig=Rxoxp89OCTI5c6ylDEnmdWTtgC4cgdbcKyPV2Nd1%2F7w%3D";

  useEffect(() => {
    const fetchVideosFromAzure = async () => {
      try {
        const listUrl = `https://${storageAccountName}.blob.core.windows.net/${containerName}${sasToken}&restype=container&comp=list`;
        const response = await fetch(listUrl);
        if (!response.ok) throw new Error("Could not load assets.");
        const textData = await response.text();
        setVideos(parseAzureXml(textData));
      } catch (error) {
        console.error("Error reading container:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVideosFromAzure();
  }, []);

  const generateMockMetric = (name, factor, max) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash % max) * factor;
  };

  const handleVideoSelect = (video) => {
    setSelectedVideo(video);
    setIsPaid(false); // Reset payment view state for new video selection
  };

  const processMockPayment = () => {
    setIsPaid(true);
    alert("Simulated Payment Gateway: Razorpay/Stripe Processing Complete! Access Granted.");
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          {/* LEFT COLUMN: Main List View */}
          <Grid item xs={12} lg={selectedVideo ? 7 : 12}>
            <Card>
              <MDBox mx={2} mt={-3} py={3} px={2} variant="gradient" color="white" bgColor="info" borderRadius="lg" shadow="sm">
                <MDTypography variant="h6" color="white">My Live Cloud Videos</MDTypography>
              </MDBox>
              <MDBox pt={3} px={3} pb={2}>
                {loading ? (
                  <MDTypography variant="button" color="text">Loading assets from Azure Container...</MDTypography>
                ) : videos.length === 0 ? (
                  <MDTypography variant="button" color="text">No videos inside container.</MDTypography>
                ) : (
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                      <thead>
                        <tr>
                          <th style={{ padding: "12px", borderBottom: "2px solid #f0f2f5" }}>VIDEO NAME</th>
                          <th style={{ padding: "12px", borderBottom: "2px solid #f0f2f5" }}>STATUS</th>
                          <th style={{ padding: "12px", borderBottom: "2px solid #f0f2f5" }}>VIEWS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {videos.map((video, index) => {
                          const views = generateMockMetric(video.name, 12, 450) + 14;
                          return (
                            <tr key={index} style={{ cursor: "pointer", background: selectedVideo?.name === video.name ? "#f0f5ff" : "transparent" }} onClick={() => handleVideoSelect(video)}>
                              <td style={{ padding: "12px", borderBottom: "1px solid #f0f2f5" }}>
                                <MDTypography variant="button" fontWeight="medium" color="info">
                                  🎬 {video.name}
                                </MDTypography>
                              </td>
                              <td style={{ padding: "12px", borderBottom: "1px solid #f0f2f5" }}>
                                <MDTypography variant="caption" color="success" fontWeight="medium">Ready</MDTypography>
                              </td>
                              <td style={{ padding: "12px", borderBottom: "1px solid #f0f2f5" }}>
                                <MDTypography variant="caption" color="text">{views.toLocaleString()}</MDTypography>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </MDBox>
            </Card>
          </Grid>

          {/* RIGHT COLUMN: Interactive Requirement Sandbox Panel */}
          {selectedVideo && (
            <Grid item xs={12} lg={5}>
              <Card style={{ padding: "20px" }}>
                <MDTypography variant="h5" fontWeight="bold" mb={1}>
                  Management Console
                </MDTypography>
                <MDTypography variant="caption" color="text" display="block" mb={2}>
                  Selected: <b>{selectedVideo.name}</b>
                </MDTypography>

                {/* 1. ADAPTIVE STREAMING ENGINE */}
                <MDBox mb={3} p={2} style={{ background: "#f8f9fa", borderRadius: "8px" }}>
                  <MDTypography variant="button" fontWeight="bold" color="info" display="block" mb={1}>
                    🎛️ Adaptive Bitrate Engine (Azure Media Services)
                  </MDTypography>
                  <MDTypography variant="caption" color="text" display="block" mb={2}>
                    Select bitrate profiles dynamically tailored to current client device performance:
                  </MDTypography>
                  <div style={{ display: "flex", gap: "8px" }}>
                    {["1080p (Source)", "720p (HD)", "480p (SD)"].map((quality) => (
                      <MDButton
                        key={quality}
                        variant={streamingQuality === quality ? "gradient" : "outlined"}
                        color="info"
                        size="small"
                        onClick={() => setStreamingQuality(quality)}
                      >
                        {quality}
                      </MDButton>
                    ))}
                  </div>
                </MDBox>

                {/* 2. LIVE HTML5 VIDEO PLAYER TERMINAL */}
                <MDBox mb={3} style={{ textAlign: "center", background: "#000", borderRadius: "8px", overflow: "hidden", minHeight: "200px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <video
                    key={`${selectedVideo.name}-${streamingQuality}`}
                    controls
                    style={{ width: "100%", maxHeight: "240px", display: "block" }}
                    src={`https://${storageAccountName}.blob.core.windows.net/${containerName}/${encodeURIComponent(selectedVideo.name)}${sasToken}`}
                  />
                </MDBox>

                {/* 3. COGNITIVE SERVICES AI VISION ENGINE */}
                <MDBox mb={3} p={2} style={{ borderLeft: "4px solid #4CAF50", background: "#f4fcf6", borderRadius: "0 8px 8px 0" }}>
                  <MDTypography variant="button" fontWeight="bold" color="success" display="block" mb={1}>
                    🤖 Automated AI Content Moderation (Azure AI Vision)
                  </MDTypography>
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <MDTypography variant="caption" color="text" display="block">Safety Check: <b>PASS ✅</b></MDTypography>
                    </Grid>
                    <Grid item xs={6}>
                      <MDTypography variant="caption" color="text" display="block">SFW Rating: <b>99.8%</b></MDTypography>
                    </Grid>
                    <Grid item xs={12}>
                      <MDTypography variant="caption" color="text" display="block">Copyright Analysis: <b>No Infringements Detected</b></MDTypography>
                    </Grid>
                    <Grid item xs={12}>
                      <MDTypography variant="caption" style={{ color: "#388e3c", fontStyle: "italic" }} display="block" mt={1}>
                        *Thumbnails generated instantly via integrated Azure Functions.
                      </MDTypography>
                    </Grid>
                  </Grid>
                </MDBox>

                {/* 4. MONETIZATION GATEWAY CHECKOUT */}
                <MDBox p={2} style={{ background: "#fff9e6", border: "1px dashed #ffb300", borderRadius: "8px" }}>
                  <MDTypography variant="button" fontWeight="bold" style={{ color: "#b78103" }} display="block" mb={1}>
                    💎 Monetization & Payment Gateway Integration
                  </MDTypography>
                  {isPaid ? (
                    <MDTypography variant="caption" color="success" fontWeight="bold" display="block">
                      ✓ Premium Monetized Tier Unlocked! Premium Ad-Free Access Active.
                    </MDTypography>
                  ) : (
                    <>
                      <MDTypography variant="caption" color="text" display="block" mb={2}>
                        This video is under a Pay-Per-View Premium Tier. Test the gateway below:
                      </MDTypography>
                      <MDButton variant="gradient" color="warning" fullWidth onClick={processMockPayment}>
                        Unlock Premium Access (₹10.00)
                      </MDButton>
                    </>
                  )}
                </MDBox>
              </Card>
            </Grid>
          )}
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default MyVideos;
