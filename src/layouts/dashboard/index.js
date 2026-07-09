// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

function Dashboard() {
  return (
    <DashboardLayout>
      <DashboardNavbar />

      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="video_library"
                title="Total Videos"
                count="0"
                percentage={{
                  color: "info",
                  amount: "",
                  label: "Waiting for Azure data",
                }}
              />
            </MDBox>
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="info"
                icon="visibility"
                title="Views"
                count="0"
                percentage={{
                  color: "info",
                  amount: "",
                  label: "Waiting for Azure data",
                }}
              />
            </MDBox>
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="attach_money"
                title="Revenue"
                count="₹0"
                percentage={{
                  color: "info",
                  amount: "",
                  label: "Waiting for Azure data",
                }}
              />
            </MDBox>
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="person"
                title="Subscribers"
                count="0"
                percentage={{
                  color: "info",
                  amount: "",
                  label: "Waiting for Azure data",
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
         