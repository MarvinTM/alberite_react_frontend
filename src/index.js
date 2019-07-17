import React from "react";
import ReactDOM from "react-dom";
import AlberiteTable from "./components/alberiteTable.js";
import AlberiteEditingTable from "./components/alberiteEditingTable.js";
import AlberiteTableGPIO from "./components/alberiteTableGPIO.js";
import AlberiteTableActions from "./components/alberiteTableActions.js";
import AlberiteEditingRow from "./components/alberiteEditingRow.js";
import "./alberite.css";
import "./alberiteFlexbox.css";
import { createStore } from "redux";
import { connect } from "react-redux";
import { Provider } from "react-redux";

//Create Redux Store
var alberiteReducer = function(state, action) {
  if (state === undefined) {
    state = {
      collections: {
        logRows: null,
        pastActionRows: null,
        actionRows: null,
        gpioState: null,
        programmedActionRows: null
      },
      currentTab: "status"
    };
  }
  if (action.type === "ADD_DATA_COLLECTION") {
    let newState = Object.assign({}, state);
    var property;
    newState.collections = {};
    for (property in state.collections) {
      if (state.collections.hasOwnProperty(property)) {
        newState[property] = state.collections[property];
      }
    }
    for (property in action.collection) {
      if (action.collection.hasOwnProperty(property)) {
        newState.collections[property] = action.collection[property];
      }
    }
    return newState;
  } else if (action.type === "SET_CURRENT_TAB") {
    let newState = Object.assign({}, state);
    newState.currentTab = action.currentTab;
    return newState;
  }
  return state;
};

var store = createStore(alberiteReducer);

