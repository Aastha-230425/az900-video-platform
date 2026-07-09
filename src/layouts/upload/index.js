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
  const [fileName, setFileName] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploadStatus, setUploadStatus] = useState("");

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleUpload = async () => {
    if (!fileName || !title) {
      setUploadStatus("Please select a file and enter a title.");
      return;
    }

    setUploadStatus("Uploading directly to Azure Blob Storage...");

    try {
      const fileInput = document.querySelector('input[type="file"]');
      const file = fileInput.files[0];

      // Direct Upload to your identified Azure Storage account container
      const storageAccountName = "videoplatformstore1";
      const containerName = "videos";
      
      // Public SAS token placeholder (fallback if not using a backend token generator)
      const sasToken = ""; 

      const uploadUrl = `https://${storageAccountName}.blob.core.windows.net/${containerName}/${encodeURIComponent(file.name)}${sasToken}`;

      const response = await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          "x-ms-blob-type": "BlockBlob",
          "Content-Type": file.type,
        },
        body: file,
      });

      if (response.ok) {
        setUploadStatus(`"${title}" uploaded successfully directly to Azure!`);
      } else {
        setUploadStatus(`Upload failed with status: ${response.status}. Ensure CORS is enabled on the Storage Account.`);
      }
    } catch (error) {
      console.error(error);
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
              <MDBox p={3}>
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
                  {fileName && (
                    <MDTypography variant="caption" color="success">
                      Selected: {fileName}
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

                <MDButton variant="gradient" color="info" onClick={handleUpload} fullWidth>
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
