import React from "react";
import ActionBody from "./actionBody.js";
import StatusBody from "./statusBody.js";
import MainAppHeader from "./mainAppHeader.js";

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
          <MainAppHeader
            setMenuTab={tab => this.setMenuTab(tab)}
            currentTab={this.props.currentTab}
          />
          <StatusBody collections={this.props.collections} />
        </div>
      );
    } else if (this.props.currentTab === "riego") {
      return (
        <div className="alberiteMainLayout">
          <MainAppHeader
            setMenuTab={tab => this.setMenuTab(tab)}
            currentTab={this.props.currentTab}
          />
          <ActionBody
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

export default MainLayout;
