import { useState } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

function Upload() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploadStatus, setUploadStatus] = useState("");

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e) => {
    // Prevent default form submission or page reloads
    if (e) e.preventDefault();

    if (!file || !title) {
      setUploadStatus("Please select a file and enter a title.");
      return;
    }

    setUploadStatus("Uploading file securely directly to Azure...");

    try {
      const storageAccountName = "videoplatformstore1";
      const containerName = "videos";
      
      // Your verified Azure Storage Shared Access Signature token
      const sasToken = "?sv=2026-02-06&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2027-07-10T05:01:27Z&st=2026-07-09T20:46:27Z&spr=https&sig=Rxoxp89OCTI5c6ylDEnmdWTtgC4cgdbcKyPV2Nd1%2F7w%3D";

      // Construct the absolute authenticated URL path
      const uploadUrl = `https://${storageAccountName}.blob.core.windows.net/${containerName}/${encodeURIComponent(file.name)}${sasToken}`;

      const response = await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          "x-ms-blob-type": "BlockBlob",
          "Content-Type": file.type || "video/mp4",
        },
        body: file,
      });

      if (response.ok) {
        setUploadStatus(`Success! "${title}" has been uploaded directly to Azure.`);
      } else {
        setUploadStatus(`Upload failed (Status ${response.status}). Verify your Azure CORS rules.`);
      }
    } catch (error) {
      console.error("Direct upload error:", error);
      setUploadStatus("Network error: Could not complete the direct upload.");
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} md={8} lg={6}>
            <Card>
              <MDBox p={3} component="form" onSubmit={handleUpload}>
                <MDTypography variant="h5" fontWeight="medium" mb={2}>
                  Upload Video
                </MDTypography>

                <MDBox mb={2}>
                  <MDTypography variant="button" fontWeight="regular" color="text">
                    Select video file
                  </MDTypography>
                  <MDBox mt={1}>
                    <input type="file" accept="video/*" onChange={handleFileChange} />
                  </MDBox>
                  {file && (
                    <MDTypography variant="caption" color="success">
                      Selected: {file.name}
                    </MDTypography>
                  )}
                </MDBox>

                <MDBox mb={2}>
                  <MDInput
                    label="Video Title"
                    fullWidth
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </MDBox>

                <MDBox mb={2}>
                  <MDInput
                    label="Description"
                    fullWidth
                    multiline
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </MDBox>

                <MDButton variant="gradient" color="info" type="submit" fullWidth>
                  Upload to Azure Blob Storage
                </MDButton>

                {uploadStatus && (
                  <MDBox mt={2}>
                    <MDTypography variant="button" color="text">
                      {uploadStatus}
                    </MDTypography>
                  </MDBox>
                )}
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Upload;