class Header extends React.Component {
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

class StatusBody extends React.Component {
  render() {
    return (
      <div className="alberiteTableContainer">
        <AlberiteTable
          rows={this.props.collections.logRows}
          headerProps={[
            { name: "Mensaje", prop: "message" },
            { name: "Fecha", prop: "messagedate" },
            { name: "IP", prop: "externalip" }
          ]}
          tableName="Mensajes de log"
        />
        <AlberiteTable
          rows={this.props.collections.pastActionRows}
          headerProps={[
            { name: "Fase", prop: "phase" },
            { name: "Duración", prop: "duration" },
            { name: "Fecha", prop: "date" }
          ]}
          tableName="Riegos pasados"
        />
        <AlberiteTable
          rows={this.props.collections.actionRows}
          headerProps={[
            { name: "Fase", prop: "phase" },
            { name: "Duración", prop: "time" }
          ]}
          tableName="Riegos en cola"
        />
        <AlberiteTableGPIO
          rows={this.props.collections.gpioState}
          headerProps={[
            { name: "Puerto", prop: "pin" },
            { name: "Estado", prop: "status" }
          ]}
          tableName="Estado puertos GPIO"
        />
      </div>
    );
  }
}

class RiegoBody extends React.Component {
  render() {
    const programFields = [
      {
        name: "Fase",
        prop: "phase",
        type: "combo",
        possibleValues: [
          { id: 1, name: "Piscina fase 1", value: 1 },
          { id: 2, name: "Piscina fase 2", value: 2 },
          { id: 3, name: "Aspersores fase 1", value: 3 },
          { id: 4, name: "Entrada+Cerezo", value: 4 },
          { id: 5, name: "Huerta", value: 5 }
        ]
      },
      {
        name: "Duración",
        prop: "time",
        type: "combo",
        possibleValues: [
          { id: 1, name: "Pulso (10 secs)", value: 10 },
          { id: 2, name: "30 segundos", value: 30 },
          { id: 3, name: "1 minuto", value: 60 },
          { id: 4, name: "2 minutos", value: 120 },
          { id: 5, name: "3 minutos", value: 180 },
          { id: 6, name: "4 minutos", value: 240 },
          { id: 7, name: "5 minutos", value: 300 },
          { id: 8, name: "10 minutos", value: 600 },
          { id: 9, name: "15 minutos", value: 900 },
          { id: 10, name: "20 minutos", value: 1200 }
        ]
      },
      {
        name: "Frecuencia",
        prop: "frequency",
        type: "combo",
        possibleValues: [
          { id: 1, name: "DIARIA", value: "DIARIA" },
          { id: 2, name: "DÍAS IMPARES", value: "DÍAS IMPARES" },
          { id: 3, name: "DÍAS PARES", value: "DÍAS PARES" }
        ]
      },
      { name: "Hora", prop: "hour", type: "hour" }
    ];
    const directFields = [
      {
        name: "Fase",
        prop: "pin",
        type: "combo",
        possibleValues: [
          { id: 1, name: "Piscina fase 1", value: 1 },
          { id: 2, name: "Piscina fase 2", value: 2 },
          { id: 3, name: "Aspersores fase 1", value: 3 },
          { id: 4, name: "Entrada+Cerezo", value: 4 },
          { id: 5, name: "Huerta", value: 5 }
        ]
      },
      {
        name: "Duración",
        prop: "duration",
        type: "combo",
        possibleValues: [
          { id: 1, name: "Pulso (10 secs)", value: 10 },
          { id: 2, name: "30 segundos", value: 30 },
          { id: 3, name: "1 minuto", value: 60 },
          { id: 4, name: "2 minutos", value: 120 },
          { id: 5, name: "3 minutos", value: 180 },
          { id: 6, name: "4 minutos", value: 240 },
          { id: 7, name: "5 minutos", value: 300 },
          { id: 8, name: "10 minutos", value: 600 },
          { id: 9, name: "15 minutos", value: 900 },
          { id: 10, name: "20 minutos", value: 1200 }
        ]
      }
    ];
    return (
      <div className="alberiteTableContainer">
        <AlberiteEditingTable
          rows={this.props.collections.programmedActionRows}
          headerProps={programFields}
          tableName="Riegos programados"
          createActionHandler={this.props.onProgrammedAction}
          deleteActionHandler={this.props.onDeleteProgrammedAction}
        />
        <AlberiteTableActions
          rows={this.props.collections.actionRows}
          headerProps={[
            { name: "Fase", prop: "phase" },
            { name: "Duración", prop: "time" }
          ]}
          tableName="Riegos en cola"
          deleteActionHandler={this.props.onDeleteAction}
        />
        <AlberiteEditingRow
          headerProps={directFields}
          tableName="Riego directo"
          createActionHandler={this.props.onDirectAction}
        />
      </div>
    );
  }
}

class MainLayout extends React.Component {
  componentDidMount() {
    this.loadData();
    setInterval(() => this.loadData(), 5000);
  }
  deleteProgrammedValue(index) {
    var me = this;
    this.remoteRequest(
      "https://villacautela.com/cancelProgrammedAction?programmedAction=" +
        index,
      function(data) {
        //TODO: MESSAGE!!!
        me.loadData();
      }
    );
  }
  deleteAction(index) {
    var me = this;
    this.remoteRequest(
      "https://villacautela.com/cancelAction?action=" + index,
      function(data) {
        me.loadData();
      }
    );
  }
  modifyDirectValues(values) {
    var me = this;
    this.remoteRequest(
      "https://villacautela.com/startSystemAction?" + buildGETRequest(values),
      function(data) {
        //TODO: MESSAGE!!!
        me.loadData();
      }
    );
  }
  modifyProgrammedValues(values) {
    const me = this;
    this.remoteRequest(
      "https://villacautela.com/insertProgrammedAction?" +
        buildGETRequest(values),
      function(data) {
        //TODO: MESSAGE!!!
        me.loadData();
      }
    );
  }
  loadData() {
    this.readAllCollections([
      {
        url: "https://villacautela.com/loginfo",
        collectionName: "logRows"
      },
      {
        url: "https://villacautela.com/pastActionsInfo",
        collectionName: "pastActionRows"
      },
      {
        url: "https://villacautela.com/actionsInfo",
        collectionName: "actionRows"
      },
      {
        url: "https://villacautela.com/gpioInfo",
        collectionName: "gpioState"
      },
      {
        url: "https://villacautela.com/programmedActionsInfo",
        collectionName: "programmedActionRows"
      }
    ]);
  }
  setMenuTab(tab) {
    this.props.setCurrentTab(tab);
  }
  readAllCollections(collectionList, successCallback, errorCallback) {
    this.readEachCollection(collectionList, {}, successCallback, errorCallback);
  }
  readEachCollection(
    collectionList,
    fullCollectionObj,
    successCallback,
    errorCallback
  ) {
    const me = this;
    if (collectionList.length === 0) {
      this.props.setCollectionValue(fullCollectionObj);
      if (successCallback) {
        successCallback();
      }
      return;
    }
    this.remoteRequest(
      collectionList[0].url,
      function(data) {
        fullCollectionObj[collectionList[0].collectionName] = data;
        collectionList.shift();
        me.readEachCollection(
          collectionList,
          fullCollectionObj,
          successCallback,
          errorCallback
        );
      },
      errorCallback
    );
  }
  remoteRequestForDataCollection(
    url,
    collectionName,
    successCallback,
    errorCallback
  ) {
    var me = this;
    this.remoteRequest(
      url,
      function(data) {
        var emptyObj = {};
        emptyObj[collectionName] = data;
        me.props.setCollectionValue(emptyObj);
        if (successCallback) {
          successCallback(data);
        }
      },
      errorCallback
    );
  }

