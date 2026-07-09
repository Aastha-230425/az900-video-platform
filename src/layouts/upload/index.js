import { useState } from "react";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

function UploadVideo() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [customTitle, setCustomTitle] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a video file first.");
      return;
    }

    // Extract original extension (e.g., .mp4)
    const originalExtension = selectedFile.name.substring(selectedFile.name.lastIndexOf("."));
    let targetFileName = customTitle.trim();

    // Fallback if title is empty, otherwise format correctly
    if (!targetFileName) {
      targetFileName = selectedFile.name;
    } else if (!targetFileName.toLowerCase().endsWith(originalExtension.toLowerCase())) {
      targetFileName = `${targetFileName}${originalExtension}`;
    }

    const storageAccountName = "videoplatformstore1";
    const containerName = "videos";
    const sasToken = "?sv=2026-02-06&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2027-07-10T05:01:27Z&st=2026-07-09T20:46:27Z&spr=https&sig=Rxoxp89OCTI5c6ylDEnmdWTtgC4cgdbcKyPV2Nd1%2F7w%3D";
    
    const uploadUrl = `https://${storageAccountName}.blob.core.windows.net/${containerName}/${encodeURIComponent(targetFileName)}${sasToken}`;

    try {
      setUploading(true);
      const response = await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          "x-ms-blob-type": "BlockBlob",
          "Content-Type": selectedFile.type,
        },
        body: selectedFile,
      });

      if (response.ok) {
        alert(`Success! Saved on Azure as: ${targetFileName}`);
        setCustomTitle("");
        setSelectedFile(null);
      } else {
        alert("Upload failed. Verify container configurations.");
      }
    } catch (error) {
      console.error("Direct Upload Error:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Card style={{ padding: "24px" }}>
          <MDBox mb={3}>
            <MDTypography variant="h5" fontWeight="medium">Upload New Asset to Azure Container</MDTypography>
          </MDBox>
          <MDBox mb={2}>
            <MDInput 
              type="text" 
              label="Custom Video Title Name" 
              fullWidth 
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
            />
          </MDBox>
          <MDBox mb={3}>
            <input type="file" accept="video/*" onChange={handleFileChange} />
          </MDBox>
          <MDButton variant="gradient" color="info" onClick={handleUpload} disabled={uploading}>
            {uploading ? "Uploading to Azure..." : "Push directly to Cloud Storage"}
          </MDButton>
        </Card>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default UploadVideo;
