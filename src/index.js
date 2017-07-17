import React from "react";
import ReactDOM from "react-dom";
import "./pure-min.css";
import "./marketing.css";
import "./alberite.css";

class Header extends React.Component {
  render() {
    return (
      <div className="header">
        <div className="home-menu pure-menu pure-menu-horizontal pure-menu-fixed menu_shadow">
          <a className="pure-menu-heading" href="">
            Villa Cautela
          </a>
          <ul className="pure-menu-list">
            <li className="pure-menu-item pure-menu-selected">
              <a href="#" className="pure-menu-link">
                Riego
              </a>
            </li>
            <li className="pure-menu-item">
              <a href="/logout" className="pure-menu-link">
                Salir
              </a>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

class MyTable extends React.Component {
  render() {
    const theRows = this.props.rows.map((row, idx) => {
      const theRow = row;
      const values = this.props.headerProps.map(headerProp => {
        let value = theRow[headerProp.prop];
        if (headerProp.prop.toLowerCase().indexOf("date") !== -1) {
          const date = new Date(Date.parse(value));
          value =
            date.toLocaleDateString() +
            " " +
            pad(date.getHours(), 2) +
            ":" +
            pad(date.getMinutes(), 2) +
            ":" +
            pad(date.getSeconds(), 2);
        }
        return (
          <td>
            {value}
          </td>
        );
      });
      return (
        <tr className="pure-table-odd" key={row.id ? row.id : row.index}>
          {values}
        </tr>
      );
    });
    const theHeader = this.props.headerProps.map((headerProp, idx) => {
      return (
        <th key={headerProp.name}>
          {headerProp.name}
        </th>
      );
    });
    return (
      <table className="pure-table pure-table-horizontal alberite_generic_table alberite_log_table">
        <thead>
          <tr key="header">
            {theHeader}
          </tr>
        </thead>
        <tbody>
          {theRows}
        </tbody>
      </table>
    );
  }
}

class Body extends React.Component {
  render() {
    return (
      <div className="splash-container alberite_splash_container">
        <MyTable
          rows={this.props.logRows}
          headerProps={[
            { name: "Mensaje", prop: "message" },
            { name: "Fecha", prop: "messagedate" },
            { name: "IP", prop: "externalip" }
          ]}
        />
        <MyTable
          rows={this.props.actionRows}
          headerProps={[
            { name: "Fase", prop: "phase" },
            { name: "Duración", prop: "duration" },
            { name: "Fecha", prop: "date" }
          ]}
        />
      </div>
    );
  }
}

class MainLayout extends React.Component {
  constructor() {
    super();
    this.state = {
      logRows: [],
      actionRows: []
    };
    var me = this;
    fetch("http://villacautela.com/loginfo", { mode: "cors", method: "get" })
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        me.setState({ logRows: data });
      })
      .catch(function(err) {
        console.error("error while reading loginfo: ", err);
      });
    fetch("http://villacautela.com/pastActionsInfo", {
      method: "get"
    })
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        me.setState({ actionRows: data });
      })
      .catch(function(err) {
        console.error("error while reading pastActionsInfo: ", err);
      });
  }
  render() {
    return (
      <div>
        <Header />
        <Body logRows={this.state.logRows} actionRows={this.state.actionRows} />
      </div>
    );
  }
}

ReactDOM.render(<MainLayout />, document.getElementById("root"));

function pad(num, size) {
  var s = num + "";
  while (s.length < size) s = "0" + s;
  return s;
}
