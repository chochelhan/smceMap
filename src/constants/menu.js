import {adminRoot} from "./config";

const data = [
  {
    id: "setting",
    icon: "fas fa-desktop",
    label: "menu.setting",
    to: `${adminRoot}/setting/building`,
    subs: [
      {
        icon: "fas fa-users",
        label: "menu.building",
        to: `${adminRoot}/setting/building`,
      },
      {
        icon: "fas fa-headset",
        label: "menu.sendnumber",
        to: `${adminRoot}/setting/sendnumber`,
      },
      {
        icon: "fas fa-route",
        label: "menu.bellset",
        to: `${adminRoot}/setting/bellset`,
      },
      {
        icon: "fas fa-route",
        label: "menu.mapset",
        to: `${adminRoot}/setting/mapset`,
      },
    
    ]
  },
  {
    id: "users",
    icon: "fas fa-chart-bar",
    label: "menu.users",
    to: `${adminRoot}/member`,
  },
  {
    id: "alarmbell",
    icon: "fas fa-file-medical-alt",
    label: "menu.alarmbell",
    to: `${adminRoot}/mornitering/mornitering`,
  },
  {
    id: "alarmbellList",
    icon: "fas fa-fax",
    label: "menu.alarmbellList",
    to: `${adminRoot}/alarmbellList`,
  }
];

export default data;