  remoteRequest(url, successCallback, errorCallback, credentials = true) {
    const me = this;
    fetch(url, {
      mode: "cors",
      method: "get",
      credentials: credentials ? "include" : "omit"
    })
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        successCallback(data);
      })
      .catch(function(err) {
        if (credentials) {
          console.warn("Failed with credentials. Retrying without...");
          me.remoteRequest(url, successCallback, errorCallback, false);
        } else if (errorCallback) {
          console.error("error while executing remote request: " + url, err);
          errorCallback();
        }
      });
  }
  render() {
    if (this.props.currentTab === "status") {
      return (
        <div className="alberiteMainLayout">
          <Header
            setMenuTab={tab => this.setMenuTab(tab)}
            currentTab={this.props.currentTab}
          />
          <StatusBody collections={this.props.collections} />
        </div>
      );
    } else if (this.props.currentTab === "riego") {
      return (
        <div className="alberiteMainLayout">
          <Header
            setMenuTab={tab => this.setMenuTab(tab)}
            currentTab={this.props.currentTab}
          />
          <RiegoBody
            collections={this.props.collections}
            onProgrammedAction={i => this.modifyProgrammedValues(i)}
            onDirectAction={i => this.modifyDirectValues(i)}
            onDeleteProgrammedAction={i => this.deleteProgrammedValue(i)}
            onDeleteAction={i => this.deleteAction(i)}
          />
        </div>
      );
    }
  }
}
var mapStateToProps = function(store) {
  return { collections: store.collections, currentTab: store.currentTab };
};

const mapDispatchToProps = dispatch => {
  return {
    setCollectionValue: collection =>
      dispatch({
        type: "ADD_DATA_COLLECTION",
        collection: collection
      }),
    setCurrentTab: currentTab =>
      dispatch({
        type: "SET_CURRENT_TAB",
        currentTab: currentTab
      })
  };
};
const App = connect(
  mapStateToProps,
  mapDispatchToProps
)(MainLayout);

function buildGETRequest(values) {
  let GETRequest = "";
  let isFirst = true;
  for (var property in values) {
    if (values.hasOwnProperty(property)) {
      if (isFirst) {
        isFirst = false;
      } else {
        GETRequest += "&&";
      }
      GETRequest += property + "=" + values[property];
    }
  }
  return GETRequest;
}

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
