import AlberiteTable from "./alberiteTable.js";

class AlberiteTableGPIO extends AlberiteTable {
  cellStyle(property, value) {
    if (property === "status") {
      if (value === "on") {
        return "alberite_gpio_on";
      } else if (value === "off") {
        return "alberite_gpio_off";
      } else {
        return null;
      }
    }
  }
}

export default AlberiteTableGPIO;
