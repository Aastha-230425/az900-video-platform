// Material Dashboard 2 React layouts
import Dashboard from "layouts/dashboard";
import Tables from "layouts/tables";
import Upload from "layouts/upload";

// @mui icons
import Icon from "@mui/material/Icon";

const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
  },
  {
    type: "collapse",
    name: "Upload",
    key: "upload",
    icon: <Icon fontSize="small">cloud_upload</Icon>,
    route: "/upload",
    component: <Upload />,
  },
  {
    type: "collapse",
    name: "My Videos",
    key: "my-videos",
    icon: <Icon fontSize="small">video_library</Icon>,
    route: "/my-videos",
    component: <Tables />,
  },
];

export default routes;