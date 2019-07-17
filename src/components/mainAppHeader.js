import React from "react";

class MainAppHeader extends React.Component {
  render() {
    const tabs = [
      { id: "status", name: "Sistema" },
      { id: "riego", name: "Riego" }
    ];
    const menuItems = tabs.map(menuItem => {
      let theClassName = "alberiteMenuItem";
      theClassName +=
        menuItem.id === this.props.currentTab
          ? " alberiteMenuItem--selected"
          : "";
      return (
        <div className={theClassName} key={menuItem.id}>
          <a
            className="link alberite_cursor"
            onClick={() => {
              this.props.setMenuTab(menuItem.id);
            }}
          >
            {menuItem.name}
          </a>
        </div>
      );
    });
    menuItems.push(
      <div className="alberiteMenuItem" key="logout">
        <a href="/logout" className="alberiteMenuLink alberite_cursor">
          Salir
        </a>
      </div>
    );

    return (
      <div className="alberiteHeader">
        <div className="alberiteAppItem">
          <a href="" className="alberiteMenuLink">
            Villa Cautela
          </a>
        </div>
        {menuItems}
      </div>
    );
  }
}

export default MainAppHeader;
